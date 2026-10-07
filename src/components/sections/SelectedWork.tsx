import { SELECTED_WORK } from "../../content/site";
import { ONGOING, PORTFOLIO, type ProjectTier } from "../../content/portfolio";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import Tag from "../ui/Tag";
import Reveal from "../offer/Reveal";

const TIER_LABEL: Record<ProjectTier, string> = {
  system: "Business System",
  site: "Website",
  engine: "In-house Engine",
};

export default function SelectedWork() {
  const { openCaseStudy } = useModals();

  const handleViewDetails = (id: string) => {
    track("case_study_open", { project: id });
    openCaseStudy(id);
  };

  return (
    <Section id="work" tone="alt">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {SELECTED_WORK.headline}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PORTFOLIO.map((project, i) => (
          // Delay capped at a 6-item cycle (not i * delay unbounded) so a
          // 15-project grid doesn't queue a long tail of pop-ins the first
          // time it scrolls into view.
          <Reveal key={project.id} delayMs={(i % 6) * 70}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
              {project.viewable && (
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
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold tracking-wide text-brand-blue">{project.category}</p>
                </div>
                <h3 className="mt-1 text-lg font-bold text-ink">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/60">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {!project.tags.includes(TIER_LABEL[project.tier]) && <Tag>{TIER_LABEL[project.tier]}</Tag>}
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                {project.viewable && project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-blue hover:underline"
                  >
                    {SELECTED_WORK.viewWebsiteLabel} &rarr;
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleViewDetails(project.id)}
                    className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-blue hover:underline"
                  >
                    {SELECTED_WORK.viewDetailsLabel} &rarr;
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-10 text-sm text-ink/60">
        <span className="font-semibold text-ink/70">{SELECTED_WORK.studioLine}</span>{" "}
        {ONGOING.map((project, i) => (
          <span key={project.id}>
            {project.name}
            {i < ONGOING.length - 1 ? ", " : ""}
          </span>
        ))}
        {" "}
        <span className="italic">(in progress)</span>
      </p>
    </Section>
  );
}
