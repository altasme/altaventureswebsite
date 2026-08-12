import { useModals } from "../../lib/modalContext";
import { useModalA11y } from "../../lib/useModalA11y";
import { PROJECTS } from "../../content/site";
import Tag from "../ui/Tag";
import CTAButton from "../ui/CTAButton";

export default function CaseStudyModal() {
  const { caseStudyProject, closeCaseStudy, openContactModal } = useModals();
  const isOpen = caseStudyProject !== null;
  const containerRef = useModalA11y(isOpen, closeCaseStudy);

  if (!isOpen || !caseStudyProject) return null;

  const project = PROJECTS[caseStudyProject];

  const handleCta = () => {
    closeCaseStudy();
    openContactModal(`case-study-${project.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-ink/60 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeCaseStudy();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-study-heading"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-10"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-brand-blue">
              {project.category}
            </p>
            <h2 id="case-study-heading" className="mt-1 text-2xl font-bold text-brand-navy sm:text-3xl">
              {project.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCaseStudy}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-ink/50 transition hover:bg-paper-alt hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-paper-alt">
          <img
            src={project.image}
            alt={`${project.name}, ${project.category} (placeholder, pending real screenshot)`}
            width={1200}
            height={750}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <p className="mb-8 text-base leading-relaxed text-ink/80">{project.overview}</p>

        <div className="mb-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink/50">
              What We Built
            </h3>
            <ul className="space-y-2">
              {project.whatWeBuilt.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink/80">
                  <span className="mt-0.5 text-brand-blue">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink/50">
                Project Type
              </h3>
              <p className="text-sm text-ink/80">{project.projectType}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink/50">
                Business Value
              </h3>
              <p className="text-sm text-ink/80">{project.businessValue}</p>
            </div>
          </div>
        </div>

        {project.futureDevelopment && (
          <div className="mb-8 rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-5">
            <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-brand-blue">
              Future Development <span className="font-normal normal-case text-brand-blue/70">(planned, not yet built)</span>
            </h3>
            <ul className="mt-3 space-y-2">
              {project.futureDevelopment.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink/70">
                  <span className="mt-0.5 text-brand-blue/60">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <CTAButton
          label={project.cta}
          section={`case-study-${project.id}`}
          onClick={handleCta}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
