import { CREDIBILITY_STRIP } from "../../content/site";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";

function scrollToWork() {
  track("cta_click", { label: CREDIBILITY_STRIP.cta, section: "credibility-strip" });
  document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
}

export default function CredibilityStrip() {
  return (
    <Section tone="light" className="!py-14 sm:!py-16">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
          {CREDIBILITY_STRIP.headline}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-base text-ink/60">{CREDIBILITY_STRIP.sub}</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {CREDIBILITY_STRIP.items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-ink/8 bg-paper-alt px-4 py-6 text-center"
          >
            <p className="text-lg font-extrabold tracking-tight text-brand-navy">{item.name}</p>
            <p className="mt-1 text-xs text-ink/50">{item.category}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={scrollToWork}
          className="text-sm font-semibold text-brand-blue hover:underline"
        >
          {CREDIBILITY_STRIP.cta} &rarr;
        </button>
      </div>
    </Section>
  );
}
