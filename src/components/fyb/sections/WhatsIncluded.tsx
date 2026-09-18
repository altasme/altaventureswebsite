import { WHATS_INCLUDED } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0 text-brand-blue" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhatsIncluded() {
  return (
    <Section tone="alt">
      <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        {WHATS_INCLUDED.headline}
      </h2>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {WHATS_INCLUDED.items.map((item, i) => (
          <li key={item}>
            <Reveal
              delayMs={i * 60}
              className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4"
            >
              <CheckIcon />
              <span className="text-sm text-ink/80 sm:text-base">{item}</span>
            </Reveal>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-xl rounded-2xl border border-ink/10 bg-white p-5 text-sm leading-relaxed text-ink/65">
        {WHATS_INCLUDED.scopeLine}
      </p>
    </Section>
  );
}
