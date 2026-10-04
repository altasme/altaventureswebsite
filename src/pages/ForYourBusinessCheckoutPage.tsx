import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { BRAND } from "../content/site";
import { CHECKOUT, UPGRADE_OPTIONS, findUpgradeOption, type UpgradeId } from "../content/foryourbusiness";
import { trackInitiateCheckout } from "../lib/analytics";
import { FYB_PREFILL } from "../lib/contact";
import { ModalProvider, useModals } from "../lib/modalContext";
import ContactModal from "../components/modals/ContactModal";
import LegalModal from "../components/modals/LegalModal";

const PAGE_TITLE = "Start Your Website | Altaventures";

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

const STARTER_PRICE = 599;

function formatPhp(amount: number): string {
  return `₱${amount.toLocaleString("en-PH")}`;
}

// The only place this page computes a total — mirrors
// functions/api/checkout.ts's own UPGRADE_AMOUNT_PHP/offerConfig.amountPhp
// math exactly (599 base + the selected upgrade's annualPrice), so what
// the customer sees here always matches what the server will actually
// validate and charge. This is a display convenience only: the server
// never trusts this number, it recomputes its own from the `upgrade` id
// alone (see that file's header comment).
function totalForUpgrade(upgrade: UpgradeId): number {
  const option = upgrade === "none" ? undefined : findUpgradeOption(upgrade);
  return STARTER_PRICE + (option?.annualPrice ?? 0);
}

type RedirectKind = "url" | "qr-image" | "qr-payload" | "test-placeholder";

type PaymentResult = {
  redirectUrl: string;
  referenceNumber: string;
  kind: RedirectKind;
};

function Field({
  label,
  htmlFor,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">
        {label} {optional && <span className="normal-case text-ink/30">(optional)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function LegalLink({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="font-semibold text-brand-blue underline hover:no-underline">
      {label}
    </button>
  );
}

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

function PaymentPanel({ result, amount }: { result: PaymentResult; amount: number }) {
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
            {formatPhp(amount)} &middot; Reference {result.referenceNumber}
          </h2>
          <div className="mt-4 flex justify-center">
            {result.kind === "qr-image" ? (
              <img src={result.redirectUrl} alt="Scan with your banking or e-wallet app to pay" width={280} height={280} />
            ) : (
              <QrPayload payload={result.redirectUrl} />
            )}
          </div>
          <p className="mx-auto mt-4 max-w-sm text-sm text-ink/60">
            Scan this code with your GCash, Maya, or banking app to complete your {formatPhp(amount)} payment.
          </p>
        </>
      )}
    </div>
  );
}

