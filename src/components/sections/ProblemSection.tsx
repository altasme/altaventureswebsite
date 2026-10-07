import { TrendingDown, ClipboardList, Unlink, Clock } from "lucide-react";
import { PROBLEMS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";

const ICONS = [TrendingDown, ClipboardList, Unlink, Clock];

export default function ProblemSection() {
  const { openContactModal } = useModals();

  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {PROBLEMS.headline}
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PROBLEMS.items.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm font-semibold leading-snug text-ink">{item.hook}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{item.copy}</p>
            </div>
          );
        })}
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
