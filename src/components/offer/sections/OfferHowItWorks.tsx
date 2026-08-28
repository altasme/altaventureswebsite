import { OFFER_HOW_IT_WORKS } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCard from "../ui/OfferCard";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function OfferHowItWorks({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="deep">
      <Eyebrow>{OFFER_HOW_IT_WORKS.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
        {OFFER_HOW_IT_WORKS.headline}
      </h2>

      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {OFFER_HOW_IT_WORKS.steps.map((step) => (
          <li key={step.number}>
            <OfferCard>
              <span className="text-3xl font-extrabold text-brand-blue/40">
                {String(step.number).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{step.copy}</p>
            </OfferCard>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm font-medium text-white/50">{OFFER_HOW_IT_WORKS.footerLine}</p>

      <div className="mt-6">
        <OfferCTAButton
          label={OFFER_HOW_IT_WORKS.cta}
          section="how-it-works"
          onClick={() => {
            track("cta_click", { label: OFFER_HOW_IT_WORKS.cta, section: "how-it-works" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
