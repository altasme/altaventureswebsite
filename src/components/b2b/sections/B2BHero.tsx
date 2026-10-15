import { B2B_HERO } from "../../../content/b2b";
import CTAButton from "../../ui/CTAButton";

// Mirrors src/components/fyb/sections/FybHero.tsx exactly (same full-bleed
// desktop treatment; same aspect-locked mobile photo panel [2026-10-05],
// see FybHero.tsx's own comments for why the earlier full-screen overlay
// was replaced). Kept as its own component (not a shared/parametrized one)
// to match this codebase's established per-funnel convention (offer.ts +
// components/offer, foryourbusiness.ts + components/fyb) rather than
// introducing a new cross-funnel abstraction for a two-page reuse.
function HeroCopy({ onCheckout, compact = false }: { onCheckout: () => void; compact?: boolean }) {
  return (
    <div className="relative max-w-xl">
      <h1
        className={`font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl ${
          compact ? "text-3xl" : "text-4xl"
        }`}
      >
        {B2B_HERO.headline}
      </h1>
      <p className={`text-white/85 ${compact ? "mt-3 text-sm leading-snug" : "mt-6 text-lg leading-relaxed"}`}>
        {B2B_HERO.sub}
      </p>
      <div className={compact ? "mt-4" : "mt-8"}>
        <CTAButton label={B2B_HERO.cta} section="hero" onClick={onCheckout} size="lg" className="w-full sm:w-auto" />
      </div>
    </div>
  );
}

export default function B2BHero({ onCheckout }: { onCheckout: () => void }) {
  return (
    <section className="relative overflow-hidden bg-brand-navy-deep">
      {/* Desktop / tablet: full-bleed wide shot. */}
      <div className="relative hidden min-h-[620px] items-center px-6 sm:flex lg:min-h-[760px] lg:px-8">
        <img
          src={B2B_HERO.backgroundImageDesktop}
          alt={B2B_HERO.backgroundAlt}
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

      {/* Mobile: copy in normal flow on a solid bg-brand-navy-deep block,
          photo as its own aspect-locked panel below — same structural fix
          as FybHero.tsx [2026-10-05], same tuned crop (object-position
          50% 83%, aspect-square) since it's the identical photo. See
          FybHero.tsx's comments for the full reasoning. */}
      <div className="bg-brand-navy-deep sm:hidden">
        <div className="px-6 pb-8 pt-8">
          <HeroCopy onCheckout={onCheckout} compact />
        </div>
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={B2B_HERO.backgroundImageMobile}
            alt={B2B_HERO.backgroundAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "50% 83%" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-12"
            style={{ background: "linear-gradient(180deg, rgba(6,18,46,1) 0%, rgba(6,18,46,0) 100%)" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
            style={{ background: "linear-gradient(0deg, rgba(6,18,46,0.85) 0%, rgba(6,18,46,0) 100%)" }}
          />
        </div>
      </div>
    </section>
  );
}
