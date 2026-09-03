import { PORTFOLIO_BY_ID } from "../../../content/portfolio";
import { FYB_PORTFOLIO } from "../../../content/foryourbusiness";
import { track } from "../../../lib/analytics";
import Section from "../../ui/Section";
import Tag from "../../ui/Tag";
import Reveal from "../../offer/Reveal";

function ProjectCard({ id }: { id: string }) {
  const project = PORTFOLIO_BY_ID[id];
  return (
    <a
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
}

export default function FybPortfolio({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <Section id="fyb-portfolio" tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {FYB_PORTFOLIO.headline}
      </h2>
      <p className="mt-3 max-w-md text-base text-ink/60">{FYB_PORTFOLIO.sub}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FYB_PORTFOLIO.primaryIds.map((id, i) => (
          <Reveal key={id} delayMs={i * 70}>
            <ProjectCard id={id} />
          </Reveal>
        ))}
      </div>

      {FYB_PORTFOLIO.advancedIds.length > 0 && (
        <div className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/40">
            {FYB_PORTFOLIO.advancedLabel}
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {FYB_PORTFOLIO.advancedIds.map((id, i) => (
              <Reveal key={id} delayMs={i * 70}>
                <ProjectCard id={id} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <button
          type="button"
          onClick={onOpenContact}
          className="text-sm font-semibold text-brand-blue hover:underline"
        >
          {FYB_PORTFOLIO.cta}
        </button>
      </div>
    </Section>
  );
}
