import { FYB_FINAL_CTA } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function FybFinalCTA({ onCheckout }: { onCheckout: () => void }) {
  return (
    <Section tone="dark">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{FYB_FINAL_CTA.headline}</h2>
        <p className="mt-6 text-base text-white/75 sm:text-lg">{FYB_FINAL_CTA.body}</p>

        <div className="mt-8 flex justify-center">
          <CTAButton label={FYB_FINAL_CTA.cta} section="final-cta" onClick={onCheckout} size="lg" />
        </div>
      </div>
    </Section>
  );
}
