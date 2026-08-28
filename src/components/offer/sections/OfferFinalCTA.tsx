import { OFFER_FINAL_CTA } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function OfferFinalCTA({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="dark">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{OFFER_FINAL_CTA.headline}</h2>
        <p className="mt-3 text-xl font-semibold text-white/90">{OFFER_FINAL_CTA.sub}</p>

        <div className="mt-8 flex justify-center">
          <CTAButton
            label={OFFER_FINAL_CTA.cta}
            section="final-cta"
            onClick={() => {
              track("cta_click", { label: OFFER_FINAL_CTA.cta, section: "final-cta" });
              onOpenQualifier();
            }}
          />
        </div>

        <p className="mt-6 text-sm text-white/50">{OFFER_FINAL_CTA.microcopy}</p>
      </div>
    </Section>
  );
}
