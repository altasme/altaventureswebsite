import { PHASE_PROGRESSION } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";

export default function PhaseProgression() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {PHASE_PROGRESSION.headline}
      </h2>
      <p className="mt-3 max-w-md text-base text-ink/60">{PHASE_PROGRESSION.sub}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {PHASE_PROGRESSION.phases.map((phase) => (
          <div key={phase.label} className="rounded-2xl border border-ink/8 p-6">
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
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm font-medium text-ink/50">{PHASE_PROGRESSION.noCommitmentLine}</p>

      <div className="mt-6">
        <a
          href={PHASE_PROGRESSION.ctaHref}
          onClick={() => track("phase2_cta_click")}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-navy/15 bg-white px-6 py-3.5 text-sm font-semibold text-brand-navy transition hover:border-brand-navy/30 hover:bg-paper-alt sm:text-base"
        >
          {PHASE_PROGRESSION.cta}
        </a>
      </div>
    </Section>
  );
}
