import { Target, Layers, TrendingUp, CircleCheck } from "lucide-react";
import { WHY_ALTAVENTURES } from "../../content/site";
import Section from "../ui/Section";
import Reveal from "../offer/Reveal";

const ICONS = [Target, Layers, TrendingUp, CircleCheck];

export default function WhyAltaventures() {
  return (
    <Section tone="dark">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          {WHY_ALTAVENTURES.headline}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {WHY_ALTAVENTURES.points.map((point, i) => {
          const Icon = ICONS[i];
          return (
            <Reveal key={point.title} delayMs={i * 80} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p className="mt-1.5 text-sm font-semibold leading-snug text-white">{point.hook}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{point.copy}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
