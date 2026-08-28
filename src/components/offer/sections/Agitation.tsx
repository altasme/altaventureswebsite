import { AGITATION } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function Agitation({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="dark">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{AGITATION.headline}</h2>

      <div className="mt-6 max-w-2xl space-y-4">
        {AGITATION.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-white/75 sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-8 max-w-xl text-xl font-bold text-white">{AGITATION.turnLine}</p>

      <div className="mt-8">
        <CTAButton
          label={AGITATION.cta}
          section="agitation"
          onClick={() => {
            track("cta_click", { label: AGITATION.cta, section: "agitation" });
            onOpenQualifier();
          }}
        />
      </div>
    </Section>
  );
}
