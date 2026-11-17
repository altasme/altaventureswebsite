// Public, read-only display of the ALTAVENTURES Post-Project Service
// Agreement (content/postProjectServiceAgreement.ts), reached at
// /service-agreement. Unlike /WSA-free and /WSA-pro, this page has no
// signing form of its own -- it exists only so the hyperlink in the
// public proposal page's (ProposalPage.tsx) required "I understand and
// agree to the Altaventures Service Agreement" checkbox has somewhere
// real to point. Acceptance happens on the proposal page itself; this
// page just shows the actual terms being agreed to.
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { BRAND } from "../content/site";
import { POST_PROJECT_SERVICE_AGREEMENT } from "../content/postProjectServiceAgreement";
import type { WsaBlock } from "../content/wsa";

function AgreementBlock({ block }: { block: WsaBlock }) {
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
    case "table":
      return (
        <div className="overflow-x-auto rounded-xl border border-ink/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-paper-alt">
                {block.headers.map((header) => (
                  <th key={header} className="px-4 py-2.5 font-semibold text-brand-navy">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-ink/10">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-2.5 text-ink/75">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "p":
    default:
      return <p className="text-[15px] leading-relaxed text-ink/75">{block.text}</p>;
  }
}

export default function PostProjectServiceAgreementPage() {
  useEffect(() => {
    document.title = `${POST_PROJECT_SERVICE_AGREEMENT.title} | ${BRAND.name}`;
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
    <div className="min-h-screen bg-paper-alt pb-24">
      <header className="border-b border-ink/5 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" aria-label={`${BRAND.name} home`}>
            <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-7 w-auto" />
          </Link>
          <p className="hidden text-xs font-medium text-ink/60 sm:block">{POST_PROJECT_SERVICE_AGREEMENT.title}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          {POST_PROJECT_SERVICE_AGREEMENT.title}
        </h1>
        <p className="mt-2 text-sm italic text-ink/60">{POST_PROJECT_SERVICE_AGREEMENT.subtitle}</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">
          This is the Altaventures Service Agreement referenced in your proposal. It governs the
          post-project service relationship once a project is handed over. You don't need to sign
          anything on this page &mdash; your acceptance happens on the proposal page itself.
        </p>

        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="space-y-3">
            {POST_PROJECT_SERVICE_AGREEMENT.intro.map((block, i) => (
              <AgreementBlock key={i} block={block} />
            ))}
          </div>

          <div className="mt-8 space-y-8">
            {POST_PROJECT_SERVICE_AGREEMENT.sections.map((section) => (
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

          <div className="mt-10 border-t border-dashed border-ink/15 pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">{BRAND.legalName}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
