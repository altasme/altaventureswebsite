import { OFFER_HERO } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import CTAButton from "../../ui/CTAButton";

function scrollToPortfolio() {
  document.getElementById("offer-portfolio")?.scrollIntoView({ behavior: "smooth" });
}

export default function OfferHero({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <section className="bg-brand-navy-deep text-white">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28 lg:px-8">
        <p className="text-sm font-semibold tracking-wide text-[#5fa2ff]">{OFFER_HERO.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          {OFFER_HERO.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">{OFFER_HERO.sub}</p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton
            label={OFFER_HERO.cta}
            section="hero"
            onClick={() => {
              track("cta_click", { label: OFFER_HERO.cta, section: "hero" });
              onOpenQualifier();
            }}
            className="!px-8 !py-4 !text-base sm:!text-lg"
          />
          <CTAButton label={OFFER_HERO.secondaryCta} section="hero" onClick={scrollToPortfolio} variant="ghost" />
        </div>

        <p className="mt-6 text-xs tracking-wide text-white/60">{OFFER_HERO.microcopy}</p>
        <p className="mt-8 text-xs text-white/40">{OFFER_HERO.proofStrip}</p>
      </div>
    </section>
  );
}
