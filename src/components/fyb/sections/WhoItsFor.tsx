import { WHO_ITS_FOR } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

export default function WhoItsFor() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHO_ITS_FOR.headline}
      </h2>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {WHO_ITS_FOR.items.map((item, i) => (
          <li key={item}>
            <Reveal
              delayMs={i * 60}
              className="rounded-2xl border border-brand-blue/15 bg-brand-blue/5 px-5 py-4 text-sm font-medium text-brand-navy sm:text-base"
            >
              {item}
            </Reveal>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-xl text-base font-semibold text-ink/70">{WHO_ITS_FOR.line}</p>
    </Section>
  );
}
