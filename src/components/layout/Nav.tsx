import { useState } from "react";
import { BRAND, NAV_LINKS } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import CTAButton from "../ui/CTAButton";

function Wordmark() {
  return (
    <a href="#home" className="flex items-center gap-2" aria-label={`${BRAND.name} home`}>
      <img src={BRAND.logo} alt={BRAND.name} width={160} height={40} className="h-8 w-auto sm:h-9" />
    </a>
  );
}

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openContactModal } = useModals();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Wordmark />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/70 transition hover:text-brand-navy"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <CTAButton
            label="Let's Talk"
            section="nav"
            onClick={() => openContactModal("nav")}
            className="!px-5 !py-2.5 !text-sm"
          />
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-ink/5 bg-white px-6 py-4 md:hidden"
          aria-label="Primary mobile"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-medium text-ink/80 hover:bg-paper-alt"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2">
            <CTAButton
              label="Let's Talk"
              section="nav-mobile"
              onClick={() => {
                setMobileOpen(false);
                openContactModal("nav-mobile");
              }}
              className="w-full"
            />
          </div>
        </nav>
      )}
    </header>
  );
}
