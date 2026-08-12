import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BRAND, type LegalBlock } from "../content/site";
import { WSA_ALTA_SIGNER, WSA_DOCUMENT } from "../content/wsa";
import { bytesToBase64, fillAgreementPdf, todayLabel } from "../lib/wsaPdf";
import { track } from "../lib/analytics";
import SignaturePad, { type SignaturePadHandle } from "../components/wsa/SignaturePad";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AgreementBlock({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case "ul":
      return (
        <ul className="space-y-1.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2 text-[15px] leading-relaxed text-ink/75">
              <span className="mt-0.5 text-brand-blue">•</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case "sh":
      return <h4 className="mt-4 text-sm font-semibold text-ink">{block.text}</h4>;
    case "p":
    default:
      return <p className="text-[15px] leading-relaxed text-ink/75">{block.text}</p>;
  }
}

export default function WsaFreePage() {
  useEffect(() => {
    document.title = `${WSA_DOCUMENT.title} | ${BRAND.name}`;
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

  const today = useMemo(() => todayLabel(), []);
  const sigRef = useRef<SignaturePadHandle>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [businessName, setBusinessName] = useState("");
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [hasReadAgreement, setHasReadAgreement] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasReadAgreement(true);
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const emailValid = EMAIL_PATTERN.test(email.trim());
  const phoneValid = phone.trim().length >= 7;
  const fieldsValid =
    businessName.trim().length > 1 && clientName.trim().length > 1 && emailValid && phoneValid;
  const canProceed = hasReadAgreement && fieldsValid && hasSignature && agreed;

  const missingReasons = [
    !hasReadAgreement && "read the full agreement above",
    !fieldsValid && "fill in all your details correctly",
    !hasSignature && "add your signature",
    !agreed && "check the agreement box",
  ].filter(Boolean) as string[];

  async function buildSignedPdf(): Promise<Uint8Array> {
    const sig = sigRef.current;
    if (!sig || sig.isEmpty()) throw new Error("Please add your signature first.");
    const dataUrl = sig.toDataUrl();
    return fillAgreementPdf({
      businessName: businessName.trim(),
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateLabel: today,
      signaturePngDataUrl: dataUrl,
    });
  }

  async function handleDownload() {
    setErrorMessage("");
    try {
      const bytes = await buildSignedPdf();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Altaventures Free Website Service Agreement - ${businessName.trim() || "signed"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Could not generate the PDF.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canProceed || status === "submitting") return;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const bytes = await buildSignedPdf();
      const pdfBase64 = bytesToBase64(bytes);
      const response = await fetch("/api/submit-wsa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          clientName: clientName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date: today,
          pdfBase64,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body && typeof body.error === "string"
            ? body.error
            : "Something went wrong sending your agreement. Please try again."
        );
      }
      track("wsa_agreement_submit", {});
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper-alt px-6 py-16 text-center">
        <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-8 w-auto" />
        <h1 className="mt-8 max-w-md text-2xl font-extrabold text-brand-navy sm:text-3xl">
          Agreement Submitted
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">
          Thanks, {clientName.trim()}. Your Free Website Service Agreement has been signed and
          submitted for {businessName.trim()}. A signed copy has been sent to{" "}
          <span className="font-medium text-ink">{email.trim()}</span>. We'll be in touch to get
          started.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc]"
        >
          Back to Altaventures
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label={`${BRAND.name} home`}>
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
          </Link>
          <p className="hidden text-xs font-medium text-ink/50 sm:block">Free Website Service Agreement</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          {WSA_DOCUMENT.title}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
          Please read the agreement in full, then fill in your details and sign below to accept.
        </p>

        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="space-y-3">
            {WSA_DOCUMENT.intro.map((block, i) => (
              <AgreementBlock key={i} block={block} />
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {WSA_DOCUMENT.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="mb-3 text-base font-bold text-brand-navy">{section.heading}</h3>
                <div className="space-y-3">
                  {section.blocks.map((block, i) => (
                    <AgreementBlock key={i} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div ref={sentinelRef} className="mt-10 border-t border-dashed border-ink/15 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">
              End of agreement
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-brand-navy">Client Information</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Business Name" htmlFor="businessName">
                <input
                  id="businessName"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={inputClasses}
                  autoComplete="organization"
                />
              </Field>
              <Field label="Client Name / Authorized Representative" htmlFor="clientName">
                <input
                  id="clientName"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={inputClasses}
                  autoComplete="name"
                />
              </Field>
              <Field label="Email" htmlFor="email" error={email.length > 0 && !emailValid ? "Enter a valid email address." : undefined}>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                  autoComplete="email"
                />
              </Field>
              <Field label="Contact Number" htmlFor="phone">
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClasses}
                  autoComplete="tel"
                />
              </Field>
              <Field label="Date">
                <input type="text" value={today} readOnly disabled className={`${inputClasses} bg-paper-alt text-ink/50`} />
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-brand-navy">Altaventures</h2>
            <p className="mt-1 text-sm text-ink/50">Already signed on our side; only the date updates automatically.</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Authorized Representative">
                <input type="text" value={WSA_ALTA_SIGNER} readOnly disabled className={`${inputClasses} bg-paper-alt text-ink/50`} />
              </Field>
              <Field label="Date">
                <input type="text" value={today} readOnly disabled className={`${inputClasses} bg-paper-alt text-ink/50`} />
              </Field>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-brand-navy">Your Signature</h2>
            <p className="mt-1 text-sm text-ink/50">This will be placed on the CLIENT signature line of the agreement.</p>
            <div className="mt-6">
              <SignaturePad ref={sigRef} onChangeEmpty={(empty) => setHasSignature(!empty)} />
            </div>

            <label className="mt-8 flex items-start gap-3 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
              />
              I have read, understood, and agree to the terms of this Free Website Service
              Agreement.
            </label>

            {!canProceed && missingReasons.length > 0 && (
              <p className="mt-4 text-xs text-ink/40">
                Before you continue, please {missingReasons.join(", ")}.
              </p>
            )}

            {errorMessage && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!canProceed}
                className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-white px-6 py-3.5 text-sm font-semibold text-brand-navy transition hover:border-brand-navy/30 hover:bg-paper-alt disabled:cursor-not-allowed disabled:opacity-40"
              >
                Download PDF
              </button>
              <button
                type="submit"
                disabled={!canProceed || status === "submitting"}
                className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
              >
                {status === "submitting" ? "Submitting..." : "Submit Agreement"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/50">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
