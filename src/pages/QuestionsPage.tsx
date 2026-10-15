// Public, unauthenticated questionnaire-filling page
// (CLAUDEproposalquestionnaire.md), reached at /questions/:slug?t=TOKEN
// -- typically arrived at via redirect right after signing the
// associated proposal, but also a standalone direct link.
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BRAND } from "../content/site";

type FieldType = "short_text" | "long_text" | "single_choice" | "multi_choice" | "dropdown" | "yes_no" | "date" | "url" | "file";

interface Question {
  id: string;
  sectionHeading: string | null;
  sectionDescription: string | null;
  prompt: string;
  helpText: string | null;
  fieldType: FieldType;
  isRequired: boolean;
  options: string[];
}

interface QuestionnaireData {
  title: string;
  description: string | null;
  questions: Question[];
}

type AnswerValue =
  | { kind: "text"; value: string }
  | { kind: "list"; value: string[] }
  | { kind: "file"; url: string | null; fileName: string | null; uploading: boolean; error: string | null };

function defaultAnswer(q: Question): AnswerValue {
  if (q.fieldType === "multi_choice") return { kind: "list", value: [] };
  if (q.fieldType === "file") return { kind: "file", url: null, fileName: null, uploading: false, error: null };
  return { kind: "text", value: "" };
}

