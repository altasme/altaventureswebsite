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

export const PRIMARY_CTA = "GET MY WEBSITE FOR ₱299 →";
export const STICKY_CTA = "₱299 · GET MY WEBSITE →";

// Hero background is a real supplied photo (operator-provided, hosted on
// Cloudinary), full-bleed, same treatment as the homepage Hero.tsx: a
// wide desktop crop and a separate portrait mobile crop, each with a navy
// scrim gradient behind the text so it stays readable over the photo.
// f_auto,q_auto in the URL lets Cloudinary negotiate the best format
// (WebP/AVIF) and quality per browser automatically — the same goal the
// homepage's self-hosted <picture>/WebP pair serves, without needing a
// local asset + conversion step for an image already hosted externally.
export const FYB_HERO = {
  headline: "Get a Website for Your Business for Only ₱299",
  sub: "A simple, professional website for business owners who want to be online without paying agency prices. We build it for you.",
  cta: PRIMARY_CTA,
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
    { kind: "counter", countTo: 18, suffix: "+", label: "Websites launched & counting" },
    { kind: "range", from: 4, to: 7, label: "Average build time" },
    { kind: "static", value: "₱299", label: "Your starting price" },
  ],
} as const;

export const PROBLEM = {
  headline: "No Website Yet?",
  body: [
    "Potential customers and clients may already be searching for you online. But without a website, they have no easy way to learn about your business, explore your services, or see what makes you worth choosing.",
    "Give them one place to discover what you do, build confidence in your work, and get in touch.",
  ],
} as const;

export const WHATS_INCLUDED = {
  headline: "What Your ₱299 Website Includes",
  items: [
    {
      title: "A Website Designed Around Your Business",
      copy: "A professional-looking website built to introduce your business and give visitors a clear idea of what you do.",
    },
    {
      title: "Your Business Information, All in One Place",
      copy: "Present your business details, About section, services or products, and contact information in one convenient place.",
      note: "No page limit, as long as the number of pages is reasonable and within the agreed scope.",
    },
    {
      title: "Mobile-Friendly Design",
      copy: "Your website adapts to different screen sizes, so visitors can browse it on their phones, tablets, or computers.",
    },
    {
      title: "A Clear Way for Customers to Contact You",
      copy: "Give visitors a straightforward way to inquire about your business through your website's contact or inquiry call-to-action.",
    },
    {
      title: "Hosting & SSL Security Included",
      copy: "Your website gets hosted online with HTTPS security, so customers can access it through the web.",
    },
    {
      title: "100% Done-for-You Website Creation",
      copy: "No need to build it yourself. We handle the website creation and get it live once your required business information and materials are ready.",
    },
    {
      title: "ALTAVENTURES Subdomain",
      copy: "e.g., yourbusiness.altasme.com",
    },
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
//
// [2026-09-18] Re-curated to this specific 6-project list per the operator's
// direct request (this page's grid only — homepage SelectedWork and
// /limitedoffer's OFFER_PORTFOLIO wall are untouched, both keep the full
// project set). Dropped: aulea, macquias, ascend-volleyball, clickandkeep,
// adrayan-law. Three more the operator asked for (Imago Productions,
// Camsnap Camera Rental, Onyx Clouds Premium Vape Co.) are NOT added yet —
// no real screenshots were actually received for them (the message said
// "uploaded" but no files came through, and none of the three live URLs
// are reachable from this sandbox to self-capture one). Add all three to
// `content/portfolio.ts` first, then to primaryIds here, once real images
// are supplied — do not add with a placeholder, per the site-wide
// real-work-only guardrail (CLAUDE.md §16).
export const FYB_PORTFOLIO = {
  headline: "See What We Can Build",
  sub: "Real websites for real Philippine businesses. Tap any to see it live.",
  primaryIds: ["dmhr", "pocketg7iii", "amr-bookkeeping", "vocalyze"],
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
      a: "A professional multi-page website built around your business, mobile-friendly design, your business information, contact details, free hosting on your own subdomain, and SSL security. One-time fee.",
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
} as const;
