import { useEffect, useState } from "react";
import { BRAND } from "../content/site";
import { PRIMARY_CTA } from "../content/offer";
import { initMetaPixel } from "../lib/analytics";
import { useScrollDepth } from "../lib/useScrollDepth";
import OfferCTAButton from "../components/offer/ui/OfferCTAButton";

import OfferHero from "../components/offer/sections/OfferHero";
import Agitation from "../components/offer/sections/Agitation";
import WhatYouGet from "../components/offer/sections/WhatYouGet";
import OfferPortfolio from "../components/offer/sections/OfferPortfolio";
import TheOfferPlainly from "../components/offer/sections/TheOfferPlainly";
import WhyFree from "../components/offer/sections/WhyFree";
import OfferHowItWorks from "../components/offer/sections/OfferHowItWorks";
import WhoItsFor from "../components/offer/sections/WhoItsFor";
import Scarcity from "../components/offer/sections/Scarcity";
import GrowthVision from "../components/offer/sections/GrowthVision";
import OfferFAQ from "../components/offer/sections/OfferFAQ";
import OfferFinalCTA from "../components/offer/sections/OfferFinalCTA";
import Qualifier from "../components/offer/qualifier/Qualifier";
import StickyMobileOfferCTA from "../components/offer/StickyMobileOfferCTA";

const PAGE_TITLE = "Free Website for Your Business (Philippines) | Altaventures";
const PAGE_DESCRIPTION =
  "Your competitors show up on Google. You show up on Facebook. We'll build you a real, custom website free: you only pay for the domain. Ready in 4 to 7 days.";

function setMeta(selector: string, attr: string, value: string): (() => void) | void {
  const el = document.querySelector(selector);
  if (!el) return;
  const previous = el.getAttribute(attr) ?? "";
  el.setAttribute(attr, value);
  return () => el.setAttribute(attr, previous);
}

export default function LimitedOfferPage() {
  const [qualifierOpen, setQualifierOpen] = useState(false);
  useScrollDepth();

  useEffect(() => {
    initMetaPixel();

    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const restores = [
      setMeta('meta[name="description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:title"]', "content", PAGE_TITLE),
      setMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION),
      setMeta('meta[property="og:url"]', "content", "https://altasme.com/limitedoffer"),
      setMeta('meta[name="twitter:title"]', "content", PAGE_TITLE),
      setMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION),
      setMeta('link[rel="canonical"]', "href", "https://altasme.com/limitedoffer"),
    ];

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore?.());
    };
  }, []);

  const openQualifier = () => setQualifierOpen(true);
  const closeQualifier = () => setQualifierOpen(false);

  return (
    <div className="min-h-screen bg-brand-navy-deep pb-16 md:pb-0">
      {/* No outbound nav on this funnel: logo only, no "Explore Altaventures"
          link. The header CTA is the same qualifier as every other button
          on the page. */}
      <header className="border-b border-white/10 bg-brand-navy-deep">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 lg:px-8">
          <span className="inline-flex shrink-0 rounded-lg bg-white px-2.5 py-1.5">
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto sm:h-7" />
          </span>
          <OfferCTAButton
            label={PRIMARY_CTA}
            section="header"
            onClick={openQualifier}
            className="hidden !px-5 !py-2.5 !text-xs sm:inline-flex sm:!text-sm"
          />
        </div>
      </header>

      <main>
        <OfferHero onOpenQualifier={openQualifier} />
        <Agitation onOpenQualifier={openQualifier} />
        <WhatYouGet onOpenQualifier={openQualifier} />
        <OfferPortfolio onOpenQualifier={openQualifier} />
        <TheOfferPlainly onOpenQualifier={openQualifier} />
        <WhyFree onOpenQualifier={openQualifier} />
        <OfferHowItWorks onOpenQualifier={openQualifier} />
        <WhoItsFor onOpenQualifier={openQualifier} />
        <Scarcity onOpenQualifier={openQualifier} />
        <GrowthVision onOpenQualifier={openQualifier} />
        <OfferFAQ />
        <OfferFinalCTA onOpenQualifier={openQualifier} />
      </main>

      <footer className="bg-brand-navy-deep py-12 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
          <span className="inline-flex rounded-lg bg-white px-3 py-2">
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto" />
          </span>
          <p className="mt-4 text-sm text-white/60">{BRAND.tagline}</p>
          <p className="mx-auto mt-2 max-w-sm text-xs text-white/40">
            No forms. Nothing is collected or stored on this page: every conversation happens on the chat
            platform you choose.
          </p>
          <p className="mt-6 text-xs text-white/30">
            &copy; {new Date().getFullYear()} {BRAND.legalName}.
          </p>
        </div>
      </footer>

      <StickyMobileOfferCTA onOpenQualifier={openQualifier} />
      <Qualifier open={qualifierOpen} onClose={closeQualifier} />
    </div>
  );
}
