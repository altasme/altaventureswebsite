import type { ReactNode } from "react";

// Shared across the 4-step checkout wizard (Questionnaire, Package,
// Upgrade, Payment) so each step's markup stays consistent without each
// one redefining the same input/label styling.

export const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

export function Field({
  label,
  htmlFor,
  hint,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/60">
        {label} {optional && <span className="normal-case text-ink/30">(optional)</span>}
      </label>
      {hint && <p className="mb-1.5 text-xs text-ink/50">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function StepHeader({ stepLabel, headline, sub }: { stepLabel: string; headline: string; sub?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{stepLabel}</p>
      <h1 className="mt-1 text-2xl font-bold text-brand-navy sm:text-3xl">{headline}</h1>
      {sub && <p className="mt-2 text-sm text-ink/60">{sub}</p>}
    </div>
  );
}

export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={`shrink-0 text-brand-blue ${className}`} aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function money(pesos: number): string {
  return `₱${pesos.toLocaleString("en-PH")}`;
}
