import { Check } from "lucide-react";
import {
  PRICING_TIERS,
  PRICING_FEATURES,
  PRICING_MATRIX,
  type PricingTierId,
  type FeatureValue,
} from "../../content/pricing";
import CTAButton from "../ui/CTAButton";

function FeatureValueDisplay({ value }: { value: FeatureValue }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
        <Check className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (value === false) {
    return <span className="text-ink/25" aria-hidden="true">&#8212;</span>;
  }
  return <span className="text-sm font-semibold text-ink/70">{value}</span>;
}

function TierHeader({ tierId, onSelectTier }: { tierId: PricingTierId; onSelectTier: (tierId: PricingTierId) => void }) {
  const tier = PRICING_TIERS.find((t) => t.id === tierId)!;
  const isFeatured = Boolean(tier.badge);

  return (
    <div className="flex flex-col items-center text-center">
      {tier.badge ? (
        <span className="mb-2 rounded-full bg-brand-blue px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {tier.badge}
        </span>
      ) : (
        <span className="mb-2 h-[26px]" aria-hidden="true" />
      )}
      <p className={`text-lg font-bold ${isFeatured ? "text-brand-blue" : "text-brand-navy"}`}>{tier.name}</p>
      <p className="mt-2 text-4xl font-extrabold tracking-tight text-brand-navy">{tier.price}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink/60">{tier.priceNote}</p>
      {tier.promoNote && <p className="mt-2 text-xs font-semibold text-brand-blue">{tier.promoNote}</p>}
      {tier.renewalNote && <p className="mt-2 text-xs text-ink/60">{tier.renewalNote}</p>}
      <div className="mt-4 w-full">
        <CTAButton
          label={tier.cta}
          section={`pricing-${tier.id}`}
          onClick={() => onSelectTier(tier.id)}
          variant={isFeatured ? "primary" : "secondary"}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default function PricingTable({ onSelectTier }: { onSelectTier: (tierId: PricingTierId) => void }) {
  return (
    <div className="mt-12">
      {/* Desktop: full side-by-side comparison table. */}
      <table className="hidden w-full border-separate border-spacing-0 md:table">
        <caption className="sr-only">Comparison of Starter, Professional, and Business website plans</caption>
        <thead>
          <tr>
            <th scope="col" className="w-1/3" />
            {PRICING_TIERS.map((tier) => (
              <th
                key={tier.id}
                scope="col"
                className={`w-2/9 rounded-t-2xl border-x border-t px-4 pb-6 pt-6 align-bottom ${
                  tier.badge ? "border-brand-blue/30 bg-brand-blue/5" : "border-ink/10 bg-white"
                }`}
              >
                <TierHeader tierId={tier.id} onSelectTier={onSelectTier} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PRICING_FEATURES.map((feature, i) => {
            const isLast = i === PRICING_FEATURES.length - 1;
            return (
              <tr key={feature.id}>
                <th
                  scope="row"
                  className="border-y border-ink/8 bg-paper-alt px-4 py-3 text-left text-sm font-medium text-ink/75"
                >
                  {feature.label}
                  {feature.note && <sup className="ml-0.5 text-brand-blue">*</sup>}
                </th>
                {PRICING_TIERS.map((tier) => (
                  <td
                    key={tier.id}
                    className={`border-y px-4 py-3 text-center ${
                      tier.badge ? "border-brand-blue/30 bg-brand-blue/5" : "border-ink/8 bg-white"
                    } ${isLast ? (tier.badge ? "rounded-b-2xl border-b-2 border-b-brand-blue/30" : "rounded-b-2xl border-b-2 border-b-ink/10") : ""}`}
                  >
                    <FeatureValueDisplay value={PRICING_MATRIX[tier.id][feature.id]} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile: one stacked card per tier, each showing its own full feature list. */}
      <div className="space-y-6 md:hidden">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-2xl border p-6 ${
              tier.badge ? "border-brand-blue/30 bg-brand-blue/5" : "border-ink/10 bg-white"
            }`}
          >
            <TierHeader tierId={tier.id} onSelectTier={onSelectTier} />
            <ul className="mt-6 space-y-3 border-t border-ink/8 pt-6">
              {PRICING_FEATURES.map((feature) => (
                <li key={feature.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-ink/75">
                    {feature.label}
                    {feature.note && <sup className="ml-0.5 text-brand-blue">*</sup>}
                  </span>
                  <FeatureValueDisplay value={PRICING_MATRIX[tier.id][feature.id]} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {PRICING_FEATURES.some((f) => f.note) && (
        <div className="mt-6 space-y-1">
          {PRICING_FEATURES.filter((f) => f.note).map((f) => (
            <p key={f.id} className="text-xs text-ink/60">
              <sup className="mr-0.5 text-brand-blue">*</sup>
              {f.note}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
