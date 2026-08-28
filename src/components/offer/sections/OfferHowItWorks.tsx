import { OFFER_HOW_IT_WORKS } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function OfferHowItWorks({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {OFFER_HOW_IT_WORKS.headline}
      </h2>

      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {OFFER_HOW_IT_WORKS.steps.map((step) => (
          <li key={step.number} className="rounded-2xl border border-ink/8 bg-white p-6">
            <span className="text-3xl font-extrabold text-brand-blue/25">
              {String(step.number).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{step.copy}</p>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-sm font-medium text-ink/50">{OFFER_HOW_IT_WORKS.footerLine}</p>

      <div className="mt-6">
        <CTAButton label={OFFER_HOW_IT_WORKS.cta} section="how-it-works" onClick={onOpenQualifier} />
      </div>
    </Section>
  );
}
