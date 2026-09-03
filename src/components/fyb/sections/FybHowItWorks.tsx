import { FYB_HOW_IT_WORKS } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

export default function FybHowItWorks() {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {FYB_HOW_IT_WORKS.headline}
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FYB_HOW_IT_WORKS.steps.map((step, i) => (
          <Reveal key={step.number} delayMs={i * 80}>
            <p className="text-3xl font-extrabold text-brand-blue/25">{step.number}</p>
            <h3 className="mt-2 text-base font-bold text-brand-navy">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.body}</p>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-sm font-medium text-ink/60">{FYB_HOW_IT_WORKS.supportingText}</p>
    </Section>
  );
}
