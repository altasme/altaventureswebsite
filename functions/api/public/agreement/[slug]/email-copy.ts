// Cloudflare Pages Function: POST /api/public/agreement/:slug/email-copy
//
// The optional "Send a copy of this agreement via email" checkbox on
// the public agreement page, cloned from the proposal generator's own
// endpoint (functions/api/public/proposal/[slug]/email-copy.ts) --
// minus the "freebies" option, which is specific to the free-website
// offer's marketing funnel, not a generic service agreement. The PDF
// itself is generated entirely client-side (AgreementPage.tsx, reusing
// the exact same generateSignedProposalPdfBase64() helper the proposal
// page already uses -- it's generic over title/contentHtml/signatures,
// so no clone of that function was needed). This endpoint's job is only
// to email the bytes the browser already produced, to both the address
// the signer typed and the internal notify address, mirroring
// submit-wsa.ts's existing dual-send pattern.
//
// Only ever sends a copy of an ALREADY-SIGNED agreement -- the PDF
// includes the signature block, so emailing one before signing would be
// emailing an unsigned document under false pretenses.

import { jsonResponse, sendResendEmail, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

const DEFAULT_NOTIFY_EMAIL = "altasmeworks@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PDF_BASE64_LENGTH = 8_000_000; // ~6MB decoded, generous for a text-heavy agreement PDF

interface ServiceAgreementRow {
  id: string;
  title: string;
  status: string;
  access_token: string;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export const onRequestPost: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) return jsonResponse(500, { error: "Email delivery is not configured yet." });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid request body" });
  }
  const b = body as Record<string, unknown>;
  const token = typeof b.t === "string" ? b.t : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const pdfBase64 = typeof b.pdfBase64 === "string" ? b.pdfBase64 : "";

  if (!email || !EMAIL_PATTERN.test(email)) return jsonResponse(400, { error: "A valid email address is required." });
  if (!pdfBase64 || pdfBase64.length > MAX_PDF_BASE64_LENGTH) return jsonResponse(400, { error: "The document is missing or too large." });

  const agreement = await db.prepare(`SELECT id, title, status, access_token FROM service_agreements WHERE slug = ?`).bind(slug).first<ServiceAgreementRow>();
  if (!agreement || !token || !tokensMatch(token, agreement.access_token)) return jsonResponse(404, { error: "This service agreement link isn't valid." });
  if (agreement.status !== "signed") return jsonResponse(409, { error: "This service agreement hasn't been signed yet." });

  const filename = `${agreement.title.replace(/[^a-z0-9 ]+/gi, "").trim() || "Altaventures Service Agreement"}.pdf`;
  const subject = `Your signed service agreement — ${agreement.title}`;

  const clientHtml = `
    <p>Hi,</p>
    <p>As requested, here's a copy of your signed service agreement, "${escapeHtml(agreement.title)}," attached as a PDF.</p>
    <p>Altaventures Business Development Services</p>
  `;
  const internalHtml = `
    <p>A client requested an emailed copy of a signed service agreement.</p>
    <ul>
      <li><strong>Service agreement:</strong> ${escapeHtml(agreement.title)}</li>
      <li><strong>Sent to:</strong> ${escapeHtml(email)}</li>
    </ul>
    <p>The signed agreement is attached.</p>
  `;

  try {
    await Promise.all([
      sendResendEmail(env, email, subject, clientHtml, { filename, base64: pdfBase64 }),
      sendResendEmail(env, DEFAULT_NOTIFY_EMAIL, `Service agreement copy emailed — ${agreement.title}`, internalHtml, { filename, base64: pdfBase64 }),
    ]);
  } catch (err) {
    console.error(err);
    return jsonResponse(502, { error: "We couldn't send that copy right now. Please try again shortly." });
  }

  return jsonResponse(200, { ok: true });
};
