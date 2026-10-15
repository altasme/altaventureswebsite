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
// lists rather than copied from the graphic verbatim, with one correction
// from the operator directly [2026-10-11]: Professional also gets its own
// Website Control Panel and can manage its own products/pricing, same as
// Business — both are true for Professional and Business, not Business
// only as a first draft had it.
//
// Add-on catalog (§ADDON_CATEGORIES below) is transcribed verbatim from
// the real, authoritative catalog in the altasme/clienthub repo
// (src/content/pricing.ts's ADDON_CATEGORIES, itself kept id-for-id in
// sync with functions/_lib/pricing.ts's PRICING_CATALOG, the one that
// actually prices a Client Hub checkout). That catalog's own code comment
// says it's meant to stay gated to existing clients post-presentation,
// consistent with this site's own §0.5/§16 "no Website Care/growth
// pricing on the public site" guardrail — the operator was asked directly
// whether to publish it here anyway (given real figures, not invented
// ones) and confirmed yes, show the full catalog with real prices. If the
// add-on catalog in clienthub changes, this needs the same manual
// re-transcription — there is no cross-repo import, matching the
// no-cross-build-target-imports convention clienthub's own two pricing
// files (functions/_lib vs. src/content) already follow for the same
// reason.

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
    panel: true,
    selfmanage: true,
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

export interface AddonItem {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
}

export interface AddonCategory {
  id: string;
  name: string;
  tagline: string;
  items: AddonItem[];
}

export const ADDONS_SECTION = {
  headline: "Add-Ons & Custom Work",
  sub: "Beyond the plans above, these are available whenever your business needs more.",
  footnote: "Prices are starting prices and may vary depending on requirements. Talk to us for an exact quote.",
} as const;

export const ADDON_CATEGORIES: AddonCategory[] = [
  {
    id: "additional-development",
    name: "Additional Development",
    tagline: "Expand. Enhance. Grow.",
    items: [
      { id: "addon-website", name: "Additional Website", description: "Add another website to your account.", priceLabel: "₱8,000+" },
      { id: "addon-lightweight-system", name: "Additional Lightweight Business System", description: "Add a simple business system to streamline operations.", priceLabel: "₱5,000+" },
      { id: "addon-advanced-system", name: "Additional Advanced Business System", description: "Add an advanced system for more complex workflows.", priceLabel: "₱10,000+" },
      { id: "addon-landing-page", name: "Additional Landing Page", description: "Add a custom landing page for campaigns or promos.", priceLabel: "₱1,500+" },
      { id: "addon-redesign", name: "Major Website Redesign", description: "A fresh new look and improved user experience.", priceLabel: "₱5,000+" },
      { id: "addon-dfy-update", name: "Additional Done-for-You Update", description: "Need more updates? We've got you covered.", priceLabel: "₱500+" },
      { id: "addon-major-custom-dev", name: "Major / Custom Development", description: "Complex features or custom solutions built just for you.", priceLabel: "Subject to quote" },
    ],
  },
  {
    id: "media-infrastructure",
    name: "Media & Infrastructure",
    tagline: "Powerful add-ons to support your growth.",
    items: [
      { id: "addon-video-storage-monthly", name: "Video Storage / Hosting (Monthly)", description: "Host and stream your videos with reliable, high-performance infrastructure. Starting at 10GB.", priceLabel: "₱500/month" },
      { id: "addon-video-storage-annual", name: "Video Storage / Hosting (Annual)", description: "Host and stream your videos with reliable, high-performance infrastructure. Starting at 10GB.", priceLabel: "₱6,000/year" },
      { id: "addon-media-storage", name: "Additional Media Storage", description: "Need more space? We'll scale it based on your requirements.", priceLabel: "Subject to capacity" },
      { id: "addon-bandwidth", name: "High-Bandwidth / Heavy Usage", description: "For high traffic, large delivery and heavy streaming needs.", priceLabel: "Subject to quote" },
    ],
  },
  {
    id: "integrations-business-tools",
    name: "Integrations & Business Tools",
    tagline: "Connect. Automate. Grow.",
    items: [
      { id: "addon-payment-gateway", name: "Payment Gateway Integration", description: "Accept payments securely with trusted payment gateways.", priceLabel: "₱3,000+" },
      { id: "addon-booking-system", name: "Advanced Booking System", description: "Enable appointments, reservations and scheduling with ease.", priceLabel: "₱5,000+" },
      { id: "addon-ordering-system", name: "Advanced Ordering System", description: "Power online orders, menus, carts and order management.", priceLabel: "₱5,000+" },
      { id: "addon-crm", name: "CRM / Customer Management", description: "Manage leads, customers and relationships in one organized system.", priceLabel: "₱5,000+" },
      { id: "addon-automation", name: "Automation / Workflow Integration", description: "Automate tasks and workflows to save time and improve efficiency.", priceLabel: "₱3,000+" },
      { id: "addon-api-integration", name: "Third-Party API Integration", description: "Connect your website with external services and platforms.", priceLabel: "₱3,000+" },
      { id: "addon-analytics", name: "Custom Analytics / Reporting", description: "Custom reports and dashboards tailored to your business needs.", priceLabel: "₱3,000+" },
      { id: "addon-data-migration", name: "Data Migration", description: "Migrate your data safely and accurately from existing platforms.", priceLabel: "₱3,000+" },
    ],
  },
  {
    id: "domains-email",
    name: "Domains & Email",
    tagline: "Add-ons to establish your professional identity.",
    items: [
      { id: "addon-additional-domain", name: "Additional Domain", description: "Add another domain to your account.", priceLabel: "Client-paid + setup" },
      { id: "addon-business-email", name: "Additional Business Email Account", description: "Get a professional email address for your team.", priceLabel: "₱500+/year" },
      { id: "addon-email-integration", name: "External Email / Service Integration", description: "Integrate with external email services and tools.", priceLabel: "₱1,500+" },
    ],
  },
  {
    id: "specialized",
    name: "Specialized",
    tagline: "Advanced solutions for growing businesses.",
    items: [
      { id: "addon-multilingual", name: "Multilingual Website", description: "Reach more customers with a multilingual website.", priceLabel: "₱3,000+" },
      { id: "addon-advanced-seo", name: "Advanced SEO", description: "Boost your visibility with advanced SEO strategies.", priceLabel: "Subject to quote" },
      { id: "addon-expedited-dev", name: "Expedited Development", description: "Fast-track your project with priority development.", priceLabel: "Subject to quote" },
      { id: "addon-complex-systems", name: "Complex / Scaled Systems", description: "Custom systems built to scale with your business.", priceLabel: "Subject to quote" },
    ],
  },
];

export const PRICING_FINAL_CTA = {
  headline: "Not Sure Which Plan Fits Your Business?",
  sub: "Tell us about your business and we'll help you figure out what actually makes sense, no pressure, no obligation.",
  cta: "Talk to Us",
} as const;
