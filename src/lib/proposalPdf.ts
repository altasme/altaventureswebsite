// Client-side "signed copy" PDF generation for the public proposal page
// (CLAUDE.md §67). Proposal content is free-form rich text (headings,
// tables, lists) with no fixed pdf-lib template to overlay like the WSA
// agreements use, and Cloudflare Pages Functions can't render HTML to
// PDF server-side (no Node/Chromium in the Workers runtime) -- the same
// constraint ClientKeeper's own "Download Signed Copy" button already
// documents working around with window.print().
//
// [2026-10-29, CLAUDE.md §71] This used to call jsPDF's .html() plugin
// directly, which internally rasterizes via html2canvas. That produced
// a PDF that LOOKED fine by file size/page count but rendered as a
// completely blank page in every real PDF viewer (confirmed against two
// independent renderers, poppler and MuPDF, plus a raw content-stream
// inspection) -- jsPDF's .html() computes PDF coordinates from the
// source element's real on-page position, and buildOffscreenElement()
// deliberately renders off-screen at left: -10000px so html2canvas has
// a real, laid-out element to rasterize without it flashing on screen.
// That combination put every drawn element thousands of points to the
// left of the page (confirmed directly in the content stream: text
// draw commands at x ~ -7000 to -7500pt against a 595pt-wide page).
// html2canvas itself handles an off-screen element fine -- it's only
// jsPDF's .html() wrapper that breaks -- so the fix bypasses .html()
// entirely: rasterize with html2canvas directly, then place the
// resulting canvas onto page(s) with doc.addImage() at an explicit,
// element-position-independent (margin, margin) origin.
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

// Scans upward from `idealY` for a row of the canvas that's effectively
// blank (near-white), so a page break lands in the gap between
// paragraphs/list items instead of slicing through a line of text.
// Bounded lookback -- if nothing blank enough turns up nearby, falls
// back to the naive cut rather than searching the whole canvas.
function findBreakRow(ctx: CanvasRenderingContext2D, width: number, idealY: number, maxLookbackPx: number): number {
  const minY = Math.max(0, idealY - maxLookbackPx);
  for (let y = idealY; y > minY; y--) {
    const row = ctx.getImageData(0, y, width, 1).data;
    let isBlank = true;
    for (let i = 0; i < row.length; i += 4) {
      if (row[i] < 250 || row[i + 1] < 250 || row[i + 2] < 250) {
        isBlank = false;
        break;
      }
    }
    if (isBlank) return y;
  }
  return idealY;
}

/** Renders the signed proposal to a PDF entirely client-side and returns it as base64. */
export async function generateSignedProposalPdfBase64(data: SignedProposalPdfInput): Promise<string> {
  const el = buildOffscreenElement(data);
  document.body.appendChild(el);
  try {
    const scale = 1.5;
    const canvas = await html2canvas(el, { scale, useCORS: true, backgroundColor: "#ffffff" });
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not read the rendered proposal canvas.");

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 28;
    const pageWidthPt = doc.internal.pageSize.getWidth();
    const pageHeightPt = doc.internal.pageSize.getHeight();
    const contentWidthPt = pageWidthPt - margin * 2;
    const contentHeightPt = pageHeightPt - margin * 2;

    const ratio = contentWidthPt / canvas.width; // canvas px -> PDF pt
    const idealSliceHeightPx = Math.floor(contentHeightPt / ratio);

    let y = 0;
    let isFirstPage = true;
    while (y < canvas.height) {
      const idealEnd = Math.min(y + idealSliceHeightPx, canvas.height);
      const sliceEnd =
        idealEnd < canvas.height ? findBreakRow(ctx, canvas.width, idealEnd, Math.min(120, idealSliceHeightPx - 1)) : idealEnd;
      const sliceHeightPx = Math.max(1, sliceEnd - y);

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      const sliceCtx = sliceCanvas.getContext("2d");
      if (!sliceCtx) throw new Error("Could not prepare a page slice of the proposal canvas.");
      sliceCtx.drawImage(canvas, 0, y, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

      if (!isFirstPage) doc.addPage();
      doc.addImage(sliceCanvas.toDataURL("image/jpeg", 0.82), "JPEG", margin, margin, contentWidthPt, sliceHeightPx * ratio);

      y += sliceHeightPx;
      isFirstPage = false;
    }

    const bytes = new Uint8Array(doc.output("arraybuffer") as ArrayBuffer);
    return bytesToBase64(bytes);
  } finally {
    el.remove();
  }
}
