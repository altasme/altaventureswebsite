// Cloudflare Pages Function: POST /api/checkout
//
// Creates a ganap.net checkout session and returns what the browser needs
// to complete payment. This is a server-only call: it signs the request
// with the ganap.net signing secret, which must never reach the client.
//
// Serves two offers off one function [2026-09-19, added for /b2b]: the
// /foryourbusiness ₱599 website offer and the /b2b ₱4,999 complete
// business website package. Both post the same shape of body (see
// CheckoutPayload) plus an `offer` field selecting which OFFER_CONFIG
// entry to use — same ganap.net project/credentials, same validation,
// same HMAC signing and D1 insert, only the amount/metadata/redirect
// URLs differ per offer. Parameterizing this instead of duplicating the
// whole payment function (signing, the fetch to ganap, D1 writes,
// classifyRedirectUrl) keeps there being exactly one place that can get
// the amount or a redirect URL wrong, which matters a lot more for a
// function that moves real money than the duplication it avoids would
// otherwise be worth. `offer` defaults to "foryourbusiness" if omitted,
// defensively, in case a stale cached frontend bundle ever posts here
// without it.
//
// /b2b is a two-installment split, not a single ₱4,999 charge
// [2026-09-19, operator clarification, corrected same day from an even
// 50/50 to this]: this endpoint only ever charges the ₱2,499 deposit
// (OFFER_CONFIG.b2b.amountPhp below). The remaining ₱2,500 balance is
// collected separately once the website is complete, via a manually
// created Client Hub / ClientKeeper "Bill of Service" — that flow
// already exists and already enforces ganap.net's ₱200 minimum (see
// CLAUDE.md §20), so no second checkout was built on this site for the
// balance. src/content/b2b.ts's DEPOSIT_PHP/BALANCE_PHP/TOTAL_PHP are the
// matching figures for this page's copy; keep both in sync if the split
// or total ever changes.
//
// Field names and behavior below are taken from ganap.net's own
// "Webhooks & API" documentation (PDF supplied directly by the client),
// which superseded an earlier build based only on a generic curl example
// from the project dashboard. Two real bugs were caught and fixed against
// that doc:
//   1. `amount` is in whole PESOS, not centavos — this function used to
//      send 29900 for what should be 299, a 100x overcharge had it ever
//      run against a live (non-test) project.
//   2. The success/failure redirect fields are `successRedirectUrl` /
//      `failureRedirectUrl`, not `returnUrl` — the field this function
//      used to send doesn't exist in ganap's API and was silently
//      ignored, so a real customer would have landed on ganap's own
//      default receipt page instead of /foryourbusiness/thank-you.
//
// Required env vars (set in the Cloudflare Pages dashboard, never in the
// repo): GANAP_SECRET (the signing secret from the ganap.net project
// dashboard), GANAP_PROJECT_UUID (that project's UUID).
//
// DB (optional, a bound D1 database, see d1/schema.sql): if bound, this
// inserts a 'pending' order row keyed by the same idempotencyKey sent to
// ganap.net, so functions/testpayment.ts can later match the webhook back
// to this order and mark it paid. Best-effort — a DB hiccup here never
// blocks the actual checkout/payment flow.
//
// Optional annual upgrade on the foryourbusiness offer [2026-10-02, added
// for the checkout redesign]: a customer may add ONE of two annual plans
// on top of the Starter Website (UPGRADE_AMOUNT_PHP below) — never both,
// never a client-supplied price. `amount` sent to ganap is always
// offerConfig.amountPhp + the server's own upgrade price for the
// `upgrade` id the client selected, and that same `upgrade` id rides along
// in `metadata` so clienthub's webhook (functions/api/webhooks/ganap.ts,
// handleForYourBusinessSignup) knows to assign the matching plan instead
// of always defaulting to Starter — see that function for the other half
// of this change.

interface Env {
  GANAP_SECRET: string;
  GANAP_PROJECT_UUID: string;
  DB?: D1Database;
}

// Confirmed working against this project during this build (returns a
// correctly-shaped test-mode response) — kept as-is even though ganap's
// own docs show the public alias api.ganap.net, since this is the host
// actually given on the project's own dashboard/credentials page.
const GANAP_CHECKOUT_URL = "https://convex-top-api.ganap.net/v1/checkout";

type OfferId = "foryourbusiness" | "b2b";

type OfferConfig = {
  amountPhp: number; // whole pesos, decimals allowed per ganap's docs
  metadataOffer: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
};

