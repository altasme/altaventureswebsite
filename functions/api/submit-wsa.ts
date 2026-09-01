// Cloudflare Pages Function: POST /api/submit-wsa
//
// Receives a client-signed Free Website Service Agreement (already filled
// and rendered to PDF bytes in the browser via pdf-lib) and:
//   1. emails a copy to the internal notification address and the client
//      via Resend, with the signed PDF attached
//   2. optionally archives the signed PDF to Cloudinary if credentials are
//      configured (best-effort; never blocks the email send)
//
// Required env vars (set in the Cloudflare Pages dashboard, never in the
// repo): RESEND_API_KEY, RESEND_FROM_EMAIL.
// Optional: WSA_NOTIFY_EMAIL (defaults to altasmeworks@gmail.com),
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.

interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  WSA_NOTIFY_EMAIL?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}

const DEFAULT_NOTIFY_EMAIL = "altasmeworks@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 200;
const MAX_PDF_BASE64_LENGTH = 8_000_000; // ~6MB decoded, well above the expected ~150-300KB document

type SubmitPayload = {
  businessName: string;
  clientName: string;
  email: string;
  phone: string;
  date: string;
  pdfBase64: string;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validate(body: unknown): { data: SubmitPayload } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid request body." };
  const b = body as Record<string, unknown>;

  const businessName = typeof b.businessName === "string" ? sanitizeLine(b.businessName) : "";
  const clientName = typeof b.clientName === "string" ? sanitizeLine(b.clientName) : "";
  const email = typeof b.email === "string" ? sanitizeLine(b.email) : "";
  const phone = typeof b.phone === "string" ? sanitizeLine(b.phone) : "";
  const date = typeof b.date === "string" ? sanitizeLine(b.date) : "";
  const pdfBase64 = typeof b.pdfBase64 === "string" ? b.pdfBase64 : "";

  if (!businessName || businessName.length > MAX_FIELD_LENGTH) return { error: "Business name is required." };
  if (!clientName || clientName.length > MAX_FIELD_LENGTH) return { error: "Client name is required." };
  if (!email || email.length > MAX_FIELD_LENGTH || !EMAIL_PATTERN.test(email)) {
    return { error: "A valid email address is required." };
  }
  if (!phone || phone.length > 40) return { error: "Contact number is required." };
  if (!date) return { error: "Date is required." };
  if (!pdfBase64 || pdfBase64.length > MAX_PDF_BASE64_LENGTH) return { error: "Signed document is missing or too large." };

  return { data: { businessName, clientName, email, phone, date, pdfBase64 } };
}

async function sendResendEmail(
  env: Env,
  to: string,
  subject: string,
  html: string,
  attachmentBase64: string,
  attachmentFilename: string
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      attachments: [{ filename: attachmentFilename, content: attachmentBase64 }],
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Resend failed to send to ${to}: ${response.status} ${text}`);
  }
}

async function signCloudinaryParams(params: Record<string, string>, apiSecret: string): Promise<string> {
  const toSign =
    Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&") + apiSecret;
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function archiveToCloudinary(env: Env, data: SubmitPayload): Promise<void> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) return;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const slug = data.businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  const publicId = `wsa-free/${slug || "client"}-${timestamp}`;

  const signature = await signCloudinaryParams({ public_id: publicId, timestamp }, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.set("file", `data:application/pdf;base64,${data.pdfBase64}`);
  form.set("api_key", env.CLOUDINARY_API_KEY);
  form.set("timestamp", timestamp);
  form.set("public_id", publicId);
  form.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/raw/upload`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.error(`Cloudinary archive failed: ${response.status} ${text}`);
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    return jsonResponse(500, { error: "Email delivery is not configured yet. Please contact us directly." });
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

  const filename = `Altaventures Free Website Service Agreement - ${data.businessName}.pdf`;
  const notifyEmail = env.WSA_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

  const internalHtml = `
    <p>A new Free Website Service Agreement was signed.</p>
    <ul>
      <li><strong>Business:</strong> ${escapeHtml(data.businessName)}</li>
      <li><strong>Client / Authorized Representative:</strong> ${escapeHtml(data.clientName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Contact Number:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Date:</strong> ${escapeHtml(data.date)}</li>
    </ul>
    <p>The signed agreement is attached.</p>
  `;

  const clientHtml = `
    <p>Hi ${escapeHtml(data.clientName)},</p>
    <p>Thanks for signing the Altaventures Free Website Service Agreement for ${escapeHtml(data.businessName)}. A copy of your signed agreement is attached for your records.</p>
    <p>We'll be in touch soon to get started.</p>
    <p>Altaventures Business Development Services</p>
  `;

  try {
    await Promise.all([
      sendResendEmail(
        env,
        notifyEmail,
        `New Free Website Service Agreement — ${data.businessName}`,
        internalHtml,
        data.pdfBase64,
        filename
      ),
      sendResendEmail(
        env,
        data.email,
        "Your signed Free Website Service Agreement — Altaventures",
        clientHtml,
        data.pdfBase64,
        filename
      ),
    ]);
  } catch (err) {
    console.error(err);
    return jsonResponse(502, { error: "We couldn't send your agreement right now. Please try again shortly." });
  }

  // Best-effort archive; never blocks the response the client sees.
  try {
    await archiveToCloudinary(env, data);
  } catch (err) {
    console.error("Cloudinary archive error", err);
  }

  return jsonResponse(200, { ok: true });
};
