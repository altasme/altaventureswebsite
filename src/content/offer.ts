// content/offer.ts
// SINGLE SOURCE OF TRUTH for the /limitedoffer landing page: the offer
// config, the qualifier, and every section's copy. No component on this
// route should hard-code copy. Shares BRAND, CONTACT, and PROJECTS with the
// main site (content/site.ts) rather than duplicating them.

import { BRAND, PROJECT_ORDER } from "./site";

export const OFFER = {
  freeTierIncludesCustomDomain: true,
  buildTimeDays: "4–7 days",
  free: {
    included: [
      "Professional website design & development",
      "Mobile-friendly build",
      "Website hosting",
      "SSL security",
      "Custom domain (you pay only the domain registration)",
      "Business information & services presentation",
      "Contact / inquiry CTA",
      "Altaventures-managed hosting",
    ],
    notIncluded: [
      "Basic SEO",
      "Business systems / admin panel",
      "Business email & notifications",
      "Continuous development / done-for-you updates",
    ],
  },
} as const;

export const OFFER_HERO = {
  eyebrow: BRAND.tagline,
  headline: "Your Business Deserves a Website.",
  sub: "We'll Build It For You. Free.",
  support: `A professional website built around your business, ready in ${OFFER.buildTimeDays}. Not a template, not a mockup: a real website you can start using.`,
  microcopy: "Professional website creation and development. You only pay for the domain.",
  cta: "GET MY FREE WEBSITE →",
  secondaryCta: "See What We've Built",
} as const;

export const PROBLEM_OPPORTUNITY = {
  headline: 'Go From "Facebook Only" to a Real Website',
  benefits: [
    "Show up when customers search for you on Google",
    "Load fast and look professional on any device",
    "Give customers one clear place to learn about your business",
    "Build the kind of credibility a Facebook page alone can't offer",
    "Turn visitors into inquiries with clear calls to action",
  ],
  support: "And we're giving you the website build for FREE.",
  cta: OFFER_HERO.cta,
} as const;

export const WHAT_YOU_GET = {
  headline: "A Professional Website. Built For Your Business.",
  sub: "Get your business online first. Build more when you're ready.",
  cta: OFFER_HERO.cta,
} as const;

export const OFFER_PORTFOLIO = {
  headline: "See What We've Built",
  sub: "Real projects for real Philippine businesses. Not templates, not mockups.",
  projectIds: PROJECT_ORDER,
  cta: OFFER_HERO.cta,
} as const;

export const OFFER_HOW_IT_WORKS = {
  headline: `From Idea to Website in ${OFFER.buildTimeDays}`,
  cta: "Start a Conversation",
  steps: [
    {
      number: 1,
      title: "Tell Us",
      copy: "Start a quick chat and tell us about your business: what you do, who you serve, and what you want your website to accomplish.",
    },
    {
      number: 2,
      title: "We Build",
      copy: "We design and build your website around your business, keeping you in the loop as it comes together.",
    },
    {
      number: 3,
      title: "We Present",
      copy: "We walk you through the finished website and make any reasonable adjustments before launch.",
    },
    {
      number: 4,
      title: "Launch",
      copy: "Your website goes live on your own domain, ready for real customers.",
    },
  ],
} as const;

export const WHY_ALTAVENTURES_OFFER = {
  headline: "Technology Should Help Your Business Grow. Not Add More Overhead.",
  founderStatement: [
    "Altaventures was born from our founder's experience building his first business and discovering how hard it was to access affordable, genuinely helpful digital tools.",
    "That's why we build practical websites and business systems, without the unnecessary overhead or complexity that usually comes with them.",
  ],
} as const;

export const PHASE_PROGRESSION = {
  headline: "Your Website Can Grow With Your Business",
  sub: "Start with a free, professional website. Add more only when your business is ready for it.",
  noCommitmentLine: "No paid commitment required for your free website.",
  cta: "EXPLORE DIGITAL GROWTH PLANS →",
  ctaHref: "https://altasme.com",
  phases: [
    {
      label: "Phase 1",
      title: "Your Free Website",
      items: OFFER.free.included.slice(0, 4),
    },
    {
      label: "Phase 2",
      title: "Business Growth Systems",
      items: OFFER.free.notIncluded,
    },
    {
      label: "Future",
      title: "Whatever Your Business Needs Next",
      items: ["Booking & scheduling systems", "Business management tools", "E-commerce", "Full business digitalization"],
    },
  ],
} as const;

export const WHO_ITS_FOR = {
  headline: "Built for Businesses Like Yours.",
  cards: [
    {
      title: "Small Businesses Just Starting Out",
      copy: "You're ready to look professional online without a big upfront cost.",
    },
    {
      title: "Service-Based Businesses",
      copy: "Salons, clinics, repair shops: businesses that live or die on trust and first impressions.",
    },
    {
      title: "Rental & Property Businesses",
      copy: "Showcase what you offer with a website customers can actually browse.",
    },
    {
      title: "Local Shops & Retailers",
      copy: "Give your regulars and new customers a real place to find you online.",
    },
    {
      title: "Growing Businesses",
      copy: "Outgrowing Facebook-only? A real website is the next step, and it's free.",
    },
  ],
} as const;

export const OFFER_FAQ = {
  headline: "Frequently Asked Questions",
  items: [
    {
      q: "Is this really free?",
      a: "Yes. We build and launch your website at no development cost. You only pay for your domain registration.",
    },
    {
      q: "Can I use my own domain?",
      a: "Yes, you can use your own domain — you just cover the domain registration.",
    },
    {
      q: "How long does it take?",
      a: `Most free websites are built and launched within ${OFFER.buildTimeDays}, once we understand your business.`,
    },
    {
      q: "What's not included in the free website?",
      a: "Things like advanced SEO, business systems, business email, and ongoing done-for-you updates are Phase 2. Your free website is a real, professional starting point.",
    },
    {
      q: "Do I have to commit to anything else?",
      a: "No. There's no paid commitment required to get your free website.",
    },
    {
      q: "How do I get started?",
      a: "Tap the button on this page, answer a few quick questions, and we'll continue the conversation on Messenger, Viber, or WhatsApp.",
    },
  ],
} as const;

export const OFFER_FINAL_CTA = {
  headline: "Ready To Put Your Business Online?",
  sub: "Let's build your website. Free.",
  cta: OFFER_HERO.cta,
  microcopy: "Your business. Your website. Your next step.",
} as const;

// ---------------------------------------------------------------------------
// Qualifier: an interactive engagement step, not a lead form. Captures no
// contact details and stores nothing; every answer is optional and only
// used to build the WhatsApp handoff message for this one session.
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
  yearsInBusiness: ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"] as const,
  objectives: [
    "Get more inquiries",
    "Showcase products or services",
    "Get more bookings",
    "Build credibility",
    "Sell online",
    "Other",
  ],
  handoff: {
    headline: "Great — let's finish this on chat.",
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