// foryourbusiness: raised to 499 [2026-09-11], reverted back to 299
// [2026-09-16], raised again to 599 [2026-10-02]. metadataOffer is
// deliberately left as "foryourbusiness-299" through all three changes —
// it's a SKU-like category label nothing branches on or displays, not a
// live price statement, so renaming it would just drift out of sync with
// every payment already recorded under that tag for no real benefit.
const OFFER_CONFIG: Record<OfferId, OfferConfig> = {
  foryourbusiness: {
    amountPhp: 599,
    metadataOffer: "foryourbusiness-299",
    successRedirectUrl: "https://altasme.com/foryourbusiness/thank-you",
    failureRedirectUrl: "https://altasme.com/foryourbusiness/checkout?retry=1",
  },
  b2b: {
    amountPhp: 2499, // deposit of the ₱4,999 total; ₱2,500 balance invoiced separately on completion
    metadataOffer: "b2b-4999-deposit",
    successRedirectUrl: "https://altasme.com/b2b/thank-you",
    failureRedirectUrl: "https://altasme.com/b2b/checkout?retry=1",
  },
};

// Optional annual upgrade on top of the foryourbusiness Starter Website —
// never applies to the b2b offer. Mirrors clienthub's own "basic"/
// "essential" catalog entries (functions/_lib/pricing.ts there) exactly,
// since those are the same two plans this checkout now offers up front
// instead of only as a later internal upsell; see that repo's webhook
// (functions/api/webhooks/ganap.ts, handleForYourBusinessSignup) for the
// matching clienthub-side catalog-item id each upgrade maps to.
//
// Amounts here are the only ones this server trusts -- the client sends an
// `upgrade` id, never a price, and this table is the single source of
// truth for what gets charged. OFFER_CONFIG.foryourbusiness.amountPhp
// (599) is reused as the base for every upgrade total below, so a future
// Starter price change only needs editing in one place.
type UpgradeId = "none" | "domain_hosting" | "business_tools";

const UPGRADE_AMOUNT_PHP: Record<UpgradeId, number> = {
  none: 0,
  domain_hosting: 1500,
  business_tools: 5700,
};

function isUpgradeId(value: unknown): value is UpgradeId {
  return value === "none" || value === "domain_hosting" || value === "business_tools";
}

// Every test-mode checkout returns this literal placeholder as redirectUrl
// (case can vary — browsers normalize URL schemes to lowercase when
// reporting them, so match case-insensitively), regardless of the
// project's real payment rail. It's not a real payment code, and
// completing a test payment happens from ganap's own dashboard (Test
// mode section, "Simulate successful payment" button), not from anything
// this checkout page can show the customer.
const TEST_PLACEHOLDER_PATTERN = /^ganap-test-do-not-pay:/i;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;

type CheckoutPayload = {
  offer: OfferId;
  upgrade: UpgradeId;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  existingWebsite: string;
};

