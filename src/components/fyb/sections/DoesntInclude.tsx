import { DOESNT_INCLUDE } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-ink/35" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DoesntInclude() {
  return (
    <Section tone="light">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {DOESNT_INCLUDE.headline}
      </h2>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">{DOESNT_INCLUDE.body}</p>
      <p className="mt-3 max-w-xl text-base font-semibold text-brand-navy">{DOESNT_INCLUDE.scopeLine}</p>

      <ul className="mt-6 max-w-md space-y-3 rounded-2xl border border-ink/10 bg-paper-alt p-6">
        {DOESNT_INCLUDE.notIncluded.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-ink/65 sm:text-base">
            <XIcon />
            {item}
          </li>
        ))}
      </ul>

      <p className="mt-6 max-w-xl text-base font-medium text-ink/70">{DOESNT_INCLUDE.closing}</p>
    </Section>
  );
}
