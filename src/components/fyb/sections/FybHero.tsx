import { FYB_HERO } from "../../../content/foryourbusiness";
import CTAButton from "../../ui/CTAButton";

// Full-bleed hero on desktop, same treatment as the homepage's Hero.tsx:
// a wide crop with a navy scrim gradient behind the text so it stays
// readable over the photo. Replaces the earlier solid-navy two-column
// layout (headline/CTA + FybHeroVisual's stat panel) [2026-09-18] — the
// stats moved into their own small animated trust-signal band right below
// the hero instead (see FybTrustSignals.tsx), so this section is copy +
// CTA only now.
//
// [2026-10-05, mobile rebuilt again] The mobile overlay approach from the
// previous version of this file (photo as a full-screen background, copy
// pinned to its dark upper zone) kept breaking every time the hero copy
// grew: §29 originally clearance-tuned it against the real photo, then
// §37's copy rewrite (a longer sub, a third line, a second CTA) quietly
// pushed the copy block's height past that safe zone again on common
// narrow phones (measured: -16px to -49px of overlap at 360-375px widths
// against the real, now-reachable photo), reproducing exactly the
// operator's real-device report ("cut off my head"). Chasing clearance
// math by hand every time the copy changes is fragile and has now failed
// twice. Fixed structurally instead: mobile no longer overlays text on
// the photo at all. The copy renders in normal flow on a solid
// bg-brand-navy-deep block, and the photo is a separate, fixed-height
// panel below it — overlap is no longer physically possible regardless of
// how long the copy gets. Desktop is unchanged (plenty of width, not what
// was reported broken).
function HeroCopy({
  onCheckout,
  onTalkToUs,
  compact = false,
}: {
  onCheckout: () => void;
  onTalkToUs: () => void;
  compact?: boolean;
}) {
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
      <p className={`text-white/70 ${compact ? "mt-2 text-xs" : "mt-3 text-sm"}`}>{FYB_HERO.line}</p>
      <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center ${compact ? "mt-5" : "mt-8"}`}>
        <CTAButton
          label={FYB_HERO.cta}
          section="hero"
          onClick={onCheckout}
          size="lg"
          className="w-full sm:w-auto"
        />
        <CTAButton
          label={FYB_HERO.talkToUsCta}
          section="hero"
          onClick={onTalkToUs}
          variant="ghost"
          size="lg"
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}

export default function FybHero({ onCheckout, onTalkToUs }: { onCheckout: () => void; onTalkToUs: () => void }) {
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
          <HeroCopy onCheckout={onCheckout} onTalkToUs={onTalkToUs} />
        </div>
      </div>

      {/* Mobile [rebuilt 2026-10-05]: copy in normal flow on a solid
          bg-brand-navy-deep block, photo as its own panel below — see the
          comment above HeroCopy for why the previous full-screen overlay
          was abandoned. The panel uses a fixed aspect-ratio (aspect-square)
          rather than a fixed pixel height so the crop is identical in
          relative terms at every device width — a fixed height combined
          with object-cover produced a different, width-dependent crop at
          each test width (375px cropped the whole face out; 360px and
          390px looked fine), which an aspect-locked box avoids entirely.
          object-position 50% 83% was tuned against the real photo (not
          plain "top") to land on a little dark headroom above the head,
          his full face, and his crossed-arms pose, cropping only the dark
          background above and a sliver of his forearms below — verified
          by screenshot at 320/360/375/390/430px widths, see CLAUDE.md. A
          short top/bottom scrim blends the panel into the navy block above
          and the next section below. */}
      <div className="bg-brand-navy-deep sm:hidden">
        <div className="px-6 pb-8 pt-8">
          <HeroCopy onCheckout={onCheckout} onTalkToUs={onTalkToUs} compact />
        </div>
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={FYB_HERO.backgroundImageMobile}
            alt={FYB_HERO.backgroundAlt}
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
