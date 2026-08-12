import { useModals } from "../../lib/modalContext";
import { useModalA11y } from "../../lib/useModalA11y";
import { LEGAL } from "../../content/site";

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
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
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

        <p className="mb-5 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          TODO(legal): placeholder text pending final legal review
        </p>

        <div className="space-y-4">
          {doc.body.map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink/75">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
