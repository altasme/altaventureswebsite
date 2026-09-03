import { WHAT_THIS_LOOKS_LIKE } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

export default function WhatThisLooksLike() {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHAT_THIS_LOOKS_LIKE.headline}
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {WHAT_THIS_LOOKS_LIKE.scenarios.map((scenario, i) => (
          <Reveal
            key={scenario.title}
            delayMs={i * 70}
            className="rounded-2xl border border-ink/8 bg-white p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Website</p>
            <h3 className="mt-1 text-lg font-bold text-brand-navy">{scenario.title}</h3>
            <ul className="mt-4 space-y-2">
              {scenario.steps.map((step) => (
                <li key={step} className="flex items-center gap-2 text-sm text-ink/70">
                  <span className="text-brand-blue" aria-hidden="true">
                    &rarr;
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
