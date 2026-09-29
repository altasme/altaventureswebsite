import { B2B_FINAL_CTA } from "../../../content/b2b";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function B2BFinalCTA({ onCheckout }: { onCheckout: () => void }) {
  return (
    <Section tone="dark">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{B2B_FINAL_CTA.headline}</h2>
        <p className="mt-6 text-base text-white/75 sm:text-lg">{B2B_FINAL_CTA.body}</p>

        <div className="mt-8 flex justify-center">
          <CTAButton label={B2B_FINAL_CTA.cta} section="final-cta" onClick={onCheckout} size="lg" />
        </div>
      </div>
    </Section>
  );
}
