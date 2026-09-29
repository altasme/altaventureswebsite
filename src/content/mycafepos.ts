// content/mycafepos.ts
// SINGLE SOURCE OF TRUTH for the /mycafepos landing page: MyCafe POS, a
// simple point-of-sale system for cafés and small food businesses,
// currently offering free access during an ongoing testing phase.
//
// This is a different product from the Altaventures service offers
// (/foryourbusiness, /b2b, /limitedoffer) — it's a standalone SaaS app
// Altaventures is building and testing, not a website-build service — so
// it gets its own visual identity (a warm café palette: espresso, coffee,
// caramel, cream) instead of the brand-navy/brand-blue system, and its
// CTAs scroll to an on-page offer section instead of opening ContactModal
// or a checkout, since there's no chat funnel or payment here yet.
//
// Ported faithfully from a supplied build spec and its Lovable-generated
// implementation (altasme/landing-page-handover-kit), not rewritten —
// copy, structure, and the documented guardrails below all carry over
// unchanged, only re-platformed into this repo's own architecture
// (content file + component tree + lazy route, matching the
// content/foryourbusiness.ts / content/b2b.ts pattern). See CLAUDE.md for
// the full port writeup, including what was deliberately left exactly as
// supplied vs. adapted.
//
// Offer and copy safeguards carried over from the source handover doc,
// do not violate when editing this file:
// - Current offer is free access during ongoing testing, ₱0.
// - No 14-day trial, no ₱199 requirement, no automatic charge, no
//   permanent-free promise, no countdown, no false scarcity.
// - Future tools are visibly labeled "Future / optional," never described
//   as part of current access.
// - Device/printer/offline/BIR-compliance claims stay conservative until
//   verified (see CLAUDE.md's launch checklist for what's still open).

// The real signup destination was not supplied. Every access CTA scrolls
// to the on-page offer section instead of inventing a URL — replace this
// with the real signup link once one exists, per the source handover
// doc's own instruction not to invent destinations.
export const ACCESS_LINK = "#access";

export const META = {
  title: "MyCafe POS | Simple POS for Cafés",
  description:
    "Try MyCafe POS for free during ongoing testing. Manage café orders, sales, inventory, and receipts with a simple point-of-sale system.",
  ogTitle: "MyCafe POS | Your Café, Made Easier",
  ogDescription: "Get free access to MyCafe POS during testing and help us build a better POS for cafés.",
} as const;

export const HEADER = {
  wordmark: "MYCAFE",
  wordmarkAccent: "POS",
  nav: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  signInHref: ACCESS_LINK,
} as const;

export const HERO = {
  badge: "Free during ongoing testing",
  eyebrow: "For cafés & small food businesses",
  headline: ["Your Café,", "Made Easier."],
  sub: "A simple POS for your daily operations.",
  body: "Take orders, track sales, manage inventory, and print receipts with MyCafe POS. We're testing and improving the system, and your café can help.",
  cta: "Get Free Access",
  demoCta: "Watch Product Demo",
  trustLine: "No payment required during the current testing phase.",
  imageCallout: "Made for daily café work",
} as const;

export const BENEFITS = [
  { title: "Take Orders", copy: "Manage customer orders" },
  { title: "Print Receipts", copy: "Use compatible printers" },
  { title: "Track Inventory", copy: "Monitor stock changes" },
  { title: "View Sales", copy: "Review recorded transactions" },
] as const;

export const BENEFITS_LINE = "Everything starts with a simpler way to manage your café.";

export const PROBLEM = {
  eyebrow: "Less juggling. More clarity.",
  headline: "Running a café is already a lot of work.",
  copy: "Orders, payments, inventory, and daily sales all need your attention. MyCafe POS brings these everyday tasks into one place, helping you keep your café organized.",
  rows: [
    { title: "Orders scattered everywhere", copy: "Keep orders organized in one POS." },
    { title: "Unsure about daily sales", copy: "Review recorded transactions and sales summaries." },
    { title: "Losing track of stock", copy: "Use inventory tools to monitor quantities and adjustments." },
  ],
} as const;

