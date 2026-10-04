import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CHECKOUT, STARTER_PHP, UPGRADES } from "../../../content/foryourbusiness";
import type { FybUpgradeType } from "../../../content/foryourbusiness";
import { trackInitiateCheckout } from "../../../lib/analytics";
import { FYB_PREFILL } from "../../../lib/contact";
import { useModals } from "../../../lib/modalContext";
import { StepHeader, money } from "./shared";
import type { QuestionnaireData } from "./QuestionnaireStep";

type RedirectKind = "url" | "qr-image" | "qr-payload" | "test-placeholder";
type PaymentResult = { redirectUrl: string; referenceNumber: string; kind: RedirectKind };

const UPGRADE_PRICE: Record<FybUpgradeType, number> = { none: 0, domain_hosting: 1500, business_tools: 5700 };
const UPGRADE_TITLE: Record<FybUpgradeType, string> = {
  none: "",
  domain_hosting: UPGRADES.domainHosting.title,
  business_tools: UPGRADES.businessTools.title,
};
const UPGRADE_ANNUAL_PRICE: Record<FybUpgradeType, string> = {
  none: "",
  domain_hosting: UPGRADES.domainHosting.price,
  business_tools: UPGRADES.businessTools.price,
};

// Generates a scannable QR code client-side from a raw payload string
// (e.g. a QR Ph payload) using the qrcode package. Not used for the
// "qr-image" kind, where ganap already hands back a ready-made image.
function QrPayload({ payload }: { payload: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(payload, { width: 280, margin: 2 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch((err) => console.error("Failed to render QR code", err));
    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (!dataUrl) {
    return <div className="flex h-[280px] w-[280px] items-center justify-center text-sm text-ink/40">Generating QR code&hellip;</div>;
  }

  return <img src={dataUrl} alt="Scan with your banking or e-wallet app to pay" width={280} height={280} />;
}

function PaymentPanel({ result, total }: { result: PaymentResult; total: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-alt p-6 text-center sm:p-8">
      {result.kind === "test-placeholder" ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Test Mode</p>
          <h2 className="mt-1 text-xl font-bold text-brand-navy">This is a Test Transaction</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/70">
            ganap.net doesn't show a real payment screen in test mode. To simulate this payment, go to the ganap.net
            dashboard's <strong>Test mode</strong> section, find reference{" "}
            <code className="rounded bg-white px-1.5 py-0.5 font-mono text-xs text-brand-navy">
              {result.referenceNumber}
            </code>
            , and click <strong>Simulate successful payment</strong>.
          </p>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">Scan to Pay</p>
          <h2 className="mt-1 text-xl font-bold text-brand-navy">
            {money(total)} &middot; Reference {result.referenceNumber}
          </h2>
          <div className="mt-4 flex justify-center">
            {result.kind === "qr-image" ? (
              <img src={result.redirectUrl} alt="Scan with your banking or e-wallet app to pay" width={280} height={280} />
            ) : (
              <QrPayload payload={result.redirectUrl} />
            )}
          </div>
          <p className="mx-auto mt-4 max-w-sm text-sm text-ink/60">
            Scan this code with your GCash, Maya, or banking app to complete your {money(total)} payment.
          </p>
        </>
      )}
    </div>
  );
}

export default function PaymentStep({
  questionnaire,
  upgradeType,
  onBack,
}: {
  questionnaire: QuestionnaireData;
  upgradeType: FybUpgradeType;
  onBack: () => void;
}) {
  const { openLegal, openContactModal } = useModals();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const upgradePrice = UPGRADE_PRICE[upgradeType];
  const total = STARTER_PHP + upgradePrice;
  const canSubmit = termsAccepted && privacyAccepted && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErrorMessage(null);
    trackInitiateCheckout();

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer: "foryourbusiness",
          fullName: questionnaire.contactPerson,
          businessName: questionnaire.businessName,
          email: questionnaire.email,
          phone: questionnaire.phone,
          businessCategory: questionnaire.businessCategory,
          businessDescription: questionnaire.businessDescription,
          upgradeType,
          termsAccepted,
          privacyAccepted,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { redirectUrl?: string; referenceNumber?: string; kind?: RedirectKind; error?: string }
        | null;

      if (!response.ok || !data?.redirectUrl || !data.referenceNumber || !data.kind) {
        setErrorMessage(data?.error || "We couldn't start your payment right now. Please try again shortly.");
        setSubmitting(false);
        return;
      }

      if (data.kind === "url") {
        window.location.href = data.redirectUrl;
        return;
      }

      // QR / test-placeholder kinds stay on this page and render a panel
      // instead of navigating away, since there's nowhere to navigate to.
      setPaymentResult({ redirectUrl: data.redirectUrl, referenceNumber: data.referenceNumber, kind: data.kind });
      setSubmitting(false);
    } catch {
      setErrorMessage("We couldn't reach our payment provider. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  if (paymentResult) {
    return <PaymentPanel result={paymentResult} total={total} />;
  }

  return (
    <div className="space-y-6">
      <StepHeader stepLabel={CHECKOUT.stepLabel} headline={CHECKOUT.headline} />

      <div className="rounded-2xl border border-ink/10 bg-paper-alt p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink/70">{CHECKOUT.starterLine}</span>
          <span className="font-semibold text-brand-navy">{money(STARTER_PHP)}</span>
        </div>
        {upgradeType !== "none" && (
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink/70">
              {UPGRADE_TITLE[upgradeType]} <span className="text-xs text-ink/40">(annual)</span>
            </span>
            <span className="font-semibold text-brand-navy">{money(upgradePrice)}</span>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="font-bold text-brand-navy">Total due today</span>
          <span className="text-2xl font-extrabold text-brand-navy">{money(total)}</span>
        </div>
        {upgradeType !== "none" && (
          <p className="mt-2 text-xs text-ink/50">
            The {UPGRADE_TITLE[upgradeType]} upgrade renews annually at {UPGRADE_ANNUAL_PRICE[upgradeType]} to keep
            that service active.
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-ink/10 bg-paper-alt p-5">
        <label className="flex items-start gap-3 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
          />
          <span>
            I have read and agree to the{" "}
            <button type="button" onClick={() => openLegal("fyb-terms")} className="font-semibold text-brand-blue underline hover:no-underline">
              Terms of Sale
            </button>{" "}
            and{" "}
            <button type="button" onClick={() => openLegal("fyb-refund")} className="font-semibold text-brand-blue underline hover:no-underline">
              Refund Policy
            </button>
            , including the pricing and any applicable annual renewal terms for my selected package.
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink/75">
          <input
            type="checkbox"
            checked={privacyAccepted}
            onChange={(e) => setPrivacyAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
          />
          <span>
            I consent to Altaventures collecting and processing my personal data as described in the{" "}
            <button type="button" onClick={() => openLegal("fyb-privacy")} className="font-semibold text-brand-blue underline hover:no-underline">
              Privacy Notice
            </button>
            , to deliver this service.
          </span>
        </label>
      </div>

      {errorMessage && (
        <div className="rounded-xl bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          <button
            type="button"
            onClick={() => openContactModal("checkout-error", FYB_PREFILL)}
            className="mt-1.5 text-sm font-semibold text-brand-blue hover:underline"
          >
            Message us instead &rarr;
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button type="button" onClick={onBack} className="text-sm font-semibold text-ink/60 hover:text-ink">
          &larr; Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-4 text-base font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-ink/10 disabled:text-ink/60 disabled:shadow-none"
        >
          {submitting ? "Starting your payment..." : CHECKOUT.cta.replace("{amount}", money(total))}
        </button>
      </div>
    </div>
  );
}
