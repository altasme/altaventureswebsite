import { Coffee, Menu } from "lucide-react";
import { HEADER } from "../../../content/mycafepos";
import AccessButton from "../AccessButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--mcp-border)", background: "color-mix(in oklch, var(--mcp-background) 95%, transparent)", backdropFilter: "blur(8px)" }}>
      <div className="mcp-container flex h-[4.5rem] items-center justify-between gap-5">
        <a href="#top" className="flex items-center gap-3 text-lg font-extrabold" style={{ fontFamily: "var(--mcp-font-heading)" }} aria-label="MyCafe POS home">
          <span className="grid h-9 w-9 place-items-center rounded-md" style={{ background: "var(--mcp-primary)", color: "var(--mcp-primary-foreground)" }}>
            <Coffee size={20} />
          </span>
          {HEADER.wordmark} <span style={{ color: "var(--mcp-accent)" }}>{HEADER.wordmarkAccent}</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex" aria-label="Main navigation">
          {HEADER.nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a className="hidden text-sm font-semibold sm:block" style={{ color: "var(--mcp-muted-foreground)" }} href={HEADER.signInHref}>
            Sign in
          </a>
          <AccessButton location="navigation" className="mcp-btn--sm mcp-desktop-only" />
          <a href="#features" className="grid h-9 w-9 place-items-center rounded-md md:hidden" aria-label="Open navigation">
            <Menu size={20} />
          </a>
        </div>
      </div>
    </header>
  );
}
