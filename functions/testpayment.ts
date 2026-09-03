// Cloudflare Pages Function: POST /testpayment
//
// Webhook receiver for ganap.net payment events (currently pointed at the
// "Test alta webhoo" TEST MODE project). This is the authoritative,
// server-to-server confirmation that a payment happened — the browser
// redirect back to /foryourbusiness/thank-you is only a UX nicety and is
// never trusted on its own.
//
// Verifies the request really came from ganap.net (HMAC-SHA256 of the raw
// body, hex, compared to X-Ganap-Signature) before doing anything with it.
// ganap.net's docs only document signing OUTGOING checkout requests this
// way; this assumes incoming webhooks are signed with the same scheme and
// the same secret. Confirm against a real test webhook delivery — if the
// header name or scheme differs, update SIGNATURE_HEADER / verifySignature
// below.
//
// There is no database yet (no Supabase credentials configured), so this
// does not persist an "orders" record. Instead it emails the full payload
// to the internal notify address via Resend so a human sees every event
// while the payload shape is still being confirmed against real test
// transactions. Once the real field names are confirmed, tighten this to
// only notify on a genuine "paid"/"succeeded" status.
//
// Required env vars: GANAP_SECRET (same signing secret as /api/checkout),
// RESEND_API_KEY, RESEND_FROM_EMAIL. Optional: PAYMENT_NOTIFY_EMAIL
// (defaults to altasmeworks@gmail.com).

interface Env {
  GANAP_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  PAYMENT_NOTIFY_EMAIL?: string;
}

const SIGNATURE_HEADER = "X-Ganap-Signature";
const DEFAULT_NOTIFY_EMAIL = "altasmeworks@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

// ganap.net's webhook payload schema isn't documented here yet; look up a
// plausible status/event field case-insensitively rather than assuming one
// exact key.
function extractStatus(payload: Record<string, unknown>): string {
  for (const key of ["status", "paymentStatus", "state", "event", "type"]) {
    const value = payload[key];
    if (typeof value === "string" && value) return value;
  }
  return "unknown";
}

function extractString(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value) return value;
  }
  return "";
}

async function sendNotification(env: Env, rawBody: string, payload: Record<string, unknown>): Promise<void> {
  const notifyEmail = env.PAYMENT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
  const status = extractStatus(payload);
  const referenceNumber = extractString(payload, ["referenceNumber", "reference", "id"]);
  const customerName = extractString(payload, ["customerName"]);
  const customerEmail = extractString(payload, ["customerEmail"]);

  const html = `
    <p>A ganap.net payment webhook was received (TEST MODE project).</p>
    <ul>
      <li><strong>Status/event:</strong> ${escapeHtml(status)}</li>
      <li><strong>Reference:</strong> ${escapeHtml(referenceNumber || "(not found in payload)")}</li>
      <li><strong>Customer:</strong> ${escapeHtml(customerName || "(not found)")} &lt;${escapeHtml(customerEmail || "(not found)")}&gt;</li>
    </ul>
    <p>Full raw payload:</p>
    <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${escapeHtml(rawBody)}</pre>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [notifyEmail],
      subject: `Ganap payment webhook (TEST MODE) — ${status}`,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(`Resend failed to send payment webhook notification: ${response.status} ${text}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const rawBody = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER) || "";

  if (!env.GANAP_SECRET) {
    console.error("GANAP_SECRET is not configured; rejecting webhook.");
    return new Response("Not configured", { status: 500 });
  }

  const expectedSignature = await hmacSha256Hex(env.GANAP_SECRET, rawBody);
  if (!signature || !timingSafeEqual(signature, expectedSignature)) {
    console.error("Ganap webhook signature mismatch; rejecting.");
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    console.error("Ganap webhook body is not valid JSON.");
    return new Response("Invalid body", { status: 400 });
  }

  if (env.RESEND_API_KEY && env.RESEND_FROM_EMAIL) {
    waitUntil(
      sendNotification(env, rawBody, payload).catch((err) => console.error("Payment webhook notification failed", err))
    );
  } else {
    console.error("RESEND_API_KEY/RESEND_FROM_EMAIL not configured; payment webhook received but not notified.");
  }

  return new Response("ok", { status: 200 });
};
