// content/b2b.ts
// SINGLE SOURCE OF TRUTH for the /b2b landing page: the ₱4,999 complete
// business website package (domain + hosting + security + maintenance +
// tech support, all included for the first year, renewing at ₱2,499/year
// from Year 2 onward). Same structure, mechanics, and infrastructure as
// /foryourbusiness (content/foryourbusiness.ts) — same 8-section layout,
// same live ganap.net checkout, same D1/account-creation flow — but
// targets established businesses instead of first-time website buyers, so
// the copy is more direct and CTR-focused, and the portfolio drops the
// "Beyond the ₱299 scope" advanced row entirely (this offer already
// covers everything in that row's scope, so there's nothing "beyond" to
// show separately). See CLAUDE.md for the full build writeup.
//
// Payment is split 50/50 [2026-09-19, operator clarification]: ₱2,499.50
// is charged at checkout as a deposit, and the remaining ₱2,499.50 is
// collected separately once the website is complete, via a manually
// created Client Hub / ClientKeeper "Bill of Service" (that flow already
// exists and already enforces ganap.net's ₱200 minimum, see CLAUDE.md
// §20) — not a new checkout on this site. DEPOSIT_PHP/BALANCE_PHP/
// TOTAL_PHP below are the one place those figures live for this page's
// copy; functions/api/checkout.ts's OFFER_CONFIG has its own matching
// amountPhp for the actual charge, since that function can't import from
// this Vite-only content file.
const DEPOSIT_PHP = "₱2,499.50";
const BALANCE_PHP = "₱2,499.50";
const TOTAL_PHP = "₱4,999";

// Checkout is live (ganap.net, same consolidated project as
// /foryourbusiness). Every CTA on this page navigates to /b2b/checkout,
// which posts to functions/api/checkout.ts (now parameterized by an
// `offer` field so one payment function serves both offers) and redirects
// the browser to ganap.net's hosted payment page. That checkout charges
// only the deposit above, not the full ₱4,999.

export const PRIMARY_CTA = `GET STARTED FOR ${DEPOSIT_PHP} →`;
export const STICKY_CTA = `${DEPOSIT_PHP} DOWN · START →`;

// Reuses the same hero photo as /foryourbusiness (content/foryourbusiness.ts's
// FYB_HERO) rather than a new photo — no B2B-specific hero asset has been
// supplied, and this is the same real, already-vetted photo (not a new
// fabrication), so re-using it is a deliberate choice, not a placeholder
// gap. Swap these two URLs if/when a dedicated B2B hero photo is supplied.
export const B2B_HERO = {
  headline: "Still Running Your Business Without a Real Website?",
  sub: `A complete business website: built, hosted, secured, maintained, and supported for a full year. ${TOTAL_PHP} total, just ${DEPOSIT_PHP} down to start, the rest due once it's complete. No hidden fees.`,
  cta: PRIMARY_CTA,
  backgroundImageDesktop:
    "https://res.cloudinary.com/dlxhrxf1a/image/upload/f_auto,q_auto/v1789711789/Hero_full_bleed_cai8aw.jpg",
  backgroundImageMobile:
    "https://res.cloudinary.com/dlxhrxf1a/image/upload/f_auto,q_auto/v1789712320/Hero_mobile_zzu60d.jpg",
  backgroundAlt: "A business owner working on their new website",
} as const;

// Same real numbers as /foryourbusiness's build stats (18+ businesses
// served, 4-7 day build time), plus a third stat that leads with the
// value stack instead of repeating the price (already prominent in the
// hero CTA and checkout summary).
export const B2B_TRUST_SIGNALS = {
  stats: [
    { kind: "counter", countTo: 18, suffix: "+", label: "Established businesses served" },
    { kind: "range", from: 4, to: 7, label: "Days to launch" },
    { kind: "static", value: "1 Year", label: "Domain, hosting & support included" },
  ],
} as const;

