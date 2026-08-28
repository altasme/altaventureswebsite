import { useState } from "react";
import { OFFER_FAQ } from "../../../content/offer";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";

export default function OfferFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <OfferSection shade="deep">
      <Eyebrow>{OFFER_FAQ.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{OFFER_FAQ.headline}</h2>

      <div className="mt-10 max-w-prose divide-y divide-white/10 border-y border-white/10">
        {OFFER_FAQ.items.map((item, i) => {
          const isOpen = openIndex === i;
          const panelId = `offer-faq-panel-${i}`;
          const buttonId = `offer-faq-button-${i}`;

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
                  <span className="text-base font-semibold text-white sm:text-lg">{item.q}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`shrink-0 text-brand-blue transition-transform ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="pb-5">
                <p className="text-sm leading-relaxed text-white/65 sm:text-base">{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </OfferSection>
  );
}
