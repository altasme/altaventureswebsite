import { useEffect, useState } from "react";
import { BRAND } from "../content/site";
import { THANK_YOU, DEVELOPER_HANDOFF } from "../content/foryourbusiness";
import { FYB_PREFILL } from "../lib/contact";
import { track, initMetaPixel } from "../lib/analytics";
import { ModalProvider, useModals } from "../lib/modalContext";
import ContactModal from "../components/modals/ContactModal";

const PAGE_TITLE = "Payment Received | Altaventures";

// Replaces the old AccountPanel/Client Hub link entirely [2026-10-04] — no
// account creation or Client Hub access anywhere in this purchase journey.
// The CTA opens the same three-channel ContactModal used everywhere else
// on the site; there's no automated developer-assignment system to link
// to, so "talk to your developer" is honestly a real person replying to a
// chat message, same as the rest of this site already works.
function DeveloperHandoffPanel({ reference }: { reference: string | null }) {
  const { openContactModal } = useModals();

  return (
    <div className="mt-6 rounded-2xl border border-ink/10 bg-paper-alt px-6 py-5 text-center">
      <p className="text-base font-bold text-brand-navy">{DEVELOPER_HANDOFF.headline}</p>
      {reference && (
        <div className="mt-3 inline-flex flex-col items-center gap-1 rounded-xl bg-white px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">{THANK_YOU.referenceLabel}</span>
          <code className="font-mono text-sm font-semibold text-brand-navy">{reference}</code>
        </div>
      )}
      <p className="mt-3 text-sm text-ink/60">{DEVELOPER_HANDOFF.body}</p>
      <button
        type="button"
        onClick={() => openContactModal("thank-you-developer", FYB_PREFILL)}
        className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-[#0b57cc]"
      >
        {DEVELOPER_HANDOFF.cta} &rarr;
      </button>
    </div>
  );
}

function PageContent() {
  const { openContactModal } = useModals();
  const [reference, setReference] = useState<string | null>(null);

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
    setReference(new URLSearchParams(window.location.search).get("ref"));
    track("payment_return", {});
    return () => {
      document.title = "Altaventures: Websites, Booking Systems & Business Digitalization (Philippines)";
      meta?.setAttribute("content", "index, follow");
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4 lg:px-8">
          <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto sm:h-8" />
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center lg:px-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">{THANK_YOU.headline}</h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink/70">{THANK_YOU.body}</p>

        <div className="w-full max-w-md">
          <DeveloperHandoffPanel reference={reference} />
        </div>

        <div className="mt-6 rounded-2xl border border-ink/10 bg-paper-alt px-6 py-5">
          <p className="text-sm text-ink/60">{THANK_YOU.microcopy}</p>
          <button
            type="button"
            onClick={() => openContactModal("thank-you", FYB_PREFILL)}
            className="mt-3 text-sm font-semibold text-brand-blue hover:underline"
          >
            {THANK_YOU.cta} &rarr;
          </button>
        </div>
      </main>

      <ContactModal />
    </div>
  );
}

export default function ForYourBusinessThankYouPage() {
  return (
    <ModalProvider>
      <PageContent />
    </ModalProvider>
  );
}