export const DEMO = {
  eyebrow: "Try it yourself",
  headline: "See MyCafe POS in action.",
  copy: "This is a real, clickable walkthrough of the order screen: pick a size, watch stock update live, add a senior/PWD discount, split a payment, and get a receipt. No sign-up, no real transaction, just the flow.",
  cta: "Try It for Free",
  note: "Demo only — this uses a sample menu and no real payment or order is created.",
  receiptCta: "Like how that felt? Get MyCafe POS free during testing.",
} as const;

// Sample menu + payment options powering the interactive demo below (Demo.tsx
// / PosDemo.tsx). Deliberately fake/illustrative prices and item names (not a
// real client's live menu) since this widget's whole point is letting a
// visitor click through the order flow itself, not showcasing real data —
// unlike the rest of the site's real-work-only guardrail, which governs
// screenshots/testimonials standing in for real client work, not a
// self-labeled interactive sample. `sizes` mirrors the real app's modifier
// groups (PosView's ModifierDialog); `stock` mirrors its inventory tracking
// (InventoryView) on one item only, so a visitor can see a real feature
// (live stock decrementing, then "Sold out") without simulating the whole
// Inventory screen.
export const DEMO_MENU = {
  categories: ["Coffee", "Non-Coffee", "Snacks"] as const,
  items: [
    { id: 1, name: "Iced Americano", category: "Coffee", priceCentavos: 12900, sizes: [{ label: "Regular", deltaCentavos: 0 }, { label: "Large", deltaCentavos: 2000 }] },
    { id: 2, name: "Cafe Latte", category: "Coffee", priceCentavos: 14900, sizes: [{ label: "Regular", deltaCentavos: 0 }, { label: "Large", deltaCentavos: 2000 }] },
    { id: 3, name: "Spanish Latte", category: "Coffee", priceCentavos: 15900, sizes: [{ label: "Regular", deltaCentavos: 0 }, { label: "Large", deltaCentavos: 2000 }] },
    { id: 4, name: "Caramel Macchiato", category: "Coffee", priceCentavos: 16900, sizes: [{ label: "Regular", deltaCentavos: 0 }, { label: "Large", deltaCentavos: 2000 }] },
    { id: 5, name: "Matcha Latte", category: "Non-Coffee", priceCentavos: 15900, sizes: [{ label: "Regular", deltaCentavos: 0 }, { label: "Large", deltaCentavos: 2000 }] },
    { id: 6, name: "Strawberry Milk", category: "Non-Coffee", priceCentavos: 13900 },
    { id: 7, name: "Chocolate Croissant", category: "Snacks", priceCentavos: 8900 },
    { id: 8, name: "Blueberry Muffin", category: "Snacks", priceCentavos: 7900, stock: 5 },
  ],
} as const;

export const DEMO_PAYMENT_METHODS = ["Cash", "GCash"] as const;
export const DEMO_ORDER_TYPES = ["Dine-in", "Takeout"] as const;

export const FEATURES = {
  eyebrow: "Available during testing",
  headline: "The tools to keep your café organized.",
  copy: "Practical tools for the everyday flow of small cafés, coffee shops, and food stalls.",
  items: [
    {
      title: "Easy order-taking",
      copy: "Add menu items to an order, review the cart, and record sales through a straightforward checkout workflow.",
      screenshotTitle: "Order-taking screenshot",
    },
    {
      title: "Receipt printing",
      copy: "Print transaction receipts using supported thermal printers. Confirm your printer model before setup.",
      screenshotTitle: "Receipt-printing screenshot",
    },
    {
      title: "Inventory management",
      copy: "Monitor stock quantities and recorded adjustments so you can see what changed.",
    },
    {
      title: "Sales reports",
      copy: "Review recorded sales and transaction history in one organized view.",
    },
  ],
} as const;

export const HOW_IT_WORKS = {
  eyebrow: "Start simply",
  headline: "Get started and help us improve MyCafe.",
  steps: [
    { number: "01", title: "Get free access", copy: "Create your account and enter the testing phase." },
    { number: "02", title: "Set up your café", copy: "Add your café details, menu items, and prices." },
    { number: "03", title: "Try it in your workflow", copy: "Explore the system with your daily operations." },
    { number: "04", title: "Share your feedback", copy: "Tell us what works and what needs improvement." },
  ],
} as const;

