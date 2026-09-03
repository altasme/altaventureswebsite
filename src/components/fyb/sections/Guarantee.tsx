import { GUARANTEE } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";

export default function Guarantee() {
  return (
    <Section tone="light">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">{GUARANTEE.headline}</h2>
        <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">{GUARANTEE.body}</p>
      </div>
    </Section>
  );
}
