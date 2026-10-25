import { Rocket, Clock, Handshake } from "lucide-react";
import { TRUST_SIGNALS } from "../../content/site";
import { useCountUp } from "../../lib/useCountUp";
import { useInView } from "../../lib/useInView";
import Section from "../ui/Section";
import DecorativeShapes from "../fyb/DecorativeShapes";

// Small animated stat band directly below the hero, mirroring the
// discriminated-union pattern + useCountUp/useInView gating already
// established by /foryourbusiness's FybTrustSignals.tsx.

type Stat = (typeof TRUST_SIGNALS.stats)[number];

const ICONS = [Rocket, Clock, Handshake];

function StatValue({ stat, animate }: { stat: Stat; animate: boolean }) {
  const counterTarget = stat.kind === "counter" && animate ? stat.countTo : 0;
  const rangeFromTarget = stat.kind === "range" && animate ? stat.from : 0;
  const rangeToTarget = stat.kind === "range" && animate ? stat.to : 0;

  const count = useCountUp(counterTarget);
  const rangeFrom = useCountUp(rangeFromTarget);
  const rangeTo = useCountUp(rangeToTarget);

  // [2026-10-25] A small "pop" right as the counter settles reads as the
  // number landing with intent rather than just stopping -- timed via a
  // CSS animation-delay matching useCountUp's own 1400ms run, so it never
  // needs a JS timer of its own. Only ever added once `animate` flips true
  // (the band is below the fold, counting is already gated on scroll-into-
  // view), so it can't fire on initial mount before anyone's scrolled down.
  const popClass = animate
    ? "motion-safe:animate-[statPop_0.5s_cubic-bezier(0.34,1.56,0.64,1)_1.4s_1_forwards]"
    : "";

  if (stat.kind === "counter") {
    return (
      <p className={`text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl ${popClass}`}>
        {count}
        <span className="ml-1 text-lg font-semibold text-brand-blue">{stat.suffix}</span>
      </p>
    );
  }

  if (stat.kind === "range") {
    return (
      <p className={`text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl ${popClass}`}>
        {rangeFrom}-{rangeTo}
      </p>
    );
  }

  return (
    <p
      className={`text-3xl font-extrabold tracking-tight text-brand-navy transition-opacity duration-700 sm:text-4xl ${animate ? "opacity-100" : "opacity-0"} ${popClass}`}
    >
      {stat.value}
    </p>
  );
}

export default function TrustSignals() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <Section tone="light" className="!py-10 sm:!py-12 lg:!py-12">
      <div className="relative">
        <DecorativeShapes variant={2} />
        <div
          ref={ref}
          className="relative grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {TRUST_SIGNALS.stats.map((stat, i) => {
            const Icon = ICONS[i];
            return (
              <div key={stat.label} className="flex flex-col items-center py-4 text-center first:pt-0 last:pb-0 sm:py-0">
                <Icon className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                <div className="mt-2">
                  <StatValue stat={stat} animate={inView} />
                </div>
                <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
