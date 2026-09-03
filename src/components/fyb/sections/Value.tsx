import { VALUE } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

export default function Value() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {VALUE.headline}
      </h2>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {VALUE.items.map((item, i) => (
          <Reveal
            key={item.title}
            delayMs={i * 60}
            className="rounded-2xl border border-ink/8 bg-paper-alt p-6"
          >
            <h3 className="text-base font-bold text-brand-navy">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
