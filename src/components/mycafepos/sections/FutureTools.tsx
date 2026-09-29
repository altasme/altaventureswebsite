import { CreditCard, MonitorSmartphone, Store, Users } from "lucide-react";
import { FUTURE_TOOLS } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";

const ICONS = [Store, MonitorSmartphone, Users, CreditCard];

export default function FutureTools() {
  return (
    <section className="mcp-section border-y" style={{ borderColor: "var(--mcp-border)", background: "var(--mcp-surface)" }}>
      <div className="mcp-container">
        <SectionTitle eyebrow={FUTURE_TOOLS.eyebrow} title={FUTURE_TOOLS.headline} copy={FUTURE_TOOLS.copy} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FUTURE_TOOLS.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <article className="mcp-future-card" key={item.title}>
                <Icon />
                <span>{FUTURE_TOOLS.badge}</span>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
