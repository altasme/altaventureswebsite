import { OFFER_FINAL_CTA } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function OfferFinalCTA({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="navy">
      <div className="text-center">
        <div className="flex justify-center">
          <Eyebrow>{OFFER_FINAL_CTA.eyebrow}</Eyebrow>
        </div>
        <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
          {OFFER_FINAL_CTA.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/75 sm:text-lg">{OFFER_FINAL_CTA.body}</p>

        <div className="mt-8 flex justify-center">
          <OfferCTAButton
            label={OFFER_FINAL_CTA.cta}
            section="final-cta"
            onClick={() => {
              track("cta_click", { label: OFFER_FINAL_CTA.cta, section: "final-cta" });
              onOpenQualifier();
            }}
            className="!px-8 !py-4 !text-base sm:!text-lg"
          />
        </div>

        <p className="mt-6 text-sm text-white/50">{OFFER_FINAL_CTA.sub}</p>
      </div>
    </OfferSection>
  );
}
