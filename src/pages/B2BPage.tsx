import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "../content/site";
import { PRIMARY_CTA } from "../content/b2b";
import { useScrollDepth } from "../lib/useScrollDepth";
import { ModalProvider, useModals } from "../lib/modalContext";
import { track } from "../lib/analytics";
import CTAButton from "../components/ui/CTAButton";

import B2BHero from "../components/b2b/sections/B2BHero";
import B2BTrustSignals from "../components/b2b/sections/B2BTrustSignals";
import Problem from "../components/b2b/sections/Problem";
import WhatsIncluded from "../components/b2b/sections/WhatsIncluded";
import WhoItsFor from "../components/b2b/sections/WhoItsFor";
import B2BPortfolio from "../components/b2b/sections/B2BPortfolio";
import B2BHowItWorks from "../components/b2b/sections/B2BHowItWorks";
import B2BFAQ from "../components/b2b/sections/B2BFAQ";
import B2BFinalCTA from "../components/b2b/sections/B2BFinalCTA";
import StickyMobileB2BCTA from "../components/b2b/StickyMobileB2BCTA";
import Reveal from "../components/offer/Reveal";

import LegalModal from "../components/modals/LegalModal";

const PAGE_TITLE = "Complete Business Website Package, ₱4,999 | Altaventures";
const PAGE_DESCRIPTION =
  "A complete business website for established businesses: built, hosted, secured, maintained, and supported for a full year. ₱4,999 total, 50% down to start. See real Altaventures work.";

const LEGAL_LINKS = [
  { label: "Refund Policy", id: "b2b-refund" as const },
  { label: "Terms of Sale", id: "b2b-terms" as const },
  { label: "Privacy Notice", id: "b2b-privacy" as const },
];

function setMeta(selector: string, attr: string, value: string): (() => void) | void {
  const el = document.querySelector(selector);
  if (!el) return;
  const previous = el.getAttribute(attr) ?? "";
  el.setAttribute(attr, value);
  return () => el.setAttribute(attr, previous);
}

function PageContent() {
  const { openLegal } = useModals();
  const navigate = useNavigate();
  useScrollDepth();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const restores = [
      setMeta('meta[name="description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:title"]', "content", PAGE_TITLE),
      setMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:url"]', "content", "https://altasme.com/b2b"),
      setMeta('meta[name="twitter:title"]', "content", PAGE_TITLE),
      setMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION),
      setMeta('link[rel="canonical"]', "href", "https://altasme.com/b2b"),
    ];

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore?.());
    };
  }, []);

  const goToCheckout = (section: string) => {
    track("cta_click", { label: PRIMARY_CTA, section });
    navigate("/b2b/checkout");
  };

  return (
    <div className="min-h-screen bg-paper pb-16 md:pb-0">
      {/* No outbound nav on this funnel: logo only, no link back to the
          main site. Every CTA navigates straight to /b2b/checkout. */}
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 lg:px-8">
          <span className="shrink-0">
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto sm:h-8" />
          </span>
          <CTAButton
            label={PRIMARY_CTA}
            section="header"
            onClick={() => goToCheckout("header")}
            className="hidden !px-5 !py-2.5 !text-xs sm:inline-flex sm:!text-sm"
          />
        </div>
      </header>

      <main>
        <B2BHero onCheckout={() => goToCheckout("hero")} />
        <B2BTrustSignals />
        <Reveal>
          <Problem />
        </Reveal>
        <Reveal>
          <WhatsIncluded />
        </Reveal>
        <Reveal>
          <WhoItsFor />
        </Reveal>
        <Reveal>
          <B2BPortfolio onCheckout={() => goToCheckout("portfolio")} />
        </Reveal>
        <Reveal>
          <B2BHowItWorks />
        </Reveal>
        <Reveal>
          <B2BFAQ />
        </Reveal>
        <Reveal>
          <B2BFinalCTA onCheckout={() => goToCheckout("final-cta")} />
        </Reveal>
      </main>

      <footer className="bg-brand-navy-deep py-12 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
          <span className="inline-flex rounded-lg bg-white px-3 py-2">
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto" />
          </span>
          <p className="mt-4 text-sm text-white/60">{BRAND.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/50">
            {LEGAL_LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => openLegal(link.id)}
                className="hover:text-white hover:underline"
              >
                {link.label}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs text-white/30">
            &copy; {new Date().getFullYear()} {BRAND.legalName}.
          </p>
        </div>
      </footer>

      <StickyMobileB2BCTA onCheckout={() => goToCheckout("sticky-mobile")} />

      <LegalModal />
    </div>
  );
}

export default function B2BPage() {
  return (
    <ModalProvider>
      <PageContent />
    </ModalProvider>
  );
}
