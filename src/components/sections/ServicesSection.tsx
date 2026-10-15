import { Globe, CalendarCheck, LayoutDashboard, ShoppingCart, Workflow } from "lucide-react";
import { SERVICES } from "../../content/site";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import Reveal from "../offer/Reveal";
import DecorativeShapes from "../fyb/DecorativeShapes";

const ICONS = [Globe, CalendarCheck, LayoutDashboard, ShoppingCart, Workflow];

export default function ServicesSection() {
  return (
    <Section id="services" tone="light">
      <div className="relative">
        <DecorativeShapes variant={1} />
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {SERVICES.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-ink/65">{SERVICES.sub}</p>
        </Reveal>

        {/* [2026-10-15] Capability bullets, per-card CTAs, and the
            digitalization item's extra intro paragraph were dropped per
            the operator's request to shorten this section so visitors
            reach Portfolio faster -- each card is now just an icon, a
            name, and one outcome sentence. Moved to a 3-column grid (was
            2) so the same 5 cards resolve in two shorter rows instead of
            three, and the icon chip is bigger since it now carries more
            of the card's visual weight with the bullets gone. */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((service, i) => {
            const Icon = ICONS[i];

            return (
              <Reveal key={service.id} delayMs={i * 80}>
                <div
                  onMouseEnter={() => track("service_interaction", { service: service.id })}
                  className="flex h-full flex-col rounded-2xl border border-ink/8 p-6 transition duration-200 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="text-xl font-extrabold text-brand-blue/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ink">{service.name}</h3>
                  <p className="mt-2 text-sm font-semibold leading-snug text-ink/80">{service.outcome}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
