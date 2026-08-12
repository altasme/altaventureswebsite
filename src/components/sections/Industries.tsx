import { INDUSTRIES } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function Industries() {
  const { openContactModal } = useModals();

  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {INDUSTRIES.headline}
      </h2>

      <div className="mt-8 flex flex-wrap gap-3">
        {INDUSTRIES.items.map((industry) => (
          <button
            key={industry}
            type="button"
            onMouseEnter={() => track("industry_engagement", { industry })}
            className="rounded-full border border-brand-blue/20 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-blue hover:bg-brand-blue/5"
          >
            {industry}
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-ink/60">{INDUSTRIES.line}</p>

      <div className="mt-6">
        <CTAButton
          label={INDUSTRIES.cta}
          section="industries"
          onClick={() => openContactModal("industries")}
          variant="secondary"
        />
      </div>
    </Section>
  );
}
