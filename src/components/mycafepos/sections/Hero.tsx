import { Check, Play } from "lucide-react";
import { HERO } from "../../../content/mycafepos";
import AccessButton from "../AccessButton";
import HeroPhoto from "../HeroPhoto";

export default function Hero() {
  return (
    <section className="mcp-hero relative overflow-hidden">
      <div className="mcp-container relative z-10 grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-14 lg:min-h-[740px] lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="max-w-xl">
          <p className="mcp-hero-badge">{HERO.badge}</p>
          <h1 className="mt-5 text-balance text-5xl font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl" style={{ fontFamily: "var(--mcp-font-heading)" }}>
            {HERO.headline[0]}
            <br />
            <span style={{ color: "var(--mcp-primary)" }}>{HERO.headline[1]}</span>
          </h1>
          <p className="mt-6 text-xl font-semibold">{HERO.sub}</p>
          <p className="mcp-muted mt-3 max-w-lg text-base leading-7">{HERO.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AccessButton label={HERO.cta} location="hero" />
            <a href="#demo" className="mcp-btn mcp-btn--ghost">
              <Play size={16} className="fill-current" />
              {HERO.demoCta}
            </a>
          </div>
          <p className="mcp-muted mt-4 flex items-center gap-2 text-sm">
            <Check size={16} style={{ color: "var(--mcp-accent)" }} /> {HERO.trustLine}
          </p>
        </div>

        {/* Reserves the grid's second column at lg: so the text column keeps
            its 0.9fr width; the real photo below is deliberately NOT this
            grid cell's content, since a full-bleed panel needs to escape
            .mcp-container's max-width and side padding, not sit inside it. */}
        <div aria-hidden="true" className="hidden lg:block" />
      </div>

      {/* Full-bleed photo: a sibling of .mcp-container, not a child of it, so
          it isn't capped by the container's 1180px max-width or side
          padding. Stacks full-width below the text on mobile/tablet (still
          edge-to-edge, since it has no container padding of its own);
          becomes an absolutely-positioned panel pinned to the section's
          actual right and top/bottom edges at lg:, bleeding all the way to
          the viewport edge exactly like the homepage's own Hero.tsx. */}
      <div className="relative z-0 h-[320px] w-full sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[48%]">
        <div className="mcp-hero-callout hidden lg:block">{HERO.imageCallout}</div>
        <HeroPhoto />
      </div>
    </section>
  );
}
