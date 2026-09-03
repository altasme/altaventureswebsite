import { FYB_HERO } from "../../../content/foryourbusiness";
import CTAButton from "../../ui/CTAButton";
import FybHeroVisual from "../FybHeroVisual";

export default function FybHero({ onCheckout }: { onCheckout: () => void }) {
  return (
    <section className="bg-brand-navy-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {FYB_HERO.headline}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">{FYB_HERO.sub}</p>
          <p className="mt-3 max-w-lg text-sm text-white/60">{FYB_HERO.microcopy}</p>

          <div className="mt-8">
            <CTAButton label={FYB_HERO.cta} section="hero" onClick={onCheckout} size="lg" />
          </div>
        </div>

        <FybHeroVisual />
      </div>
    </section>
  );
}
