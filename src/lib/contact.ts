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
  let message = "Hi Altaventures! I want to claim the free website offer.";

  const introParts: string[] = [];
  if (answers.name.trim()) introParts.push(`I'm ${answers.name.trim()}`);

  if (answers.businessName.trim() && answers.businessType.trim()) {
    introParts.push(`I run ${answers.businessName.trim()}, a ${answers.businessType.trim()} business`);
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

/**
 * WhatsApp prefill for /foryourbusiness. Checkout/payment isn't wired up
 * yet (no ganap.net, Supabase, Setmona, or Resend credentials), so every
 * CTA on that page opens a chat with this message instead, keeping the
 * page a working lead path in the interim. Replace with a real checkout
 * flow once payment is ready; see CLAUDE.md §19.
 */
export const FYB_PREFILL =
  "Hi Altaventures! I'd like to get the ₱599 website offer for my business.";

/**
 * WhatsApp prefill for /b2b's "Message us instead" fallbacks (a checkout
 * failure, or the thank-you page's trouble link). Checkout itself is live
 * (see functions/api/checkout.ts), so this is only a fallback path, same
 * role FYB_PREFILL plays on /foryourbusiness.
 */
export const B2B_PREFILL =
  "Hi Altaventures! I'd like to get the ₱4,999 business website package.";

/**
 * WhatsApp prefill for the standalone /pricing page, tier-aware. That page
 * is presentation-only (no checkout of its own), so every CTA opens
 * ContactModal with a message naming the specific tier the visitor tapped,
 * same spirit as FYB_PREFILL/B2B_PREFILL but personalized per plan.
 */
export function buildPricingPrefill(tierName: string, priceLabel: string): string {
  return `Hi Altaventures! I'm interested in the ${tierName} plan (${priceLabel}). Can we talk about my business?`;
}

/**
 * WhatsApp prefill for the public proposal payment screen's "send your
 * payment screenshot" channel buttons (CLAUDE.md §67). Names the
 * proposal so a human reading it in chat doesn't have to guess which
 * project the incoming screenshot belongs to.
 */
export function buildProposalPaymentPrefill(proposalTitle: string): string {
  return `Hi Altaventures! I just paid for "${proposalTitle}." Here's my payment screenshot:`;
}
