import { Check } from "lucide-react";
import { OFFER } from "../../../content/mycafepos";
import AccessButton from "../AccessButton";

export default function Offer() {
  return (
    <section id="access" className="mcp-section">
      <div className="mcp-container">
        <div className="mcp-offer-panel">
          <div>
            <h2>{OFFER.headline}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8" style={{ color: "var(--mcp-dark-muted)" }}>
              {OFFER.copy}
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {OFFER.bullets.map((bullet) => (
                <li className="flex items-center gap-3" key={bullet}>
                  <Check size={20} style={{ color: "var(--mcp-accent)" }} />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="mcp-offer-price">
            <span>{OFFER.priceLabel}</span>
            <strong>{OFFER.price}</strong>
            <p>{OFFER.priceNote}</p>
            <AccessButton label={OFFER.cta} location="offer" className="mt-6 w-full" />
            <small>{OFFER.fineprint}</small>
          </div>
        </div>
      </div>
    </section>
  );
}
