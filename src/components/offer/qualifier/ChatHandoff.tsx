import { buildQualifierPrefill, messengerUrl, viberUrl, whatsappUrl } from "../../../lib/contact";
import { trackLead } from "../../../lib/analytics";
import { QUALIFIER, type QualifierAnswers } from "../../../content/offer";

// Shared chat-bubble glyph (Feather "message-circle"), matching ContactModal.
const CHAT_BUBBLE_PATH =
  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z";

export default function ChatHandoff({ answers }: { answers: QualifierAnswers }) {
  const businessType = answers.businessType || undefined;
  const yearsInBusiness = answers.yearsInBusiness || undefined;
  const objectives = answers.objectives.length > 0 ? answers.objectives.join(", ") : undefined;

  const channels = [
    {
      id: "whatsapp" as const,
      label: "WhatsApp",
      note: "Opens WhatsApp with a message ready to send.",
      url: whatsappUrl(buildQualifierPrefill(answers)),
    },
    {
      id: "messenger" as const,
      label: "Messenger",
      note: "Opens a chat on Messenger.",
      url: messengerUrl(),
    },
    {
      id: "viber" as const,
      label: "Viber",
      note: "Opens a chat on Viber.",
      url: viberUrl(),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy sm:text-2xl">{QUALIFIER.handoff.headline}</h2>
      <p className="mt-2 text-sm text-ink/70 sm:text-base">{QUALIFIER.handoff.sub}</p>

      <div className="mt-6 flex flex-col gap-3">
        {channels.map((channel) => (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLead({ channel: channel.id, businessType, yearsInBusiness, objectives })}
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
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-ink/40">No forms, no sign-ups. Just a conversation.</p>
    </div>
  );
}
