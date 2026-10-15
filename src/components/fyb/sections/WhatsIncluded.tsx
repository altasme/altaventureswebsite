import { WHATS_INCLUDED } from "../../../content/foryourbusiness";
import Section from "../../ui/Section";
import Reveal from "../../offer/Reveal";
import DecorativeShapes from "../DecorativeShapes";

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-brand-blue transition-colors duration-200 group-hover:text-white" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhatsIncluded() {
  return (
    <Section tone="alt">
      <div className="relative">
        <DecorativeShapes variant={1} />

        <div className="relative">
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
            {WHATS_INCLUDED.headline}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">{WHATS_INCLUDED.intro}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {WHATS_INCLUDED.items.map((item, i) => (
              <li key={item.title} className="group">
                <Reveal
                  delayMs={i * 60}
                  className="flex h-full items-start gap-3 rounded-2xl border border-ink/8 bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/10"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 transition-colors duration-200 group-hover:bg-brand-blue">
                    <CheckIcon />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink sm:text-base">{item.title}</p>
                    <p className="mt-1 text-sm text-ink/70">{item.copy}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-8 max-w-xl rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-sm font-semibold text-ink">{WHATS_INCLUDED.closing.lead}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/65">{WHATS_INCLUDED.closing.body}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
