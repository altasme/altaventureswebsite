import { useState } from "react";
import { PRICING_NOTES } from "../../content/pricing";

export default function PricingNotes() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">{PRICING_NOTES.headline}</h2>
      <div className="mt-6 max-w-prose divide-y divide-ink/8 border-y border-ink/8">
        {PRICING_NOTES.items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `pricing-notes-panel-${i}`;
          const buttonId = `pricing-notes-button-${i}`;

          return (
            <div key={item.q}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-ink sm:text-base">{item.q}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`shrink-0 text-brand-blue transition-transform ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="pb-4">
                <p className="text-sm leading-relaxed text-ink/65">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
