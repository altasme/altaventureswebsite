import { THE_OFFER_PLAINLY } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function TheOfferPlainly({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="deep">
      <Eyebrow>{THE_OFFER_PLAINLY.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{THE_OFFER_PLAINLY.headline}</h2>

      <ul className="mt-8 space-y-3">
        {THE_OFFER_PLAINLY.stack.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4"
          >
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
            <span className="text-sm text-white/80 sm:text-base">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 p-6">
        <p className="text-base font-medium leading-relaxed text-white">{THE_OFFER_PLAINLY.riskReversal}</p>
      </div>

      <div className="mt-8">
        <OfferCTAButton
          label={THE_OFFER_PLAINLY.cta}
          section="offer-plainly"
          onClick={() => {
            track("cta_click", { label: THE_OFFER_PLAINLY.cta, section: "offer-plainly" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
