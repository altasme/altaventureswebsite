import { WHY_ALTAVENTURES_OFFER, OFFER_HERO } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function OfferWhyAltaventures({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="dark">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{WHY_ALTAVENTURES_OFFER.headline}</h2>

      <div className="mt-6 max-w-lg space-y-4">
        {WHY_ALTAVENTURES_OFFER.founderStatement.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-white/75">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8">
        <CTAButton
          label={OFFER_HERO.cta}
          section="why-altaventures"
          onClick={() => {
            track("cta_click", { label: OFFER_HERO.cta, section: "why-altaventures" });
            onOpenQualifier();
          }}
        />
      </div>
    </Section>
  );
}
