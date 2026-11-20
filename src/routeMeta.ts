// Per-route <head> data used ONLY by scripts/prerender.mjs to bake the right
// title, description, canonical and robots tags into each static HTML file.
// The pages still set the same values at runtime (their own useEffect), so
// keep the two in sync when you change a page's title/description.

export const SITE_URL = "https://www.altasme.com";
export const OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  /** false → <meta name="robots" content="noindex, nofollow"> and excluded from the sitemap. */
  index: boolean;
}

const NOINDEX_DESC = "Altaventures private page.";

export const ROUTES: RouteMeta[] = [
  {
    path: "/",
    title: "Altaventures: Websites & Booking Systems in the Philippines",
    description:
      "Altaventures builds websites, booking systems and business tools for Philippine businesses. We build the engine. You drive the business.",
    index: true,
  },
  {
    path: "/limitedoffer",
    title: "Free Website for Your Business (Philippines) | Altaventures",
    description:
      "Your competitors show up on Google. You show up on Facebook. We'll build you a real, custom website free: you only pay for the domain. Ready in 4 to 7 days.",
    index: true,
  },
  {
    path: "/foryourbusiness",
    title: "Get Your Business Online for ₱599 | Altaventures",
    description:
      "A professional, mobile-friendly business website, done for you, for a one-time ₱599 payment. Ready in 3 to 7 days. See real Altaventures work.",
    index: true,
  },
  {
    path: "/b2b",
    title: "Complete Business Website Package, ₱4,999 | Altaventures",
    description:
      "A complete business website for established businesses: built, hosted, secured, and supported for a full year. ₱4,999 total, 50% down to start.",
    index: true,
  },
  {
    path: "/mycafepos",
    title: "MyCafe POS | Simple POS for Cafés",
    description:
      "Try MyCafe POS for free during ongoing testing. Manage café orders, sales, inventory, and receipts with a simple point-of-sale system.",
    index: true,
  },
  {
    path: "/pricing",
    title: "Website Pricing Plans (Philippines) | Altaventures",
    description:
      "Simple, transparent pricing for Altaventures website plans: Starter, Pro, and Full Digital. See what's included and talk to us about your business.",
    index: true,
  },
  // Utility pages: prerendered so they load without the SPA fallback, but never indexed.
  ...[
    "/WSA-free",
    "/WSA-pro",
    "/service-agreement",
    "/foryourbusiness/checkout",
    "/foryourbusiness/thank-you",
    "/b2b/checkout",
    "/b2b/thank-you",
  ].map((path) => ({ path, title: "Altaventures", description: NOINDEX_DESC, index: false })),
];
