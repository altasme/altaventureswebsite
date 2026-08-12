import { PROJECT_ORDER, PROJECTS, SELECTED_WORK } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import { track } from "../../lib/analytics";
import Section from "../ui/Section";
import Tag from "../ui/Tag";

export default function SelectedWork() {
  const { openCaseStudy } = useModals();

  const handleOpen = (id: (typeof PROJECT_ORDER)[number]) => {
    track("case_study_open", { project: id });
    openCaseStudy(id);
  };

  return (
    <Section id="work" tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {SELECTED_WORK.headline}
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PROJECT_ORDER.map((id) => {
          const project = PROJECTS[id];
          return (
            <div key={id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="aspect-[16/10] w-full overflow-hidden border-b border-ink/10 bg-paper-alt">
                <img
                  src={project.image}
                  alt={`${project.name}, ${project.category} (placeholder, pending real screenshot)`}
                  width={1200}
                  height={750}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold tracking-wide text-brand-blue">
                  {project.category}
                </p>
                <h3 className="mt-1 text-lg font-bold text-ink">{project.name}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/60">{project.shortDescription}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpen(id)}
                  className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-brand-blue hover:underline"
                >
                  {SELECTED_WORK.viewProjectLabel} &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