export const PROBLEM = {
  headline: "Still Relying Only on Facebook and Word of Mouth?",
  body: [
    "More customers are searching for businesses like yours online before they ever pick up the phone. If they land on a Facebook page instead of a real website, you look smaller, less established, and easier to skip.",
    "A real website tells customers you're a serious, established business that's open for business anytime, day or night, and gives them one place to see exactly why they should choose you over the competition.",
  ],
} as const;

export const WHATS_INCLUDED = {
  headline: "Everything Your Business Website Needs, in One Package",
  items: [
    {
      title: "A Professional Business Website",
      copy: "A complete, multi-page website built around your business: your services, your story, and a clear way for customers to reach you.",
    },
    {
      title: "Free Domain for Your First Year",
      copy: "Your own custom domain name (yourbusiness.com), registered and set up for you, free for the first year.",
    },
    {
      title: "Hosting Included",
      copy: "Fast, reliable hosting so your website is always online when customers come looking.",
    },
    {
      title: "Security & SSL Included",
      copy: "Your website is secured with SSL/HTTPS and monitored, so customers, and Google, trust it.",
    },
    {
      title: "Ongoing Maintenance",
      copy: "We keep your website updated, running smoothly, and free of technical issues, all year.",
    },
    {
      title: "Priority Tech Support",
      copy: "Direct access to our team whenever you need changes, help, or have questions about your website.",
    },
    {
      title: "Mobile-Friendly Design",
      copy: "Your website looks and works great on phones, tablets, and computers.",
    },
  ],
  scopeLine: `Domain, hosting, security, maintenance, and support are included free for your first year. Pay ${DEPOSIT_PHP} to start and the remaining ${BALANCE_PHP} once your website is complete. Starting Year 2, this renews at ₱2,499/year to keep everything active. We'll reach out before your renewal date, and you're free to cancel anytime.`,
} as const;

export const WHO_ITS_FOR = {
  headline: "Built for Businesses Ready to Be Taken Seriously",
  items: [
    "Established local businesses",
    "Businesses tired of relying only on Facebook",
    "Businesses that want to look more credible online",
    "Businesses that want ongoing support, not just a one-time build",
    "Businesses ready to compete online, not just offline",
  ],
  line: "If your business is already running and you're ready for a real website behind it, this is for you.",
} as const;

// Same primary portfolio grid as /foryourbusiness's FYB_PORTFOLIO
// (content/foryourbusiness.ts), scoped to this page only per the operator's
// instruction — the homepage's SelectedWork and /limitedoffer's
// OFFER_PORTFOLIO wall are untouched and unrelated to this list.
// advancedIds is deliberately empty: unlike the ₱299 offer, this ₱4,999
// package already covers the domain/hosting/security/maintenance/support
// bundle those "beyond scope" projects would be shown to illustrate, so
// there's no separate "beyond this offer" row to show. B2BPortfolio.tsx
// only renders that row when the array is non-empty, so leaving it empty
// hides the section entirely rather than needing a special case.
export const B2B_PORTFOLIO = {
  headline: "See What We've Built for Businesses Like Yours",
  sub: "Real websites for real Philippine businesses. Tap any to see it live.",
  primaryIds: ["dmhr", "pocketg7iii", "amr-bookkeeping", "imago-productions", "camsnap", "onyx-clouds", "vocalyze"],
  advancedIds: [] as string[],
  advancedLabel: "",
  cta: "See What We Can Build for Your Business →",
} as const;

export const B2B_HOW_IT_WORKS = {
  headline: "From Payment to Launch",
  steps: [
    { number: "01", title: `Pay ${DEPOSIT_PHP} to Start`, body: "Secure checkout via GCash, Maya, or card." },
    {
      number: "02",
      title: "Tell Us About Your Business",
      body: "After you pay your deposit, we set up your account and get your business details, domain preference, and content.",
    },
    {
      number: "03",
      title: "We Build & Launch It",
      body: `We build your complete website, register your domain, set up hosting and security, and get it live. The remaining ${BALANCE_PHP} is due once it's complete.`,
    },
  ],
} as const;

