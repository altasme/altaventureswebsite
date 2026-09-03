// content/foryourbusiness.ts
// SINGLE SOURCE OF TRUTH for the /foryourbusiness landing page (the ₱299
// professional website offer). Copy is drawn verbatim, where practical,
// from the authoritative build spec (ALTAVENTURES___ForYourBusiness.txt)
// per CLAUDEforyourbusiness.md. Shares BRAND, CONTACT with the main site
// (content/site.ts) and portfolio data with content/portfolio.ts rather
// than duplicating them.
//
// Checkout/payment is deferred (no ganap.net, Supabase, Setmona, or Resend
// credentials available yet). Every CTA on this page opens the same
// ContactModal used site-wide, with a ₱299-specific WhatsApp prefill, so
// the page still functions as a real (chat-qualified) lead path today.
// Swap the CTA handlers to route to a real /foryourbusiness/checkout once
// the payment integration is ready; see CLAUDE.md §19.

export const PRIMARY_CTA = "GET MY WEBSITE FOR ₱299 →";
export const SECONDARY_CTA = "SEE OUR WORK →";
export const STICKY_CTA = "₱299 · GET MY WEBSITE →";

export const FYB_HERO = {
  eyebrow: "ALTAVENTURES WEBSITE CREATION OFFER",
  headline: "Get Your Business Online for ₱299.",
  sub: "A professional website. Done for you.",
  body: [
    "You don't need an expensive website just to give customers a professional place to learn about your business and get in touch.",
    "We'll build you a clean, mobile-friendly website that presents your business clearly, builds trust, and gives visitors an easy way to inquire.",
  ],
  price: "₱299",
  priceNote: "ONE-TIME PAYMENT",
  cta: PRIMARY_CTA,
  secondaryCta: SECONDARY_CTA,
  urgencyMicrocopy: "Limited monthly build slots.",
} as const;

export const REALITY = {
  headline: "Let's Be Honest About Websites.",
  body: [
    "A website won't magically bring you 100 customers tomorrow.",
    "It won't replace good marketing.",
    "It won't fix a bad product.",
    "And it won't make people buy something they don't want.",
  ],
  transition: "So why have one?",
  body2: [
    "Because when someone hears about your business, sees your social media, finds you online, or gets your name from a friend, they can look you up.",
    "Instead of sending them through scattered posts, messages and screenshots, you can give them one professional place that explains your business and makes it easy to contact you.",
  ],
  closing: "That's what this website is built to do.",
} as const;

export const SOCIAL_MEDIA_REALITY = {
  headline: "Your Facebook Page Is Useful. It's Just Not Your Whole Online Presence.",
  body: [
    "Social media is great for reaching people.",
    "But important information gets buried between posts, promotions, comments and messages.",
    "Your services change. Your posts get older. Customers have to scroll or message you just to find basic information.",
  ],
  transition: "A website gives your business a proper home online.",
  comparison: {
    social: { label: "Social Media", items: ["Posts", "Promotions", "Comments", "Messages"], note: "Fast-moving" },
    website: { label: "Your Website", items: ["Business", "Services", "About", "Contact"], note: "Clear & organized" },
  },
} as const;

export const VALUE = {
  headline: "What ₱299 Actually Gets You",
  items: [
    { title: "Professional Website", body: "A clean website designed around your business." },
    {
      title: "Your Business Information",
      body: "Services/products, about section, contact details and other essential information.",
    },
    { title: "Mobile-Friendly Design", body: "Designed to work properly across phones and other devices." },
    { title: "Clear Contact CTA", body: "Give visitors an obvious next step to contact or inquire." },
    { title: "Hosting & SSL", body: "Your website is hosted online and secured with HTTPS." },
    { title: "Done For You", body: "You provide the information and materials. We handle the website creation." },
    { title: "One-Time Payment", body: "₱299. No recurring website creation fee." },
  ],
} as const;

export const WHAT_THIS_LOOKS_LIKE = {
  headline: "A Website That Actually Represents Your Business.",
  scenarios: [
    { title: "Local Service Business", steps: ["Services", "Business information", "Location", "Contact"] },
    { title: "Coach / Consultant", steps: ["About", "Expertise", "Services", "Inquiry CTA"] },
    { title: "Small Retail Business", steps: ["Products", "Business information", "Contact", "Location"] },
    { title: "Professional Business", steps: ["Services", "About", "Credentials / information", "Contact"] },
  ],
} as const;

