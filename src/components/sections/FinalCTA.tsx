import { FINAL_CTA } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function FinalCTA() {
  const { openContactModal } = useModals();

  return (
    <Section tone="dark" className="text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{FINAL_CTA.headline}</h2>
        <p className="mt-4 text-lg text-white/70">{FINAL_CTA.sub}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton
            label={FINAL_CTA.cta}
            section="final-cta"
            onClick={() => openContactModal("final-cta")}
          />
        </div>
        <p className="mt-5 text-xs uppercase tracking-wider text-white/40">
          {FINAL_CTA.channelsLine}
        </p>
      </div>
    </Section>
  );
}
