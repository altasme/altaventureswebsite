import { B2B_HOW_IT_WORKS } from "../../../content/b2b";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

export default function B2BHowItWorks() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {B2B_HOW_IT_WORKS.headline}
      </h2>

      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {B2B_HOW_IT_WORKS.steps.map((step, i) => (
          <li key={step.number}>
            <Reveal delayMs={i * 80}>
              <p aria-hidden="true" className="text-3xl font-extrabold text-brand-blue/75">
                {step.number}
              </p>
              <h3 className="mt-2 text-base font-bold text-brand-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
