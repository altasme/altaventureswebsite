// Cloudflare Pages Function: POST /api/checkout
//
// Creates a ganap.net checkout session for the /foryourbusiness ₱299
// website offer and returns what the browser needs to complete payment.
// This is a server-only call: it signs the request with the ganap.net
// signing secret, which must never reach the client.
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
const AMOUNT_PHP = 299; // whole pesos, decimals allowed per ganap's docs
const SUCCESS_REDIRECT_URL = "https://altasme.com/foryourbusiness/thank-you";
const FAILURE_REDIRECT_URL = "https://altasme.com/foryourbusiness/checkout?retry=1";

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
    data: { fullName, businessName, email, phone, facebook, instagram, existingWebsite },
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

  const idempotencyKey = crypto.randomUUID();

  const ganapBody = JSON.stringify({
    projectUuid: env.GANAP_PROJECT_UUID,
    amount: AMOUNT_PHP,
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
      offer: "foryourbusiness-299",
    },
    successRedirectUrl: SUCCESS_REDIRECT_URL,
    failureRedirectUrl: FAILURE_REDIRECT_URL,
  });

  if (env.DB) {
    try {
      const now = new Date().toISOString();
      await env.DB.prepare(
        `INSERT INTO orders (id, status, full_name, business_name, email, phone, facebook, instagram, existing_website, amount, created_at, updated_at)
         VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
          AMOUNT_PHP,
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
