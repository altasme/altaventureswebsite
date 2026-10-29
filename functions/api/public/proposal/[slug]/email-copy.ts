// Cloudflare Pages Function: POST /api/public/proposal/:slug/email-copy
//
// The optional "Send a copy of this proposal via email" checkbox on the
// public proposal page (CLAUDE.md §67). The PDF itself is generated
// entirely client-side (ProposalPage.tsx, via jsPDF + html2canvas --
// there's no server-side HTML-to-PDF renderer available in the Workers
// runtime, same constraint ClientKeeper's own "Download Signed Copy"
// button already works around with window.print()); this endpoint's job
// is only to email the bytes the browser already produced, to both the
// address the signer typed (which may override whatever email was on
// file for this proposal's client/lead/prospect) and the internal
// notify address, exactly mirroring submit-wsa.ts's existing dual-send
// pattern.
//
// Only ever sends a copy of an ALREADY-SIGNED proposal -- the PDF
// includes the signature block, so emailing one before signing would be
// emailing an unsigned document under false pretenses.

import { jsonResponse, sendResendEmail, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

const DEFAULT_NOTIFY_EMAIL = "altasmeworks@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PDF_BASE64_LENGTH = 8_000_000; // ~6MB decoded, generous for a text-heavy proposal PDF

interface ProposalRow {
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

  const proposal = await db.prepare(`SELECT id, title, status, access_token FROM proposals WHERE slug = ?`).bind(slug).first<ProposalRow>();
  if (!proposal || !token || !tokensMatch(token, proposal.access_token)) return jsonResponse(404, { error: "This proposal link isn't valid." });
  if (proposal.status !== "signed") return jsonResponse(409, { error: "This proposal hasn't been signed yet." });

  const filename = `${proposal.title.replace(/[^a-z0-9 ]+/gi, "").trim() || "Altaventures Proposal"}.pdf`;

  const clientHtml = `
    <p>Hi,</p>
    <p>As requested, here's a copy of your signed proposal, "${escapeHtml(proposal.title)}," attached as a PDF.</p>
    <p>Altaventures Business Development Services</p>
  `;
  const internalHtml = `
    <p>A client requested an emailed copy of a signed proposal.</p>
    <ul>
      <li><strong>Proposal:</strong> ${escapeHtml(proposal.title)}</li>
      <li><strong>Sent to:</strong> ${escapeHtml(email)}</li>
    </ul>
    <p>The signed proposal is attached.</p>
  `;

  try {
    await Promise.all([
      sendResendEmail(env, email, `Your signed proposal — ${proposal.title}`, clientHtml, { filename, base64: pdfBase64 }),
      sendResendEmail(env, DEFAULT_NOTIFY_EMAIL, `Proposal copy emailed — ${proposal.title}`, internalHtml, { filename, base64: pdfBase64 }),
    ]);
  } catch (err) {
    console.error(err);
    return jsonResponse(502, { error: "We couldn't send that copy right now. Please try again shortly." });
  }

  return jsonResponse(200, { ok: true });
};
