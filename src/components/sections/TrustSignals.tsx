import { Rocket, Clock, Handshake } from "lucide-react";
import { TRUST_SIGNALS } from "../../content/site";
import { useCountUp } from "../../lib/useCountUp";
import { useInView } from "../../lib/useInView";
import Section from "../ui/Section";

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

  if (stat.kind === "counter") {
    return (
      <p className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
        {count}
        <span className="ml-1 text-lg font-semibold text-brand-blue">{stat.suffix}</span>
      </p>
    );
  }

  if (stat.kind === "range") {
    return (
      <p className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
        {rangeFrom}-{rangeTo}
      </p>
    );
  }

  return (
    <p
      className={`text-3xl font-extrabold tracking-tight text-brand-navy transition-opacity duration-700 sm:text-4xl ${animate ? "opacity-100" : "opacity-0"}`}
    >
      {stat.value}
    </p>
  );
}

export default function TrustSignals() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <Section tone="light" className="!py-10 sm:!py-12 lg:!py-12">
      <div
        ref={ref}
        className="grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
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
    </Section>
  );
}
