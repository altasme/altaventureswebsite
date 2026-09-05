// Editorial stat composition for the hero. Replaces the earlier
// "hero visual placeholder" box (a real device-screenshot composition was
// the original spec target, but no such asset exists yet and won't for a
// while) with real, honest numbers instead of a fabricated mockup —
// consistent with the site-wide no-fabricated-screenshots guardrail
// (CLAUDE.md §16): a true stat is real proof too, not a placeholder.
import { FYB_HERO_STATS } from "../../content/foryourbusiness";

export default function FybHeroVisual() {
  return (
    <div className="min-w-0 rounded-3xl border border-white/15 px-8 py-10 sm:px-10 sm:py-12">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {FYB_HERO_STATS.eyebrow}
      </p>

      <div className="mt-8 divide-y divide-white/10">
        {FYB_HERO_STATS.stats.map((stat) => (
          <div key={stat.label} className="py-7 text-center first:pt-0 last:pb-0">
            <p className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">{stat.value}</p>
            <p className="mt-2 text-sm text-white/60">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
