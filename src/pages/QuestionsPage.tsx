// Public, unauthenticated questionnaire-filling page
// (CLAUDEproposalquestionnaire.md), reached at /questions/:slug?t=TOKEN
// -- typically arrived at via redirect right after signing the
// associated proposal, but also a standalone direct link.
//
// [Redesigned 2026-10-15] Previously rendered a structured, multi-field-
// type question list (short text, choices, dates, file uploads, etc.).
// Replaced with the exact same shape as the public proposal page, per
// the operator's direct request ("can the questionnaire be the same as
// the proposal? Free text field for ease for us"): the content is
// read-only rich text (rendered via the shared .proposal-content class,
// same as ProposalPage.tsx), and the client replies in one open text
// box, no per-question setup or validation beyond "don't submit empty."
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BRAND } from "../content/site";

interface QuestionnaireData {
  title: string;
  contentHtml: string;
}

export default function QuestionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";

  const [data, setData] = useState<QuestionnaireData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = `Questionnaire | ${BRAND.name}`;
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
    fetch(`/api/public/questionnaire/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error((body as { error?: string } | null)?.error || "This questionnaire link isn't valid.");
        return body as QuestionnaireData;
      })
      .then(setData)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."));
  }, [slug, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || submitting) return;
    if (!answerText.trim()) {
      setSubmitError("Please write a response before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/public/questionnaire/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, answerText: answerText.trim() }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error((body as { error?: string } | null)?.error || "Something went wrong. Please try again.");
      setSubmitted(true);
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

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper-alt px-6 py-16 text-center">
        <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-8 w-auto" />
        <h1 className="mt-8 max-w-md text-2xl font-extrabold text-brand-navy sm:text-3xl">Thank You!</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">Your response has been submitted. We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{data.title}</h1>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="proposal-content" dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
            <label className="block text-sm font-semibold text-ink">Your Response</label>
            <textarea
              rows={8}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="mt-3 w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
              placeholder="Write your answer here..."
            />
          </div>

          {submitError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}
