import { useState } from "react";
import { ZoomIn, X } from "lucide-react";
import { TESTIMONIALS } from "../../content/site";
import { useModalA11y } from "../../lib/useModalA11y";
import Section from "../ui/Section";
import Reveal from "../offer/Reveal";

function Lightbox({ item, onClose }: { item: { src: string; alt: string }; onClose: () => void }) {
  const containerRef = useModalA11y(true, onClose);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={containerRef} role="dialog" aria-modal="true" aria-label={item.alt} className="relative max-h-full max-w-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
        <img src={item.src} alt={item.alt} className="max-h-[80vh] w-auto rounded-xl object-contain shadow-2xl" />
      </div>
    </div>
  );
}

const TONE_TEXT = {
  light: { headline: "text-brand-navy", sub: "text-ink/65", placeholder: "border-ink/15 bg-paper-alt text-ink/60" },
  alt: { headline: "text-brand-navy", sub: "text-ink/65", placeholder: "border-ink/15 bg-white text-ink/60" },
  dark: { headline: "text-white", sub: "text-white/70", placeholder: "border-white/20 bg-white/5 text-white/60" },
} as const;

export default function Testimonials({ tone = "light" }: { tone?: "light" | "alt" | "dark" }) {
  const [selected, setSelected] = useState<number | null>(null);
  const hasItems = TESTIMONIALS.items.length > 0;
  const text = TONE_TEXT[tone];

  return (
    <Section tone={tone}>
      <Reveal>
        <h2 className={`max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl ${text.headline}`}>
          {TESTIMONIALS.headline}
        </h2>
        <p className={`mt-4 max-w-2xl text-base ${text.sub}`}>{TESTIMONIALS.sub}</p>
      </Reveal>

      {hasItems ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.items.map((item, i) => (
            <Reveal key={item.src} delayMs={i * 70}>
              <button
                type="button"
                onClick={() => setSelected(i)}
                className="group relative block w-full overflow-hidden rounded-2xl shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <img src={item.src} alt={item.alt} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition group-hover:bg-ink/30">
                  <ZoomIn
                    className="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      ) : (
        // Honest placeholder, per the site-wide real-work-only guardrail
        // (§16): no fabricated testimonial photos or quotes. Replace this
        // block the moment real client photos are supplied, by adding
        // entries to TESTIMONIALS.items in content/site.ts.
        <Reveal className={`mt-10 rounded-2xl border border-dashed px-6 py-12 text-center ${text.placeholder}`}>
          <p className="text-sm">Real client testimonials are on their way. Check back soon.</p>
        </Reveal>
      )}

      {selected !== null && TESTIMONIALS.items[selected] && (
        <Lightbox item={TESTIMONIALS.items[selected]} onClose={() => setSelected(null)} />
      )}
    </Section>
  );
}
