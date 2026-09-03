import { SOCIAL_MEDIA_REALITY } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

function ComparisonCard({
  data,
  tone,
}: {
  data: (typeof SOCIAL_MEDIA_REALITY.comparison)["social" | "website"];
  tone: "muted" | "brand";
}) {
  const isBrand = tone === "brand";
  return (
    <div
      className={`rounded-2xl border p-6 ${
        isBrand ? "border-brand-blue/20 bg-brand-blue/5" : "border-ink/10 bg-paper-alt"
      }`}
    >
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          isBrand ? "text-brand-blue" : "text-ink/50"
        }`}
      >
        {data.label}
      </p>
      <ul className="mt-4 space-y-2">
        {data.items.map((item) => (
          <li key={item} className={`text-base ${isBrand ? "text-ink/80" : "text-ink/60"}`}>
            {item}
          </li>
        ))}
      </ul>
      <p className={`mt-4 text-xs font-medium ${isBrand ? "text-brand-blue" : "text-ink/40"}`}>{data.note}</p>
    </div>
  );
}

export default function SocialMediaReality() {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {SOCIAL_MEDIA_REALITY.headline}
      </h2>

      <div className="mt-6 max-w-xl space-y-3">
        {SOCIAL_MEDIA_REALITY.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink/70 sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-6 max-w-xl text-lg font-semibold text-brand-navy">{SOCIAL_MEDIA_REALITY.transition}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Reveal>
          <ComparisonCard data={SOCIAL_MEDIA_REALITY.comparison.social} tone="muted" />
        </Reveal>
        <Reveal delayMs={80}>
          <ComparisonCard data={SOCIAL_MEDIA_REALITY.comparison.website} tone="brand" />
        </Reveal>
      </div>
    </Section>
  );
}
