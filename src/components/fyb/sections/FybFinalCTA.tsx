import { FYB_FINAL_CTA } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function FybFinalCTA({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <Section tone="dark">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {FYB_FINAL_CTA.headline}
          <br />
          {FYB_FINAL_CTA.headline2}
        </h2>
        <p className="mt-6 text-base text-white/75 sm:text-lg">{FYB_FINAL_CTA.body}</p>

        <div className="mt-8 flex items-baseline justify-center gap-3">
          <span className="text-3xl font-extrabold tracking-tight">{FYB_FINAL_CTA.price}</span>
        </div>
        <p className="mt-1 text-sm text-white/60">{FYB_FINAL_CTA.priceNote}</p>

        <div className="mt-8 flex justify-center">
          <CTAButton label={FYB_FINAL_CTA.cta} section="final-cta" onClick={onOpenContact} size="lg" />
        </div>

        <p className="mt-6 text-xs tracking-wide text-white/50">{FYB_FINAL_CTA.microcopy}</p>
      </div>
    </Section>
  );
}
