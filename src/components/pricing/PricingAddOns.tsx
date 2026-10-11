import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ADDONS_SECTION, ADDON_CATEGORIES } from "../../content/pricing";

export default function PricingAddOns() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">{ADDONS_SECTION.headline}</h2>
      <p className="mt-2 max-w-2xl text-sm text-ink/65 sm:text-base">{ADDONS_SECTION.sub}</p>

      <div className="mt-6 space-y-3">
        {ADDON_CATEGORIES.map((category) => {
          const isOpen = openIds.has(category.id);
          const panelId = `addon-panel-${category.id}`;
          const buttonId = `addon-button-${category.id}`;

          return (
            <div key={category.id} className="overflow-hidden rounded-2xl border border-ink/10">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(category.id)}
                  className="flex w-full items-center justify-between gap-4 bg-paper-alt px-5 py-4 text-left transition hover:bg-paper-alt/70"
                >
                  <span>
                    <span className="block text-sm font-bold text-brand-navy sm:text-base">{category.name}</span>
                    <span className="block text-xs text-ink/60">{category.tagline}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-brand-blue transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                <ul className="divide-y divide-ink/8 border-t border-ink/8">
                  {category.items.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">{item.name}</p>
                        <p className="mt-0.5 text-sm text-ink/60">{item.description}</p>
                      </div>
                      <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-brand-blue">
                        {item.priceLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-ink/60">{ADDONS_SECTION.footnote}</p>
    </div>
  );
}
