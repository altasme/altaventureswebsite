import { SCARCITY } from "../../../content/offer";
import { ONGOING } from "../../../content/portfolio";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function Scarcity({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="deep">
      <Eyebrow>{SCARCITY.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{SCARCITY.headline}</h2>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{SCARCITY.body}</p>

      <div className="mt-8 rounded-2xl border border-white/15 bg-white/[0.04] p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#5fa2ff]">{SCARCITY.studioLabel}</p>
        <ul className="mt-3 space-y-2">
          {ONGOING.map((project) => (
            <li key={project.id} className="text-sm text-white/75">
              <span className="font-semibold text-white">{project.name}:</span> {project.note}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs italic text-white/40">{SCARCITY.studioNote}</p>
      </div>

      <div className="mt-8">
        <OfferCTAButton
          label={SCARCITY.cta}
          section="scarcity"
          onClick={() => {
            track("cta_click", { label: SCARCITY.cta, section: "scarcity" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
