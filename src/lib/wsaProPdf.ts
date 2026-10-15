// Fills the real ₱2,099 Website Plan Agreement PDF with the client's
// submitted details and drawn signature. Runs entirely in the browser so the
// signature never leaves the client's device unbaked into the document.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { WSA_PRO_PDF_FIELD_COORDS, WSA_PRO_SIGNATURE_BOX } from "../content/wsa-pro";
export { bytesToBase64, todayLabel } from "./wsaPdf";

const TEMPLATE_URL = "/documents/pro-website-service-agreement.pdf";
const FONT_SIZE = 10.5;
const FIELD_GAP = 10;
const FILLED_COLOR = rgb(0.008, 0.145, 0.435); // brand-navy

export type WsaProFormData = {
  businessName: string;
  clientName: string;
  email: string;
  phone: string;
  dateLabel: string;
  signaturePngDataUrl: string;
};

export async function fillProAgreementPdf(data: WsaProFormData): Promise<Uint8Array> {
  const templateBytes = await fetch(TEMPLATE_URL).then((res) => {
    if (!res.ok) throw new Error("Could not load the agreement template.");
    return res.arrayBuffer();
  });

  const pdf = await PDFDocument.load(templateBytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();

  const put = (text: string, field: { page: number; x: number; y: number; w: number }) => {
    pages[field.page].drawText(text, {
      x: field.x + field.w + FIELD_GAP,
      y: field.y,
      size: FONT_SIZE,
      font,
      color: FILLED_COLOR,
    });
  };

  const { clientInfo, signing } = WSA_PRO_PDF_FIELD_COORDS;
  put(data.businessName, clientInfo.businessName);
  put(data.email, clientInfo.email);
  put(data.phone, clientInfo.phone);
  put(data.clientName, signing.clientName);
  put(data.businessName, signing.clientBusinessName);
  put(data.dateLabel, signing.clientDate);
  put(data.dateLabel, signing.altaDate);

  const signatureBytes = dataUrlToBytes(data.signaturePngDataUrl);
  const signatureImage = await pdf.embedPng(signatureBytes);
  const scale = Math.min(
    WSA_PRO_SIGNATURE_BOX.width / signatureImage.width,
    WSA_PRO_SIGNATURE_BOX.height / signatureImage.height
  );
  const drawWidth = signatureImage.width * scale;
  const drawHeight = signatureImage.height * scale;
  pages[WSA_PRO_SIGNATURE_BOX.page].drawImage(signatureImage, {
    x: WSA_PRO_SIGNATURE_BOX.x + (WSA_PRO_SIGNATURE_BOX.width - drawWidth) / 2,
    y: WSA_PRO_SIGNATURE_BOX.y + (WSA_PRO_SIGNATURE_BOX.height - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  });

  return pdf.save();
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
