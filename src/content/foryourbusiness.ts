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
//
// Checkout rebuilt into a 4-step guest wizard [2026-10-04, operator
// direction]: Questionnaire -> Package Review -> Optional Upgrade ->
// Payment, with NO account creation or Client Hub step anywhere in this
// journey (that's a hard requirement, not a preference). Contact info
// (name/email/phone) now lives on the Questionnaire step, not re-asked at
// payment. Two new optional annual upgrades were introduced for the first
// time (Custom Domain & Managed Hosting ₱1,500/yr, Website + Business
// Tools ₱5,700/yr) — see QUESTIONNAIRE/PACKAGE_REVIEW/UPGRADES below and
// functions/api/checkout.ts for the server-side pricing table. The old
// single-step form's optional Facebook/Instagram/existing-website fields
// were dropped entirely, since the operator's own exact questionnaire spec
// doesn't include them — functions/api/checkout.ts still accepts them as
// optional/empty for /b2b, which is untouched by any of this.

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
    "https://res.cloudinary.com/dikrjc8nx/image/upload/f_auto,q_auto/v1791164586/Hero_full_bleed_cai8aw_zhqmrf.jpg",
  backgroundImageMobile:
    "https://res.cloudinary.com/dikrjc8nx/image/upload/f_auto,q_auto/v1791164587/Hero_mobile_zzu60d_gsgsxm.jpg",
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
      copy: "A dedicated web address on your own subdomain of altasme.com that you can share on Facebook, Messenger, business cards, and anywhere else your customers find you.",
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

