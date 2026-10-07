import { Car, Banknote, Sparkles, HeartPulse, Wrench, ShoppingBag, PartyPopper, Briefcase } from "lucide-react";
import { INDUSTRIES } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import CTAButton from "../ui/CTAButton";
import Reveal from "../offer/Reveal";
import DecorativeShapes from "../fyb/DecorativeShapes";

const ICONS = [Car, Banknote, Sparkles, HeartPulse, Wrench, ShoppingBag, PartyPopper, Briefcase];

export default function Industries() {
  const { openContactModal } = useModals();

  return (
    <Section tone="alt">
      <div className="relative">
        <DecorativeShapes variant={3} />
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {INDUSTRIES.headline}
          </h2>
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3">
          {INDUSTRIES.items.map((industry, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={industry} delayMs={i * 60}>
                <button
                  type="button"
                  onMouseEnter={() => track("industry_engagement", { industry })}
                  className="flex items-center gap-2 rounded-full border border-brand-blue/20 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-blue hover:bg-brand-blue/5"
                >
                  <Icon className="h-4 w-4 text-brand-blue" aria-hidden="true" />
                  {industry}
                </button>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 max-w-sm text-sm text-ink/60">{INDUSTRIES.line}</p>

        <div className="mt-6">
          <CTAButton
            label={INDUSTRIES.cta}
            section="industries"
            onClick={() => openContactModal("industries")}
            variant="secondary"
          />
        </div>
      </div>
    </Section>
  );
}
