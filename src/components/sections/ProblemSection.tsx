import { TrendingDown, ClipboardList, Unlink, Clock } from "lucide-react";
import { PROBLEMS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";
import Reveal from "../offer/Reveal";
import DecorativeShapes from "../fyb/DecorativeShapes";

const ICONS = [TrendingDown, ClipboardList, Unlink, Clock];

export default function ProblemSection() {
  const { openContactModal } = useModals();

  return (
    <Section tone="alt">
      <div className="relative">
        <DecorativeShapes variant={3} />
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {PROBLEMS.headline}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {PROBLEMS.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={item.title} delayMs={i * 80}>
                {/* The hover micro-interaction lives on this inner div, not
                    on Reveal's own wrapper: Reveal unconditionally sets
                    duration-700 for its entrance fade, and combining that
                    with a hover transition on the same element would make
                    the hover lift inherit that same slow 700ms, instead of
                    a snappy one. */}
                <div className="group h-full rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                  {/* Rose/pain accent, deliberately distinct from the
                      brand-blue "solution" chips used everywhere else on
                      the page (Services, HowItWorks, TalkToUs), so this
                      section reads as the problem, not just another
                      identical icon-in-a-blue-circle card. */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition duration-200 group-hover:bg-rose-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-snug text-ink">{item.hook}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{item.copy}</p>
                </div>
              </Reveal>
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
      </div>
    </Section>
  );
}
