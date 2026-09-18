import { FYB_HERO } from "../../../content/foryourbusiness";
import CTAButton from "../../ui/CTAButton";

// Full-bleed hero, same treatment as the homepage's Hero.tsx: a wide
// desktop crop and a separate portrait mobile crop, each with a navy
// scrim gradient behind the text so it stays readable over the photo.
// Replaces the earlier solid-navy two-column layout (headline/CTA +
// FybHeroVisual's stat panel) [2026-09-18] — the stats moved into their
// own small animated trust-signal band right below the hero instead (see
// FybTrustSignals.tsx), so this section is copy + CTA only now.
function HeroCopy({ onCheckout }: { onCheckout: () => void }) {
  return (
    <div className="relative max-w-xl">
      <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {FYB_HERO.headline}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-white/85">{FYB_HERO.sub}</p>
      <div className="mt-8">
        <CTAButton label={FYB_HERO.cta} section="hero" onClick={onCheckout} size="lg" className="w-full sm:w-auto" />
      </div>
    </div>
  );
}

export default function FybHero({ onCheckout }: { onCheckout: () => void }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-deep">
      {/* Desktop / tablet: full-bleed wide shot. */}
      <div className="relative hidden min-h-[560px] items-center px-6 sm:flex lg:min-h-[680px] lg:px-8">
        <img
          src={FYB_HERO.backgroundImageDesktop}
          alt={FYB_HERO.backgroundAlt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,18,46,0.92) 0%, rgba(6,18,46,0.72) 32%, rgba(6,18,46,0.25) 52%, transparent 68%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,18,46,0.5) 0%, rgba(6,18,46,0.15) 25%, rgba(6,18,46,0.6) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <HeroCopy onCheckout={onCheckout} />
        </div>
      </div>

      {/* Mobile: full-bleed portrait shot, text sits in the image's own
          upper zone (same assumption as the homepage's crop — adjust
          object-position below if the supplied photo is framed differently). */}
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-10 pt-14 sm:hidden">
        <img
          src={FYB_HERO.backgroundImageMobile}
          alt={FYB_HERO.backgroundAlt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,18,46,0.92) 0%, rgba(6,18,46,0.88) 50%, rgba(6,18,46,0.72) 74%, rgba(6,18,46,0.45) 100%)",
          }}
        />
        <div className="relative z-10">
          <HeroCopy onCheckout={onCheckout} />
        </div>
      </div>
    </section>
  );
}
