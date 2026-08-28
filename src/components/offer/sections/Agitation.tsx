import { AGITATION } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function Agitation({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="navy">
      <Eyebrow>{AGITATION.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{AGITATION.headline}</h2>

      <div className="mt-6 max-w-2xl space-y-4">
        {AGITATION.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-white/75 sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-xl font-bold text-white">{AGITATION.turnLine}</p>

      <div className="mt-8">
        <OfferCTAButton
          label={AGITATION.cta}
          section="agitation"
          onClick={() => {
            track("cta_click", { label: AGITATION.cta, section: "agitation" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
