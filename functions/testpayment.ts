// Cloudflare Pages Function: POST /testpayment
//
// Webhook receiver for ganap.net payment events (currently pointed at the
// "Test alta webhoo" TEST MODE project). This is the authoritative,
// server-to-server confirmation that a payment happened — the browser
// redirect back to /foryourbusiness/thank-you is only a UX nicety and is
// never trusted on its own.
//
// Payload shape below is taken from ganap.net's own "Webhooks & API"
// documentation (PDF supplied directly by the client), which confirmed
// the exact fields — this used to guess at plausible field names
// (status/paymentStatus/state, customerName/customerEmail flat) since no
// real docs were available yet. The real shape:
//   POST your endpoint URL
//   X-Ganap-Event: transaction.paid
//   X-Ganap-Signature: <HMAC-SHA256 of the raw body, hex>
//   {
//     "event": "transaction.paid",       // the only event sent today
//     "referenceNumber": "...",          // matches the checkout response
//     "externalReference": "..." | null, // whatever we sent at checkout
//     "amount": 299,                     // gross, in pesos
//     "currency": "PHP",
//     "status": "paid",                  // always "paid" — failures are
//                                         // never sent, so there is
//                                         // nothing else to branch on
//     "customer": { "name": "...", "email": "..." }, // either can be null
//     "metadata": { ... } | null,
//     "timestamp": "2026-08-13T09:04:11.412Z" // when the delivery was
//                                              // built, not when it settled
//   }
// Signed the same way as the outgoing checkout call (confirmed by the
// same docs): HMAC-SHA256 of the raw body, hex, in X-Ganap-Signature,
// using the same signing secret.
//
// Docs also confirm callbacks are at-least-once (a retry after a timeout,
// or a manual redelivery, can resend the same event) — this always
// updates the matching D1 order and re-sends the notification email on
// every delivery rather than trying to dedupe, since a duplicate email is
// a much smaller cost than a silently-dropped one; add real dedupe (e.g.
// skip if the order is already 'paid') if duplicate notifications become
// a problem.
//
// DB (optional, a bound D1 database, see d1/schema.sql): if bound, this
// tries to match the webhook back to the 'pending' order created by
// functions/api/checkout.ts via externalReference (the idempotencyKey
// sent at checkout, which is also the order's own D1 row id) and marks
// it paid with the raw webhook payload attached. No match, or no DB
// bound, is not an error — the email notification below still fires
// either way, so nothing is silently lost.
//
// Required env vars: GANAP_SECRET (same signing secret as /api/checkout),
// RESEND_API_KEY, RESEND_FROM_EMAIL. Optional: PAYMENT_NOTIFY_EMAIL
// (defaults to altasmeworks@gmail.com).

interface Env {
  GANAP_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  PAYMENT_NOTIFY_EMAIL?: string;
  DB?: D1Database;
}

interface GanapWebhookPayload {
  event: string;
  referenceNumber: string;
  externalReference: string | null;
  amount: number;
  currency: string;
  status: string;
  customer: { name: string | null; email: string | null } | null;
  metadata: Record<string, unknown> | null;
  timestamp: string;
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

function parsePayload(rawBody: string): GanapWebhookPayload | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) return null;
  const p = parsed as Record<string, unknown>;

  if (typeof p.referenceNumber !== "string" || typeof p.event !== "string") return null;

  const customer =
    typeof p.customer === "object" && p.customer !== null
      ? (p.customer as { name?: unknown; email?: unknown })
      : null;

  return {
    event: p.event,
    referenceNumber: p.referenceNumber,
    externalReference: typeof p.externalReference === "string" ? p.externalReference : null,
    amount: typeof p.amount === "number" ? p.amount : 0,
    currency: typeof p.currency === "string" ? p.currency : "PHP",
    status: typeof p.status === "string" ? p.status : "unknown",
    customer: customer
      ? {
          name: typeof customer.name === "string" ? customer.name : null,
          email: typeof customer.email === "string" ? customer.email : null,
        }
      : null,
    metadata: typeof p.metadata === "object" && p.metadata !== null ? (p.metadata as Record<string, unknown>) : null,
    timestamp: typeof p.timestamp === "string" ? p.timestamp : "",
  };
}

async function updateMatchingOrder(env: Env, rawBody: string, payload: GanapWebhookPayload): Promise<void> {
  if (!env.DB) return;

  // The order's D1 row id is the idempotencyKey sent at checkout, which
  // was also sent as externalReference — that's what we match on.
  // referenceNumber is ganap's own id, not ours, so it's only a fallback.
  const orderId = payload.externalReference || payload.referenceNumber;
  if (!orderId) return;

  const now = new Date().toISOString();

  const result = await env.DB.prepare(
    `UPDATE orders SET status = ?, webhook_payload = ?, updated_at = ? WHERE id = ?`
  )
    .bind(payload.status, rawBody, now, orderId)
    .run();

  if (!result.meta.changes) {
    console.error(`No order matched webhook reference "${orderId}"; nothing updated in D1.`);
  }
}

async function sendNotification(env: Env, rawBody: string, payload: GanapWebhookPayload): Promise<void> {
  const notifyEmail = env.PAYMENT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

  const html = `
    <p>A ganap.net payment webhook was received (TEST MODE project).</p>
    <ul>
      <li><strong>Event:</strong> ${escapeHtml(payload.event)}</li>
      <li><strong>Status:</strong> ${escapeHtml(payload.status)}</li>
      <li><strong>Amount:</strong> ₱${payload.amount} ${escapeHtml(payload.currency)}</li>
      <li><strong>Reference:</strong> ${escapeHtml(payload.referenceNumber)}</li>
      <li><strong>Our reference:</strong> ${escapeHtml(payload.externalReference || "(none)")}</li>
      <li><strong>Customer:</strong> ${escapeHtml(payload.customer?.name || "(not provided)")} &lt;${escapeHtml(payload.customer?.email || "(not provided)")}&gt;</li>
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
      subject: `Ganap payment webhook (TEST MODE) — ${payload.status}, ₱${payload.amount}`,
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

  const payload = parsePayload(rawBody);
  if (!payload) {
    console.error("Ganap webhook body is not valid JSON or missing required fields.", rawBody);
    return new Response("Invalid body", { status: 400 });
  }

  // "transaction.paid" is the only event ganap sends today; branching on
  // it (per their own docs' advice) means a future event type won't fall
  // through this handler as if it were a payment.
  if (payload.event !== "transaction.paid") {
    console.log(`Ignoring unrecognized ganap webhook event: ${payload.event}`);
    return new Response("ok", { status: 200 });
  }

  waitUntil(
    updateMatchingOrder(env, rawBody, payload).catch((err) => console.error("Failed to update order in D1", err))
  );

  if (env.RESEND_API_KEY && env.RESEND_FROM_EMAIL) {
    waitUntil(
      sendNotification(env, rawBody, payload).catch((err) => console.error("Payment webhook notification failed", err))
    );
  } else {
    console.error("RESEND_API_KEY/RESEND_FROM_EMAIL not configured; payment webhook received but not notified.");
  }

  return new Response("ok", { status: 200 });
};
