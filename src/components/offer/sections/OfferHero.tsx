import { OFFER_HERO } from "../../../content/offer";
import CTAButton from "../../ui/CTAButton";

function scrollToPortfolio() {
  document.getElementById("offer-portfolio")?.scrollIntoView({ behavior: "smooth" });
}

export default function OfferHero({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-deep text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 hidden h-80 w-80 bg-brand-gradient opacity-20 sm:block"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 hidden h-80 w-80 bg-brand-gradient opacity-10 sm:block"
        style={{ clipPath: "polygon(0 100%, 100% 100%, 0 0)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 py-20 text-center sm:py-28 lg:px-8">
        <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl">
          {OFFER_HERO.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">{OFFER_HERO.sub}</p>
        <p className="mx-auto mt-3 max-w-xl text-base font-semibold text-white">{OFFER_HERO.punchLine}</p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton
            label={OFFER_HERO.cta}
            section="hero"
            onClick={onOpenQualifier}
            className="!px-8 !py-4 !text-base sm:!text-lg"
          />
          <CTAButton label={OFFER_HERO.secondaryCta} section="hero" onClick={scrollToPortfolio} variant="ghost" />
        </div>

        <p className="mt-8 text-xs tracking-wide text-white/50">{OFFER_HERO.microcopy}</p>
      </div>
    </section>
  );
}
