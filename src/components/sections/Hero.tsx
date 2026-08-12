import { HERO } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import CTAButton from "../ui/CTAButton";

function scrollToWork() {
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const { openContactModal } = useModals();

  return (
    <section
      id="home"
      className="relative flex min-h-[640px] items-center overflow-hidden bg-brand-navy-deep text-white sm:min-h-[720px] lg:min-h-[800px]"
    >
      {/* Full-bleed background image */}
      <img
        src={HERO.backgroundImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      {/* Scrim so text stays legible over any background image */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-navy-deep via-brand-navy-deep/85 to-brand-navy-deep/40"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-[#5fa2ff]">{HERO.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {HERO.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75">{HERO.sub}</p>
          <p className="mt-3 max-w-xl text-sm text-white/50">{HERO.line}</p>

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

          <p className="mt-8 max-w-sm text-xs tracking-wide text-white/50">{HERO.trustLine}</p>
        </div>
      </div>
    </section>
  );
}
