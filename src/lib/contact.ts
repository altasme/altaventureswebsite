import { CONTACT } from "../content/site";

export const whatsappUrl = () =>
  `https://wa.me/${CONTACT.whatsapp.number}` +
  (CONTACT.whatsapp.supportsPrefill
    ? `?text=${encodeURIComponent(CONTACT.whatsapp.prefill)}`
    : "");

export const viberUrl = () =>
  `viber://chat?number=${encodeURIComponent(CONTACT.viber.number)}`;

export const messengerUrl = () => `https://m.me/${CONTACT.messenger.handle}`;