type RedirectKind = "url" | "qr-image" | "qr-payload" | "test-placeholder";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function sanitizeLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function validate(body: unknown): { data: CheckoutPayload } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid request body." };
  const b = body as Record<string, unknown>;

  const offer: OfferId = b.offer === "b2b" ? "b2b" : "foryourbusiness";
  // Upgrades only exist on the foryourbusiness offer. b2b never carries one,
  // regardless of what the client sends, so a stale/tampered b2b request
  // can't smuggle an upgrade price onto that offer's own flat amount.
  if (offer === "b2b" && b.upgrade !== undefined && b.upgrade !== "none") {
    return { error: "This offer does not support upgrades." };
  }
  const requestedUpgrade = offer === "foryourbusiness" ? b.upgrade : "none";
  if (requestedUpgrade !== undefined && !isUpgradeId(requestedUpgrade)) {
    return { error: "Invalid upgrade selection." };
  }
  const upgrade: UpgradeId = isUpgradeId(requestedUpgrade) ? requestedUpgrade : "none";
  const fullName = typeof b.fullName === "string" ? sanitizeLine(b.fullName) : "";
  const businessName = typeof b.businessName === "string" ? sanitizeLine(b.businessName) : "";
  const email = typeof b.email === "string" ? sanitizeLine(b.email) : "";
  const phone = typeof b.phone === "string" ? sanitizeLine(b.phone) : "";
  const facebook = typeof b.facebook === "string" ? sanitizeLine(b.facebook) : "";
  const instagram = typeof b.instagram === "string" ? sanitizeLine(b.instagram) : "";
  const existingWebsite = typeof b.existingWebsite === "string" ? sanitizeLine(b.existingWebsite) : "";
  const termsAccepted = b.termsAccepted === true;
  const privacyAccepted = b.privacyAccepted === true;

  if (!fullName || fullName.length > MAX_FIELD_LENGTH) return { error: "Full name is required." };
  if (!businessName || businessName.length > MAX_FIELD_LENGTH) return { error: "Business name is required." };
  if (!email || email.length > MAX_FIELD_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { error: "A valid email address is required." };
  }
  if (!phone || phone.length > 40) return { error: "Mobile number is required." };
  if (!termsAccepted) return { error: "Please agree to the Terms of Sale and Refund Policy." };
  if (!privacyAccepted) return { error: "Please agree to the Privacy Notice." };

  return {
    data: { offer, upgrade, fullName, businessName, email, phone, facebook, instagram, existingWebsite },
  };
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Classifies redirectUrl per ganap's own documented heuristic: an image
// when it starts data:image or ends in an image extension, a URL when it
// starts http, a QR payload otherwise — plus a check for the known
// test-mode placeholder ahead of the generic QR-payload bucket, since
// that literal string is not something to actually render as a QR code.
function classifyRedirectUrl(value: string): RedirectKind {
  if (TEST_PLACEHOLDER_PATTERN.test(value)) return "test-placeholder";
  if (/^https?:\/\//i.test(value)) return "url";
  if (/^data:image/i.test(value) || /\.(png|jpe?g|gif|webp|svg)$/i.test(value)) return "qr-image";
  return "qr-payload";
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.GANAP_SECRET || !env.GANAP_PROJECT_UUID) {
    return jsonResponse(500, { error: "Payment is not configured yet. Please contact us directly." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  const result = validate(body);
  if ("error" in result) return jsonResponse(400, { error: result.error });
  const data = result.data;
  const offerConfig = OFFER_CONFIG[data.offer];

  // The server computes the amount from offerConfig + UPGRADE_AMOUNT_PHP,
  // never from anything the client sent — this is the one number that
  // actually reaches ganap.net, so a tampered/guessed price in the request
  // body has no effect on what gets charged.
  const upgradeAmountPhp = UPGRADE_AMOUNT_PHP[data.upgrade];
  const totalAmountPhp = offerConfig.amountPhp + upgradeAmountPhp;

  const idempotencyKey = crypto.randomUUID();

  const ganapBody = JSON.stringify({
    projectUuid: env.GANAP_PROJECT_UUID,
    amount: totalAmountPhp,
    idempotencyKey,
    customerName: data.fullName,
    customerEmail: data.email,
    externalReference: idempotencyKey,
    metadata: {
      businessName: data.businessName,
      phone: data.phone,
      facebook: data.facebook || undefined,
      instagram: data.instagram || undefined,
      existingWebsite: data.existingWebsite || undefined,
      offer: offerConfig.metadataOffer,
      // Read by clienthub's webhook (handleForYourBusinessSignup) to decide
      // which catalog plan to assign — "none" keeps today's Starter-only
      // behavior; the other two map to clienthub's existing "basic"/
      // "essential" catalog entries. Always "none" for the b2b offer
      // (validate() already rejects anything else for that offer).
      upgrade: data.upgrade,
    },
    successRedirectUrl: offerConfig.successRedirectUrl,
    failureRedirectUrl: offerConfig.failureRedirectUrl,
  });

  if (env.DB) {
    try {
      const now = new Date().toISOString();
      await env.DB.prepare(
        `INSERT INTO orders (id, status, full_name, business_name, email, phone, facebook, instagram, existing_website, amount, offer, upgrade, upgrade_amount, created_at, updated_at)
         VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          idempotencyKey,
          data.fullName,
          data.businessName,
          data.email,
          data.phone,
          data.facebook || null,
          data.instagram || null,
          data.existingWebsite || null,
          totalAmountPhp,
          data.offer,
          data.upgrade,
          upgradeAmountPhp,
          now,
          now
        )
        .run();
    } catch (err) {
      console.error("Failed to insert pending order into D1", err);
    }
  }

  const signature = await hmacSha256Hex(env.GANAP_SECRET, ganapBody);

  let ganapResponse: Response;
  try {
    ganapResponse = await fetch(GANAP_CHECKOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Ganap-Signature": signature,
      },
      body: ganapBody,
    });
  } catch (err) {
    console.error("ganap.net checkout request failed", err);
    return jsonResponse(502, { error: "We couldn't start your payment right now. Please try again shortly." });
  }

  const ganapResponseText = await ganapResponse.text().catch(() => "");

  // Logged on every call, success or failure, so the full response is
  // visible in Cloudflare's Functions logs for diagnosis.
  console.log(`ganap.net checkout response (${ganapResponse.status}):`, ganapResponseText);

  if (!ganapResponse.ok) {
    // ganap's error responses are always { error: "..." } — surface that
    // reason in the log rather than just the status code.
    return jsonResponse(502, { error: "We couldn't start your payment right now. Please try again shortly." });
  }

  let ganapData: { referenceNumber?: string; redirectUrl?: string } | null;
  try {
    ganapData = JSON.parse(ganapResponseText) as { referenceNumber?: string; redirectUrl?: string };
  } catch {
    ganapData = null;
  }

  if (!ganapData?.redirectUrl || !ganapData.referenceNumber) {
    console.error("ganap.net checkout response missing redirectUrl/referenceNumber", ganapResponseText);
    return jsonResponse(502, { error: "We couldn't start your payment right now. Please try again shortly." });
  }

  const kind = classifyRedirectUrl(ganapData.redirectUrl);

  return jsonResponse(200, {
    redirectUrl: ganapData.redirectUrl,
    referenceNumber: ganapData.referenceNumber,
    kind,
  });
};
