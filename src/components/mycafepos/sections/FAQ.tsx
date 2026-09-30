import { useState } from "react";
import { CircleAlert } from "lucide-react";
import { FAQ as FAQ_CONTENT } from "../../../content/mycafepos";
import SectionTitle from "../SectionTitle";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mcp-section" style={{ background: "var(--mcp-surface)" }}>
      <div className="mcp-container grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <SectionTitle title={FAQ_CONTENT.headline} />
          <div className="mcp-muted mt-7 flex gap-3 text-sm leading-6">
            <CircleAlert size={20} className="mt-0.5 shrink-0" style={{ color: "var(--mcp-accent)" }} />
            {FAQ_CONTENT.note}
          </div>
        </div>

        <div className="border-t" style={{ borderColor: "var(--mcp-border)" }}>
          {FAQ_CONTENT.items.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `mcp-faq-panel-${i}`;
            const buttonId = `mcp-faq-button-${i}`;
            return (
              <div key={item.q} className="border-b" style={{ borderColor: "var(--mcp-border)" }}>
                <h3 className="!text-base">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold"
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-xl transition-transform"
                      style={{ color: "var(--mcp-accent)", transform: isOpen ? "rotate(45deg)" : undefined }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="mcp-muted max-w-2xl pb-5 leading-7">
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