// Order Summary (spec §3.A) — the Starter Website, always in the order,
// never selectable/removable.
function OrderSummary() {
  return (
    <div className="rounded-2xl border border-ink/10 bg-paper-alt p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{CHECKOUT.eyebrow}</p>
      <h1 className="mt-1 text-2xl font-bold text-brand-navy sm:text-3xl">{CHECKOUT.summaryTitle}</h1>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-brand-navy">{CHECKOUT.price}</span>
        <span className="text-xs font-semibold text-ink/60">{CHECKOUT.priceNote}</span>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
        {CHECKOUT.summaryItems.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-ink/70">
            <CheckIcon />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-brand-blue" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Choose an Optional Upgrade (spec §3.B) — single-select, default "no
// upgrade" (never preselected), reselecting the already-active choice
// deselects it back to none since that's the only other way to reach
// "continue without an upgrade" once something is picked.
function UpgradeSelector({
  selected,
  onSelect,
}: {
  selected: UpgradeId;
  onSelect: (id: UpgradeId) => void;
}) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Optional annual upgrade">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink/60">Choose an Optional Upgrade</h2>
      <button
        type="button"
        role="radio"
        aria-checked={selected === "none"}
        onClick={() => onSelect("none")}
        className={`w-full rounded-2xl border p-4 text-left transition ${
          selected === "none" ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue" : "border-ink/10 bg-white hover:border-ink/25"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-brand-navy">Continue without an upgrade</span>
          <span className="text-sm font-semibold text-ink/60">{formatPhp(STARTER_PRICE)} total</span>
        </div>
      </button>

      {UPGRADE_OPTIONS.map((option) => {
        const isSelected = selected === option.id;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(isSelected ? "none" : option.id)}
            className={`w-full rounded-2xl border p-5 text-left transition ${
              isSelected ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue" : "border-ink/10 bg-white hover:border-ink/25"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-base font-bold text-brand-navy">{option.name}</p>
                <p className="text-sm font-semibold text-brand-blue">{option.priceLabel}</p>
              </div>
              <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink/60">
                Annual service
              </span>
            </div>
            <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {option.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-ink/70">
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink/60">{option.note}</p>
            <p className="mt-2 text-sm font-semibold text-brand-navy">
              First-year total: {formatPhp(option.firstYearTotal)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

// Final Order Summary (spec §3.C) — recomputed live from `upgrade`, never
// a second source of truth for pricing (same STARTER_PRICE/UPGRADE_OPTIONS
// the selector above reads from).
function FinalSummary({ upgrade }: { upgrade: UpgradeId }) {
  const option = upgrade === "none" ? undefined : findUpgradeOption(upgrade);
  const total = totalForUpgrade(upgrade);

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ink/60">Order Summary</h2>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-ink/70">Starter Website</span>
          <span className="font-semibold text-brand-navy">{formatPhp(STARTER_PRICE)} one-time</span>
        </div>
        {option && (
          <div className="flex justify-between">
            <span className="text-ink/70">{option.name}</span>
            <span className="font-semibold text-brand-navy">{formatPhp(option.annualPrice)}/year</span>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-3">
        <span className="text-sm font-semibold text-ink/70">Total due today</span>
        <span className="text-xl font-extrabold text-brand-navy">{formatPhp(total)}</span>
      </div>
      {option && (
        <p className="mt-2 text-xs text-ink/60">
          {option.name} is billed annually. After the first year, it renews at {formatPhp(option.renewalPrice)}/year to
          continue the service — we'll reach out before then.
        </p>
      )}
    </div>
  );
}

function CheckoutForm() {
  const { openLegal, openContactModal } = useModals();

  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [existingWebsite, setExistingWebsite] = useState("");
  const [upgrade, setUpgrade] = useState<UpgradeId>("none");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [reviewedConfirmed, setReviewedConfirmed] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const fieldsValid = fullName.trim().length > 1 && businessName.trim().length > 1 && emailValid && phone.trim().length > 3;
  const canSubmit = fieldsValid && termsAccepted && privacyAccepted && reviewedConfirmed && !submitting;
  const total = totalForUpgrade(upgrade);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMessage(null);
    trackInitiateCheckout(total);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer: "foryourbusiness",
          upgrade,
          fullName: fullName.trim(),
          businessName: businessName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          facebook: facebook.trim(),
          instagram: instagram.trim(),
          existingWebsite: existingWebsite.trim(),
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
    return <PaymentPanel result={paymentResult} amount={total} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OrderSummary />

      <UpgradeSelector selected={upgrade} onSelect={setUpgrade} />

      <FinalSummary upgrade={upgrade} />

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full Name" htmlFor="fullName">
            <input id="fullName" className={inputClasses} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="Business Name" htmlFor="businessName">
            <input
              id="businessName"
              className={inputClasses}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </Field>
          <Field
            label="Email"
            htmlFor="email"
            error={touched && email.length > 0 && !emailValid ? "Enter a valid email address." : undefined}
          >
            <input
              id="email"
              type="email"
              className={inputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Mobile Number" htmlFor="phone">
            <input id="phone" type="tel" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </Field>
          <Field label="Facebook Page" htmlFor="facebook" optional>
            <input id="facebook" className={inputClasses} value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          </Field>
          <Field label="Instagram" htmlFor="instagram" optional>
            <input id="instagram" className={inputClasses} value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </Field>
          <Field label="Existing Website" htmlFor="existingWebsite" optional>
            <input
              id="existingWebsite"
              className={inputClasses}
              value={existingWebsite}
              onChange={(e) => setExistingWebsite(e.target.value)}
            />
          </Field>
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
              I have read and agree to the <LegalLink label="Terms of Sale" onOpen={() => openLegal("fyb-terms")} /> and{" "}
              <LegalLink label="Refund Policy" onOpen={() => openLegal("fyb-refund")} />.
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
              <LegalLink label="Privacy Notice" onOpen={() => openLegal("fyb-privacy")} />, to deliver this service.
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm text-ink/75">
            <input
              type="checkbox"
              checked={reviewedConfirmed}
              onChange={(e) => setReviewedConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
            />
            <span>
              I've reviewed the order summary above — the package inclusions and pricing
              {upgrade !== "none" ? ", including the annual renewal terms for my selected upgrade" : ""}.
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

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-4 text-base font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-ink/10 disabled:text-ink/60 disabled:shadow-none sm:w-auto"
        >
          {submitting ? "Starting your payment..." : `PAY ${formatPhp(total)} & START →`}
        </button>
      </div>
    </form>
  );
}

function PageContent() {
  useEffect(() => {
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
        <CheckoutForm />
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
