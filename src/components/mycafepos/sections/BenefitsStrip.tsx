import { BarChart3, Boxes, Printer, ShoppingBag } from "lucide-react";
import { BENEFITS, BENEFITS_LINE } from "../../../content/mycafepos";

const ICONS = [ShoppingBag, Printer, Boxes, BarChart3];

export default function BenefitsStrip() {
  return (
    <section className="border-b py-10" style={{ borderColor: "var(--mcp-border)", background: "var(--mcp-surface)" }}>
      <div className="mcp-container">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border lg:grid-cols-4" style={{ borderColor: "var(--mcp-border)", background: "var(--mcp-border)" }}>
          {BENEFITS.map((benefit, i) => {
            const Icon = ICONS[i];
            return (
              <div key={benefit.title} className="p-5 sm:p-7" style={{ background: "var(--mcp-surface)" }}>
                <Icon size={24} className="mb-4" style={{ color: "var(--mcp-accent)" }} />
                <p className="font-bold" style={{ fontFamily: "var(--mcp-font-heading)" }}>
                  {benefit.title}
                </p>
                <p className="mcp-muted mt-1 text-sm">{benefit.copy}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-7 text-center text-lg font-semibold" style={{ fontFamily: "var(--mcp-font-heading)" }}>
          {BENEFITS_LINE}
        </p>
      </div>
    </section>
  );
}
