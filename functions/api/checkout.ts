// Cloudflare Pages Function: POST /api/checkout
//
// Creates a ganap.net hosted checkout session for the /foryourbusiness ₱299
// website offer and returns the redirectUrl the browser should be sent to.
// This is a server-only call: it signs the request with the ganap.net
// signing secret, which must never reach the client.
//
// Required env vars (set in the Cloudflare Pages dashboard, never in the
// repo): GANAP_SECRET (the signing secret from the ganap.net project
// dashboard), GANAP_PROJECT_UUID (that project's UUID).
//
// NOTE ON AMOUNT UNIT: ganap.net's docs show `"amount":1000` in their
// example without stating the unit. This assumes the API expects the
// smallest currency unit (centavos), matching common PH payment gateway
// convention, so ₱299.00 is sent as 29900. Confirm against a real test
// transaction before relying on this; if ganap.net actually expects whole
// pesos, change AMOUNT_PHP_CENTAVOS to 299.

interface Env {
  GANAP_SECRET: string;
  GANAP_PROJECT_UUID: string;
}

const GANAP_CHECKOUT_URL = "https://convex-top-api.ganap.net/v1/checkout";
const AMOUNT_PHP_CENTAVOS = 29900; // ₱299.00 — see amount-unit note above
const RETURN_URL = "https://altasme.com/foryourbusiness/thank-you";

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
    amount: AMOUNT_PHP_CENTAVOS,
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
    returnUrl: RETURN_URL,
  });

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

  if (!ganapResponse.ok) {
    const text = await ganapResponse.text().catch(() => "");
    console.error(`ganap.net checkout failed: ${ganapResponse.status} ${text}`);
    return jsonResponse(502, { error: "We couldn't start your payment right now. Please try again shortly." });
  }

  const ganapData = (await ganapResponse.json().catch(() => null)) as { redirectUrl?: string } | null;
  if (!ganapData?.redirectUrl) {
    console.error("ganap.net checkout response missing redirectUrl", ganapData);
    return jsonResponse(502, { error: "We couldn't start your payment right now. Please try again shortly." });
  }

  return jsonResponse(200, { redirectUrl: ganapData.redirectUrl });
};
