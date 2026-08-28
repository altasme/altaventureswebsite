import { PROBLEM_OPPORTUNITY } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function ProblemOpportunity({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {PROBLEM_OPPORTUNITY.headline}
      </h2>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {PROBLEM_OPPORTUNITY.benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 rounded-2xl border border-ink/8 p-5">
            <svg
              width="20"
              height="20"
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
            <span className="text-sm leading-relaxed text-ink/75 sm:text-base">{benefit}</span>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-md text-xl font-bold text-brand-navy">{PROBLEM_OPPORTUNITY.support}</p>

      <div className="mt-8">
        <CTAButton
          label={PROBLEM_OPPORTUNITY.cta}
          section="problem-opportunity"
          onClick={() => {
            track("cta_click", { label: PROBLEM_OPPORTUNITY.cta, section: "problem-opportunity" });
            onOpenQualifier();
          }}
        />
      </div>
    </Section>
  );
}
