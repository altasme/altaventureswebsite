// Public, unauthenticated mailbox request page (CLAUDE.md §74), reached at
// /mailbox-request/:slug?t=TOKEN from a one-time link staff generate in
// ClientKeeper for one client's email service and send by hand. Same
// conventions as ProposalPage/QuestionsPage: plain fetch() against this
// repo's own Pages Functions (functions/api/public/mailbox-request/*), no
// ModalProvider/ContactModal, noindex, lazy-loaded.
//
// The client picks a name (and a domain, if the service has more than
// one) and submits once. That creates a request staff then set up by hand
// in Z.com; nothing here creates a real mailbox or asks for a password.
// The link is spent on success, so a reload lands on the "no longer
// valid" state; the confirmation screen is the end of the flow.
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { BRAND } from "../content/site";

interface LinkData {
  businessName: string;
  domains: { id: string; domain: string }[];
  allowance: { total: number; used: number; available: number };
  pendingRequestAddress: string | null;
  acceptingRequests: boolean;
}

// Mirrors the server's normalizeLocalPart (functions/_lib/publicDocs.ts),
// itself a copy of ClientKeeper's: the server is what actually decides.
function localPartProblem(raw: string): string | null {
  const l = raw.trim().toLowerCase();
  if (!l) return null;
  if (l.length > 64) return "Keep it to 64 characters or fewer.";
  if (!/^[a-z0-9._+-]+$/.test(l)) return "Use only letters, numbers, dots, dashes, underscores and plus signs (no spaces).";
  if (l.startsWith(".") || l.endsWith(".")) return "It can't start or end with a dot.";
  if (l.includes("..")) return "It can't have two dots in a row.";
  return null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-10 sm:py-14">{children}</main>
    </div>
  );
}

export default function MailboxRequestPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";

  const [data, setData] = useState<LinkData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [localPart, setLocalPart] = useState("");
  const [domainId, setDomainId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [requested, setRequested] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Request a Mailbox | ${BRAND.name}`;
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
    fetch(`/api/public/mailbox-request/${encodeURIComponent(slug)}?t=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new Error((body as { error?: string } | null)?.error || "This link isn't valid or has already been used.");
        return body as LinkData;
      })
      .then((d) => {
        setData(d);
        if (d.domains[0]) setDomainId(d.domains[0].id);
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Something went wrong."));
  }, [slug, token]);

  const problem = useMemo(() => localPartProblem(localPart), [localPart]);
  const chosenDomain = data?.domains.find((d) => d.id === domainId) ?? null;
  const canSubmit = !!localPart.trim() && !problem && !!chosenDomain && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug || !canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(`/api/public/mailbox-request/${encodeURIComponent(slug)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, localPart: localPart.trim(), domainId }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string; address?: string } | null;
      if (!response.ok) {
        // The link was spent or revoked while the page was open: show the
        // same end state a reload would.
        if (response.status === 404) {
          setLoadError(body?.error || "This link isn't valid or has already been used.");
          return;
        }
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }
      setRequested(body?.address ?? `${localPart.trim().toLowerCase()}@${chosenDomain!.domain}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return (
      <Shell>
        <div className="rounded-3xl border border-ink/10 bg-white p-6 text-center shadow-sm sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy">This link can&rsquo;t be used</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">{loadError}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">If you already sent a request with it, you&rsquo;re all set: we&rsquo;ll be in touch once your mailbox is ready.</p>
        </div>
      </Shell>
    );
  }
  if (!data) return <div className="flex min-h-screen items-center justify-center bg-paper-alt text-sm text-ink/60">Loading&hellip;</div>;

  if (requested) {
    return (
      <Shell>
        <div className="rounded-3xl border border-green-200 bg-green-50 p-6 text-center sm:p-10">
          <h1 className="text-2xl font-extrabold tracking-tight text-green-800">We&rsquo;ve got your request.</h1>
          <p className="mt-4 text-sm text-green-800">
            You asked for <span className="break-all font-mono font-semibold">{requested}</span>.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-green-700">
            Our team will set it up and get in touch with your login details. There&rsquo;s nothing else you need to do, and you can close this page.
          </p>
        </div>
      </Shell>
    );
  }

  const blockedMessage = !data.acceptingRequests
    ? "New mailboxes can't be requested on this email service right now. Please contact us and we'll sort it out."
    : data.pendingRequestAddress
      ? `Your request for ${data.pendingRequestAddress} is still being set up. You can request another mailbox once it's done.`
      : data.allowance.available === 0
        ? "There are no mailbox slots left on your plan. Please contact us if you'd like to add more."
        : null;

  return (
    <Shell>
      <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">Request a mailbox</h1>
      <p className="mt-3 text-sm text-ink/70">
        Hi {data.businessName}! Choose the email address you&rsquo;d like. We&rsquo;ll set it up for you and send you the login details.
      </p>

      <div className="mt-6 rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm">
        <p className="text-ink/70">
          <span className="font-semibold text-brand-navy">{data.allowance.available}</span> of {data.allowance.total} mailbox{data.allowance.total === 1 ? "" : "es"} available on your plan
        </p>
      </div>

      {blockedMessage ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">{blockedMessage}</div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <label htmlFor="mailbox-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/60">
            Email address
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              id="mailbox-name"
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={localPart}
              onChange={(e) => setLocalPart(e.target.value)}
              placeholder="hello"
              aria-invalid={!!problem}
              aria-describedby="mailbox-name-help"
              className="w-full min-w-0 rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 sm:flex-1"
            />
            {data.domains.length > 1 ? (
              <select
                aria-label="Domain"
                value={domainId}
                onChange={(e) => setDomainId(e.target.value)}
                className="w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 sm:w-auto"
              >
                {data.domains.map((d) => (
                  <option key={d.id} value={d.id}>
                    @{d.domain}
                  </option>
                ))}
              </select>
            ) : (
              <span className="break-all text-sm font-semibold text-ink/70">@{chosenDomain?.domain}</span>
            )}
          </div>
          <p id="mailbox-name-help" className={`mt-2 text-xs ${problem ? "text-red-700" : "text-ink/60"}`}>
            {problem ?? "Letters, numbers, dots, dashes, underscores and plus signs. For example: hello, sales, ana.cruz"}
          </p>

          {localPart.trim() && !problem && chosenDomain && (
            <p className="mt-4 text-sm text-ink/70">
              You&rsquo;re requesting <span className="break-all font-mono font-semibold text-brand-navy">{`${localPart.trim().toLowerCase()}@${chosenDomain.domain}`}</span>
            </p>
          )}

          {submitError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-ink/10 disabled:text-ink/60 disabled:shadow-none"
          >
            {submitting ? "Sending request..." : "Request this mailbox"}
          </button>
          <p className="mt-3 text-xs text-ink/60">This link works once. You won&rsquo;t need to create an account.</p>
        </form>
      )}
    </Shell>
  );
}
