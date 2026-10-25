import { HERO } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import CTAButton from "../ui/CTAButton";

function scrollToWork() {
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
}

// `compact` mirrors FybHero.tsx's own prop (CLAUDE.md §45): smaller type,
// tighter margins, used only by the mobile instance below now that mobile
// renders in normal document flow rather than overlaid on the photo.
function HeroCopy({ compact = false }: { compact?: boolean }) {
  const { openContactModal } = useModals();

  // [2026-10-25] A staged, staggered entrance (headline -> sub -> line ->
  // CTAs, ~130ms apart) reads as considered/art-directed rather than a
  // static page that happened to load -- a cheap, well-worn "premium
  // product launch" cue. motion-safe: so prefers-reduced-motion users get
  // the fully-visible end state immediately, no animation at all (same
  // accessible-by-default approach as Reveal.tsx). fill-mode forwards
  // keeps the element at its animated-to state once the run completes
  // instead of snapping back to the opacity-0 start.
  return (
    <div className="relative flex flex-col items-start text-left">
      <h1
        className={`max-w-xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl motion-safe:opacity-0 motion-safe:animate-[heroStagger_0.9s_cubic-bezier(0.16,1,0.3,1)_0.05s_forwards] ${
          compact ? "text-3xl" : "text-4xl"
        }`}
      >
        {HERO.headline}
      </h1>
      <p
        className={`max-w-xl text-white/90 motion-safe:opacity-0 motion-safe:animate-[heroStagger_0.9s_cubic-bezier(0.16,1,0.3,1)_0.2s_forwards] ${
          compact ? "mt-3 text-sm leading-snug" : "mt-6 text-lg"
        }`}
      >
        {HERO.sub}
      </p>
      {!compact && (
        <p className="mt-3 max-w-xl text-sm text-white/70 motion-safe:opacity-0 motion-safe:animate-[heroStagger_0.9s_cubic-bezier(0.16,1,0.3,1)_0.32s_forwards]">
          {HERO.line}
        </p>
      )}

      <div
        className={`flex flex-col gap-4 sm:flex-row sm:items-center motion-safe:opacity-0 motion-safe:animate-[heroStagger_0.9s_cubic-bezier(0.16,1,0.3,1)_0.45s_forwards] ${
          compact ? "mt-5" : "mt-10"
        }`}
      >
        <CTAButton
          label={HERO.primaryCta}
          section="hero"
          onClick={() => openContactModal("hero")}
        />
        <CTAButton
          label={HERO.secondaryCta}
          section="hero"
          onClick={scrollToWork}
          variant="ghost"
        />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-brand-navy-deep">
      {/* Desktop / tablet: full-bleed wide shot, same real photo now used
          on /foryourbusiness and /b2b. Cloudinary's f_auto,q_auto already
          negotiates WebP/AVIF per request, so a plain <img> is enough, no
          <picture>/webp source needed (see HERO's own comment). */}
      <div className="relative hidden min-h-[620px] items-center px-6 sm:flex lg:min-h-[760px] lg:px-8">
        <img
          src={HERO.backgroundImageDesktop}
          alt={HERO.backgroundAlt}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center motion-safe:animate-[kenburns_20s_ease-out_1_forwards]"
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
          <HeroCopy />
        </div>
      </div>

      {/* Mobile [2026-10-07, matches FybHero.tsx's fixed geometry per
          CLAUDE.md §45/§48]: copy in normal flow on a solid
          bg-brand-navy-deep block, photo as its own aspect-locked panel
          below — not a text-over-photo overlay. The old overlay pattern is
          exactly what caused the repeated head-crop bug on
          /foryourbusiness (§29, §45): copy growth can silently push past
          whatever clearance was true at tuning time. This structure makes
          that overlap physically impossible regardless of future copy
          length. aspect-square + object-position 50% 83% is the same
          tuned crop already verified against this exact photo on
          /foryourbusiness and /b2b — identical box-to-image aspect ratio
          at every device width, so the same value reproduces the same
          clean framing here. */}
      <div className="bg-brand-navy-deep sm:hidden">
        <div className="px-6 pb-8 pt-8">
          <HeroCopy compact />
        </div>
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={HERO.backgroundImageMobile}
            alt={HERO.backgroundAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover motion-safe:animate-[kenburns_20s_ease-out_1_forwards]"
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
