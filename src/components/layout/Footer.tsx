import { BRAND, FOOTER } from "../../content/site";
import { useModals } from "../../lib/modalContext";
import { messengerUrl, viberUrl, whatsappUrl } from "../../lib/contact";
import { track } from "../../lib/analytics";

export default function Footer() {
  const { openContactModal, openLegal } = useModals();

  const handleContactClick = () => {
    track("cta_click", { label: "Contact", section: "footer" });
    openContactModal("footer");
  };

  return (
    <footer className="bg-brand-navy-deep text-white">
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            {/* Logo's navy wordmark doesn't read on this dark canvas (checked
                against the supplied reversed variant too), so it's rendered
                in a light chip for legibility instead. */}
            <span className="inline-flex rounded-lg bg-white px-3 py-2">
              <img src={BRAND.logo} alt={BRAND.name} width={240} height={30} className="h-6 w-auto" />
            </span>
            <p className="mt-3 max-w-sm text-sm text-white/60">{FOOTER.tagline}</p>
            <p className="mt-4 text-xs text-white/40">{FOOTER.legalName}</p>
            <p className="mt-1 max-w-sm text-xs text-white/40">{FOOTER.supportingStatement}</p>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Site
            </h3>
            <ul className="space-y-2">
              {FOOTER.linkGroups.site.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/70 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={handleContactClick}
                  className="text-sm text-white/70 hover:text-white"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
              Chat With Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={messengerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_channel_select", { channel: "messenger" })}
                  className="text-sm text-white/70 hover:text-white"
                >
                  Messenger
                </a>
              </li>
              <li>
                <a
                  href={viberUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_channel_select", { channel: "viber" })}
                  className="text-sm text-white/70 hover:text-white"
                >
                  Viber
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("contact_channel_select", { channel: "whatsapp" })}
                  className="text-sm text-white/70 hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {BRAND.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {FOOTER.legalLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => openLegal(link.id)}
                className="text-xs text-white/50 hover:text-white"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
