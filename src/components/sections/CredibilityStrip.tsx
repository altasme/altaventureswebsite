import { CREDIBILITY_STRIP } from "../../content/site";
import { PORTFOLIO_BY_ID } from "../../content/portfolio";
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
        <p className="mx-auto mt-3 max-w-sm text-base text-ink/60">{CREDIBILITY_STRIP.sub}</p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {CREDIBILITY_STRIP.featuredIds.map((id) => {
          const project = PORTFOLIO_BY_ID[id];
          return (
            <div
              key={id}
              className="rounded-2xl border border-ink/8 bg-paper-alt px-4 py-6 text-center"
            >
              <p className="text-lg font-extrabold tracking-tight text-brand-navy">
                {project.name.toUpperCase()}
              </p>
              <p className="mt-1 text-xs text-ink/50">{project.category}</p>
            </div>
          );
        })}
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
