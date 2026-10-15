// Generates public/documents/pro-website-service-agreement.pdf from
// src/content/wsa-pro.ts (single source of truth for the ₱2,099 Website
// Plan agreement text), and prints the resulting field coordinates to paste
// into WSA_PRO_PDF_FIELD_COORDS / WSA_PRO_SIGNATURE_BOX in that same file.
//
// Run with: npx tsx scripts/generate-wsa-pro-pdf.ts
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WSA_PRO_DOCUMENT, WSA_PRO_ALTA_SIGNER, type WsaBlock } from "../src/content/wsa-pro";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 72;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const BOTTOM_MARGIN = 64;
const TOP_MARGIN = 50;

const NAVY = rgb(0.008, 0.145, 0.435);
const BLUE = rgb(0.051, 0.408, 0.937);
const INK = rgb(0.04, 0.06, 0.11);
const GRAY = rgb(0.55, 0.57, 0.62);
const TABLE_HEADER_BG = rgb(0.965, 0.973, 0.988);
const TABLE_LINE = rgb(0.85, 0.87, 0.91);

type FieldCoord = { page: number; x: number; y: number; w: number };

async function main() {
  const pdf = await PDFDocument.create();
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logoBytes = fs.readFileSync(path.join(ROOT, "public/images/brand/altaventures-logo.png"));
  const logoImage = await pdf.embedPng(logoBytes);
  const signatureBytes = fs.readFileSync(path.join(ROOT, "public/images/brand/alta-signature.png"));
  const signatureImage = await pdf.embedPng(signatureBytes);

  let page: PDFPage;
  let cursorY = 0;
  let pageIndex = -1;

  function drawHeader() {
    const logoWidth = 170;
    const logoHeight = (logoWidth * logoImage.height) / logoImage.width;
    const x = (PAGE_WIDTH - logoWidth) / 2;
    const y = PAGE_HEIGHT - TOP_MARGIN - logoHeight;
    page.drawImage(logoImage, { x, y, width: logoWidth, height: logoHeight });
    cursorY = y - 26;
  }

  function newPage() {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageIndex += 1;
    drawHeader();
  }

  function ensureSpace(height: number) {
    if (cursorY - height < BOTTOM_MARGIN) newPage();
  }

  function sanitizeForPdf(text: string): string {
    // Standard 14 PDF fonts use WinAnsi encoding, which has no Peso sign.
    return text.replace(/₱/g, "PHP ");
  }

  function wrapText(rawText: string, font: PDFFont, size: number, maxWidth: number): string[] {
    const text = sanitizeForPdf(rawText);
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function drawParagraph(text: string, opts: { indent?: number; color?: RGB } = {}) {
    const indent = opts.indent ?? 0;
    const size = 10.5;
    const leading = 14.5;
    const lines = wrapText(text, fontRegular, size, CONTENT_WIDTH - indent);
    for (const line of lines) {
      ensureSpace(leading);
      page.drawText(line, { x: MARGIN_X + indent, y: cursorY, size, font: fontRegular, color: opts.color ?? INK });
      cursorY -= leading;
    }
    cursorY -= 4;
  }

  function drawHeading(text: string) {
    ensureSpace(34);
    cursorY -= 8;
    page.drawText(text, { x: MARGIN_X, y: cursorY, size: 12.5, font: fontBold, color: NAVY });
    cursorY -= 19;
  }

  function drawSubheading(text: string) {
    ensureSpace(22);
    page.drawText(text, { x: MARGIN_X, y: cursorY, size: 11, font: fontBold, color: NAVY });
    cursorY -= 16;
  }

  function drawBullets(items: string[]) {
    for (const item of items) {
      const lines = wrapText(item, fontRegular, 10.5, CONTENT_WIDTH - 14);
      for (let i = 0; i < lines.length; i++) {
        ensureSpace(14.5);
        if (i === 0) {
          page.drawText("•", { x: MARGIN_X, y: cursorY, size: 10.5, font: fontRegular, color: BLUE });
        }
        page.drawText(lines[i], { x: MARGIN_X + 14, y: cursorY, size: 10.5, font: fontRegular, color: BLUE });
        cursorY -= 14.5;
      }
    }
    cursorY -= 4;
  }

  function drawTable(headers: string[], rows: string[][]) {
    const colCount = headers.length;
    const colWidth = CONTENT_WIDTH / colCount;
    const rowHeight = 20;

    ensureSpace(rowHeight);
    let x = MARGIN_X;
    page.drawRectangle({ x: MARGIN_X, y: cursorY - rowHeight + 5, width: CONTENT_WIDTH, height: rowHeight, color: TABLE_HEADER_BG });
    for (let i = 0; i < headers.length; i++) {
      page.drawText(sanitizeForPdf(headers[i]), { x: x + 6, y: cursorY - 10, size: 9.5, font: fontBold, color: NAVY });
      x += colWidth;
    }
    cursorY -= rowHeight;

    for (const row of rows) {
      ensureSpace(rowHeight);
      x = MARGIN_X;
      for (let i = 0; i < row.length; i++) {
        page.drawText(sanitizeForPdf(row[i]), { x: x + 6, y: cursorY - 10, size: 9.5, font: fontRegular, color: INK });
        x += colWidth;
      }
      page.drawLine({
        start: { x: MARGIN_X, y: cursorY - rowHeight + 5 },
        end: { x: MARGIN_X + CONTENT_WIDTH, y: cursorY - rowHeight + 5 },
        thickness: 0.5,
        color: TABLE_LINE,
      });
      cursorY -= rowHeight;
    }
    cursorY -= 8;
  }

  function drawBlock(block: WsaBlock) {
    if (block.kind === "p") drawParagraph(block.text);
    else if (block.kind === "sh") drawSubheading(block.text);
    else if (block.kind === "ul") drawBullets(block.items);
    else if (block.kind === "table") drawTable(block.headers, block.rows);
  }

  /** Draws "Label:" and returns the coordinate right after it, for overlaying a value later. */
  function drawFieldLine(label: string): FieldCoord {
    ensureSpace(17);
    const text = `${label}:`;
    page.drawText(text, { x: MARGIN_X, y: cursorY, size: 10.5, font: fontRegular, color: INK });
    const w = fontRegular.widthOfTextAtSize(text, 10.5);
    const coord: FieldCoord = { page: pageIndex, x: MARGIN_X, y: cursorY, w };
    cursorY -= 17;
    return coord;
  }

  // ---------------------------------------------------------------------
  // Page 1: title + plan label + intro
  // ---------------------------------------------------------------------
  newPage();
  page.drawText(WSA_PRO_DOCUMENT.title.toUpperCase(), {
    x: MARGIN_X,
    y: cursorY,
    size: 17,
    font: fontBold,
    color: NAVY,
  });
  cursorY -= 22;
  page.drawText(sanitizeForPdf(WSA_PRO_DOCUMENT.planLabel), {
    x: MARGIN_X,
    y: cursorY,
    size: 9,
    font: fontRegular,
    color: GRAY,
  });
  cursorY -= 24;

  for (const block of WSA_PRO_DOCUMENT.intro) drawBlock(block);

  // ---------------------------------------------------------------------
  // Parties block: Service Provider (pre-filled) + Client (fillable)
  // ---------------------------------------------------------------------
  const clientInfoCoords: Record<string, FieldCoord> = {};

  drawSubheading("Service Provider");
  page.drawText("ALTAVENTURES", { x: MARGIN_X, y: cursorY, size: 10.5, font: fontBold, color: INK });
  cursorY -= 17;
  drawFieldLine("Business Address");
  page.drawText(sanitizeForPdf(WSA_PRO_DOCUMENT.providerAddress), {
    x: MARGIN_X + fontRegular.widthOfTextAtSize("Business Address:", 10.5) + 10,
    y: cursorY + 17,
    size: 10.5,
    font: fontRegular,
    color: NAVY,
  });
  const repLabel = "Representative:";
  page.drawText(repLabel, { x: MARGIN_X, y: cursorY, size: 10.5, font: fontRegular, color: INK });
  page.drawText(WSA_PRO_ALTA_SIGNER, {
    x: MARGIN_X + fontRegular.widthOfTextAtSize(repLabel, 10.5) + 10,
    y: cursorY,
    size: 10.5,
    font: fontRegular,
    color: NAVY,
  });
  cursorY -= 24;

  drawSubheading("Client");
  clientInfoCoords.businessName = drawFieldLine("Full Name / Business Name");
  drawFieldLine("Business Address");
  clientInfoCoords.email = drawFieldLine("Email Address");
  clientInfoCoords.phone = drawFieldLine("Contact Number");
  cursorY -= 8;

  ensureSpace(20);
  page.drawLine({
    start: { x: MARGIN_X, y: cursorY },
    end: { x: MARGIN_X + CONTENT_WIDTH, y: cursorY },
    thickness: 0.75,
    color: TABLE_LINE,
  });
  cursorY -= 20;

  // ---------------------------------------------------------------------
  // Sections 1-23 (regular), Section 24 (Acknowledgment and Acceptance,
  // with its own fillable signature execution block)
  // ---------------------------------------------------------------------
  const signingCoords: Record<string, FieldCoord> = {};
  let clientSignatureBox = { page: 0, x: 0, y: 0, width: 150, height: 32 };

  for (const section of WSA_PRO_DOCUMENT.sections) {
    drawHeading(section.heading);

    if (section.heading === "24. Acknowledgment and Acceptance") {
      for (const block of section.blocks) drawBlock(block);
      cursorY -= 6;

      ensureSpace(72);
      drawSubheading("Service Provider");
      const altaRepLabel = "Representative Name:";
      page.drawText(altaRepLabel, { x: MARGIN_X, y: cursorY, size: 10.5, font: fontRegular, color: INK });
      page.drawText(WSA_PRO_ALTA_SIGNER, {
        x: MARGIN_X + fontRegular.widthOfTextAtSize(altaRepLabel, 10.5) + 10,
        y: cursorY,
        size: 10.5,
        font: fontRegular,
        color: NAVY,
      });
      cursorY -= 17;

      ensureSpace(46);
      const altaSigLabel = "Signature:";
      page.drawText(altaSigLabel, { x: MARGIN_X, y: cursorY, size: 10.5, font: fontRegular, color: INK });
      const altaSigLabelWidth = fontRegular.widthOfTextAtSize(altaSigLabel, 10.5);
      const altaSigBoxHeight = 26;
      const altaSigBoxWidth = altaSigBoxHeight * (signatureImage.width / signatureImage.height);
      page.drawImage(signatureImage, {
        x: MARGIN_X + altaSigLabelWidth + 12,
        y: cursorY - altaSigBoxHeight + 4,
        width: altaSigBoxWidth,
        height: altaSigBoxHeight,
      });
      cursorY -= 34;

      signingCoords.altaDate = drawFieldLine("Date");
      cursorY -= 10;

      ensureSpace(110); // keep the whole Client name/business/signature/date block together
      drawSubheading("Client");
      signingCoords.clientName = drawFieldLine("Full Name / Authorized Representative");
      signingCoords.clientBusinessName = drawFieldLine("Business Name, if applicable");
      // Extra clearance so the signature box (which extends upward from the
      // "Signature:" label to accommodate tall ascenders/loops) doesn't
      // visually collide with this field line immediately above it -- this
      // Client block has one more field line before Signature than
      // WSA-free's equivalent block, so it needs a touch more breathing
      // room than the shared per-line spacing alone provides.
      cursorY -= 8;

      ensureSpace(54);
      const clientSigLabel = "Signature:";
      page.drawText(clientSigLabel, { x: MARGIN_X, y: cursorY, size: 10.5, font: fontRegular, color: INK });
      const clientSigLabelWidth = fontRegular.widthOfTextAtSize(clientSigLabel, 10.5);
      clientSignatureBox = { page: pageIndex, x: MARGIN_X + clientSigLabelWidth + 12, y: cursorY - 6, width: 150, height: 32 };
      cursorY -= 34;

      signingCoords.clientDate = drawFieldLine("Date");
      continue;
    }

    for (const block of section.blocks) drawBlock(block);
  }

  // ---------------------------------------------------------------------
  // Save + report coordinates
  // ---------------------------------------------------------------------
  const outBytes = await pdf.save();
  const outPath = path.join(ROOT, "public/documents/pro-website-service-agreement.pdf");
  fs.writeFileSync(outPath, outBytes);
  console.log(`Saved ${outPath} (${pdf.getPageCount()} pages, ${outBytes.length} bytes)`);

  console.log("\n// Paste into WSA_PRO_PDF_FIELD_COORDS / WSA_PRO_SIGNATURE_BOX in src/content/wsa-pro.ts:\n");
  console.log(
    JSON.stringify(
      {
        clientInfo: clientInfoCoords,
        signing: signingCoords,
      },
      null,
      2
    )
  );
  console.log("\nWSA_PRO_SIGNATURE_BOX:");
  console.log(JSON.stringify(clientSignatureBox, null, 2));
}

main();
