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

export default function Testimonials() {
  const [selected, setSelected] = useState<number | null>(null);
  const hasItems = TESTIMONIALS.items.length > 0;

  return (
    <Section tone="light">
      <Reveal>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          {TESTIMONIALS.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink/65">{TESTIMONIALS.sub}</p>
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
        <Reveal className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-paper-alt px-6 py-12 text-center">
          <p className="text-sm text-ink/60">Real client testimonials are on their way. Check back soon.</p>
        </Reveal>
      )}

      {selected !== null && TESTIMONIALS.items[selected] && (
        <Lightbox item={TESTIMONIALS.items[selected]} onClose={() => setSelected(null)} />
      )}
    </Section>
  );
}
