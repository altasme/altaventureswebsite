// Client-side "signed copy" PDF generation for the public proposal page
// (CLAUDE.md §67). Proposal content is free-form rich text (headings,
// tables, lists) with no fixed pdf-lib template to overlay like the WSA
// agreements use, and Cloudflare Pages Functions can't render HTML to
// PDF server-side (no Node/Chromium in the Workers runtime) -- the same
// constraint ClientKeeper's own "Download Signed Copy" button already
// documents working around with window.print(). jsPDF's .html() plugin
// (which rasterizes the DOM via html2canvas internally) is the real
// client-side equivalent for a document that needs to be emailed as
// actual PDF bytes rather than opened in a new print-dialog tab.
import jsPDF from "jspdf";
import { bytesToBase64 } from "./wsaPdf";
import { BRAND } from "../content/site";
import { WSA_ALTA_SIGNER } from "../content/wsa";

export interface SignedProposalPdfInput {
  title: string;
  contentHtml: string;
  altaventuresSignedAtLabel: string;
  clientSignerName: string;
  clientSignerTitle: string | null;
  clientSignatureDataUrl: string;
  clientSignedAtLabel: string;
}

function buildOffscreenElement(data: SignedProposalPdfInput): HTMLDivElement {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const el = document.createElement("div");
  // Off-screen but genuinely laid out (not display:none / visibility:
  // hidden) -- html2canvas needs real, rendered dimensions to rasterize.
  el.style.position = "fixed";
  el.style.left = "-10000px";
  el.style.top = "0";
  el.style.width = "720px";
  el.style.background = "#ffffff";
  el.style.padding = "32px";
  el.style.fontFamily = "Arial, Helvetica, sans-serif";
  el.style.color = "#0a0f1c";

  el.innerHTML = `
    <h1 style="color:#02256f;font-size:22px;margin:0 0 4px;">${esc(data.title)}</h1>
    <p style="font-size:11px;color:#5b6479;margin:0 0 20px;">Signed copy &mdash; ${esc(BRAND.name)}</p>
    <div class="proposal-content">${data.contentHtml}</div>
    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #d8dce6;">
      <p style="font-weight:bold;margin:0 0 6px;">Already signed by ${esc(BRAND.name)}</p>
      <img src="/images/brand/alta-signature.png" style="height:50px;" />
      <p style="margin:6px 0 0;">${esc(WSA_ALTA_SIGNER)}, Founder &mdash; ${esc(BRAND.name)}</p>
      <p style="font-size:10px;color:#5b6479;margin:2px 0 0;">Authorized ${esc(data.altaventuresSignedAtLabel)}</p>
    </div>
    <div style="margin-top:24px;padding-top:16px;border-top:1px solid #d8dce6;">
      <p style="font-weight:bold;margin:0 0 6px;">Accepted and signed by ${esc(data.clientSignerName)}${data.clientSignerTitle ? `, ${esc(data.clientSignerTitle)}` : ""}</p>
      <img src="${data.clientSignatureDataUrl}" style="height:50px;border:1px solid #d8dce6;border-radius:6px;padding:6px;background:#fff;" />
      <p style="font-size:10px;color:#5b6479;margin:2px 0 0;">Signed ${esc(data.clientSignedAtLabel)}</p>
    </div>
  `;
  return el;
}

/** Renders the signed proposal to a PDF entirely client-side and returns it as base64. */
export async function generateSignedProposalPdfBase64(data: SignedProposalPdfInput): Promise<string> {
  const el = buildOffscreenElement(data);
  document.body.appendChild(el);
  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 28;
    await doc.html(el, {
      x: margin,
      y: margin,
      width: pageWidth - margin * 2,
      windowWidth: 720,
      autoPaging: "text",
      html2canvas: { scale: 0.75, useCORS: true },
    });
    const bytes = new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
    return bytesToBase64(bytes);
  } finally {
    el.remove();
  }
}
