import { HOW_IT_WORKS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function HowItWorks() {
  const { openContactModal } = useModals();

  return (
    <Section id="how-it-works" tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {HOW_IT_WORKS.headline}
      </h2>

      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HOW_IT_WORKS.steps.map((step) => (
          <li key={step.number} className="rounded-2xl border border-ink/8 p-6">
            <span className="text-3xl font-extrabold text-brand-blue/25">
              {String(step.number).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{step.copy}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <CTAButton
          label={HOW_IT_WORKS.cta}
          section="how-it-works"
          onClick={() => openContactModal("how-it-works")}
        />
      </div>
    </Section>
  );
}
