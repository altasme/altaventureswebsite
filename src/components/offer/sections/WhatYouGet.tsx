import { WHAT_YOU_GET } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCard from "../ui/OfferCard";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function WhatYouGet({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="deep">
      <Eyebrow>{WHAT_YOU_GET.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{WHAT_YOU_GET.headline}</h2>
      <p className="mt-3 max-w-md text-base text-white/60">{WHAT_YOU_GET.intro}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {WHAT_YOU_GET.items.map((item) => (
          <li key={item}>
            <OfferCard className="flex items-start gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-0.5 shrink-0 text-brand-blue"
                aria-hidden="true"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm text-white/80">{item}</span>
            </OfferCard>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <OfferCTAButton
          label={WHAT_YOU_GET.cta}
          section="what-you-get"
          onClick={() => {
            track("cta_click", { label: WHAT_YOU_GET.cta, section: "what-you-get" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
