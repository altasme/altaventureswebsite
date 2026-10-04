// content/foryourbusiness.ts
// SINGLE SOURCE OF TRUTH for the /foryourbusiness landing page (the ₱599
// professional website offer). Structure and copy follow the v2 lean
// 8-section spec (CLAUDEforyourbusiness_1.md §5), which supersedes the
// original 13-section elaborate structure: standalone Reality, Social
// Media Reality, Why Only ₱299, Urgency, and Guarantee sections are
// dropped entirely (intentional for a ₱299 impulse offer). The
// catch-reassurance question ("why so cheap?") is folded into the FAQ;
// the make-it-right guarantee lives in the Terms of Sale, not on-page.
// No fake scarcity anywhere on this page.
//
// Shares BRAND, CONTACT with the main site (content/site.ts) and
// portfolio data with content/portfolio.ts rather than duplicating them.
//
// Checkout is live (ganap.net, real production project, confirmed
// 2026-09-10). Every CTA on this page navigates to /foryourbusiness/checkout,
// which posts to the functions/api/checkout.ts Cloudflare Function and
// redirects the browser to ganap.net's hosted payment page. Setmona's
// booking system still has no credentials and remains unbuilt, so the
// post-payment experience is a simple thank-you page, not the full
// formalized flow in CLAUDE.md §19; see that section for what's real vs.
// still deferred.
//
// Price raised from ₱299 to ₱499 [2026-09-11, operator decision], then
// reverted back to ₱299 [2026-09-16, operator decision]. Every mention of
// the price on this page and its checkout/thank-you flow was updated to
// match; nothing about the offer's scope or structure changed either time.
//
// Price raised again to ₱599 [2026-10-02, operator decision], alongside a
// full copy rewrite of the hero, Problem, What's Included, Who It's For,
// and How It Works sections, and a portfolio re-curation to match /b2b's
// exact project list. Deliberately left unchanged, same reasoning as the
// 499 round (§21 in CLAUDE.md): the internal `metadata.offer:
// "foryourbusiness-299"` tag sent to ganap.net in functions/api/checkout.ts
// is a SKU-like category label no code branches on and nothing displays,
// not a live price statement, so it stays as-is rather than drifting out
// of sync with every payment already recorded under that tag.

export const PRIMARY_CTA = "GET MY WEBSITE FOR ₱599 →";
export const STICKY_CTA = "₱599 · GET MY WEBSITE →";

// Hero background is a real supplied photo (operator-provided, hosted on
// Cloudinary), full-bleed, same treatment as the homepage Hero.tsx: a
// wide desktop crop and a separate portrait mobile crop, each with a navy
// scrim gradient behind the text so it stays readable over the photo.
// f_auto,q_auto in the URL lets Cloudinary negotiate the best format
// (WebP/AVIF) and quality per browser automatically — the same goal the
// homepage's self-hosted <picture>/WebP pair serves, without needing a
// local asset + conversion step for an image already hosted externally.
export const FYB_HERO = {
  headline: "Your Business Deserves More Than Just a Facebook Page.",
  sub: "Get your own professional website for just ₱599. Showcase what makes your business special, make a great first impression, and help more potential customers see why they should choose you.",
  line: "No complicated process. No need to build it yourself. We'll do it all for you.",
  cta: PRIMARY_CTA,
  talkToUsCta: "Talk to Us",
  backgroundImageDesktop:
    "https://res.cloudinary.com/dlxhrxf1a/image/upload/f_auto,q_auto/v1789711789/Hero_full_bleed_cai8aw.jpg",
  backgroundImageMobile:
    "https://res.cloudinary.com/dlxhrxf1a/image/upload/f_auto,q_auto/v1789712320/Hero_mobile_zzu60d.jpg",
  backgroundAlt: "A small business owner working on their new website",
} as const;

// Real numbers only — same honesty guardrail as everywhere else on this
// page (no fake scarcity, no fabricated stats). "18+" is the real total
// businesses served, per the operator directly (higher than
// content/portfolio.ts's 14-entry PORTFOLIO array, since not every real
// project has a public listing there). Update countTo by hand as the real
// count grows — don't derive it from portfolio.ts, which was never meant
// to be a complete client count.
//
// Moved out of the hero into its own small animated trust-signal band
// right below it [2026-09-18] — same discriminated-union shape and
// useCountUp-driven animation as /limitedoffer's OFFER_HERO.stats, so the
// numbers count up once the band scrolls into view instead of sitting
// static in a hero stat panel.
export const FYB_TRUST_SIGNALS = {
  stats: [
    { kind: "counter", countTo: 20, suffix: "+", label: "Websites and Systems launched & counting" },
    { kind: "range", from: 3, to: 7, label: "Average build time" },
    { kind: "static", value: "₱599", label: "Your starting price" },
  ],
} as const;

