// Public, unauthenticated proposal viewing + e-signature page
// (CLAUDEproposalquestionnaire.md), reached at /proposal/:slug?t=TOKEN.
// Reads/writes the shared D1 database directly via this repo's own
// Cloudflare Pages Functions (functions/api/public/proposal/*) -- see
// clienthub/d1/schema.sql's "Proposals & Questionnaires" section for why
// this repo, not clienthub/clientkeeper, serves this page (the operator's
// explicit choice to keep the literal www.altasme.com domain).
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BRAND } from "../content/site";
import SignaturePad, { type SignaturePadHandle } from "../components/wsa/SignaturePad";

interface ProposalData {
  title: string;
  contentHtml: string;
  status: string;
  hasQuestionnaire: boolean;
  signature: { signerName: string; signedAt: string } | null;
}

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<"signed" | null>(null);
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
      .then(setData)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."));
  }, [slug, token]);

  const canSubmit = useMemo(() => signerName.trim().length > 1 && hasSignature && agreed, [signerName, hasSignature, agreed]);

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
    try {
      const response = await fetch(`/api/public/proposal/${encodeURIComponent(slug)}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          t: token,
          signerName: signerName.trim(),
          signerTitle: signerTitle.trim() || undefined,
          signatureDataUrl: sig.toDataUrl(),
          agreed: true,
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error((body as { error?: string } | null)?.error || "Something went wrong. Please try again.");

      setResult("signed");
      const next = (body as { nextQuestionnaire: { slug: string; token: string } | null }).nextQuestionnaire;
      if (next) {
        setTimeout(() => navigate(`/questions/${next.slug}?t=${encodeURIComponent(next.token)}`), 1800);
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

  return (
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{data.title}</h1>

        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="proposal-content" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        </div>

        {alreadySigned ? (
          <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-6 text-center sm:p-10">
            <h2 className="text-xl font-bold text-green-800">
              {result === "signed" ? "Thank you, this proposal has been signed." : `Signed by ${data.signature?.signerName ?? "the client"}.`}
            </h2>
            {result === "signed" && data.hasQuestionnaire && (
              <p className="mt-2 text-sm text-green-700">Taking you to the next step&hellip;</p>
            )}
            {result === "signed" && !data.hasQuestionnaire && (
              <p className="mt-2 text-sm text-green-700">We'll be in touch about next steps shortly.</p>
            )}
          </div>
        ) : (
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

            {submitError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
            >
              {submitting ? "Submitting..." : "Submit and Accept"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
