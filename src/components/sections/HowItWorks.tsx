import { MessageCircle, Search, Lightbulb, Hammer, Rocket, TrendingUp } from "lucide-react";
import { HOW_IT_WORKS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";
import Reveal from "../offer/Reveal";
import DecorativeShapes from "../fyb/DecorativeShapes";

const ICONS = [MessageCircle, Search, Lightbulb, Hammer, Rocket, TrendingUp];

export default function HowItWorks() {
  const { openContactModal } = useModals();

  return (
    <Section id="how-it-works" tone="light">
      <div className="relative">
        <DecorativeShapes variant={2} />
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {HOW_IT_WORKS.headline}
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <li key={step.number}>
                <Reveal delayMs={i * 80}>
                  <div className="rounded-2xl border border-ink/8 p-6 transition duration-200 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      {/* Decorative accent numeral, redundant with the <ol>
                          item order a screen reader already announces, so
                          aria-hidden keeps it out of the a11y tree.
                          aria-hidden alone doesn't satisfy WCAG contrast
                          though (it hides from assistive tech, not from
                          sighted low-vision users), so it's also darkened to
                          /75 to clear the 3:1 large-bold-text threshold. */}
                      <span aria-hidden="true" className="text-2xl font-extrabold text-brand-blue/75">
                        {String(step.number).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{step.copy}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <div className="mt-10">
          <CTAButton
            label={HOW_IT_WORKS.cta}
            section="how-it-works"
            onClick={() => openContactModal("how-it-works")}
          />
        </div>
      </div>
    </Section>
  );
}
