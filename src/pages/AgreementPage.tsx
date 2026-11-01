// Public, unauthenticated service agreement viewing + e-signature page
// (CLAUDE.md §29) -- a direct clone of ProposalPage.tsx, reached at
// /agreement/:slug?t=TOKEN. Reads/writes the shared D1 database
// directly via this repo's own Cloudflare Pages Functions
// (functions/api/public/agreement/*).
//
// Two deliberate differences from the proposal page, both the
// operator's own confirmed decision for this clone: no post-signature
// payment screen (signature only, no payment-request step), and no
// "next questionnaire" redirect (sending a signer to an intake
// questionnaire is a sales-funnel concept that belongs to the proposal
// that precedes a contract, not the contract itself). The "email me a
// copy" checkbox is kept (a genuinely useful, standalone capability),
// minus the proposal page's "freebies" option, which is specific to the
// free-website offer's marketing funnel.
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BRAND } from "../content/site";
import { WSA_ALTA_SIGNER } from "../content/wsa";
import SignaturePad, { type SignaturePadHandle } from "../components/wsa/SignaturePad";
import { generateSignedProposalPdfBase64 } from "../lib/proposalPdf";

interface AgreementData {
  title: string;
  contentHtml: string;
  status: string;
  signature: { signerName: string; signedAt: string } | null;
  contactEmail: string | null;
  altaventuresSignedAt: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AgreementPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";

  const [data, setData] = useState<AgreementData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [wantsEmailCopy, setWantsEmailCopy] = useState(false);
  const [emailCopyAddress, setEmailCopyAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<"signed" | null>(null);
  const [signedInfo, setSignedInfo] = useState<{ signerName: string; signerTitle: string | null; signatureDataUrl: string; signedAt: string } | null>(null);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const sigRef = useRef<SignaturePadHandle>(null);

  useEffect(() => {
    document.title = `Service Agreement | ${BRAND.name}`;
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
    fetch(`/api/public/agreement/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error((body as { error?: string } | null)?.error || "This service agreement link isn't valid.");
        return body as AgreementData;
      })
      .then((d) => {
        setData(d);
        if (d.contactEmail) setEmailCopyAddress(d.contactEmail);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."));
  }, [slug, token]);

  const canSubmit = useMemo(() => {
    const base = signerName.trim().length > 1 && hasSignature && agreed;
    if (!wantsEmailCopy) return base;
    return base && EMAIL_PATTERN.test(emailCopyAddress.trim());
  }, [signerName, hasSignature, agreed, wantsEmailCopy, emailCopyAddress]);

  // What's still missing before Submit will enable -- same reasoning as
  // ProposalPage's identical hint: a disabled button with no visible
  // cause is a real, previously-reported bug (CLAUDE.md §69).
  const missingBeforeSubmit = useMemo(() => {
    const missing: string[] = [];
    if (signerName.trim().length <= 1) missing.push("your full name");
    if (!hasSignature) missing.push("your signature");
    if (!agreed) missing.push("the agreement checkbox");
    if (wantsEmailCopy && !EMAIL_PATTERN.test(emailCopyAddress.trim())) missing.push("a valid email address");
    return missing;
  }, [signerName, hasSignature, agreed, wantsEmailCopy, emailCopyAddress]);

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
      const response = await fetch(`/api/public/agreement/${encodeURIComponent(slug)}/sign`, {
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

      // Fire-and-forget: generating and emailing the PDF never blocks
      // the confirmation screen from showing immediately below.
      if (wantsEmailCopy && data) {
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
            fetch(`/api/public/agreement/${encodeURIComponent(slug)}/email-copy`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ t: token, email: emailCopyAddress.trim(), pdfBase64 }),
            })
          )
          .then((res) => setEmailCopyStatus(res.ok ? "sent" : "error"))
          .catch(() => setEmailCopyStatus("error"));
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
              <span className="font-semibold">Already signed by {BRAND.name}.</span> This service agreement has been reviewed and authorized by{" "}
              {WSA_ALTA_SIGNER}, {BRAND.name}'s founder &mdash; it only needs your signature below to move forward.
            </p>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="proposal-content" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        </div>

        {!alreadySigned && (
          <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
            <h2 className="text-xl font-bold text-brand-navy">Accept This Agreement</h2>

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
              I have read and agree to this service agreement, and I consent to signing electronically.
            </label>

            <label className="mt-4 flex items-start gap-3 text-sm text-ink/75">
              <input
                type="checkbox"
                checked={wantsEmailCopy}
                onChange={(e) => setWantsEmailCopy(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 text-brand-blue focus:ring-brand-blue"
              />
              Send a copy of the agreement via email
            </label>

            {wantsEmailCopy && (
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
              {result === "signed" ? "Thank you, this service agreement has been signed." : `Signed by ${displaySignature?.signerName ?? "the client"}.`}
            </h2>
            {emailCopyStatus === "sending" && <p className="mt-2 text-xs text-green-700">Emailing you a copy&hellip;</p>}
            {emailCopyStatus === "sent" && <p className="mt-2 text-xs text-green-700">A copy was emailed to {emailCopyAddress}.</p>}
            {emailCopyStatus === "error" && <p className="mt-2 text-xs text-amber-700">We couldn't email that right now &mdash; you can still download/print it later.</p>}
            <p className="mt-2 text-sm text-green-700">We'll be in touch about next steps shortly.</p>
          </div>
        )}
      </main>
    </div>
  );
}
