// Shared decorative vector shapes for /foryourbusiness's section
// whitespace (every section except the hero, Final CTA, and footer, per
// the operator's explicit scope). Crisp, low-opacity outlined/filled
// geometric shapes echoing the brand's own "A" mark device (CLAUDE.md
// §11.1) — deliberately not the blurred-glow/grid pattern this project's
// own design history (§18) already flagged as a recognizable
// AI-generated-template tell. `variant` rotates which shapes/positions
// render so adjacent sections don't look identical. Render inside a
// `relative` wrapper around the section's content (not Section.tsx
// itself, which has no overflow-hidden/relative wrapper to hook into) so
// shapes stay confined to that section and never bleed into the next one.

type Variant = 1 | 2 | 3;

type ShapeDef = { Shape: (props: { className: string }) => JSX.Element; className: string };

function Triangle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      <path d="M100 10L190 180H10L100 10Z" stroke="currentColor" strokeWidth="6" />
    </svg>
  );
}

function Circle({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 160" fill="none">
      <circle cx="80" cy="80" r="76" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}

function DotGrid({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="currentColor">
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="2.5" />)
      )}
    </svg>
  );
}

const LAYOUTS: Record<Variant, ShapeDef[]> = {
  1: [
    { Shape: Triangle, className: "absolute -right-16 -top-20 h-64 w-64 text-brand-blue/[0.07] sm:h-80 sm:w-80" },
    { Shape: Circle, className: "absolute -bottom-10 -left-10 h-40 w-40 text-brand-navy/[0.06] sm:h-56 sm:w-56" },
    { Shape: DotGrid, className: "absolute bottom-24 right-8 hidden h-24 w-24 text-brand-blue/[0.12] sm:block" },
  ],
  2: [
    { Shape: Circle, className: "absolute -left-16 -top-16 h-56 w-56 text-brand-blue/[0.06] sm:h-72 sm:w-72" },
    { Shape: DotGrid, className: "absolute right-10 top-10 hidden h-20 w-20 text-brand-navy/[0.1] sm:block" },
    { Shape: Triangle, className: "absolute -bottom-16 -right-12 h-52 w-52 rotate-180 text-brand-navy/[0.06] sm:h-64 sm:w-64" },
  ],
  3: [
    { Shape: DotGrid, className: "absolute left-6 top-8 hidden h-20 w-20 text-brand-blue/[0.1] sm:block" },
    { Shape: Triangle, className: "absolute -bottom-14 -left-14 h-56 w-56 text-brand-blue/[0.06] sm:h-72 sm:w-72" },
    { Shape: Circle, className: "absolute -right-12 -top-12 h-44 w-44 text-brand-navy/[0.06] sm:h-60 sm:w-60" },
  ],
};

export default function DecorativeShapes({ variant = 1 }: { variant?: Variant }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {LAYOUTS[variant].map(({ Shape, className }, i) => (
        <Shape key={i} className={className} />
      ))}
    </div>
  );
}