export const B2B_FAQ = {
  headline: "Frequently Asked Questions",
  items: [
    {
      q: `What exactly is included in the ${TOTAL_PHP}?`,
      a: "A complete, professional multi-page business website, a free domain for your first year, hosting, SSL security, ongoing maintenance, and priority tech support.",
    },
    {
      q: "Do I have to pay the full amount upfront?",
      a: `No. You pay a ${DEPOSIT_PHP} deposit to start, and the remaining ${BALANCE_PHP} is due once your website is complete and ready to launch.`,
    },
    { q: "How long does it take?", a: "Usually 4 to 7 days after we receive your business details and content." },
    {
      q: "Do I need my own domain already?",
      a: "No. We register a domain for your business and include it free for your first year.",
    },
    {
      q: "What happens after Year 1?",
      a: "Your domain, hosting, security, maintenance, and support renew at ₱2,499/year starting Year 2. We'll reach out before your renewal date, and you're free to cancel anytime.",
    },
    {
      q: "Can I request changes?",
      a: "Yes, a couple of revision rounds are included within the agreed scope, and ongoing maintenance covers routine updates after launch.",
    },
    {
      q: "Can I add e-commerce, booking, or other systems later?",
      a: "Yes. Once your website is live, we can quote additional systems separately as your business grows.",
    },
    {
      q: "How is this different from the ₱299 offer?",
      a: "This package is built for established businesses that want their own domain, hosting, security, and ongoing support handled for them, not just a one-time build.",
    },
    { q: "What payment methods are accepted?", a: "GCash, Maya, and cards, for both the deposit and the balance." },
    {
      q: "What happens after I pay my deposit?",
      a: "You'll get an email to set up your account, then we reach out to get your business details, domain preference, and content before we start building.",
    },
    {
      q: "Is there a contract?",
      a: `No long-term contract. You pay ${DEPOSIT_PHP} to start, ${BALANCE_PHP} on completion, and the annual renewal after that is optional. You can cancel anytime.`,
    },
  ],
} as const;

export const B2B_FINAL_CTA = {
  headline: "Ready to Look as Established Online as You Are in Real Life?",
  body: `Get a complete business website, domain, hosting, security, maintenance, and support included. ${TOTAL_PHP} total, ${DEPOSIT_PHP} down to start.`,
  cta: PRIMARY_CTA,
} as const;

export const CHECKOUT = {
  eyebrow: "SECURE YOUR BUSINESS WEBSITE",
  price: DEPOSIT_PHP,
  priceNote: `50% DEPOSIT · ${TOTAL_PHP} TOTAL`,
  summaryTitle: "Complete Business Website Package",
  summaryItems: [
    "Professional website",
    "Free domain (1 year)",
    "Hosting included",
    "SSL security",
    "Ongoing maintenance",
    "Priority tech support",
    "Typical buildtime: 4-7 days",
    `${BALANCE_PHP} balance due on completion`,
  ],
  cta: `PAY ${DEPOSIT_PHP} DEPOSIT & START →`,
} as const;

export const THANK_YOU = {
  headline: "Deposit Received. Let's Build Your Business Website.",
  body: `Your ${DEPOSIT_PHP} deposit has been successfully received. You'll receive a confirmation email shortly. From there, you can create your Altaventures account and continue with your website setup. The remaining ${BALANCE_PHP} balance will be invoiced once your website is complete.`,
  microcopy: "Having trouble, or didn't get a confirmation? Message us and we'll sort it out.",
  cta: "Message Us",
} as const;

export const ACCOUNT = {
  headline: "Ready to Get Started?",
  body: "Create your account to continue your website setup.",
  cta: "Create Your Account",
} as const;
