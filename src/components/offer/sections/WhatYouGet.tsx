import { WHAT_YOU_GET } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function WhatYouGet({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHAT_YOU_GET.headline}
      </h2>
      <p className="mt-3 max-w-md text-base text-ink/60">{WHAT_YOU_GET.intro}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {WHAT_YOU_GET.items.map((item) => (
          <li key={item} className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 shrink-0 text-brand-blue"
              aria-hidden="true"
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm text-ink/80">{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <CTAButton label={WHAT_YOU_GET.cta} section="what-you-get" onClick={onOpenQualifier} size="lg" />
      </div>
    </Section>
  );
}
