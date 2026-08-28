import { WHO_ITS_FOR } from "../../../content/offer";
import Section from "../../ui/Section";

export default function WhoItsFor() {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHO_ITS_FOR.headline}
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WHO_ITS_FOR.cards.map((card) => (
          <div key={card.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{card.copy}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
