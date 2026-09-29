import { Coffee } from "lucide-react";
import { FOOTER } from "../../../content/mycafepos";

export default function Footer() {
  return (
    <footer className="mcp-footer py-12" style={{ background: "var(--mcp-footer)", color: "var(--mcp-footer-foreground)" }}>
      <div className="mcp-container flex flex-col justify-between gap-8 sm:flex-row">
        <div>
          <p className="flex items-center gap-2 font-extrabold" style={{ fontFamily: "var(--mcp-font-heading)" }}>
            <Coffee size={20} style={{ color: "var(--mcp-accent)" }} />
            {FOOTER.wordmark}
          </p>
          <p className="mt-3 max-w-sm text-sm" style={{ color: "var(--mcp-footer-muted)" }}>
            {FOOTER.tagline}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm" style={{ color: "var(--mcp-footer-muted)" }}>
          {FOOTER.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className="mcp-container mt-9 border-t pt-6 text-xs" style={{ borderColor: "var(--mcp-footer-border)", color: "var(--mcp-footer-muted)" }}>
        &copy; {new Date().getFullYear()} {FOOTER.copyright}
      </div>
    </footer>
  );
}
