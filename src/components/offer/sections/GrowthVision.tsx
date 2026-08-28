import { GROWTH_VISION } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCard from "../ui/OfferCard";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function GrowthVision({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="navy">
      <Eyebrow>{GROWTH_VISION.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{GROWTH_VISION.headline}</h2>
      <p className="mt-3 max-w-md text-base text-white/60">{GROWTH_VISION.sub}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {GROWTH_VISION.phases.map((phase) => (
          <OfferCard key={phase.label}>
            <span className="inline-flex items-center rounded-full bg-brand-blue/15 px-3 py-1 text-xs font-semibold text-[#5fa2ff]">
              {phase.label}
            </span>
            <h3 className="mt-3 text-lg font-bold text-white">{phase.title}</h3>
            <ul className="mt-3 space-y-1.5">
              {phase.items.map((item) => (
                <li key={item} className="text-sm leading-relaxed text-white/60">
                  {item}
                </li>
              ))}
            </ul>
          </OfferCard>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/60">{GROWTH_VISION.phase2ProofLine}</p>
      <p className="mt-4 text-sm font-medium text-white/50">{GROWTH_VISION.noCommitmentLine}</p>

      <div className="mt-6">
        <OfferCTAButton
          label={GROWTH_VISION.cta}
          section="growth-vision"
          onClick={() => {
            track("cta_click", { label: GROWTH_VISION.cta, section: "growth-vision" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