export default function QuestionsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";

  const [data, setData] = useState<QuestionnaireData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
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
      .then((d) => {
        setData(d);
        const initial: Record<string, AnswerValue> = {};
        for (const q of d.questions) initial[q.id] = defaultAnswer(q);
        setAnswers(initial);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."));
  }, [slug, token]);

  function setTextAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: { kind: "text", value } }));
  }
  function toggleListAnswer(id: string, option: string) {
    setAnswers((prev) => {
      const current = prev[id];
      const list = current?.kind === "list" ? current.value : [];
      const next = list.includes(option) ? list.filter((o) => o !== option) : [...list, option];
      return { ...prev, [id]: { kind: "list", value: next } };
    });
  }

  async function handleFileChange(q: Question, file: File | null) {
    if (!file || !slug) return;
    setAnswers((prev) => ({ ...prev, [q.id]: { kind: "file", url: null, fileName: file.name, uploading: true, error: null } }));
    try {
      const form = new FormData();
      form.set("file", file);
      const res = await fetch(`/api/public/questionnaire/${encodeURIComponent(slug)}/upload?t=${encodeURIComponent(token)}`, { method: "POST", body: form });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error((body as { error?: string } | null)?.error || "Upload failed.");
      setAnswers((prev) => ({ ...prev, [q.id]: { kind: "file", url: (body as { url: string }).url, fileName: file.name, uploading: false, error: null } }));
    } catch (err) {
      setAnswers((prev) => ({ ...prev, [q.id]: { kind: "file", url: null, fileName: file.name, uploading: false, error: err instanceof Error ? err.message : "Upload failed." } }));
    }
  }

  function validate(): string | null {
    if (!data) return "Not loaded.";
    for (const q of data.questions) {
      if (!q.isRequired) continue;
      const a = answers[q.id];
      if (!a) return `Please answer: ${q.prompt}`;
      if (a.kind === "text" && !a.value.trim()) return `Please answer: ${q.prompt}`;
      if (a.kind === "list" && a.value.length === 0) return `Please answer: ${q.prompt}`;
      if (a.kind === "file" && !a.url) return `Please upload a file for: ${q.prompt}`;
    }
    for (const q of data.questions) {
      const a = answers[q.id];
      if (a?.kind === "file" && a.uploading) return "Please wait for all uploads to finish.";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || submitting) return;
    const validationError = validate();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = Object.entries(answers).map(([questionId, a]) => {
        if (a.kind === "list") return { questionId, value: a.value };
        if (a.kind === "file") return { questionId, fileUrl: a.url, fileName: a.fileName };
        return { questionId, value: a.value };
      });
      const res = await fetch(`/api/public/questionnaire/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, answers: payload }),
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
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">Your responses have been submitted. We'll be in touch soon.</p>
      </div>
    );
  }

  let lastSection: string | null | undefined = undefined;

  return (
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">{data.title}</h1>
        {data.description && <p className="mt-3 text-sm leading-relaxed text-ink/60">{data.description}</p>}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {data.questions.map((q) => {
            const showSection = q.sectionHeading && q.sectionHeading !== lastSection;
            lastSection = q.sectionHeading ?? lastSection;
            const answer = answers[q.id];

            return (
              <div key={q.id}>
                {showSection && (
                  <div className="mb-3 mt-8 border-b border-ink/10 pb-2 first:mt-0">
                    <h2 className="text-lg font-bold text-brand-navy">{q.sectionHeading}</h2>
                    {q.sectionDescription && <p className="mt-1 text-sm text-ink/60">{q.sectionDescription}</p>}
                  </div>
                )}

                <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <label className="block text-sm font-semibold text-ink">
                    {q.prompt}
                    {q.isRequired && <span className="ml-1 text-red-500">*</span>}
                  </label>
                  {q.helpText && <p className="mt-0.5 text-xs text-ink/50">{q.helpText}</p>}

                  <div className="mt-3">
                    {q.fieldType === "short_text" && (
                      <input
                        type="text"
                        value={answer?.kind === "text" ? answer.value : ""}
                        onChange={(e) => setTextAnswer(q.id, e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    )}
                    {q.fieldType === "long_text" && (
                      <textarea
                        rows={4}
                        value={answer?.kind === "text" ? answer.value : ""}
                        onChange={(e) => setTextAnswer(q.id, e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    )}
                    {q.fieldType === "url" && (
                      <input
                        type="url"
                        placeholder="https://..."
                        value={answer?.kind === "text" ? answer.value : ""}
                        onChange={(e) => setTextAnswer(q.id, e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    )}
                    {q.fieldType === "date" && (
                      <input
                        type="date"
                        value={answer?.kind === "text" ? answer.value : ""}
                        onChange={(e) => setTextAnswer(q.id, e.target.value)}
                        className="rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      />
                    )}
                    {q.fieldType === "dropdown" && (
                      <select
                        value={answer?.kind === "text" ? answer.value : ""}
                        onChange={(e) => setTextAnswer(q.id, e.target.value)}
                        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                      >
                        <option value="">Choose one&hellip;</option>
                        {q.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    )}
                    {q.fieldType === "yes_no" && (
                      <div className="flex gap-4">
                        {["Yes", "No"].map((o) => (
                          <label key={o} className="flex items-center gap-2 text-sm text-ink/80">
                            <input type="radio" name={q.id} checked={(answer?.kind === "text" ? answer.value : "") === o} onChange={() => setTextAnswer(q.id, o)} />
                            {o}
                          </label>
                        ))}
                      </div>
                    )}
                    {q.fieldType === "single_choice" && (
                      <div className="space-y-2">
                        {q.options.map((o) => (
                          <label key={o} className="flex items-center gap-2 text-sm text-ink/80">
                            <input type="radio" name={q.id} checked={(answer?.kind === "text" ? answer.value : "") === o} onChange={() => setTextAnswer(q.id, o)} />
                            {o}
                          </label>
                        ))}
                      </div>
                    )}
                    {q.fieldType === "multi_choice" && (
                      <div className="space-y-2">
                        {q.options.map((o) => (
                          <label key={o} className="flex items-center gap-2 text-sm text-ink/80">
                            <input type="checkbox" checked={answer?.kind === "list" ? answer.value.includes(o) : false} onChange={() => toggleListAnswer(q.id, o)} />
                            {o}
                          </label>
                        ))}
                      </div>
                    )}
                    {q.fieldType === "file" && (
                      <div>
                        <input type="file" onChange={(e) => handleFileChange(q, e.target.files?.[0] ?? null)} className="text-sm" />
                        {answer?.kind === "file" && answer.uploading && <p className="mt-1 text-xs text-ink/50">Uploading&hellip;</p>}
                        {answer?.kind === "file" && answer.url && <p className="mt-1 text-xs text-green-700">Uploaded: {answer.fileName}</p>}
                        {answer?.kind === "file" && answer.error && <p className="mt-1 text-xs text-red-600">{answer.error}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {submitError && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </main>
    </div>
  );
}