export const OFFER = {
  eyebrow: "Current offer",
  headline: "Try MyCafe POS for Free.",
  copy: "Explore the features, try it with your café, and help us build a better POS for small businesses.",
  bullets: ["Access to available testing features", "Try the system with your café", "Share feedback and report issues"],
  priceLabel: "FREE ACCESS",
  price: "₱0",
  priceNote: "during testing",
  cta: "Get Free Access",
  fineprint: "Future pricing and availability may change.",
} as const;

export const FUTURE_TOOLS = {
  eyebrow: "Looking ahead",
  headline: "More possibilities for your café.",
  copy: "These ideas are part of the longer-term product vision. They are not included in the current testing access.",
  badge: "Future / optional",
  items: [
    { title: "Online café website", copy: "An online presence for your café and menu." },
    { title: "Custom domain", copy: "Use your own café web address." },
    { title: "Loyalty and rewards", copy: "Digital rewards and customer retention tools." },
    { title: "Multi-branch tools", copy: "Centralized tools for multiple locations." },
  ],
} as const;

export const FEEDBACK = {
  eyebrow: "Built with café owners",
  headline: "Help us build a POS that works for real cafés.",
  copy: "We're improving MyCafe POS through testing and feedback. Your experience can help us identify what needs to work better.",
  note: "A feedback channel will be linked here once it is active and ready to receive tester input.",
} as const;

export const FAQ = {
  eyebrow: "Clear answers",
  headline: "Frequently asked questions.",
  note: "Device, printer, offline, and invoicing details are stated carefully while verification is ongoing.",
  items: [
    { q: "Is MyCafe POS free right now?", a: "Yes. MyCafe POS is currently offering free access while testing and improvement are ongoing." },
    { q: "Do I need to pay to join?", a: "No payment is required for access during the current testing phase." },
    { q: "Is this a 14-day free trial?", a: "No. The current offer is free access during ongoing testing, not a fixed 14-day trial." },
    { q: "Will I be charged automatically?", a: "No automatic billing is attached to the current free-access offer." },
    { q: "Will MyCafe always be free?", a: "Free access applies during the current testing phase. Future pricing and availability have not been finalized." },
    {
      q: "Can I use my existing Android phone?",
      a: "MyCafe POS is intended for supported Android devices. Verified device requirements will be published once testing is complete.",
    },
    {
      q: "Can I connect a Bluetooth thermal printer?",
      a: "MyCafe POS supports compatible printers. A verified list of tested models will be published when available.",
    },
    {
      q: "Can I use it without internet?",
      a: "Offline behavior is still being verified. Do not rely on offline transactions until the supported workflow is confirmed.",
    },
    {
      q: "Is the receipt a BIR-compliant invoice?",
      a: "The current receipt is an ordinary transaction receipt. No BIR-compliant invoicing claim is being made at this time.",
    },
  ],
} as const;

export const FINAL_CTA = {
  eyebrow: "Free access during testing",
  headline: "Ready to Try MyCafe POS?",
  copy: "Explore the system, test it with your café, and help us make it better.",
  cta: "Get Free Access",
  trustLine: "No payment required during the current testing phase.",
} as const;

export const FOOTER = {
  wordmark: "MYCAFE POS",
  tagline: "A simple point-of-sale system for cafés and small food businesses.",
  links: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ],
  copyright: "MyCafe POS. Testing-phase access terms and privacy links will be added when supplied.",
} as const;

export const MOBILE_ACCESS_BAR = {
  label: "Free access",
  sublabel: "During testing",
  cta: "Get Free Access",
} as const;

// Media placeholders — no images were generated or supplied for this
// build, per the site-wide real-work-only guardrail (CLAUDE.md §16).
// Each placeholder states its required canvas/aspect/type/subject exactly
// as specified so it can be swapped for verified product media later
// without guessing dimensions. See CLAUDE.md's media replacement table.
export const MEDIA = {
  hero: { width: 1600, height: 1200, ratio: "4:3", type: "WebP", title: "Hero product image", note: "Android phone or tablet showing the actual POS, café counter, and thermal printer" },
  community: { width: 1200, height: 900, ratio: "4:3", type: "WebP", title: "Testing community image", note: "Real café owner using MyCafe POS in a working environment" },
} as const;
