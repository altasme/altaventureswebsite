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
      className="relative overflow-hidden bg-brand-navy-deep text-white"
    >
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #0D68EF 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#5fa2ff]">
              {HERO.eyebrow}
            </p>
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

            <p className="mt-8 text-xs uppercase tracking-wider text-white/40">
              {HERO.trustLine}
            </p>
          </div>

          <div className="relative">
            {/* TODO(asset): real hero interface composition (website + dashboard/booking/CRM) not yet supplied */}
            <div className="aspect-[4/3] w-full rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm sm:p-4">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-brand-navy/40 text-center">
                <p className="px-8 text-sm text-white/40">
                  TODO(asset): real product interface composition
                  <br />
                  (website + booking/CRM screens) pending
                </p>
              </div>
            </div>
            <div
              className="absolute -bottom-6 -left-6 hidden h-28 w-28 rounded-2xl bg-brand-gradient shadow-xl sm:block"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
