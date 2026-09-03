import { useEffect } from "react";
import { BRAND } from "../content/site";
import { PRIMARY_CTA } from "../content/foryourbusiness";
import { FYB_PREFILL } from "../lib/contact";
import { useScrollDepth } from "../lib/useScrollDepth";
import { ModalProvider, useModals } from "../lib/modalContext";
import CTAButton from "../components/ui/CTAButton";

import FybHero from "../components/fyb/sections/FybHero";
import Problem from "../components/fyb/sections/Problem";
import WhatsIncluded from "../components/fyb/sections/WhatsIncluded";
import WhoItsFor from "../components/fyb/sections/WhoItsFor";
import FybPortfolio from "../components/fyb/sections/FybPortfolio";
import FybHowItWorks from "../components/fyb/sections/FybHowItWorks";
import FybFAQ from "../components/fyb/sections/FybFAQ";
import FybFinalCTA from "../components/fyb/sections/FybFinalCTA";
import StickyMobileFybCTA from "../components/fyb/StickyMobileFybCTA";
import Reveal from "../components/offer/Reveal";

import ContactModal from "../components/modals/ContactModal";
import LegalModal from "../components/modals/LegalModal";

const PAGE_TITLE = "Get Your Business Online for ₱299 | Altaventures";
const PAGE_DESCRIPTION =
  "A professional, mobile-friendly business website, done for you, for a one-time ₱299 payment. Ready in 4 to 7 days. See real Altaventures work.";

const LEGAL_LINKS = [
  { label: "Refund Policy", id: "fyb-refund" as const },
  { label: "Terms of Sale", id: "fyb-terms" as const },
  { label: "Privacy Notice", id: "fyb-privacy" as const },
];

function setMeta(selector: string, attr: string, value: string): (() => void) | void {
  const el = document.querySelector(selector);
  if (!el) return;
  const previous = el.getAttribute(attr) ?? "";
  el.setAttribute(attr, value);
  return () => el.setAttribute(attr, previous);
}

function PageContent() {
  const { openContactModal, openLegal } = useModals();
  useScrollDepth();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const restores = [
      setMeta('meta[name="description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:title"]', "content", PAGE_TITLE),
      setMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:url"]', "content", "https://altasme.com/foryourbusiness"),
      setMeta('meta[name="twitter:title"]', "content", PAGE_TITLE),
      setMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION),
      setMeta('link[rel="canonical"]', "href", "https://altasme.com/foryourbusiness"),
    ];

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore?.());
    };
  }, []);

  const openContact = (section: string) => openContactModal(section, FYB_PREFILL);

  return (
    <div className="min-h-screen bg-paper pb-16 md:pb-0">
      {/* No outbound nav on this funnel: logo only, no link back to the
          main site. Checkout/payment isn't wired up yet, so every CTA
          opens the same chat channel picker used site-wide, prefilled
          with a ₱299-specific message (see lib/contact.ts FYB_PREFILL). */}
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 lg:px-8">
          <span className="shrink-0">
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto sm:h-8" />
          </span>
          <CTAButton
            label={PRIMARY_CTA}
            section="header"
            onClick={() => openContact("header")}
            className="hidden !px-5 !py-2.5 !text-xs sm:inline-flex sm:!text-sm"
          />
        </div>
      </header>

      <main>
        <FybHero onOpenContact={() => openContact("hero")} />
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
          <FybPortfolio onOpenContact={() => openContact("portfolio")} />
        </Reveal>
        <Reveal>
          <FybHowItWorks />
        </Reveal>
        <Reveal>
          <FybFAQ />
        </Reveal>
        <Reveal>
          <FybFinalCTA onOpenContact={() => openContact("final-cta")} />
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

      <StickyMobileFybCTA onOpenContact={() => openContact("sticky-mobile")} />

      <ContactModal />
      <LegalModal />
    </div>
  );
}

export default function ForYourBusinessPage() {
  return (
    <ModalProvider>
      <PageContent />
    </ModalProvider>
  );
}
