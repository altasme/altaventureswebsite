import { FYB_HERO } from "../../../content/foryourbusiness";
import CTAButton from "../../ui/CTAButton";

// Full-bleed hero, same treatment as the homepage's Hero.tsx: a wide
// desktop crop and a separate portrait mobile crop, each with a navy
// scrim gradient behind the text so it stays readable over the photo.
// Replaces the earlier solid-navy two-column layout (headline/CTA +
// FybHeroVisual's stat panel) [2026-09-18] — the stats moved into their
// own small animated trust-signal band right below the hero instead (see
// FybTrustSignals.tsx), so this section is copy + CTA only now.
// `compact` is used only by the mobile instance below, to fit the copy
// block inside the dark upper zone of the mobile photo above the subject's
// head (see the mobile section's comment). It never reaches the desktop
// instance, which doesn't pass it, so desktop sizing is unaffected.
function HeroCopy({ onCheckout, compact = false }: { onCheckout: () => void; compact?: boolean }) {
  return (
    <div className="relative max-w-xl">
      <h1
        className={`font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl ${
          compact ? "text-3xl" : "text-4xl"
        }`}
      >
        {FYB_HERO.headline}
      </h1>
      <p className={`text-white/85 ${compact ? "mt-3 text-sm leading-snug" : "mt-6 text-lg leading-relaxed"}`}>
        {FYB_HERO.sub}
      </p>
      <div className={compact ? "mt-4" : "mt-8"}>
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

      {/* Mobile: back to a full-bleed overlay [2026-09-18, third fix],
          this time verified against the real photo instead of guessed.
          The stacked "text block, then photo block" layout from the
          second fix guaranteed no overlap but gave up the full-bleed look
          entirely. The operator then supplied the actual mobile hero file
          directly (not just a Cloudinary link this sandbox can't fetch),
          which showed why the two earlier object-position guesses failed:
          the image is a 1080x1920 (9:16) portrait with a plain dark
          background filling roughly the top 43% and the subject occupying
          the bottom ~57% (shoulders up, cropped at the very bottom). On a
          typical phone viewport, object-cover against a ~9:16-ish
          container is height-bound (scale = containerHeight / imageHeight,
          per CSS's object-fit spec), so there is little to no vertical
          slack to crop — meaning object-position's Y value was never the
          lever that mattered here. The real fix is keeping the text block
          top-anchored (not vertically centered) with a top padding shallow
          enough to sit entirely within that top ~43% dark zone, which
          verified clean above the subject at both a short (~650px) and
          tall (~930px) phone viewport height using this exact image (see
          the "How this was tested" note in CLAUDE.md). object-top is kept
          on the <img> as a safety net for any device where the container
          does end up width-bound and some vertical crop occurs, so the
          background gets trimmed before the subject would. */}
      <div className="relative min-h-[100svh] overflow-hidden sm:hidden">
        <img
          src={FYB_HERO.backgroundImageMobile}
          alt={FYB_HERO.backgroundAlt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,18,46,0.55) 0%, rgba(6,18,46,0.15) 30%, transparent 46%)",
          }}
        />
        <div className="relative flex min-h-[100svh] flex-col justify-start px-6 pb-10 pt-6">
          <HeroCopy onCheckout={onCheckout} compact />
        </div>
      </div>
    </section>
  );
}
