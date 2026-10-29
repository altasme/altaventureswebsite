// Public, unauthenticated proposal viewing + e-signature page
// (CLAUDEproposalquestionnaire.md), reached at /proposal/:slug?t=TOKEN.
// Reads/writes the shared D1 database directly via this repo's own
// Cloudflare Pages Functions (functions/api/public/proposal/*) -- see
// clienthub/d1/schema.sql's "Proposals & Questionnaires" section for why
// this repo, not clienthub/clientkeeper, serves this page (the operator's
// explicit choice to keep the literal www.altasme.com domain).
//
// [2026-10-29] CLAUDE.md §67: adds an "already signed by Altaventures"
// trust signal, a post-signature payment screen (configured per proposal
// in ClientKeeper), and an optional "email me a copy" checkbox that
// generates a real client-side PDF (src/lib/proposalPdf.ts) and emails it.
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BRAND } from "../content/site";
import { WSA_ALTA_SIGNER } from "../content/wsa";
import SignaturePad, { type SignaturePadHandle } from "../components/wsa/SignaturePad";
import { whatsappUrl, viberUrl, messengerUrl, buildProposalPaymentPrefill } from "../lib/contact";
import { generateSignedProposalPdfBase64 } from "../lib/proposalPdf";

interface ProposalPayment {
  amountLabel: string;
  gcashNumber: string;
  gcashAccountName: string;
  bankNote: string;
  markedPaidAt: string | null;
}

interface ProposalData {
  title: string;
  contentHtml: string;
  status: string;
  hasQuestionnaire: boolean;
  signature: { signerName: string; signedAt: string } | null;
  contactEmail: string | null;
  altaventuresSignedAt: string;
  payment: ProposalPayment | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProposalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const navigate = useNavigate();

