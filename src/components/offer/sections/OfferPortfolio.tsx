import { PORTFOLIO_BY_ID } from "../../../content/portfolio";
import { OFFER_PORTFOLIO } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";
import Tag from "../../ui/Tag";
import CTAButton from "../../ui/CTAButton";

export default function OfferPortfolio({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section id="offer-portfolio" tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {OFFER_PORTFOLIO.headline}
      </h2>
      <p className="mt-3 max-w-md text-base text-ink/60">{OFFER_PORTFOLIO.sub}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {OFFER_PORTFOLIO.projectIds.map((id) => {
          const project = PORTFOLIO_BY_ID[id];
          return (
            <a
              key={id}
              href={project.url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => track("portfolio_view", { project: id })}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="aspect-[16/10] w-full overflow-hidden border-b border-ink/10 bg-paper-alt">
                <img
                  src={`/images/projects/${project.id}.jpg`}
                  alt={`${project.name}, ${project.category}`}
                  width={1200}
                  height={750}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold tracking-wide text-brand-blue">{project.category}</p>
                <h3 className="mt-1 text-lg font-bold text-ink">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/60">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-blue group-hover:underline">
                  View Website &rarr;
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <p className="mt-10 max-w-md text-lg font-semibold text-brand-navy">{OFFER_PORTFOLIO.closer}</p>

      <div className="mt-6">
        <CTAButton label={OFFER_PORTFOLIO.cta} section="portfolio" onClick={onOpenQualifier} />
      </div>
    </Section>
  );
}
