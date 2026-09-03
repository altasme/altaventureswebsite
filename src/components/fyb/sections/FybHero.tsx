import { FYB_HERO } from "../../../content/foryourbusiness";
import CTAButton from "../../ui/CTAButton";
import FybHeroVisual from "../FybHeroVisual";

function scrollToPortfolio() {
  document.getElementById("fyb-portfolio")?.scrollIntoView({ behavior: "smooth" });
}

export default function FybHero({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <section className="bg-brand-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <p className="text-sm font-semibold tracking-wide text-[#5fa2ff]">{FYB_HERO.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {FYB_HERO.headline}
          </h1>
          <p className="mt-6 max-w-lg text-lg font-semibold text-white/90">{FYB_HERO.sub}</p>

          <div className="mt-4 max-w-lg space-y-3">
            {FYB_HERO.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-white/75">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="text-4xl font-extrabold tracking-tight">{FYB_HERO.price}</span>
            <span className="text-xs font-semibold tracking-wide text-white/60">{FYB_HERO.priceNote}</span>
          </div>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CTAButton label={FYB_HERO.cta} section="hero" onClick={onOpenContact} size="lg" />
            <CTAButton
              label={FYB_HERO.secondaryCta}
              section="hero"
              onClick={scrollToPortfolio}
              variant="ghost"
              size="lg"
            />
          </div>

          <p className="mt-8 text-xs tracking-wide text-white/50">{FYB_HERO.urgencyMicrocopy}</p>
        </div>

        <FybHeroVisual />
      </div>
    </section>
  );
}
