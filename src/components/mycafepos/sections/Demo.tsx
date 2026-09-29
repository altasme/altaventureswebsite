import { DEMO } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";
import PosDemo from "../PosDemo";
import AccessButton from "../AccessButton";

export default function Demo() {
  return (
    <section id="demo" className="mcp-section mcp-dark" style={{ background: "var(--mcp-dark)", color: "var(--mcp-dark-foreground)" }}>
      <div className="mcp-container">
        <SectionTitle eyebrow={DEMO.eyebrow} title={DEMO.headline} copy={DEMO.copy} />
        <div className="mt-10">
          <PosDemo />
          <p className="mcp-muted mt-4 text-center text-xs">{DEMO.note}</p>
        </div>
        <div className="mt-8 text-center">
          <AccessButton label={DEMO.cta} location="after_demo" />
        </div>
      </div>
    </section>
  );
}
