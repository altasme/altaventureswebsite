import { PORTFOLIO_BY_ID } from "../../../content/portfolio";
import { OFFER_PORTFOLIO } from "../../../content/offer";
import { track } from "../../../lib/analytics";
import OfferSection from "../ui/OfferSection";
import Eyebrow from "../ui/Eyebrow";
import Tag from "../../ui/Tag";
import OfferCTAButton from "../ui/OfferCTAButton";

export default function OfferPortfolio({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <OfferSection id="offer-portfolio" shade="navy">
      <Eyebrow>{OFFER_PORTFOLIO.eyebrow}</Eyebrow>
      <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">{OFFER_PORTFOLIO.headline}</h2>
      <p className="mt-3 max-w-md text-base text-white/60">{OFFER_PORTFOLIO.sub}</p>

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
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-white/20"
            >
              <div className="aspect-[16/10] w-full overflow-hidden border-b border-white/10 bg-brand-navy-deep">
                <img
                  src={`/images/projects/${project.id}.jpg`}
                  alt={`${project.name}, ${project.category}`}
                  width={1200}
                  height={750}
                  loading="lazy"
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold tracking-wide text-[#5fa2ff]">{project.category}</p>
                <h3 className="mt-1 text-lg font-bold text-white">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm text-white/60">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Tag key={tag} tone="dark">
                      {tag}
                    </Tag>
                  ))}
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#5fa2ff] group-hover:underline">
                  View Website &rarr;
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <p className="mt-10 max-w-md text-lg font-semibold text-white">{OFFER_PORTFOLIO.closer}</p>

      <div className="mt-6">
        <OfferCTAButton
          label={OFFER_PORTFOLIO.cta}
          section="portfolio"
          onClick={() => {
            track("cta_click", { label: OFFER_PORTFOLIO.cta, section: "portfolio" });
            onOpenQualifier();
          }}
        />
      </div>
    </OfferSection>
  );
}
