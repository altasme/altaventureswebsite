import { PACKAGE_REVIEW } from "../../../content/foryourbusiness";
import { CheckIcon, StepHeader } from "./shared";

export default function PackageStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <StepHeader stepLabel={PACKAGE_REVIEW.stepLabel} headline={PACKAGE_REVIEW.headline} />

      <div className="rounded-2xl border border-ink/10 bg-paper-alt p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{PACKAGE_REVIEW.summaryTitle}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-brand-navy">{PACKAGE_REVIEW.price}</span>
          <span className="text-xs font-semibold text-ink/60">{PACKAGE_REVIEW.priceNote}</span>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {PACKAGE_REVIEW.items.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-ink/70">
              <CheckIcon />
              {item}
            </li>
          ))}
        </ul>
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
          {PACKAGE_REVIEW.cta}
        </button>
      </div>
    </div>
  );
}
