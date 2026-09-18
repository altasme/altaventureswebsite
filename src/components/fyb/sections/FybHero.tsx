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
      <div className="relative hidden min-h-[620px] items-center px-6 sm:flex lg:min-h-[760px] lg:px-8">
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

      {/* Mobile: NOT an overlay anymore [2026-09-18, second fix]. The
          previous approach stacked the text block on top of the full-bleed
          photo via object-position cropping (object-center, then
          object-[50%_100%] bottom-anchoring) — both attempts were tuned
          blind (this sandbox can never load the actual Cloudinary photo)
          and both failed the same way on a real screenshot of the deployed
          page: the CTA button sat directly over the subject's face either
          time. Bottom-anchoring only helps if the source photo has real
          headroom above the subject to crop away; this one apparently
          doesn't, and no CSS object-position value can invent headroom
          that isn't in the photo. Fixed at the layout level instead: the
          text block now has its own solid bg-brand-navy-deep space (sized
          to its content, not a fixed viewport height), and the photo is a
          separate block below it with its own fixed aspect ratio. Text and
          photo now occupy non-overlapping DOM regions, so this can't
          recur regardless of how the photo is actually framed. */}
      <div className="sm:hidden">
        <div className="bg-brand-navy-deep px-6 pb-10 pt-14">
          <HeroCopy onCheckout={onCheckout} />
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <img
            src={FYB_HERO.backgroundImageMobile}
            alt={FYB_HERO.backgroundAlt}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
