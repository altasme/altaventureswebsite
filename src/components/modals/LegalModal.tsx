import { useModals } from "../../lib/modalContext";
import { useModalA11y } from "../../lib/useModalA11y";
import { LEGAL, type LegalBlock } from "../../content/site";

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "sh":
      return <h4 className="mt-4 text-sm font-semibold text-ink">{block.text}</h4>;
    case "ul":
      return (
        <ul className="space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink/75">
              <span className="mt-0.5 text-brand-blue">•</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "p":
    default:
      return <p className="text-sm leading-relaxed text-ink/75">{block.text}</p>;
  }
}

export default function LegalModal() {
  const { legalDoc, closeLegal } = useModals();
  const isOpen = legalDoc !== null;
  const containerRef = useModalA11y(isOpen, closeLegal);

  if (!isOpen || !legalDoc) return null;

  const doc = LEGAL[legalDoc];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeLegal();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-heading"
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 id="legal-modal-heading" className="text-xl font-bold text-brand-navy sm:text-2xl">
            {doc.title}
          </h2>
          <button
            type="button"
            onClick={closeLegal}
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

        <p className="mb-6 text-xs text-ink/40">
          Effective {doc.effectiveDate} · Last updated {doc.lastUpdated}
        </p>

        <div className="space-y-3">
          {doc.intro.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {doc.sections.map((section) => (
            <section key={section.heading}>
              <h3 className="mb-3 text-base font-bold text-brand-navy">{section.heading}</h3>
              <div className="space-y-3">
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
