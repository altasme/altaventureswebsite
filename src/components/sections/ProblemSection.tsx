import { Search, ClipboardList, Unlink, Scale } from "lucide-react";
import { PROBLEMS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";
import Reveal from "../offer/Reveal";
import DecorativeShapes from "../fyb/DecorativeShapes";

const ICONS = [Search, ClipboardList, Unlink, Scale];

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
          {PROBLEMS.intro.map((line) => (
            <p key={line} className="mt-3 max-w-xl text-base text-ink/65">
              {line}
            </p>
          ))}
        </Reveal>

        {/* [2026-10-15] Icon-left, title-right rows (not the old
            icon-above-title-above-paragraph card) -- shorter per the
            operator's request to let visitors reach Portfolio faster, and
            the bigger icon chip makes the icon carry more of the section's
            visual weight now that there's no supporting sentence under it. */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
                <div className="group flex h-full items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
                  {/* Rose/pain accent, deliberately distinct from the
                      brand-blue "solution" chips used elsewhere on the page
                      (Services, HowItWorks), so this section reads as the
                      problem, not just another identical icon-in-a-blue-
                      circle card. */}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition duration-200 group-hover:bg-rose-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold leading-snug text-ink">{item.title}</h3>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-10 max-w-xl">
          <p className="text-base font-semibold text-ink">{PROBLEMS.closing.lead}</p>
          <p className="mt-1 text-base text-ink/65">{PROBLEMS.closing.body}</p>
          <div className="mt-6">
            <CTAButton
              label={PROBLEMS.cta}
              section="problem-section"
              onClick={() => openContactModal("problem-section")}
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
