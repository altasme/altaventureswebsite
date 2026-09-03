import { REALITY } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";

export default function Reality() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {REALITY.headline}
      </h2>

      <div className="mt-6 max-w-xl space-y-2">
        {REALITY.body.map((line) => (
          <p key={line} className="text-base leading-relaxed text-ink/70 sm:text-lg">
            {line}
          </p>
        ))}
      </div>

      <p className="mt-6 max-w-xl text-lg font-semibold text-brand-navy">{REALITY.transition}</p>

      <div className="mt-4 max-w-xl space-y-3">
        {REALITY.body2.map((paragraph) => (
          <p key={paragraph} className="text-base leading-relaxed text-ink/70 sm:text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <p className="mt-6 max-w-xl text-base font-semibold text-brand-blue">{REALITY.closing}</p>
    </Section>
  );
}
