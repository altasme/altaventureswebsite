import { CircleHelp, PackageX, Shuffle } from "lucide-react";
import { PROBLEM } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";

const ICONS = [Shuffle, CircleHelp, PackageX];

export default function ProblemSection() {
  return (
    <section className="mcp-section">
      <div className="mcp-container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionTitle title={PROBLEM.headline} copy={PROBLEM.copy} />
        <div className="grid gap-4">
          {PROBLEM.rows.map((row, i) => {
            const Icon = ICONS[i];
            return (
              <div className="mcp-problem-row" key={row.title}>
                <span>
                  <Icon />
                </span>
                <div>
                  <h3>{row.title}</h3>
                  <p>{row.copy}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
