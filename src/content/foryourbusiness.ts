// content/foryourbusiness.ts
// SINGLE SOURCE OF TRUTH for the /foryourbusiness landing page (the ₱299
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
// Checkout is live (ganap.net, TEST MODE project). Every CTA on this page
// navigates to /foryourbusiness/checkout, which posts to the
// functions/api/checkout.ts Cloudflare Function and redirects the browser
// to ganap.net's hosted payment page. Supabase/Setmona/the full
// account-onboarding flow are still not built (no credentials for those
// yet), so the post-payment experience is a simple thank-you page, not the
// full formalized flow in CLAUDE.md §19; see that section for what's real
// vs. still deferred.

export const PRIMARY_CTA = "GET MY WEBSITE FOR ₱299 →";
export const STICKY_CTA = "₱299 · GET MY WEBSITE →";

export const FYB_HERO = {
  headline: "Get a Website for Your Business for Only ₱299",
  sub: "A simple, professional website for business owners who want to be online without paying agency prices. We build it for you.",
  microcopy:
    "No tech skills needed. You send your details, we build it, and it goes live on your own yourbusiness.altasme.com.",
  cta: PRIMARY_CTA,
} as const;

export const PROBLEM = {
  headline: "No Website Yet? Your Customers Notice.",
  body: "When someone hears about your business, they search for it. If nothing comes up, or just an old Facebook page, they wonder if you are still around, or they move on to someone who looks more established. A simple website gives them one clear place to see what you offer and how to reach you. You do not need something complicated. You just need to exist online, properly.",
} as const;

export const WHATS_INCLUDED = {
  headline: "What Your ₱299 Website Includes",
  items: [
    "A professional single-page website built around your business",
    "Mobile-friendly design (most of your customers are on their phones)",
    "Your business information and what you offer",
    "Contact details and a clear way for customers to reach you",
    "Free hosting on your own subdomain (yourbusiness.altasme.com)",
    "SSL security (the padlock customers trust)",
  ],
  scopeLine:
    "This is a simple website to get you online. Online stores, booking systems, and custom tools are things we can add later, but they are not part of the ₱299 build.",
} as const;

export const WHO_ITS_FOR = {
  headline: "Perfect For",
  items: ["Small business owners", "Local businesses", "Freelancers and service providers", "Online sellers", "New businesses just starting out"],
  line: "If you have a real business and no proper website yet, this is for you.",
} as const;

// Portfolio grid is a deliberate ₱299-scope curation, not the full canonical
// list: Altamotors (system tier) is excluded so a full CRM/financing
// platform doesn't sit next to "₱299" and misrepresent what the offer
// delivers. Setmona/Kolekta (engine tier, no public URL) never belong here.
// Primary grid = simple, live, ₱299-scale informational sites. Advanced row
// is optional proof of range, explicitly labeled beyond this offer's scope.
export const FYB_PORTFOLIO = {
  headline: "See What We Can Build",
  sub: "Real websites for real Philippine businesses. Tap any to see it live.",
  primaryIds: ["dmhr", "vocalyze", "aulea", "pocketg7iii", "macquias"],
  advancedIds: ["aurielle", "leanandfit"],
  advancedLabel: "Beyond the ₱299 scope",
  cta: "See What We Can Build →",
} as const;

export const FYB_HOW_IT_WORKS = {
  headline: "Three Simple Steps",
  steps: [
    { number: "01", title: "Pay ₱299", body: "Secure checkout via GCash, Maya, or card." },
    {
      number: "02",
      title: "Tell Us About Your Business",
      body: "After you pay, we set up your account and have a quick call to get your details and content right.",
    },
    { number: "03", title: "We Build Your Website", body: "We create your site from your information and get it live." },
  ],
} as const;

export const FYB_FAQ = {
  headline: "Frequently Asked Questions",
  items: [
    {
      q: "What exactly is included in ₱299?",
      a: "A professional single-page website built around your business, mobile-friendly design, your business information, contact details, free hosting on your own subdomain, and SSL security. One-time fee.",
    },
    { q: "How long does it take?", a: "Usually 4 to 7 days after we receive your details and content." },
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
      q: "Why is it only ₱299?",
      a: "We keep the first website simple and affordable to earn your trust. If your business grows and wants more later, we hope you build it with us. No catch, no contract.",
    },
  ],
} as const;

export const FYB_FINAL_CTA = {
  headline: "Ready to Put Your Business Online?",
  body: "Get started with your website for ₱299. Simple, professional, and yours.",
  cta: PRIMARY_CTA,
} as const;

export const CHECKOUT = {
  eyebrow: "START YOUR WEBSITE",
  price: "₱299",
  priceNote: "ONE-TIME PAYMENT",
  summaryTitle: "Professional Business Website",
  summaryItems: [
    "Professional website",
    "Mobile-friendly",
    "Business information",
    "Contact/inquiry CTA",
    "Hosting & SSL",
    "Done for you",
    "Typical buildtime: 4-7 days",
  ],
  cta: "PAY ₱299 & START →",
  testModeNote: "This checkout is currently running in ganap.net test mode.",
} as const;

export const THANK_YOU = {
  headline: "Payment Received. Let's Get Started.",
  body: "Your ₱299 payment has been successfully received. You'll receive a confirmation email shortly. From there, you can create your Altaventures account and continue with your website setup.",
  microcopy: "Having trouble, or didn't get a confirmation? Message us and we'll sort it out.",
  cta: "Message Us",
} as const;

export const ACCOUNT = {
  headline: "Ready to Get Started?",
  body: "Create your account to continue your website setup.",
  cta: "Create Your Account",
  welcomeHeadline: "You're All Set!",
  welcomeBody: "Your account is created. We'll reach out within one business day to get your business details and schedule a quick call.",
  errorMessage: "We couldn't create your account just now. Please try again, or message us and we'll sort it out.",
} as const;
