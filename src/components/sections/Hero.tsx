import { HERO } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import CTAButton from "../ui/CTAButton";

function scrollToWork() {
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
}

function HeroCopy() {
  const { openContactModal } = useModals();

  return (
    <div className="relative flex flex-col items-start text-left">
      <p className="text-sm font-semibold tracking-wide text-[#5fa2ff]">{HERO.eyebrow}</p>
      <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
        {HERO.headline}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-white/90">{HERO.sub}</p>
      <p className="mt-3 max-w-xl text-sm text-white/70">{HERO.line}</p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
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

      <p className="mt-8 max-w-sm text-xs tracking-wide text-white/60">{HERO.trustLine}</p>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-brand-navy-deep">
      {/* Desktop / tablet: full-bleed wide shot. Subject (real product
          screenshot or team photo, once supplied) sits right-of-frame so
          the left third stays clear for the headline by construction;
          the gradient reinforces it rather than doing all the work. */}
      <div className="relative hidden min-h-[620px] items-center px-6 sm:flex lg:min-h-[760px] lg:px-8">
        <img
          src={HERO.backgroundImageDesktop}
          alt={HERO.backgroundAlt}
          className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
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

      {/* Mobile: full-bleed portrait shot, subject in the lower frame,
          text sits in the image's own empty top zone. */}
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden px-6 pb-10 pt-14 sm:hidden">
        <img
          src={HERO.backgroundImageMobile}
          alt={HERO.backgroundAlt}
          className="absolute inset-0 h-full w-full object-cover object-[50%_100%]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,18,46,0.92) 0%, rgba(6,18,46,0.88) 50%, rgba(6,18,46,0.72) 74%, rgba(6,18,46,0.45) 100%)",
          }}
        />
        <div className="relative z-10">
          <HeroCopy />
        </div>
      </div>
    </section>
  );
}
