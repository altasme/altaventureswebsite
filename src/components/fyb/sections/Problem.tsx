import { PROBLEM } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import DecorativeShapes from "../DecorativeShapes";

export default function Problem() {
  return (
    <Section tone="light">
      <div className="relative">
        <DecorativeShapes variant={3} />
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">{PROBLEM.headline}</h2>
          <div className="mt-6 space-y-4">
            {PROBLEM.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-ink/70 sm:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
