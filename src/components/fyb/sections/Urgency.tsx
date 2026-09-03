import { URGENCY } from "../../../content/foryourbusiness";
import { ONGOING } from "../../../content/portfolio";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function Urgency({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <Section tone="brand">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{URGENCY.headline}</h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{URGENCY.body}</p>
      <p className="mt-3 max-w-xl text-sm text-white/70">{URGENCY.microcopy}</p>

      <div className="mt-8 rounded-2xl border border-white/25 bg-white/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Currently in the studio</p>
        <ul className="mt-3 space-y-2">
          {ONGOING.map((project) => (
            <li key={project.id} className="text-sm text-white/90">
              <span className="font-semibold text-white">{project.name}:</span> {project.note}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs italic text-white/70">Real client work in progress, not yet launched.</p>
      </div>

      <div className="mt-8">
        <CTAButton label={URGENCY.cta} section="urgency" onClick={onOpenContact} variant="secondary" size="lg" />
      </div>
    </Section>
  );
}