export const PROBLEM = {
  headline: "Business owner or professional service provider ka ba?",
  body: [
    "Facebook page lang ba ang meron ang business mo?",
    "Your posts get buried, important details get lost, and customers have to scroll through your page just to find what they're looking for. Minsan, kailangan ka pa nilang i-message para lang magtanong ng basic information, and not everyone has the patience to wait for a reply.",
    "The bigger problem? Potential customers are searching online for businesses like yours, and without your own website, you're missing another opportunity to showcase your services, build trust, and get more inquiries.",
    "Your Facebook page is a start. But your business could be reaching more customers with its own website.",
  ],
} as const;

export const WHATS_INCLUDED = {
  headline: "What ₱599 Gets You and Your Business",
  intro:
    "We know how difficult and expensive it can be to get a professional website for your business. That's why we're lowering the barrier to getting online, so more business owners and professionals can build, grow, and scale their businesses.",
  items: [
    {
      title: "A Website Made for Your Business",
      copy: "Built around your business, your services, and what your customers need to know.",
    },
    {
      title: "Looks Great on Any Device",
      copy: "Professional and mobile-responsive, whether customers visit from their phone, tablet, or computer.",
    },
    {
      title: "Showcase What You Offer",
      copy: "Present your products and services clearly and attractively, so customers can quickly see what you have to offer.",
    },
    {
      title: "Hosting & Security Included",
      copy: "Managed hosting and SSL security included, so you don't have to deal with the technical side.",
    },
    {
      title: "Your Own Business Link",
      copy: "A dedicated web address you can share on Facebook, Messenger, business cards, and anywhere else your customers find you.",
    },
    {
      title: "The Pages Your Business Needs",
      copy: "No arbitrary page limit. We'll build the pages reasonably needed to properly present your business.",
    },
    {
      title: "100% Done For You",
      copy: "No coding. No complicated setup. No figuring it out yourself. You give us the details, we build the website.",
    },
  ],
  closing: {
    lead: "You've already put so much into building your business.",
    body: "For just ₱599, let us help you give it a proper place online.",
  },
} as const;

export const WHO_ITS_FOR = {
  headline: "Perfectly Fits Businesses and Professionals Like You",
  sub: "Whether you're running a business, offering professional services, or building your own practice, your work deserves to be seen and your business deserves to grow.",
  items: [
    {
      title: "Small & Growing Businesses",
      copy: "Give your business a professional online presence that grows with your ambitions.",
    },
    {
      title: "Local Business Owners",
      copy: "Make it easier for potential customers to discover your business and explore what you offer.",
    },
    {
      title: "Professional Service Providers",
      copy: "Showcase your expertise, services, and experience to help potential clients feel confident choosing you.",
    },
    {
      title: "Independent Professionals & Freelancers",
      copy: "Put your skills and work in the spotlight with a website that's truly yours.",
    },
    {
      title: "Established Businesses",
      copy: "Create a dedicated online space that reflects the quality of your business and the work you've put into it.",
    },
  ],
  line: "Whatever stage you're at, your business deserves more than just a social media page.",
} as const;

// [2026-10-02] Re-curated to match /b2b's portfolio exactly (same project
// list, same order, no "advanced" row, same description overrides), per
// the operator's direct request. Supersedes the 2026-09-18 7-project
// curation and its "Beyond the ₱299 scope" advanced row below it — this
// offer's portfolio no longer draws that scope line visually, matching how
// /b2b (content/b2b.ts's B2B_PORTFOLIO) presents its own wider project mix.
export const FYB_PORTFOLIO = {
  headline: "See What We Can Build",
  sub: "Real websites for real Philippine businesses. Tap any to see it live.",
  primaryIds: ["leanandfit", "aurielle", "dmhr", "amr-bookkeeping", "imago-productions", "camsnap", "onyx-clouds"],
  advancedIds: [] as string[],
  advancedLabel: "",
  cta: "See What We Can Build →",
  // Same /b2b-only-style overrides, carried over verbatim: the canonical
  // content/portfolio.ts descriptions for camsnap and onyx-clouds mention
  // "subdomained to ours," a technical detail not meant for this page
  // either. Overridden here rather than editing the shared canonical copy.
  descriptionOverrides: {
    camsnap: "A landing page for a local camera rental business based in Batangas.",
    "onyx-clouds": "A landing page for a local vape and e-cig supplier.",
  } as Record<string, string>,
} as const;

export const FYB_HOW_IT_WORKS = {
  headline: "We do it in 3 Simple Steps",
  sub: "Getting your business online is easier than you think. We'll guide you every step of the way.",
  steps: [
    {
      number: "01",
      title: "Let's Talk About Your Business",
      body: "Tell us about your business, your goals, and what you need. We'll get to know your business so we can create a website that fits you.",
    },
    {
      number: "02",
      title: "We'll Plan & Build It for You",
      body: "We'll take care of the design, content layout, and website development based on your business information and requirements. No coding or technical work needed on your end.",
    },
    {
      number: "03",
      title: "Review, Present & Launch",
      body: "We'll present your website for you to review, make the agreed refinements, and get it ready to launch. Your business will have its own place online, ready to share with your customers.",
    },
  ],
} as const;

