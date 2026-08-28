import { OFFER_FINAL_CTA } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function OfferFinalCTA({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="dark">
      <div className="text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          {OFFER_FINAL_CTA.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">{OFFER_FINAL_CTA.body}</p>

        <div className="mt-8 flex justify-center">
          <CTAButton label={OFFER_FINAL_CTA.cta} section="final-cta" onClick={onOpenQualifier} size="lg" />
        </div>

        <p className="mt-6 text-sm text-white/60">{OFFER_FINAL_CTA.sub}</p>
      </div>
    </Section>
  );
}
