import { WHY_FREE } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function WhyFree({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection shade="navy">
      <Eyebrow>{WHY_FREE.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{WHY_FREE.headline}</h2>

      <div className="mt-6 max-w-lg space-y-4">
        {WHY_FREE.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-white/75">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <OfferCTAButton
          label={WHY_FREE.cta}
          section="why-free"
          onClick={() => {
            track("cta_click", { label: WHY_FREE.cta, section: "why-free" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
