import { useModals } from "../../lib/modalContext";
import { useModalA11y } from "../../lib/useModalA11y";
import { messengerUrl, viberUrl, whatsappUrl } from "../../lib/contact";
import { track } from "../../lib/analytics";

// Shared chat-bubble glyph (Feather "message-circle"). Channels are
// differentiated by label/note text rather than brand-specific logo marks.
const CHAT_BUBBLE_PATH =
  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z";

export default function ContactModal() {
  const { contactSection, contactPrefill, closeContactModal } = useModals();
  const isOpen = contactSection !== null;
  const containerRef = useModalA11y(isOpen, closeContactModal);

  if (!isOpen) return null;

  const CHANNELS = [
    {
      id: "whatsapp" as const,
      label: "WhatsApp",
      note: "Opens WhatsApp with a message ready to send.",
      url: () => whatsappUrl(contactPrefill),
    },
    {
      id: "messenger" as const,
      label: "Messenger",
      note: "Opens a chat on Messenger.",
      url: messengerUrl,
    },
    {
      id: "viber" as const,
      label: "Viber",
      note: "Opens a chat on Viber.",
      url: viberUrl,
    },
  ];

  const handleChannelSelect = (channel: (typeof CHANNELS)[number]["id"]) => {
    // Note: this is the closest on-site proxy for a qualified conversation.
    // Whether the visitor actually engages happens off-site in chat.
    track("contact_channel_select", { channel });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeContactModal();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-heading"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="contact-modal-heading" className="text-xl font-bold text-brand-navy sm:text-2xl">
              Let's Start a Conversation.
            </h2>
            <p className="mt-2 text-sm text-ink/70 sm:text-base">
              Choose the platform you prefer and tell us a little about your business.
            </p>
          </div>
          <button
            type="button"
            onClick={closeContactModal}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-ink/50 transition hover:bg-paper-alt hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {CHANNELS.map((channel) => (
            <a
              key={channel.id}
              href={channel.url()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleChannelSelect(channel.id)}
              className="group flex items-center gap-4 rounded-2xl border border-ink/10 px-4 py-4 transition hover:border-brand-blue hover:bg-brand-blue/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={CHAT_BUBBLE_PATH} />
                </svg>
              </span>
              <span className="flex-1 text-left">
                <span className="block font-semibold text-ink">{channel.label}</span>
                <span className="block text-xs text-ink/60">{channel.note}</span>
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 text-ink/30 transition group-hover:translate-x-0.5 group-hover:text-brand-blue"
                aria-hidden="true"
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-ink/40">
          No forms, no sign-ups. Just a conversation.
        </p>
      </div>
    </div>
  );
}
