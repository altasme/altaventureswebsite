import { useEffect } from "react";
import { BRAND } from "../content/site";
import { PRICING_HERO, PRICING_FINAL_CTA, PRICING_TIERS, type PricingTierId } from "../content/pricing";
import { buildPricingPrefill } from "../lib/contact";
import { ModalProvider, useModals } from "../lib/modalContext";
import { track } from "../lib/analytics";
import CTAButton from "../components/ui/CTAButton";
import Reveal from "../components/offer/Reveal";
import DecorativeShapes from "../components/fyb/DecorativeShapes";
import ContactModal from "../components/modals/ContactModal";
import LegalModal from "../components/modals/LegalModal";
import StickyMobileCTA from "../components/layout/StickyMobileCTA";
import PricingTable from "../components/pricing/PricingTable";
import PricingAddOns from "../components/pricing/PricingAddOns";
import PricingNotes from "../components/pricing/PricingNotes";

const PAGE_TITLE = "Pricing | Altaventures";
const PAGE_DESCRIPTION =
  "Simple, transparent pricing for Altaventures website plans: Starter, Professional, and Business. See what's included and talk to us about your business.";

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
  const { openLegal, openContactModal } = useModals();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const restores = [
      setMeta('meta[name="description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:title"]', "content", PAGE_TITLE),
      setMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:url"]', "content", "https://www.altasme.com/pricing"),
      setMeta('meta[name="twitter:title"]', "content", PAGE_TITLE),
      setMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION),
      setMeta('link[rel="canonical"]', "href", "https://www.altasme.com/pricing"),
    ];

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore?.());
    };
  }, []);

  const talkToUs = (section: string) => {
    track("cta_click", { label: "Talk to Us", section });
    openContactModal(section);
  };

  const selectTier = (tierId: PricingTierId, section: string) => {
    const tier = PRICING_TIERS.find((t) => t.id === tierId)!;
    const priceLabel = tier.renewalNote ? `${tier.price} first year` : tier.price;
    track("cta_click", { label: `${tier.name} - ${tier.cta}`, section });
    openContactModal(section, buildPricingPrefill(tier.name, priceLabel));
  };

  return (
    <div className="min-h-screen bg-paper pb-16 md:pb-0">
      {/* Same no-outbound-nav convention as /limitedoffer, /foryourbusiness,
          /b2b: logo only, every CTA opens the contact modal (this page has
          no checkout of its own, per the operator's own "purely for
          presentation" instruction). */}
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 lg:px-8">
          <span className="shrink-0">
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto sm:h-8" />
          </span>
          <CTAButton
            label="Talk to Us"
            section="header"
            onClick={() => talkToUs("header")}
            className="hidden !px-5 !py-2.5 !text-xs sm:inline-flex sm:!text-sm"
          />
        </div>
      </header>

      <main>
        <section className="bg-paper px-6 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              <DecorativeShapes variant={1} />
              <Reveal className="relative">
                <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
                  {PRICING_HERO.headline}
                </h1>
                <p className="mt-4 max-w-2xl text-lg text-ink/65">{PRICING_HERO.sub}</p>
                <p className="mt-3 max-w-2xl text-xs text-ink/60">{PRICING_HERO.disclaimer}</p>
              </Reveal>
            </div>

            <Reveal delayMs={80}>
              <PricingTable onSelectTier={(tierId) => selectTier(tierId, `pricing-table-${tierId}`)} />
            </Reveal>
          </div>
        </section>

        <section className="bg-paper-alt px-6 py-16 sm:py-20 lg:px-8">
          <div className="relative mx-auto max-w-6xl">
            <DecorativeShapes variant={3} />
            <Reveal className="relative">
              <PricingAddOns />
            </Reveal>
          </div>
        </section>

        <section className="bg-paper px-6 py-16 sm:py-20 lg:px-8">
          <div className="relative mx-auto max-w-6xl">
            <DecorativeShapes variant={2} />
            <Reveal className="relative">
              <PricingNotes />
            </Reveal>
          </div>
        </section>

        <section className="bg-brand-navy-deep py-16 text-center text-white sm:py-20">
          <Reveal className="mx-auto max-w-2xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{PRICING_FINAL_CTA.headline}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{PRICING_FINAL_CTA.sub}</p>
            <div className="mt-8 flex justify-center">
              <CTAButton
                label={PRICING_FINAL_CTA.cta}
                section="pricing-final-cta"
                onClick={() => talkToUs("final-cta")}
              />
            </div>
          </Reveal>
        </section>
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

          <p className="mt-6 text-xs text-white/50">
            &copy; {new Date().getFullYear()} {BRAND.legalName}.
          </p>
        </div>
      </footer>

      <StickyMobileCTA />

      <LegalModal />
      <ContactModal />
    </div>
  );
}

export default function PricingPage() {
  return (
    <ModalProvider>
      <PageContent />
    </ModalProvider>
  );
}
