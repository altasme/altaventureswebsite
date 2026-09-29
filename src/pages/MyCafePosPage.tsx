import { useEffect } from "react";
import { META } from "../content/mycafepos";
import { track } from "../lib/analytics";
import "../components/mycafepos/mycafepos.css";

import Header from "../components/mycafepos/sections/Header";
import Hero from "../components/mycafepos/sections/Hero";
import BenefitsStrip from "../components/mycafepos/sections/BenefitsStrip";
import ProblemSection from "../components/mycafepos/sections/ProblemSection";
import Demo from "../components/mycafepos/sections/Demo";
import Features from "../components/mycafepos/sections/Features";
import HowItWorks from "../components/mycafepos/sections/HowItWorks";
import Offer from "../components/mycafepos/sections/Offer";
import FutureTools from "../components/mycafepos/sections/FutureTools";
import Feedback from "../components/mycafepos/sections/Feedback";
import FAQ from "../components/mycafepos/sections/FAQ";
import FinalCTA from "../components/mycafepos/sections/FinalCTA";
import Footer from "../components/mycafepos/sections/Footer";
import MobileAccessBar from "../components/mycafepos/sections/MobileAccessBar";

function setMeta(selector: string, attr: string, value: string): (() => void) | void {
  const el = document.querySelector(selector);
  if (!el) return;
  const previous = el.getAttribute(attr) ?? "";
  el.setAttribute(attr, value);
  return () => el.setAttribute(attr, previous);
}

export default function MyCafePosPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = META.title;

    const restores = [
      setMeta('meta[name="description"]', "content", META.description),
      setMeta('meta[property="og:title"]', "content", META.ogTitle),
      setMeta('meta[property="og:description"]', "content", META.ogDescription),
      setMeta('meta[property="og:url"]', "content", "https://altasme.com/mycafepos"),
      setMeta('meta[name="twitter:title"]', "content", META.ogTitle),
      setMeta('meta[name="twitter:description"]', "content", META.ogDescription),
      setMeta('link[rel="canonical"]', "href", "https://altasme.com/mycafepos"),
    ];

    track("mycafe_landing_view", {});

    return () => {
      document.title = previousTitle;
      restores.forEach((restore) => restore?.());
    };
  }, []);

  return (
    <div className="mcp min-h-screen pb-16 md:pb-0">
      <Header />
      <main id="top">
        <Hero />
        <BenefitsStrip />
        <ProblemSection />
        <Demo />
        <Features />
        <HowItWorks />
        <Offer />
        <FutureTools />
        <Feedback />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <MobileAccessBar />
    </div>
  );
}
