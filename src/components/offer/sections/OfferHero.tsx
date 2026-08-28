import { OFFER_HERO } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferCTAButton from "../ui/OfferCTAButton";

function scrollToPortfolio() {
  document.getElementById("offer-portfolio")?.scrollIntoView({ behavior: "smooth" });
}

export default function OfferHero({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy-deep text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-brand-blue/30 blur-[120px]" />
        <div className="absolute -bottom-48 left-[-10%] h-[28rem] w-[28rem] rounded-full bg-brand-navy/60 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32 lg:px-8">
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          {OFFER_HERO.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">{OFFER_HERO.sub}</p>
        <p className="mx-auto mt-3 max-w-xl text-base font-semibold text-white/90">{OFFER_HERO.punchLine}</p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <OfferCTAButton
            label={OFFER_HERO.cta}
            section="hero"
            onClick={() => {
              track("cta_click", { label: OFFER_HERO.cta, section: "hero" });
              onOpenQualifier();
            }}
            className="!px-8 !py-4 !text-base sm:!text-lg"
          />
          <OfferCTAButton label={OFFER_HERO.secondaryCta} section="hero" onClick={scrollToPortfolio} variant="secondary" />
        </div>

        <p className="mt-8 text-xs tracking-wide text-white/50">{OFFER_HERO.microcopy}</p>
      </div>
    </section>
  );
}