  const [data, setData] = useState<ProposalData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [wantsEmailCopy, setWantsEmailCopy] = useState(false);
  const [wantsFreebies, setWantsFreebies] = useState(false);
  const [emailCopyAddress, setEmailCopyAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<"signed" | null>(null);
  const [signedInfo, setSignedInfo] = useState<{ signerName: string; signerTitle: string | null; signatureDataUrl: string; signedAt: string } | null>(null);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [gcashCopied, setGcashCopied] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [paidMarked, setPaidMarked] = useState(false);
  const [finalThanks, setFinalThanks] = useState(false);
  const sigRef = useRef<SignaturePadHandle>(null);

  useEffect(() => {
    document.title = `Proposal | ${BRAND.name}`;
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/public/proposal/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error((body as { error?: string } | null)?.error || "This proposal link isn't valid.");
        return body as ProposalData;
      })
      .then((d) => {
        setData(d);
        if (d.contactEmail) setEmailCopyAddress(d.contactEmail);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."));
  }, [slug, token]);

  const wantsAnyEmail = wantsEmailCopy || wantsFreebies;
  const canSubmit = useMemo(() => {
    const base = signerName.trim().length > 1 && hasSignature && agreed;
    if (!wantsAnyEmail) return base;
    return base && EMAIL_PATTERN.test(emailCopyAddress.trim());
  }, [signerName, hasSignature, agreed, wantsAnyEmail, emailCopyAddress]);

  // What's still missing before Submit will enable -- without this, a
  // disabled button gives zero indication of why (most commonly hit by
  // checking an email checkbox and leaving the revealed email field
  // blank or invalid, which silently blocks submission with no visible
  // cause otherwise).
  const missingBeforeSubmit = useMemo(() => {
    const missing: string[] = [];
    if (signerName.trim().length <= 1) missing.push("your full name");
    if (!hasSignature) missing.push("your signature");
    if (!agreed) missing.push("the agreement checkbox");
    if (wantsAnyEmail && !EMAIL_PATTERN.test(emailCopyAddress.trim())) missing.push("a valid email address");
    return missing;
  }, [signerName, hasSignature, agreed, wantsAnyEmail, emailCopyAddress]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !canSubmit || submitting) return;
    const sig = sigRef.current;
    if (!sig || sig.isEmpty()) {
      setSubmitError("Please draw your signature first.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const signatureDataUrl = sig.toDataUrl();
    try {
      const response = await fetch(`/api/public/proposal/${encodeURIComponent(slug)}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t: token,
          signerName: signerName.trim(),
          signerTitle: signerTitle.trim() || undefined,
          signatureDataUrl,
          agreed: true,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error((body as { error?: string } | null)?.error || "Something went wrong. Please try again.");

      const nowIso = new Date().toISOString();
      setResult("signed");
      setSignedInfo({
        signerName: signerName.trim(),
        signerTitle: signerTitle.trim() || null,
        signatureDataUrl,
        signedAt: nowIso,
      });

      // Fire-and-forget: generating and emailing the PDF never blocks the
      // payment screen from showing immediately below. One email covers
      // both checkboxes -- checking "Send the freebies" alone still
      // attaches the proposal copy (per the operator's own spec), so
      // there's never a reason to fire two separate sends.
      if (wantsAnyEmail && data) {
        setEmailCopyStatus("sending");
        generateSignedProposalPdfBase64({
          title: data.title,
          contentHtml: data.contentHtml,
          altaventuresSignedAtLabel: new Date(data.altaventuresSignedAt).toLocaleDateString(),
          clientSignerName: signerName.trim(),
          clientSignerTitle: signerTitle.trim() || null,
          clientSignatureDataUrl: signatureDataUrl,
          clientSignedAtLabel: new Date(nowIso).toLocaleString(),
        })
          .then((pdfBase64) =>
            fetch(`/api/public/proposal/${encodeURIComponent(slug)}/email-copy`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ t: token, email: emailCopyAddress.trim(), pdfBase64, includeFreebies: wantsFreebies }),
            })
          )
          .then((res) => setEmailCopyStatus(res.ok ? "sent" : "error"))
          .catch(() => setEmailCopyStatus("error"));
      }

      // No payment step configured for this proposal -- fall back to the
      // original behavior (auto-advance to the linked questionnaire, if
      // any, shortly after signing).
      if (!data?.payment) {
        const next = (body as { nextQuestionnaire: { slug: string; token: string } | null }).nextQuestionnaire;
        if (next) {
          setTimeout(() => navigate(`/questions/${next.slug}?t=${encodeURIComponent(next.token)}`), 1800);
        } else {
          setFinalThanks(true);
        }
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDonePaying() {
    if (!slug || markingPaid) return;
    setMarkingPaid(true);
    try {
      const response = await fetch(`/api/public/proposal/${encodeURIComponent(slug)}/mark-paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token }),
      });
      const body = await response.json().catch(() => null);
      setPaidMarked(true);
      const next = (body as { nextQuestionnaire: { slug: string; token: string } | null } | null)?.nextQuestionnaire;
      if (response.ok && next) {
        navigate(`/questions/${next.slug}?t=${encodeURIComponent(next.token)}`);
      } else {
        setFinalThanks(true);
      }
    } catch {
      // Even if the network call failed, don't trap the client on the
      // payment screen -- they already paid (or tried to); show the
      // same reassuring close as a successful mark.
      setPaidMarked(true);
      setFinalThanks(true);
    } finally {
      setMarkingPaid(false);
    }
  }

  function handleCopyGcash() {
    if (!data?.payment) return;
    navigator.clipboard.writeText(data.payment.gcashNumber).then(() => {
      setGcashCopied(true);
      setTimeout(() => setGcashCopied(false), 2000);
    });
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper-alt px-6 py-16 text-center">
        <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-8 w-auto" />
        <p className="mt-8 max-w-md text-sm text-ink/70">{loadError}</p>
      </div>
    );
  }
  if (!data) return <div className="flex min-h-screen items-center justify-center bg-paper-alt text-sm text-ink/50">Loading&hellip;</div>;

  const alreadySigned = data.status === "signed" || result === "signed";
  // On a fresh sign, use the locally-captured signature for an instant,
  // no-extra-fetch display; on a page revisit the server's own record
  // (data.signature) is all there is.
  const displaySignature = result === "signed" && signedInfo ? { signerName: signedInfo.signerName, signedAt: signedInfo.signedAt } : data.signature;
  const showPayment = alreadySigned && !!data.payment && !finalThanks;
  const paymentAlreadyMarked = paidMarked || !!data.payment?.markedPaidAt;
  const paymentPrefill = buildProposalPaymentPrefill(data.title);

  return (
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{data.title}</h1>

        {!alreadySigned && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
            <img src="/images/brand/alta-signature.png" alt="" aria-hidden="true" className="h-8 w-auto shrink-0" />
            <p className="text-sm text-green-800">
              <span className="font-semibold">Already signed by {BRAND.name}.</span> This proposal has been reviewed and authorized by{" "}
              {WSA_ALTA_SIGNER}, {BRAND.name}'s founder &mdash; it only needs your signature below to move forward.
            </p>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="proposal-content" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        </div>

        {!alreadySigned && (
          <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-brand-navy">Accept This Proposal</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">Full Name / Authorized Representative</label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">Title / Position (optional)</label>
                <input
                  type="text"
                  value={signerTitle}
                  onChange={(e) => setSignerTitle(e.target.value)}
                  className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink/60">Signature</p>
              <SignaturePad ref={sigRef} onChangeEmpty={(empty) => setHasSignature(!empty)} />
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm text-ink/75">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue" />
              I have read and agree to this proposal and the applicable service agreement, and I consent to signing electronically.
            </label>

            <label className="mt-4 flex items-start gap-3 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={wantsEmailCopy}
                onChange={(e) => setWantsEmailCopy(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
              />
              Send a copy of the proposal via email
            </label>

            <label className="mt-3 flex items-start gap-3 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={wantsFreebies}
                onChange={(e) => setWantsFreebies(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
              />
              Send the freebies to my email
            </label>

            {wantsAnyEmail && (
              <div className="ml-7 mt-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailCopyAddress}
                  onChange={(e) => setEmailCopyAddress(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full max-w-sm rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                />
              </div>
            )}

            {submitError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

            {!canSubmit && !submitting && missingBeforeSubmit.length > 0 && (
              <p className="mt-4 text-xs text-ink/60">Before you can submit, we still need: {missingBeforeSubmit.join(", ")}.</p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        )}

        {alreadySigned && (
          <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-6 text-center sm:p-10">
            <h2 className="text-xl font-bold text-green-800">
              {result === "signed" ? "Thank you, this proposal has been signed." : `Signed by ${displaySignature?.signerName ?? "the client"}.`}
            </h2>
            {emailCopyStatus === "sending" && (
              <p className="mt-2 text-xs text-green-700">{wantsFreebies ? "Emailing you a copy and the freebies…" : "Emailing you a copy…"}</p>
            )}
            {emailCopyStatus === "sent" && (
              <p className="mt-2 text-xs text-green-700">
                {wantsFreebies ? `A copy and the freebies were emailed to ${emailCopyAddress}.` : `A copy was emailed to ${emailCopyAddress}.`}
              </p>
            )}
            {emailCopyStatus === "error" && <p className="mt-2 text-xs text-amber-700">We couldn't email that right now &mdash; you can still download/print it later.</p>}
            {!showPayment && !finalThanks && data.hasQuestionnaire && result === "signed" && (
              <p className="mt-2 text-sm text-green-700">Taking you to the next step&hellip;</p>
            )}
            {!showPayment && !finalThanks && !data.hasQuestionnaire && (
              <p className="mt-2 text-sm text-green-700">We'll be in touch about next steps shortly.</p>
            )}
            {finalThanks && <p className="mt-2 text-sm text-green-700">We'll be in touch about next steps shortly.</p>}
          </div>
        )}

        {showPayment && data.payment && (
          <div className="mt-6 rounded-3xl border border-brand-blue/20 bg-white p-6 shadow-lg shadow-brand-blue/5 sm:p-10">
            <h2 className="text-xl font-bold text-brand-navy">Let's Get Your Project Started</h2>
            <p className="mt-2 text-sm text-ink/70">
              In order to commence the website project, please pay the initial development fee:
            </p>

            <div className="mt-5 rounded-2xl bg-brand-blue/5 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Amount</p>
              <p className="text-3xl font-extrabold tracking-tight text-brand-blue">{data.payment.amountLabel}</p>
            </div>

            <div className="mt-5 rounded-2xl border border-ink/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Payment Method</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-lg font-bold text-brand-navy">GCash: {data.payment.gcashNumber}</p>
                <button
                  type="button"
                  onClick={handleCopyGcash}
                  className="rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-brand-navy hover:border-brand-blue hover:text-brand-blue"
                >
                  {gcashCopied ? "Copied!" : "Copy Number"}
                </button>
              </div>
              <p className="mt-1 text-sm text-ink/70">Account name: {data.payment.gcashAccountName}</p>
              {data.payment.bankNote && <p className="mt-3 text-sm text-ink/60">{data.payment.bankNote}</p>}
            </div>

            <p className="mt-6 text-sm font-semibold text-ink/80">Please send your payment screenshot to {BRAND.name}:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={whatsappUrl(paymentPrefill)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                WhatsApp
              </a>
              <a href={messengerUrl()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b57cc]">
                Messenger
              </a>
              <a href={viberUrl()} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#7360F2] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                Viber
              </a>
            </div>

            <button
              type="button"
              onClick={handleDonePaying}
              disabled={markingPaid || paymentAlreadyMarked}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
            >
              {paymentAlreadyMarked ? "Thanks, we've noted your payment!" : markingPaid ? "Just a moment..." : "Done Paying"}
            </button>
            <p className="mt-2 text-xs text-ink/50">Your signature is already recorded &mdash; this step just gets your project moving.</p>
          </div>
        )}
      </main>
    </div>
  );
}
