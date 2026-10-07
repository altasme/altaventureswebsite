import { FINAL_CTA } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";
import Reveal from "../offer/Reveal";

export default function FinalCTA() {
  const { openContactModal } = useModals();

  return (
    <Section tone="dark" className="text-center">
      <Reveal className="mx-auto max-w-2xl">
        <p className="text-base text-white/70">{FINAL_CTA.kicker}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{FINAL_CTA.headline}</h2>
        <p className="mx-auto mt-4 max-w-sm text-lg text-white/70">{FINAL_CTA.sub}</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">{FINAL_CTA.line}</p>
        <div className="mt-8 flex justify-center">
          <CTAButton
            label={FINAL_CTA.cta}
            section="final-cta"
            onClick={() => openContactModal("final-cta")}
          />
        </div>
        <p className="mt-5 text-sm text-white/50">
          {FINAL_CTA.channelsLine}
        </p>
      </Reveal>
    </Section>
  );
}
