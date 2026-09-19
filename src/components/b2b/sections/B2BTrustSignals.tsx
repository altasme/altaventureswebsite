import { B2B_TRUST_SIGNALS } from "../../../content/b2b";
import { useCountUp } from "../../../lib/useCountUp";
import { useInView } from "../../../lib/useInView";
import Section from "../../ui/Section";

// Mirrors FybTrustSignals.tsx exactly (same discriminated-union stat
// shape, same scroll-gated counting via useInView since this band sits
// below the fold).

type Stat = (typeof B2B_TRUST_SIGNALS.stats)[number];

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

export default function B2BTrustSignals() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <Section tone="alt" className="!py-10 sm:!py-12 lg:!py-12">
      <div ref={ref} className="grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {B2B_TRUST_SIGNALS.stats.map((stat) => (
          <div key={stat.label} className="py-4 text-center first:pt-0 last:pb-0 sm:py-0">
            <StatValue stat={stat} animate={inView} />
            <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
