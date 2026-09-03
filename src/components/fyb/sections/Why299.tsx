import { WHY_299 } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";

export default function Why299() {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHY_299.headline}
      </h2>

      <div className="mt-6 max-w-xl space-y-3">
        {WHY_299.body.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink/70 sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-6 max-w-xl text-base font-semibold text-brand-navy">{WHY_299.closing}</p>
    </Section>
  );
}
