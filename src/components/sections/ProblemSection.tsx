import { PROBLEMS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

export default function ProblemSection() {
  const { openContactModal } = useModals();

  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {PROBLEMS.headline}
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PROBLEMS.items.map((item) => (
          <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.copy}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <CTAButton
          label={PROBLEMS.cta}
          section="problem-section"
          onClick={() => openContactModal("problem-section")}
        />
      </div>
    </Section>
  );
}