export const FYB_FAQ = {
  headline: "Frequently Asked Questions",
  items: [
    {
      q: "What exactly is included in ₱599?",
      a: "A professional multi-page website built around your business, mobile-friendly design, your business information, contact details, free hosting on your own subdomain, and SSL security. One-time fee.",
    },
    { q: "How long does it take?", a: "Usually 3 to 7 days after we receive your details and content." },
    {
      q: "Do I need my own domain?",
      a: "No. Your site is free on a yourbusiness.altasme.com subdomain. Moving to your own custom domain is an option later.",
    },
    { q: "Is hosting included?", a: "Yes, free, on your subdomain, for as long as we operate." },
    { q: "Can I request changes?", a: "Yes, a couple of revision rounds within the agreed scope." },
    { q: "Can I add more pages or features?", a: "Yes, those can be quoted separately." },
    {
      q: "How do I send my business information?",
      a: "After you pay, we guide you: a quick call and a simple form.",
    },
    { q: "What payment methods are accepted?", a: "GCash, Maya, and cards through our secure checkout." },
    {
      q: "What happens after I pay?",
      a: "You get an email to set up your account, then you book a quick call so we get everything right, then we build.",
    },
    {
      q: "Why is it only ₱599?",
      a: "We keep the first website simple and affordable to earn your trust. If your business grows and wants more later, we hope you build it with us. No catch, no contract.",
    },
  ],
} as const;

export const FYB_FINAL_CTA = {
  headline: "Ready to Put Your Business Online?",
  body: "Get started with your website for ₱599. Simple, professional, and yours.",
  cta: PRIMARY_CTA,
} as const;

export const CHECKOUT = {
  eyebrow: "START YOUR WEBSITE",
  price: "₱599",
  priceNote: "ONE-TIME PAYMENT",
  summaryTitle: "Professional Business Website",
  summaryItems: [
    "Professional website",
    "Mobile-friendly",
    "Business information",
    "Contact/inquiry CTA",
    "Hosting & SSL",
    "Done for you",
    "Typical buildtime: 3-7 days",
  ],
  cta: "PAY ₱599 & START →",
} as const;

// Upgrade selection (added for the checkout redesign): the Starter Website
// above is always in the order; a customer may optionally add ONE of these
// two annual upgrades on top of it. Prices/features/renewal amounts are
// NOT invented here -- they match clienthub's existing "basic"/"essential"
// catalog entries exactly (functions/_lib/pricing.ts and
// src/content/pricing.ts in the clienthub repo), since those are the same
// plans already sold as an internal upsell after a client signs up. This
// checkout just offers the same two plans at the front door instead of
// only after the fact. renewalPrice is what clienthub's webhook will
// actually bill in year 2+ (see that repo's PRICING_CATALOG) -- shown here
// so the annual-renewal disclosure in section 7 of the spec is a real
// number, not a guess.
export type UpgradeId = "none" | "domain_hosting" | "business_tools";

export interface UpgradeOption {
  id: Exclude<UpgradeId, "none">;
  name: string;
  priceLabel: string;
  annualPrice: number;
  firstYearTotal: number;
  renewalPrice: number;
  features: string[];
  note: string;
}

export const UPGRADE_OPTIONS: UpgradeOption[] = [
  {
    id: "domain_hosting",
    name: "Custom Domain & Managed Hosting",
    priceLabel: "₱1,500/year",
    annualPrice: 1500,
    firstYearTotal: 2099,
    renewalPrice: 1500,
    features: ["Custom domain", "Managed website hosting", "SSL security", "Website maintenance", "Best-effort technical support"],
    note: "Annual service. Renews at ₱1,500/year.",
  },
  {
    id: "business_tools",
    name: "Website + Business Tools",
    priceLabel: "₱5,700/year",
    annualPrice: 5700,
    firstYearTotal: 6299,
    renewalPrice: 4200,
    features: [
      "Managed custom domain and hosting",
      "SSL security",
      "Own website control panel",
      "Manage website products and pricing",
      "Lightweight order management or booking system",
      "Standard technical support",
    ],
    note: "Annual service. You receive either order management or a booking system, not both. First year ₱5,700, renews at ₱4,200/year.",
  },
];

export function findUpgradeOption(id: UpgradeId): UpgradeOption | undefined {
  return UPGRADE_OPTIONS.find((u) => u.id === id);
}

export const THANK_YOU = {
  headline: "Payment Received. Let's Get Started.",
  body: "Your payment has been successfully received. You'll receive a confirmation email shortly. From there, you can create your Altaventures account and continue with your website setup.",
  microcopy: "Having trouble, or didn't get a confirmation? Message us and we'll sort it out.",
  cta: "Message Us",
} as const;

export const ACCOUNT = {
  headline: "Ready to Get Started?",
  body: "Create your account to continue your website setup.",
  cta: "Create Your Account",
} as const;
