import { useState } from "react";
import { FAQ as FAQ_CONTENT } from "../../content/site";
import Section from "../ui/Section";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {FAQ_CONTENT.headline}
      </h2>

      <div className="mt-10 max-w-prose divide-y divide-ink/8 border-y border-ink/8">
        {FAQ_CONTENT.items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `faq-panel-${i}`;
          const buttonId = `faq-button-${i}`;

          return (
            <div key={item.q}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-base font-semibold text-ink sm:text-lg">{item.q}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`shrink-0 text-brand-blue transition-transform ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="pb-5"
              >
                <p className="text-sm leading-relaxed text-ink/65 sm:text-base">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
