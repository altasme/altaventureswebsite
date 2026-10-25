import { useState } from "react";
import { FAQ as FAQ_CONTENT } from "../../content/site";
import Section from "../ui/Section";
import Reveal from "../offer/Reveal";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section tone="light">
      <Reveal>
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
              {/* [2026-10-25] grid-template-rows 0fr->1fr smoothly animates
                  to/from the answer's natural height with no JS
                  measurement -- `hidden` (display:none) can't be
                  transitioned at all, so this swaps to aria-hidden, which
                  keeps the panel in a transitionable layout while still
                  pulling it from the accessibility tree when closed. The
                  inner min-h-0 wrapper is what actually clips the content
                  against the animating 0fr row. */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-0 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="pb-5 text-sm leading-relaxed text-ink/65 sm:text-base">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </Reveal>
    </Section>
  );
}
