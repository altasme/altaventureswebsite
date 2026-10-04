import { useEffect, useState } from "react";
import { BRAND } from "../content/site";
import type { FybUpgradeType } from "../content/foryourbusiness";
import { ModalProvider } from "../lib/modalContext";
import { initMetaPixel } from "../lib/analytics";
import ContactModal from "../components/modals/ContactModal";
import LegalModal from "../components/modals/LegalModal";
import QuestionnaireStep, { type QuestionnaireData } from "../components/fyb/checkout/QuestionnaireStep";
import PackageStep from "../components/fyb/checkout/PackageStep";
import UpgradeStep from "../components/fyb/checkout/UpgradeStep";
import PaymentStep from "../components/fyb/checkout/PaymentStep";

// Checkout is a 4-step guest wizard [2026-10-04, operator direction]:
// Questionnaire -> Package Review -> Optional Upgrade -> Payment. No
// account creation or Client Hub access anywhere in this journey — see
// src/pages/ForYourBusinessThankYouPage.tsx for the "talk to your
// developer" step that replaces the old account-creation panel.
//
// All four steps live under this one route rather than four separate
// routes, and nothing is written to the backend until the Payment step's
// actual submit — the same single /api/checkout call that creates the
// ganap session also creates the one D1 order row, exactly like the old
// single-step checkout did, just with a bigger payload (the questionnaire
// answers + the selected upgrade, both validated server-side). Wizard
// progress is kept in sessionStorage only (not a backend "draft" row), so
// a refresh mid-wizard doesn't lose it, without needing any account to
// store it against.

const PAGE_TITLE = "Start Your ₱599 Website | Altaventures";
const STORAGE_KEY = "fyb-checkout-wizard";

type WizardStep = "questionnaire" | "package" | "upgrade" | "payment";

type WizardState = {
  step: WizardStep;
  questionnaire: QuestionnaireData;
  upgradeType: FybUpgradeType;
};

const EMPTY_QUESTIONNAIRE: QuestionnaireData = {
  businessName: "",
  businessCategory: "",
  businessDescription: "",
  contactPerson: "",
  email: "",
  phone: "",
};

const DEFAULT_STATE: WizardState = {
  step: "questionnaire",
  questionnaire: EMPTY_QUESTIONNAIRE,
  upgradeType: "none",
};

function loadState(): WizardState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<WizardState>;
    const steps: WizardStep[] = ["questionnaire", "package", "upgrade", "payment"];
    return {
      step: parsed.step && steps.includes(parsed.step) ? parsed.step : DEFAULT_STATE.step,
      questionnaire: { ...EMPTY_QUESTIONNAIRE, ...parsed.questionnaire },
      upgradeType: parsed.upgradeType ?? "none",
    };
  } catch {
    return DEFAULT_STATE;
  }
}

function CheckoutWizard() {
  const [state, setState] = useState<WizardState>(() => (typeof window === "undefined" ? DEFAULT_STATE : loadState()));

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage can throw in private-browsing/storage-blocked contexts;
      // losing resume-on-refresh there is an acceptable degradation, not a hard failure.
    }
  }, [state]);

  const goTo = (step: WizardStep) => setState((s) => ({ ...s, step }));

  switch (state.step) {
    case "questionnaire":
      return (
        <QuestionnaireStep
          initial={state.questionnaire}
          onNext={(questionnaire) => setState((s) => ({ ...s, questionnaire, step: "package" }))}
        />
      );
    case "package":
      return <PackageStep onNext={() => goTo("upgrade")} onBack={() => goTo("questionnaire")} />;
    case "upgrade":
      return (
        <UpgradeStep
          selected={state.upgradeType}
          onSelect={(upgradeType) => setState((s) => ({ ...s, upgradeType }))}
          onNext={() => goTo("payment")}
          onBack={() => goTo("package")}
        />
      );
    case "payment":
      return <PaymentStep questionnaire={state.questionnaire} upgradeType={state.upgradeType} onBack={() => goTo("upgrade")} />;
    default:
      return null;
  }
}

function PageContent() {
  useEffect(() => {
    initMetaPixel();

    document.title = PAGE_TITLE;
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => {
      document.title = "Altaventures: Websites, Booking Systems & Business Digitalization (Philippines)";
      meta?.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4 lg:px-8">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto sm:h-8" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <CheckoutWizard />
      </main>

      <LegalModal />
      <ContactModal />
    </div>
  );
}

export default function ForYourBusinessCheckoutPage() {
  return (
    <ModalProvider>
      <PageContent />
    </ModalProvider>
  );
}
