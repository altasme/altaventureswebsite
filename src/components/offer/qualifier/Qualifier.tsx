import { useRef, useState } from "react";
import { useModalA11y } from "../../../lib/useModalA11y";
import { track } from "../../../lib/analytics";
import { EMPTY_QUALIFIER_ANSWERS, QUALIFIER, type QualifierAnswers } from "../../../content/offer";
import ChatHandoff from "./ChatHandoff";

type Props = { open: boolean; onClose: () => void };

const DATA_STEPS = 3;
const HANDOFF_STEP = DATA_STEPS;

const INPUT_CLASSES =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
        active
          ? "border-brand-blue bg-brand-blue text-white"
          : "border-ink/15 text-ink/70 hover:border-brand-blue hover:text-brand-navy"
      }`}
    >
      {children}
    </button>
  );
}

export default function Qualifier({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QualifierAnswers>(EMPTY_QUALIFIER_ANSWERS);
  const hasStarted = useRef(false);

  const handleClose = () => {
    onClose();
    // Reset so a reopened qualifier starts fresh rather than resuming a
    // half-finished session. Escape/backdrop/close-button all route through
    // this (not the raw `onClose` prop) so the reset can't be bypassed.
    setStep(0);
    setAnswers(EMPTY_QUALIFIER_ANSWERS);
    hasStarted.current = false;
  };

  const containerRef = useModalA11y(open, handleClose);

  if (!open) return null;

  const markStarted = () => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      track("qualifier_start");
    }
  };

  const goNext = () => {
    const next = step + 1;
    setStep(next);
    if (next === HANDOFF_STEP) track("qualifier_complete");
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const toggleObjective = (item: string) => {
    markStarted();
    setAnswers((a) => ({
      ...a,
      objectives: a.objectives.includes(item) ? a.objectives.filter((o) => o !== item) : [...a.objectives, item],
    }));
  };

  const selectSingle = (key: "businessType" | "yearsInBusiness", value: string) => {
    markStarted();
    setAnswers((a) => ({ ...a, [key]: a[key] === value ? "" : value }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="qualifier-heading"
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          {step < HANDOFF_STEP ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                Step {step + 1} of {DATA_STEPS}
              </p>
              <h2 id="qualifier-heading" className="mt-1 text-xl font-bold text-brand-navy sm:text-2xl">
                {step === 0 ? QUALIFIER.intro.headline : "Tell Us a Bit More"}
              </h2>
              {step === 0 && <p className="mt-2 text-sm text-ink/70">{QUALIFIER.intro.sub}</p>}
            </div>
          ) : (
            <h2 id="qualifier-heading" className="sr-only">
              {QUALIFIER.handoff.headline}
            </h2>
          )}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-2 text-ink/50 transition hover:bg-paper-alt hover:text-ink"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50" htmlFor="q-name">
                Your name (optional)
              </label>
              <input
                id="q-name"
                type="text"
                value={answers.name}
                onChange={(e) => {
                  markStarted();
                  setAnswers((a) => ({ ...a, name: e.target.value }));
                }}
                className={INPUT_CLASSES}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50" htmlFor="q-business">
                Business name (optional)
              </label>
              <input
                id="q-business"
                type="text"
                value={answers.businessName}
                onChange={(e) => {
                  markStarted();
                  setAnswers((a) => ({ ...a, businessName: e.target.value }));
                }}
                className={INPUT_CLASSES}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">What kind of business is it?</p>
              <div className="flex flex-wrap gap-2">
                {QUALIFIER.businessTypes.map((type) => (
                  <Chip key={type} active={answers.businessType === type} onClick={() => selectSingle("businessType", type)}>
                    {type}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">How long have you been in business?</p>
              <div className="flex flex-wrap gap-2">
                {QUALIFIER.yearsInBusiness.map((years) => (
                  <Chip key={years} active={answers.yearsInBusiness === years} onClick={() => selectSingle("yearsInBusiness", years)}>
                    {years}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">What do you want your website to do?</p>
            <p className="mb-3 text-xs text-ink/50">Pick as many as apply.</p>
            <div className="flex flex-wrap gap-2">
              {QUALIFIER.objectives.map((item) => (
                <Chip key={item} active={answers.objectives.includes(item)} onClick={() => toggleObjective(item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {step === HANDOFF_STEP && <ChatHandoff answers={answers} />}

        {step < HANDOFF_STEP ? (
          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button type="button" onClick={goBack} className="text-sm font-semibold text-ink/60 hover:text-ink">
                Back
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={goNext}
              className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc]"
            >
              {step === DATA_STEPS - 1 ? "Continue to Chat" : "Next"}
            </button>
          </div>
        ) : (
          <button type="button" onClick={goBack} className="mt-6 text-sm font-semibold text-ink/60 hover:text-ink">
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