// [2026-10-05] Switched to the full canonical portfolio, per the operator's
// direct request ("show the full portfolio in one, exclude setmona and
// kolekta"), scoped to this page only — supersedes the 2026-10-02 /b2b-
// matching 7-project curation above. Shown as a single list (no "advanced"
// row), in the same order as content/portfolio.ts, with every project
// except the two engine-tier, non-viewable ones (setmona, kolekta — no
// public URL, so they'd have nothing to link "View Website" to). The id
// list is still hand-maintained rather than derived from
// VIEWABLE_PORTFOLIO_IDS, matching this project's existing convention
// elsewhere (see portfolio.ts's own comment) so a newly-added canonical
// project needs a deliberate decision before it appears here too.
export const FYB_PORTFOLIO = {
  headline: "See What We Can Build",
  sub: "Real websites for real Philippine businesses. Tap any to see it live.",
  primaryIds: [
    "altamotors",
    "aurielle",
    "leanandfit",
    "dmhr",
    "vocalyze",
    "aulea",
    "pocketg7iii",
    "macquias",
    "ascend-volleyball",
    "clickandkeep",
    "amr-bookkeeping",
    "adrayan-law",
    "imago-productions",
    "camsnap",
    "onyx-clouds",
  ],
  advancedIds: [] as string[],
  advancedLabel: "",
  cta: "See What We Can Build →",
  // Several canonical descriptions mention "subdomained to ours," a
  // technical detail not meant for this page (per the same no-subdomain-
  // mention preference already established for /b2b and /foryourbusiness,
  // see CLAUDE.md). Overridden here rather than editing the shared
  // canonical copy in content/portfolio.ts.
  descriptionOverrides: {
    pocketg7iii:
      "A landing page for a local camera rental business based in Puerto Princesa, Palawan, in support of youth entrepreneurship. Booking page and system development in future talks.",
    macquias: "A landing page for a local camera rental business based in Tarlac City, in support of youth entrepreneurship.",
    clickandkeep:
      "A landing page for a local freelance photographer to showcase his work to clients, in support of youth entrepreneurship.",
    "adrayan-law": "A professional landing page for a law office.",
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
      a: "You tell us upfront, before you pay: a short questionnaire about your business and what you want on your site. No account or call needed.",
    },
    { q: "What payment methods are accepted?", a: "GCash, Maya, and cards through our secure checkout." },
    {
      q: "What happens after I pay?",
      a: "You'll get your order reference right away. Message your developer with a screenshot of it, and we'll start building based on what you told us in the questionnaire.",
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

// Checkout wizard, step 1 of 4: Questionnaire. No pricing or upgrades are
// shown here at all — purely the website requirements + contact details
// needed to both build the site and coordinate payment/delivery. Field
// order and copy are the operator's own exact spec, reproduced as given.
export const BUSINESS_CATEGORIES = ["Aesthetic Clinic", "Restaurant", "Retail", "Professional Services", "Other"] as const;

export const QUESTIONNAIRE = {
  stepLabel: "Step 1 of 4",
  headline: "Tell Us About Your Business",
  sub: "A few quick details so we can start planning your website. No payment information yet.",
  fields: {
    businessName: { label: "Business Name", hint: "The name to display on the website." },
    businessCategory: { label: "Business Category", hint: "E.g., Aesthetic Clinic, Restaurant, Retail, Professional Services, Other." },
    businessDescription: {
      label: "Tell us about your business and what you offer",
      hint: "A brief description of the business, products, or services.",
    },
    contactPerson: { label: "Contact Person", hint: "Who the developer should coordinate with." },
    email: { label: "Email Address", hint: "For order updates and communication." },
    phone: { label: "Mobile Number", hint: "For quick coordination with the developer." },
  },
  cta: "Continue",
} as const;

// Step 2 of 4: Package Review. The Starter package and its inclusions
// only — still no upgrade shown, so the customer confirms the base offer
// before any upsell enters the picture.
export const STARTER_PHP = 599;

export const PACKAGE_REVIEW = {
  stepLabel: "Step 2 of 4",
  headline: "Your Starter Website",
  price: "₱599",
  priceNote: "ONE-TIME PAYMENT",
  summaryTitle: "Professional Business Website",
  items: [
    "Professional website",
    "Mobile-friendly",
    "Business information",
    "Contact/inquiry CTA",
    "Hosting & SSL",
    "Done for you",
    "Typical buildtime: 3-7 days",
  ],
  cta: "Continue",
} as const;

// Step 3 of 4: Optional Upgrade. Exactly one of these may be selected (or
// none, the default) — the ₱5,700 package replaces the ₱1,500 one, they
// are never charged together. Prices here are the display copy only; the
// actual charge is computed server-side in functions/api/checkout.ts from
// the validated upgradeType, never trusted from the client.
export const DOMAIN_HOSTING_UPGRADE_PHP = 1500;
export const BUSINESS_TOOLS_UPGRADE_PHP = 5700;

export const UPGRADES = {
  stepLabel: "Step 3 of 4",
  headline: "Want More? Add an Optional Upgrade",
  sub: "Completely optional. The Starter Website is already included either way.",
  none: {
    id: "none",
    title: "No Upgrade",
    body: "Just the Starter Website for ₱599.",
    firstYearTotal: "₱599",
  },
  domainHosting: {
    id: "domain_hosting",
    title: "Custom Domain & Managed Hosting",
    price: "₱1,500/year",
    annualNote: "Billed annually, starting Year 1.",
    items: ["Custom domain", "Managed website hosting", "SSL security", "Website maintenance", "Best effort technical support"],
    firstYearTotal: "₱2,099",
  },
  businessTools: {
    id: "business_tools",
    title: "Website + Business Tools",
    price: "₱5,700/year",
    annualNote: "Billed annually, starting Year 1.",
    items: [
      "Managed custom domain and hosting",
      "SSL security",
      "Your own website control panel",
      "Manage website products and pricing",
      "A lightweight order management or booking system",
      "Standard technical support",
    ],
    note: "You'll get either an order management system or a booking system, not both by default.",
    firstYearTotal: "₱6,299",
  },
  cta: "Continue",
} as const;

// Step 4 of 4: Payment. Final order summary + the real "Pay" button. No
// contact-info fields here — all of that was already collected on the
// Questionnaire step, so this step only asks for consent and confirmation.
export const CHECKOUT = {
  stepLabel: "Step 4 of 4",
  eyebrow: "REVIEW & PAY",
  headline: "Review Your Order",
  starterLine: "Starter Website (one-time)",
  cta: "PAY {amount} & START →",
} as const;

// Shared upgrade-type literal, used by both the checkout wizard components
// and functions/api/checkout.ts's own matching type (duplicated there
// since that Cloudflare Function can't import from this Vite-only file).
export type FybUpgradeType = "none" | "domain_hosting" | "business_tools";

export const THANK_YOU = {
  headline: "Payment Received. Let's Get Started.",
  body: "Your payment has been successfully received. Below is your order reference, plus how to reach your developer and get your project moving.",
  referenceLabel: "Your Order Reference",
  microcopy: "Having trouble, or didn't get a confirmation? Message us and we'll sort it out.",
  cta: "Message Us",
} as const;

// Replaces the old ACCOUNT/Client Hub panel entirely [2026-10-04] — no
// account creation or Client Hub access anywhere in this purchase journey.
// The only real contact mechanism this site has is the same three-channel
// ContactModal used everywhere else; "talk to your developer" honestly
// means "message us, a person replies," not an automated assignment
// system, since no such system exists here or anywhere this repo connects
// to.
export const DEVELOPER_HANDOFF = {
  headline: "Talk to Your Developer",
  body: "Take a screenshot of this page, including your order reference, and send it to us. That's how your developer will know to start on your project.",
  cta: "Talk to your developer",
} as const;
