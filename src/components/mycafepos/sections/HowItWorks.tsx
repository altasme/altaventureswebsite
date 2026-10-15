import { HOW_IT_WORKS } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";
import AccessButton from "../AccessButton";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mcp-section" style={{ background: "var(--mcp-surface)" }}>
      <div className="mcp-container">
        <SectionTitle title={HOW_IT_WORKS.headline} />
        <div className="mt-12 grid gap-0 md:grid-cols-4">
          {HOW_IT_WORKS.steps.map((step) => (
            <div className="mcp-process-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <AccessButton location="after_features" />
        </div>
      </div>
    </section>
  );
}
