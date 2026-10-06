import { WHO_ITS_FOR } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";
import DecorativeShapes from "../DecorativeShapes";

export default function WhoItsFor() {
  return (
    <Section tone="light">
      <div className="relative">
        <DecorativeShapes variant={2} />
        <div className="relative">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {WHO_ITS_FOR.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">{WHO_ITS_FOR.sub}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WHO_ITS_FOR.items.map((item, i) => (
              <li key={item.title}>
                <Reveal
                  delayMs={i * 60}
                  className="h-full rounded-2xl border border-brand-blue/15 bg-brand-blue/5 px-5 py-4"
                >
                  <p className="text-sm font-bold text-brand-navy sm:text-base">{item.title}</p>
                  <p className="mt-1.5 text-sm text-ink/65">{item.copy}</p>
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-xl text-base font-semibold text-ink/70">{WHO_ITS_FOR.line}</p>
        </div>
      </div>
    </Section>
  );
}
