import { Check, Play, Sparkles } from "lucide-react";
import { HERO, MEDIA } from "../../../content/mycafepos";
import { track } from "../../../lib/analytics";
import AccessButton from "../AccessButton";
import MediaPlaceholder from "../MediaPlaceholder";

export default function Hero() {
  return (
    <section className="mcp-hero">
      <div className="mcp-container grid min-h-[calc(100vh-4.5rem)] items-center gap-12 py-14 lg:min-h-[740px] lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <div className="max-w-xl">
          <div
            className="mb-7 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold uppercase"
            style={{ borderColor: "color-mix(in oklch, var(--mcp-accent) 30%, transparent)", background: "var(--mcp-accent-soft)", color: "var(--mcp-accent)" }}
          >
            <Sparkles size={14} /> {HERO.badge}
          </div>
          <p className="mcp-eyebrow">{HERO.eyebrow}</p>
          <h1 className="mt-4 text-balance text-5xl font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl" style={{ fontFamily: "var(--mcp-font-heading)" }}>
            {HERO.headline[0]}
            <br />
            <span style={{ color: "var(--mcp-primary)" }}>{HERO.headline[1]}</span>
          </h1>
          <p className="mt-6 text-xl font-semibold">{HERO.sub}</p>
          <p className="mcp-muted mt-3 max-w-lg text-base leading-7">{HERO.body}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AccessButton label={HERO.cta} location="hero" />
            <a href="#demo" onClick={() => track("mycafe_demo_play", {})} className="mcp-btn mcp-btn--ghost">
              <Play size={16} className="fill-current" />
              {HERO.demoCta}
            </a>
          </div>
          <p className="mcp-muted mt-4 flex items-center gap-2 text-sm">
            <Check size={16} style={{ color: "var(--mcp-accent)" }} /> {HERO.trustLine}
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute -left-4 top-8 hidden rounded-md px-4 py-3 text-sm font-bold shadow-xl lg:block"
            style={{ background: "var(--mcp-primary)", color: "var(--mcp-primary-foreground)" }}
          >
            {HERO.imageCallout}
          </div>
          <MediaPlaceholder {...MEDIA.hero} />
        </div>
      </div>
    </section>
  );
}
