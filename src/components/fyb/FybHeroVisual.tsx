// Placeholder for the hero visual. Per CLAUDEforyourbusiness.md spec §8,
// this should be a real device composition (one dominant desktop shot, one
// or two mobile shots, real Altaventures projects, clean device framing)
// once someone builds/captures it. Until then this renders a clearly
// labeled placeholder instead of a fabricated mockup, per the site-wide
// no-fabricated-screenshots guardrail (CLAUDE.md §16).
export default function FybHeroVisual() {
  return (
    <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-white/25 bg-white/5 p-8 text-center">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white/40" aria-hidden="true">
        <rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-sm font-semibold text-white/70">Hero visual placeholder</p>
      <p className="max-w-xs text-xs leading-relaxed text-white/45">
        Real device composition: one dominant desktop site + 1-2 mobile shots, real Altaventures projects.
      </p>
      <dl className="mt-2 grid grid-cols-1 gap-1 text-xs text-white/45">
        <div>
          <dt className="inline font-semibold text-white/60">Canvas: </dt>
          <dd className="inline">1600 &times; 1200px</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-white/60">Aspect ratio: </dt>
          <dd className="inline">4:3</dd>
        </div>
        <div>
          <dt className="inline font-semibold text-white/60">Type: </dt>
          <dd className="inline">PNG, transparent background</dd>
        </div>
      </dl>
    </div>
  );
}
