import { WHY_FREE } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function WhyFree({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHY_FREE.headline}
      </h2>

      <div className="mt-6 max-w-lg space-y-4">
        {WHY_FREE.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink/70">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <CTAButton label={WHY_FREE.cta} section="why-free" onClick={onOpenQualifier} />
      </div>
    </Section>
  );
}
