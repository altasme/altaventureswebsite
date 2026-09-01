import { SCARCITY } from "../../../content/offer";
import { ONGOING } from "../../../content/portfolio";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function Scarcity({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="brand">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{SCARCITY.headline}</h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{SCARCITY.body}</p>

      <div className="mt-8 rounded-2xl border border-white/25 bg-white/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{SCARCITY.studioLabel}</p>
        <ul className="mt-3 space-y-2">
          {ONGOING.map((project) => (
            <li key={project.id} className="text-sm text-white/90">
              <span className="font-semibold text-white">{project.name}:</span> {project.note}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs italic text-white/70">{SCARCITY.studioNote}</p>
      </div>

      <div className="mt-8">
        <CTAButton label={SCARCITY.cta} section="scarcity" onClick={onOpenQualifier} variant="secondary" size="lg" />
      </div>
    </Section>
  );
}
