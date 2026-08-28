// content/offer.ts
// SINGLE SOURCE OF TRUTH for the /limitedoffer landing page (v3,
// direct-response rewrite). No component on this route should hard-code
// copy. Shares BRAND, CONTACT with the main site (content/site.ts) and
// portfolio data with content/portfolio.ts rather than duplicating them.
//
// This is a direct-response funnel, not a brochure: one goal, one CTA,
// every button opens the chat qualifier. No pricing anywhere except "you
// only pay for the domain." Scarcity uses soft framing, not a fabricated
// number, since no confirmed real monthly cap has been provided.

export const OFFER = {
  freeTierIncludesCustomDomain: true,
  buildTimeDays: "4 to 7 days",
} as const;

export const PRIMARY_CTA = "CLAIM MY FREE WEBSITE →";

export const OFFER_HERO = {
  headline: "Get Your Business Online. We'll Build the Website for FREE.",
  sub: "Get a professional website built for your business at zero development cost.",
  punchLine: "Be easier to find. Look more credible. Give customers a reason to choose you.",
  cta: PRIMARY_CTA,
  secondaryCta: "SEE WHAT WE'VE BUILT",
  microcopy: "Ready in 4 to 7 days. You only pay for your domain. No plans. No contracts.",
} as const;

export const AGITATION = {
  eyebrow: "What This Is Costing You",
  headline: "Right Now, You're Losing Customers You'll Never Hear From.",
  body: [
    "When someone hears your business name, they do one thing first: they search for you. If what shows up is a thin Facebook page, an old listing, or nothing at all, they quietly move on. No message. No missed call. Just a customer who chose someone else.",
    "A Facebook page cannot do a website's job. It buries your info under posts, makes you look like a side hustle instead of a real business, and forces customers to dig for answers before they will trust you with their money.",
    "Meanwhile, the competitor with a clean, professional website looks like the safe choice, even when your product is better.",
  ],
  turnLine: "Every day you stay Facebook-only, this keeps happening. The good news: it is fixable in about a week, and the build costs you nothing.",
  cta: PRIMARY_CTA,
} as const;

export const WHAT_YOU_GET = {
  eyebrow: "What You Get",
  headline: "A Website That Does the Selling For You.",
  intro: "Here is everything we build and hand you, at no development cost:",
  items: [
    "Shows up when customers Google your business, so you stop losing them before they find you.",
    "Loads fast and looks premium on any phone, where most of your customers already are.",
    "One clear place that answers every question a customer has before they even message.",
    "An obvious way to contact you, so browsing turns into real conversations.",
    "Hosting and SSL handled for you: the secure padlock customers look for.",
    "Custom domain (you pay only the domain registration).",
    "Built and managed by our team, so you never touch a line of code.",
  ],
  cta: PRIMARY_CTA,
} as const;

export const OFFER_PORTFOLIO = {
  eyebrow: "Real Work, Real Businesses",
  headline: "We Don't Do Templates. We Build the Real Thing.",
  sub: "Every project below is a live website for a real Philippine business. Click any of them. Not mockups. Not stock. Yours is next.",
  // Lead with the relatable site tier, then the ceiling (system tier).
  // Engines (Setmona, Kolekta) have no public URL and are excluded here;
  // they appear in Growth Vision as Phase 2 proof instead.
  projectIds: ["dmhr", "vocalyze", "aulea", "altamotors", "aurielle", "leanandfit"],
  closer: "If we built these for them, picture what we will build for you. Free.",
  cta: PRIMARY_CTA,
} as const;

export const THE_OFFER_PLAINLY = {
  eyebrow: "The Offer, Plainly",
  headline: "Here Is the Whole Deal, in Plain Terms.",
  stack: [
    "We build your complete, professional website. No development fee.",
    "We design it around your business, not a template.",
    "We host it, secure it, and get it live in 4 to 7 days.",
    "You only pay for your domain. That is the only cost. Nothing hidden, nothing recurring required.",
    "You do not touch code. You do not manage anything. You do not commit to any plan.",
  ],
  riskReversal:
    "And if we build it and you are not happy, you walk away. No fee, no pressure, no obligation. Worst case, you got a free website and we part as friends.",
  cta: PRIMARY_CTA,
} as const;

export const WHY_FREE = {
  eyebrow: "Why Free?",
  headline: "Wait, Why Would You Do This for Free?",
  body: [
    "Fair question. Here is the honest answer.",
    "Altaventures started when our founder built his first business and found out how expensive and confusing good digital tools were. The free tools were weak. The real ones were priced for big companies.",
    "So we flipped it. We build your first website for free, do great work, and earn your trust. When your business grows and you are ready for booking systems, customer tools, or a full online operation, we hope we are the team you call. That is the entire catch. The free website is how we start, not a bait and switch.",
  ],
  cta: PRIMARY_CTA,
} as const;

export const OFFER_HOW_IT_WORKS = {
  eyebrow: "How It Works",
  headline: "You Do Almost Nothing. Here Is the Whole Process.",
  footerLine: "Total effort on your side: one conversation and a few photos.",
  cta: PRIMARY_CTA,
  steps: [
    { number: 1, title: "Tell Us", copy: "One quick chat about your business, what you do, and who you serve." },
    { number: 2, title: "We Build", copy: "We design and build your site. You relax." },
    { number: 3, title: "We Present", copy: "We walk you through the finished website and adjust what you want." },
    { number: 4, title: "Launch", copy: "Your site goes live on your own domain, ready for real customers." },
  ],
} as const;

