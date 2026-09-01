import { THE_OFFER_PLAINLY } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";
import Reveal from "../Reveal";

export default function TheOfferPlainly({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {THE_OFFER_PLAINLY.headline}
      </h2>

      <ul className="mt-8 space-y-3">
        {THE_OFFER_PLAINLY.stack.map((item, i) => (
          <li key={item}>
            <Reveal
              delayMs={i * 60}
              className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4"
            >
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
              <span className="text-sm text-ink/80 sm:text-base">{item}</span>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6">
        <p className="text-base font-medium leading-relaxed text-brand-navy">{THE_OFFER_PLAINLY.riskReversal}</p>
      </div>

      <div className="mt-8">
        <CTAButton label={THE_OFFER_PLAINLY.cta} section="offer-plainly" onClick={onOpenQualifier} size="lg" />
      </div>
    </Section>
  );
}
