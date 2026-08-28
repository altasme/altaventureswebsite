import { OFFER_HERO } from "../../../content/offer";
import { useCountUp } from "../../../lib/useCountUp";
import CTAButton from "../../ui/CTAButton";

function scrollToPortfolio() {
  document.getElementById("offer-portfolio")?.scrollIntoView({ behavior: "smooth" });
}

function Headline() {
  const { headline, headlineHighlight } = OFFER_HERO;
  const index = headline.indexOf(headlineHighlight);
  if (index === -1) return <>{headline}</>;

  const before = headline.slice(0, index);
  const after = headline.slice(index + headlineHighlight.length);
  return (
    <>
      {before}
      <span className="text-[#5fa2ff]">{headlineHighlight}</span>
      {after}
    </>
  );
}

type Stat = (typeof OFFER_HERO.stats)[number];

function StatValue({ stat }: { stat: Stat }) {
  const hasCounter = "countTo" in stat;
  const count = useCountUp(hasCounter ? stat.countTo : 0);

  if (hasCounter) {
    return (
      <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
        {count}
        <span className="ml-2 text-base font-semibold text-white/70">{stat.suffix}</span>
      </p>
    );
  }

  return <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">{stat.value}</p>;
}

export default function OfferHero({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <section className="bg-brand-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            <Headline />
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/80">{OFFER_HERO.sub}</p>
          <p className="mt-3 max-w-lg text-base font-semibold text-white">{OFFER_HERO.punchLine}</p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CTAButton label={OFFER_HERO.cta} section="hero" onClick={onOpenQualifier} size="lg" />
            <CTAButton
              label={OFFER_HERO.secondaryCta}
              section="hero"
              onClick={scrollToPortfolio}
              variant="ghost"
              size="lg"
            />
          </div>

          <p className="mt-8 text-xs tracking-wide text-white/50">{OFFER_HERO.microcopy}</p>
        </div>

        <div className="rounded-3xl bg-brand-gradient p-8 sm:p-10">
          <div className="divide-y divide-white/20">
            {OFFER_HERO.stats.map((stat) => (
              <div key={stat.label} className="py-5 first:pt-0 last:pb-0">
                <StatValue stat={stat} />
                <p className="mt-1 text-sm font-medium text-white/85">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