// Portfolio grid is a deliberate ₱299-scope curation, not the full canonical
// list: Altamotors (system tier) is excluded so a full CRM/financing
// platform doesn't sit next to "₱299" and misrepresent what the offer
// delivers. Setmona/Kolekta (engine tier, no public URL) never belong here.
// Primary grid = simple, live, ₱299-scale informational sites. Advanced row
// is optional proof of range, explicitly labeled beyond this offer's scope.
export const FYB_PORTFOLIO = {
  headline: "Don't Just Take Our Word for It.",
  sub: "See what we build.",
  primaryIds: ["dmhr", "vocalyze", "aulea", "pocketg7iii", "macquias"],
  advancedIds: ["aurielle", "leanandfit"],
  advancedLabel: "Beyond the ₱299 scope",
  cta: "SEE MORE OF OUR WORK →",
} as const;

export const FYB_HOW_IT_WORKS = {
  headline: "From ₱299 to Live Website.",
  steps: [
    { number: "01", title: "Pay ₱299", body: "Secure your website build." },
    { number: "02", title: "Send Your Information", body: "Give us your business information, services, branding and materials." },
    { number: "03", title: "We Build It", body: "We create your website." },
    { number: "04", title: "Go Live", body: "Review the completed website and get it online." },
  ],
  supportingText: "Typical development time: 4 to 7 days after receiving the required information and materials.",
} as const;

export const DOESNT_INCLUDE = {
  headline: "₱299 Doesn't Mean \"Build Me Anything.\"",
  body: "We're keeping this offer simple so we can actually deliver it at ₱299.",
  scopeLine: "The offer is for a professional business website. It is not a complex custom application.",
  notIncluded: [
    "Complex e-commerce",
    "Custom web applications",
    "Advanced business systems",
    "Complex integrations",
    "Unlimited custom changes",
  ],
  closing: "Need more? That's fine. We'll tell you what your business actually needs and quote it separately.",
} as const;

export const WHY_299 = {
  headline: "Yes. It's Really ₱299.",
  body: [
    "Professional websites can cost thousands of pesos.",
    "We're intentionally making the first step easier for small businesses.",
    "The ₱299 offer is a focused website build with a clear scope, not an unlimited custom development project.",
  ],
  closing: "You don't need to spend tens of thousands just to establish a professional presence online.",
} as const;

// Real monthly capacity only. No countdown timers, no fake slot counts, no
// fake deadlines, no fake price increases.
export const URGENCY = {
  headline: "₱299 Builds Are Limited Each Month.",
  body: "These are done-for-you websites. We still need the time to build each one properly. That's why we only accept a limited number of ₱299 website builds each month.",
  cta: "CLAIM MY ₱299 WEBSITE →",
  microcopy: "Once this month's build capacity is filled, new projects may have to wait for the next available slot.",
} as const;

export const GUARANTEE = {
  headline: "You Should Get What We Agreed to Build.",
  body: "If the completed website doesn't meet the agreed requirements, we'll work with you to address the concerns and make it right.",
} as const;

export const FYB_FAQ = {
  headline: "Frequently Asked Questions",
  items: [
    { q: "Is ₱299 really a one-time payment?", a: "Yes. ₱299 is the one-time website creation fee." },
    {
      q: "Does ₱299 include a custom domain?",
      a: "No. The website can be hosted online without a custom domain. A custom domain can be added separately.",
    },
    {
      q: "How long does it take?",
      a: "Typically 4 to 7 days after we receive the required business information and materials.",
    },
    {
      q: "Do I need to provide the content?",
      a: "Yes. You'll need to provide the business information, content and materials required for your website.",
    },
    {
      q: "Can you write everything for me?",
      a: "The ₱299 offer is based on client-provided business information and materials. Additional content creation can be discussed separately if needed.",
    },
    {
      q: "Can you build online booking?",
      a: "Booking systems and other advanced functionality are outside the ₱299 website offer and can be discussed separately.",
    },
    {
      q: "Can you build an online store?",
      a: "Complex e-commerce is outside this offer. We can recommend a suitable solution based on what your business needs.",
    },
    {
      q: "Will the website bring me customers?",
      a: "A website isn't a magic lead generator. Your marketing still matters. The website gives the customers you're already reaching a professional place to learn about your business and take the next step.",
    },
    {
      q: "What happens after I pay?",
      a: "You'll provide your business information and materials, then schedule your project call. We'll confirm the scope and begin the website build.",
    },
  ],
} as const;

export const FYB_FINAL_CTA = {
  headline: "Your Business Already Exists.",
  headline2: "Now Give It a Place Online.",
  body: "A professional website doesn't have to cost thousands just to get started.",
  price: "₱299 ONE-TIME",
  priceNote: "Professional business website. Done for you.",
  cta: PRIMARY_CTA,
  microcopy: "Limited monthly build slots · Typical 4 to 7 day delivery",
} as const;