export const WHO_ITS_FOR = {
  eyebrow: "Is This For You?",
  headline: "This Is Built for You If...",
  forYou: [
    "You run a real, operating business and you are tired of looking smaller than you are.",
    "Customers keep asking the same questions your Facebook page cannot answer.",
    "You want to show up when people search, not hope they scroll past your competitor.",
  ],
  notForYou: [
    "You have not started a real business yet and are only testing an idea.",
    "You want endless free redesigns without ever growing the business.",
  ],
  close: "We keep it honest so both of us win.",
  cta: PRIMARY_CTA,
} as const;

export const SCARCITY = {
  eyebrow: "Limited Capacity",
  headline: "We Can Only Build So Many at Once.",
  body: "Every free build gets our full attention, so we cap how many we take each month. When this month's slots are full, the next opening rolls to the following month. If your business is ready now, start the conversation now.",
  studioLabel: "Currently in the studio",
  studioNote: "(in progress)",
  cta: PRIMARY_CTA,
} as const;

export const GROWTH_VISION = {
  eyebrow: "Beyond the Free Website",
  headline: "Your Free Website Is the Start, Not the Ceiling.",
  sub: "Start free. Add more only when your business is ready.",
  phases: [
    { label: "Phase 1", title: "Your Free Website", items: ["Professional site", "Mobile build", "Hosting", "SSL", "Custom domain"] },
    { label: "Phase 2", title: "Business Growth", items: ["Booking systems", "Admin tools", "Business email", "Continuous development"] },
    { label: "Future", title: "Whatever's Next", items: ["E-commerce", "Business management tools", "Full digitalization"] },
  ],
  phase2ProofLine:
    "When you are ready, we build the systems your business graduates into: booking and scheduling like our Setmona engine, billing and collections like our Kolekta engine.",
  noCommitmentLine: "No paid commitment required for your free website.",
  cta: "Start With My Free Website →",
} as const;

export const OFFER_FAQ = {
  eyebrow: "FAQ",
  headline: "Frequently Asked Questions",
  items: [
    {
      q: "Is this really free?",
      a: "Yes. We build and launch your website at no development cost. You only pay for your domain registration.",
    },
    {
      q: "What is the catch?",
      a: "No catch. We do great work for free to earn the chance to help you as you grow. No contract, no hidden fee, nothing recurring required.",
    },
    {
      q: "Why would you give this away?",
      a: "A free first website is how we start a relationship. If you grow and want more later, we hope you choose us. If not, the website is still yours.",
    },
    {
      q: "Can I use my own domain?",
      a: "Yes. You register the domain (the only cost) and we build everything on it.",
    },
    {
      q: "How long does it take?",
      a: "Usually 4 to 7 days once you send your details and photos.",
    },
    {
      q: "How do I get started?",
      a: "One quick chat. Tap any button on this page and tell us about your business.",
    },
  ],
} as const;

export const OFFER_FINAL_CTA = {
  eyebrow: "Last Step",
  headline: "A Week From Now, You Could Have a Website That Sells For You.",
  body: "Or you could still be sending customers to a Facebook page and hoping it looks good enough. One quick chat starts the build.",
  cta: PRIMARY_CTA,
  sub: "Free build. You only pay for the domain. Ready in 4 to 7 days.",
} as const;

// ---------------------------------------------------------------------------
// Qualifier: an interactive engagement step, not a lead form. Unchanged from
// v2. Captures no contact details and stores nothing; every answer is
// optional and only used to build the WhatsApp handoff message for this one
// session.
// ---------------------------------------------------------------------------

export const QUALIFIER = {
  intro: {
    headline: "Let's Get Your Free Website Started.",
    sub: "A few quick questions, then we'll continue on chat. Nothing here is saved or sent anywhere until you choose a channel.",
  },
  businessTypes: [
    "Retail / Shop",
    "Food & Beverage",
    "Salon, Spa, or Clinic",
    "Professional Services",
    "Automotive",
    "Real Estate / Rental",
    "Home & Trade Services",
    "Other",
  ],
  yearsInBusiness: ["Less than 1 year", "1 to 3 years", "3 to 5 years", "5+ years"] as const,
  objectives: [
    "Get more inquiries",
    "Showcase products or services",
    "Get more bookings",
    "Build credibility",
    "Sell online",
    "Other",
  ],
  handoff: {
    headline: "Great, let's finish this on chat.",
    sub: "Choose the platform you prefer. WhatsApp opens with a message ready to send; Messenger and Viber open a blank chat.",
  },
} as const;

export type QualifierAnswers = {
  name: string;
  businessName: string;
  businessType: string;
  yearsInBusiness: string;
  objectives: string[];
};

export const EMPTY_QUALIFIER_ANSWERS: QualifierAnswers = {
  name: "",
  businessName: "",
  businessType: "",
  yearsInBusiness: "",
  objectives: [],
};
