import { FYB_HOW_IT_WORKS } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

export default function FybHowItWorks() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {FYB_HOW_IT_WORKS.headline}
      </h2>

      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {FYB_HOW_IT_WORKS.steps.map((step, i) => (
          <li key={step.number}>
            <Reveal delayMs={i * 80}>
              {/* Decorative accent numeral, redundant with the <ol> item
                  order a screen reader already announces. */}
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
