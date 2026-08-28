import { WHO_ITS_FOR } from "../../../content/offer";
import Section from "../../ui/Section";
import CTAButton from "../../ui/CTAButton";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-brand-blue" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-ink/30" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhoItsFor({ onOpenQualifier }: { onOpenQualifier: () => void }) {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHO_ITS_FOR.headline}
      </h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-blue/20 bg-brand-blue/5 p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">For you if</p>
          <ul className="mt-4 space-y-3">
            {WHO_ITS_FOR.forYou.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink/80 sm:text-base">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink/10 bg-paper-alt p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink/50">Not for you if</p>
          <ul className="mt-4 space-y-3">
            {WHO_ITS_FOR.notForYou.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-ink/60 sm:text-base">
                <XIcon />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-6 text-base font-medium text-ink/70">{WHO_ITS_FOR.close}</p>

      <div className="mt-6">
        <CTAButton label={WHO_ITS_FOR.cta} section="who-its-for" onClick={onOpenQualifier} />
      </div>
    </Section>
  );
}
