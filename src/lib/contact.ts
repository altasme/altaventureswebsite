import { CONTACT } from "../content/site";
import type { QualifierAnswers } from "../content/offer";

export const whatsappUrl = (customMessage?: string) =>
  `https://wa.me/${CONTACT.whatsapp.number}` +
  (customMessage
    ? `?text=${encodeURIComponent(customMessage)}`
    : CONTACT.whatsapp.supportsPrefill
      ? `?text=${encodeURIComponent(CONTACT.whatsapp.prefill)}`
      : "");

export const viberUrl = () =>
  `viber://chat?number=${encodeURIComponent(CONTACT.viber.number)}`;

export const messengerUrl = () => `https://m.me/${CONTACT.messenger.handle}`;

/**
 * Builds the dynamic WhatsApp prefill for the /limitedoffer qualifier from
 * whatever the visitor answered. Every field is optional; empty fields are
 * omitted rather than left as blanks in the message. Nothing here is stored
 * or sent anywhere until the visitor taps the WhatsApp channel themselves.
 */
export function buildQualifierPrefill(answers: QualifierAnswers): string {
  let message = "Hi Altaventures! I'd like to claim the free website offer.";

  const introParts: string[] = [];
  if (answers.name.trim()) introParts.push(`I'm ${answers.name.trim()}`);

  if (answers.businessName.trim() && answers.businessType.trim()) {
    introParts.push(`I run ${answers.businessName.trim()} — a ${answers.businessType.trim()} business`);
  } else if (answers.businessName.trim()) {
    introParts.push(`I run ${answers.businessName.trim()}`);
  } else if (answers.businessType.trim()) {
    introParts.push(`I run a ${answers.businessType.trim()} business`);
  }

  if (answers.yearsInBusiness.trim()) introParts.push(`${answers.yearsInBusiness.trim()} in business`);

  if (introParts.length > 0) message += ` ${introParts.join(", ")}.`;

  if (answers.objectives.length > 0) {
    message += ` I'd like my website to help me: ${answers.objectives.join(", ")}.`;
  }

  return message;
}
