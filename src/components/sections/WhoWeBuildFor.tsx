import { Rocket, TrendingUp, CalendarCheck, ShoppingCart, ClipboardX } from "lucide-react";
import { WHO_WE_BUILD_FOR } from "../../content/site";
import Section from "../ui/Section";
import Reveal from "../offer/Reveal";
import DecorativeShapes from "../fyb/DecorativeShapes";

const ICONS = [Rocket, TrendingUp, CalendarCheck, ShoppingCart, ClipboardX];

export default function WhoWeBuildFor() {
  return (
    <Section tone="alt">
      <div className="relative">
        <DecorativeShapes variant={1} />
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {WHO_WE_BUILD_FOR.headline}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHO_WE_BUILD_FOR.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={item.title} delayMs={i * 70}>
                <div className="flex h-full gap-4 rounded-2xl bg-white p-6 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{item.copy}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
