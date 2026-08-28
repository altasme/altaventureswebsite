import { GROWTH_VISION } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";
import Reveal from "../Reveal";

export default function GrowthVision({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {GROWTH_VISION.headline}
      </h2>
      <p className="mt-3 max-w-md text-base text-ink/60">{GROWTH_VISION.sub}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {GROWTH_VISION.phases.map((phase, i) => (
          <Reveal key={phase.label} delayMs={i * 100} className="rounded-2xl border border-ink/8 bg-white p-6">
            <span className="inline-flex items-center rounded-full bg-brand-blue/8 px-3 py-1 text-xs font-semibold text-brand-navy">
              {phase.label}
            </span>
            <h3 className="mt-3 text-lg font-bold text-ink">{phase.title}</h3>
            <ul className="mt-3 space-y-1.5">
              {phase.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-ink/60">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-ink/60">{GROWTH_VISION.phase2ProofLine}</p>
      <p className="mt-4 text-sm font-medium text-ink/50">{GROWTH_VISION.noCommitmentLine}</p>

      <div className="mt-6">
        <CTAButton label={GROWTH_VISION.cta} section="growth-vision" onClick={onOpenQualifier} size="lg" />
      </div>
    </Section>
  );
}
