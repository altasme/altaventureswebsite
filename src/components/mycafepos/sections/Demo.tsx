import { DEMO, MEDIA } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";
import MediaPlaceholder from "../MediaPlaceholder";
import AccessButton from "../AccessButton";

export default function Demo() {
  return (
    <section id="demo" className="mcp-section mcp-dark" style={{ background: "var(--mcp-dark)", color: "var(--mcp-dark-foreground)" }}>
      <div className="mcp-container">
        <SectionTitle eyebrow={DEMO.eyebrow} title={DEMO.headline} copy={DEMO.copy} />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
          <MediaPlaceholder {...MEDIA.demo} />
          <ol className="mcp-step-list">
            {DEMO.steps.map((step, i) => (
              <li key={step}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-8">
          <AccessButton label={DEMO.cta} location="after_demo" />
        </div>
      </div>
    </section>
  );
}
