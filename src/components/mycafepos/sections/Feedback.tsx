import { Lightbulb } from "lucide-react";
import { FEEDBACK, MEDIA } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";
import MediaPlaceholder from "../MediaPlaceholder";

export default function Feedback() {
  return (
    <section className="mcp-section">
      <div className="mcp-container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionTitle title={FEEDBACK.headline} copy={FEEDBACK.copy} />
          <div className="mcp-muted mt-8 flex items-start gap-3 rounded-md border p-4 text-sm" style={{ borderColor: "var(--mcp-border)", background: "var(--mcp-surface)" }}>
            <Lightbulb size={20} className="mt-0.5 shrink-0" style={{ color: "var(--mcp-accent)" }} />
            {FEEDBACK.note}
          </div>
        </div>
        <MediaPlaceholder {...MEDIA.community} />
      </div>
    </section>
  );
}
