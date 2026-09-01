import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ModalProvider } from "./lib/modalContext";
import { useScrollDepth } from "./lib/useScrollDepth";

import Nav from "./components/layout/Nav";
import Footer from "./components/layout/Footer";
import StickyMobileCTA from "./components/layout/StickyMobileCTA";

import Hero from "./components/sections/Hero";
import CredibilityStrip from "./components/sections/CredibilityStrip";
import ProblemSection from "./components/sections/ProblemSection";
import ServicesSection from "./components/sections/ServicesSection";
import SelectedWork from "./components/sections/SelectedWork";
import PortfolioConversion from "./components/sections/PortfolioConversion";
import WhyAltaventures from "./components/sections/WhyAltaventures";
import ComplimentaryOffer from "./components/sections/ComplimentaryOffer";
import HowItWorks from "./components/sections/HowItWorks";
import Industries from "./components/sections/Industries";
import FAQ from "./components/sections/FAQ";
import FinalCTA from "./components/sections/FinalCTA";
import About from "./components/sections/About";

import ContactModal from "./components/modals/ContactModal";
import CaseStudyModal from "./components/modals/CaseStudyModal";
import LegalModal from "./components/modals/LegalModal";

const WsaFreePage = lazy(() => import("./pages/WsaFreePage"));
const LimitedOfferPage = lazy(() => import("./pages/LimitedOfferPage"));

function PageContent() {
  useScrollDepth();

  return (
    <>
      <Nav />
      <main className="pb-16 md:pb-0">
        <Hero />
        <CredibilityStrip />
        <ProblemSection />
        <ServicesSection />
        <SelectedWork />
        <PortfolioConversion />
        <WhyAltaventures />
        <ComplimentaryOffer />
        <HowItWorks />
        <Industries />
        <FAQ />
        <FinalCTA />
        <About />
      </main>
      <Footer />
      <StickyMobileCTA />

      <ContactModal />
      <CaseStudyModal />
      <LegalModal />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ModalProvider>
            <PageContent />
          </ModalProvider>
        }
      />
      <Route
        path="/WSA-free"
        element={
          <Suspense fallback={null}>
            <WsaFreePage />
          </Suspense>
        }
      />
      <Route
        path="/limitedoffer"
        element={
          <Suspense fallback={null}>
            <LimitedOfferPage />
          </Suspense>
        }
      />
    </Routes>
  );
}
