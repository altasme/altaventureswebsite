// content/pricing.ts
// SINGLE SOURCE OF TRUTH for the standalone /pricing page.
//
// This is a presentation-only page: a public, shareable pricing table for
// the three real website tiers this business currently sells. It carries
// no checkout of its own — every CTA opens the same three-channel
// ContactModal used everywhere else on the site (per the operator's own
// instruction: "This pricing page is purely for presentation only and
// still leads the visitors to talk to us").
//
// The three tiers and every number here are NOT invented for this page.
// They are the real, already-shipped /foryourbusiness base price plus its
// two real optional annual upgrades (see functions/api/checkout.ts's
// FYB_UPGRADE_PRICES and content/foryourbusiness.ts's UPGRADES):
//   - Starter: the ₱599 Starter Website itself (promotional price).
//   - Professional: Starter + the "Custom Domain & Managed Hosting"
//     upgrade (₱1,500/year, billed annually starting Year 1).
//   - Business: Starter + the "Website + Business Tools" upgrade
//     (₱5,700/year, billed annually starting Year 1).
// The operator supplied a reference graphic for this page's layout whose
// numbers mostly matched (₱599 / ₱2,099 / ₱6,299 first-year totals, and
// ₱1,500/year for the Professional renewal), confirming those are current.
// Its one mismatch was the Business renewal figure (₱4,000/year in the
// graphic vs. the real, already-live ₱5,700/year rate this codebase
// actually charges) — per the operator's own direction to "use the current
// add on rates that we have," the real ₱5,700/year figure is used here,
// not the graphic's number. The feature checklist below was also
// reconciled against the real UPGRADES.domainHosting/businessTools item
// lists rather than copied from the graphic verbatim (e.g. the graphic
// showed a Website Control Panel on the Professional tier; the real
// domain_hosting upgrade doesn't include one, only business_tools does).

export const PRICING_HERO = {
  headline: "Simple, Transparent Pricing",
  sub: "Professional websites and business systems, built around your business. Pick the plan that fits where you are today, or talk to us if you're not sure.",
  disclaimer:
    "Prices below are our current published rates, including today's limited-time Starter promo. Pricing can change going forward; we'll always be upfront about it.",
} as const;

export type PricingTierId = "starter" | "professional" | "business";

export const PRICING_TIERS: {
  id: PricingTierId;
  name: string;
  badge?: string;
  price: string;
  priceNote: string;
  promoNote?: string;
  renewalNote?: string;
  cta: string;
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: "₱599",
    priceNote: "One-time payment",
    promoNote: "Limited-time promotional price",
    cta: "Get Started",
  },
  {
    id: "professional",
    name: "Professional",
    badge: "Best Value",
    price: "₱2,099",
    priceNote: "First-year total, one-time",
    renewalNote: "Renews at ₱1,500/year from Year 2",
    cta: "Get Started",
  },
  {
    id: "business",
    name: "Business",
    price: "₱6,299",
    priceNote: "First-year total, one-time",
    renewalNote: "Renews at ₱5,700/year from Year 2",
    cta: "Get Started",
  },
];

export type FeatureValue = boolean | string;

export const PRICING_FEATURES: { id: string; label: string; note?: string }[] = [
  { id: "design", label: "Multi-Page Professional Website Design" },
  { id: "responsive", label: "Fully Mobile-Responsive" },
  { id: "pages", label: "No Arbitrary Page Limit" },
  { id: "showcase", label: "Products & Services Showcase" },
  { id: "info", label: "Business Information & Contact Details" },
  { id: "hosting", label: "Hosting & SSL Security Included" },
  { id: "subdomain", label: "Your Own Subdomain of altasme.com" },
  { id: "domain", label: "Custom Domain Included" },
  { id: "maintenance", label: "Ongoing Website Maintenance" },
  { id: "support", label: "Technical Support" },
  { id: "panel", label: "Your Own Website Control Panel" },
  { id: "selfmanage", label: "Manage Your Own Products & Pricing" },
  {
    id: "ordersystem",
    label: "Order Management or Booking System",
    note: "You'll get either an order management system or a booking system, not both by default.",
  },
  { id: "launch", label: "Deployment & Launch" },
  { id: "delivery", label: "3–7 Days Delivery" },
  { id: "agreement", label: "Service Agreement Upon Delivery" },
];

export const PRICING_MATRIX: Record<PricingTierId, Record<string, FeatureValue>> = {
  starter: {
    design: true,
    responsive: true,
    pages: true,
    showcase: true,
    info: true,
    hosting: true,
    subdomain: true,
    domain: false,
    maintenance: false,
    support: "—",
    panel: false,
    selfmanage: false,
    ordersystem: false,
    launch: true,
    delivery: true,
    agreement: true,
  },
  professional: {
    design: true,
    responsive: true,
    pages: true,
    showcase: true,
    info: true,
    hosting: true,
    subdomain: false,
    domain: true,
    maintenance: true,
    support: "Best Effort",
    panel: false,
    selfmanage: false,
    ordersystem: false,
    launch: true,
    delivery: true,
    agreement: true,
  },
  business: {
    design: true,
    responsive: true,
    pages: true,
    showcase: true,
    info: true,
    hosting: true,
    subdomain: false,
    domain: true,
    maintenance: true,
    support: "Standard",
    panel: true,
    selfmanage: true,
    ordersystem: true,
    launch: true,
    delivery: true,
    agreement: true,
  },
};

export const PRICING_NOTES = {
  headline: "Good to Know",
  items: [
    {
      q: "Is ₱599 the permanent price?",
      a: "No. ₱599 is a limited-time promotional price for the Starter plan. If pricing changes in the future, we'll always be upfront about it.",
    },
    {
      q: "What's included in the ₱599 Starter price?",
      a: "A multi-page professional website built around your business, hosted on your own subdomain of altasme.com, with managed hosting and SSL security already included at no extra fee.",
    },
    {
      q: "Can I get my own custom domain instead of a subdomain?",
      a: "Yes, with the Professional or Business plan. Both include a custom domain plus managed hosting, security, and maintenance, billed annually starting Year 1.",
    },
    {
      q: "What happens after Year 1 on Professional or Business?",
      a: "The domain, hosting, security, and maintenance renew annually so everything stays active. We'll reach out before renewal, and you're free to cancel anytime.",
    },
    {
      q: "Do I have to pay in installments?",
      a: "No. Each plan is a single upfront payment, the Starter price alone, or the first-year total shown for Professional/Business, which already includes that plan's add-on for Year 1.",
    },
  ],
} as const;

export const PRICING_FINAL_CTA = {
  headline: "Not Sure Which Plan Fits Your Business?",
  sub: "Tell us about your business and we'll help you figure out what actually makes sense, no pressure, no obligation.",
  cta: "Talk to Us",
} as const;
