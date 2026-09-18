import { PROBLEM } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";

export default function Problem() {
  return (
    <Section tone="light">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">{PROBLEM.headline}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">{PROBLEM.body}</p>
      </div>
    </Section>
  );
}
