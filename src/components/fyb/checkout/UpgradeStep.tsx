import { UPGRADES } from "../../../content/foryourbusiness";
import type { FybUpgradeType } from "../../../content/foryourbusiness";
import { StepHeader } from "./shared";

type Card = {
  id: FybUpgradeType;
  title: string;
  price?: string;
  body?: string;
  annualNote?: string;
  items?: readonly string[];
  note?: string;
  firstYearTotal: string;
};

const CARDS: Card[] = [UPGRADES.none, UPGRADES.domainHosting, UPGRADES.businessTools];

export default function UpgradeStep({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: FybUpgradeType;
  onSelect: (id: FybUpgradeType) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <StepHeader stepLabel={UPGRADES.stepLabel} headline={UPGRADES.headline} sub={UPGRADES.sub} />

      <div role="radiogroup" aria-label="Optional upgrade" className="space-y-4">
        {CARDS.map((card) => {
          const isSelected = selected === card.id;
          return (
            <button
              key={card.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(card.id)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                isSelected
                  ? "border-brand-blue bg-brand-blue/5 ring-2 ring-brand-blue/20"
                  : "border-ink/10 bg-white hover:border-brand-blue/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-brand-navy">{card.title}</p>
                  {card.price && <p className="mt-0.5 text-sm font-semibold text-brand-blue">{card.price}</p>}
                </div>
                <span
                  aria-hidden="true"
                  className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                    isSelected ? "border-brand-blue bg-brand-blue" : "border-ink/20"
                  }`}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              </div>
              {card.body && <p className="mt-2 text-sm text-ink/60">{card.body}</p>}
              {card.annualNote && <p className="mt-1 text-xs text-ink/50">{card.annualNote}</p>}
              {card.items && (
                <ul className="mt-3 space-y-1">
                  {card.items.map((item) => (
                    <li key={item} className="text-sm text-ink/70">
                      &bull; {item}
                    </li>
                  ))}
                </ul>
              )}
              {card.note && <p className="mt-2 text-xs italic text-ink/50">{card.note}</p>}
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink/50">
                First-year total: <span className="text-brand-navy">{card.firstYearTotal}</span>
              </p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-ink/60 hover:text-ink">
          &larr; Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-4 text-base font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc]"
        >
          {UPGRADES.cta}
        </button>
      </div>
    </div>
  );
}
