import { AGITATION } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

export default function Agitation({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="dark">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">{AGITATION.headline}</h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="space-y-4">
          {AGITATION.body.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-white/80 sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <img
            src="/images/offer/agitation.jpg"
            alt=""
            width={1000}
            height={1250}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="mt-10 max-w-2xl rounded-2xl bg-brand-blue p-6 sm:p-8">
        <p className="text-xl font-bold leading-snug text-white sm:text-2xl">{AGITATION.turnLine}</p>
      </div>

      <div className="mt-8">
        <CTAButton label={AGITATION.cta} section="agitation" onClick={onOpenQualifier} size="lg" />
      </div>
    </Section>
  );
}
