import { ABOUT } from "../../content/site";
import Section from "../ui/Section";

export default function About() {
  return (
    <Section id="about" tone="alt">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {ABOUT.headline}
        </h2>
        <div className="mt-6 max-w-sm space-y-4 sm:max-w-md">
          {ABOUT.body.map((paragraph, i) => (
            <p key={i} className="text-base leading-relaxed text-ink/75 sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
