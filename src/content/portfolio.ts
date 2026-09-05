// content/portfolio.ts
// Canonical portfolio data, shared by the main marketing site (altasme.com)
// and the free-website landing page (altasme.com/limitedoffer). Descriptions
// are client-approved wording. No fabrication, no embellishment beyond what's
// written here — see CLAUDE.md for placement rules per surface.

export type ProjectTier = "system" | "site" | "engine";
export type ProjectStatus = "live" | "ongoing";

export interface Project {
  id: string;
  name: string;
  url: string | null; // null = in-house, no public URL, no "View Website" link
  category: string; // customer-facing label
  tier: ProjectTier;
  status: ProjectStatus;
  viewable: boolean; // has a public URL the visitor can open
  description: string; // short card copy
  tags: string[];
}

export const PORTFOLIO: Project[] = [
  {
    id: "altamotors",
    name: "Altamotors",
    url: "https://altamotorsph.com",
    category: "Motorcycle Sales & Financing Platform",
    tier: "system",
    status: "live",
    viewable: true,
    description:
      "A full business system for a motorcycle sales company: customer website, CRM, inventory management, a loan application suite open to all financing partners, SMS and email, plus separate customer and partner portals.",
    tags: ["CRM", "Financing", "Inventory", "Portals"],
  },
  {
    id: "aurielle",
    name: "Aurielle Paris Atelier",
    url: "https://auriellefragrancestudio.com",
    category: "Fragrance E-commerce & Operations",
    tier: "system",
    status: "live",
    viewable: true,
    description:
      "A customer website and order-and-operations platform with a built-in payment system for a fragrance manufacturer and supplier carrying over 2,000 SKUs.",
    tags: ["E-commerce", "Payments", "Operations"],
  },
  {
    id: "leanandfit",
    name: "Lean and Fit PH",
    url: "https://leanandfit.ph",
    category: "Health Brand + Multi-Panel Commerce",
    tier: "system",
    status: "live",
    viewable: true,
    description:
      "Landing page plus an order management system and an affiliate and distribution channel platform, with separate panels for admins, customers, distributors, and franchisers.",
    tags: ["Commerce", "Affiliate", "Multi-panel"],
  },
  {
    id: "dmhr",
    name: "DM HR Consultancy",
    url: "https://dmhrconsultancyph.com",
    category: "Professional Services Website",
    tier: "site",
    status: "live",
    viewable: true,
    description:
      "A professional landing page for an HR consultancy firm, with hosting and maintenance. Payroll and timekeeping system in future development talks.",
    tags: ["Website", "Professional Services"],
  },
  {
    id: "vocalyze",
    name: "Vocalyze Lounge",
    url: "https://vocalyze.altasme.com",
    category: "Local Business Website",
    tier: "site",
    status: "live",
    viewable: true,
    description: "A landing page for a startup local karaoke lounge, with hosting and maintenance.",
    tags: ["Website", "Entertainment", "Local"],
  },
  {
    id: "aulea",
    name: "Aulea Skin Essentials",
    url: "https://aulea.altasme.com",
    category: "Local Skincare Brand Website",
    tier: "site",
    status: "live",
    viewable: true,
    description: "A landing page for a local skincare brand, with hosting and maintenance.",
    tags: ["Website", "Retail", "Local"],
  },
  {
    id: "setmona",
    name: "Setmona Booking Engine",
    url: null,
    category: "Booking & Scheduling System",
    tier: "engine",
    status: "live",
    viewable: false,
    description:
      "An in-house booking and appointment management system for service businesses, with automated email and SMS, CRM, forms, and reporting.",
    tags: ["Booking", "CRM", "Automation"],
  },
  {
    id: "kolekta",
    name: "Kolekta Billing Engine",
    url: null,
    category: "Billing & Collections System",
    tier: "engine",
    status: "live",
    viewable: false,
    description:
      "An in-house billing and collections system: invoice generation, automated email and SMS, manual recurring billing, tax and fee calculation, customer portal, and payment plans.",
    tags: ["Billing", "Collections", "Portal"],
  },
  {
    id: "pocketg7iii",
    name: "Pocket G7iii Camera Rental",
    url: "https://pocketg7iii.altasme.com",
    category: "Local Camera Rental Website",
    tier: "site",
    status: "live",
    viewable: true,
    description:
      "A landing page for a local camera rental business based in Puerto Princesa, Palawan, subdomained to ours in support of youth entrepreneurship. Booking page and system development in future talks.",
    tags: ["Website", "Local", "Youth Entrepreneurship"],
  },
  {
    id: "macquias",
    name: "Macquia's Camera Rental",
    url: "https://macquias.altasme.com",
    category: "Local Camera Rental Website",
    tier: "site",
    status: "live",
    viewable: true,
    description:
      "A landing page for a local camera rental business based in Tarlac City, subdomained to ours in support of youth entrepreneurship.",
    tags: ["Website", "Local", "Youth Entrepreneurship"],
  },
  {
    id: "ascend-volleyball",
    name: "Ascend Volleyball Camp",
    url: "https://avc.altasme.com",
    category: "Volleyball Camp & Training Academy Website",
    tier: "site",
    status: "live",
    viewable: true,
    description:
      "A landing page for a Quezon City based volleyball camp and training academy. Student management system and e-commerce store in future development talks.",
    tags: ["Website", "Sports", "Local"],
  },
  {
    id: "clickandkeep",
    name: "Click and Keep Photography",
    url: "https://clickandkeep.altasme.com",
    category: "Local Photography Business Website",
    tier: "site",
    status: "live",
    viewable: true,
    description:
      "A landing page for a local freelance photographer to showcase his work to clients, subdomained to ours in support of youth entrepreneurship.",
    tags: ["Website", "Local", "Youth Entrepreneurship"],
  },
];

export const PORTFOLIO_BY_ID: Record<string, Project> = Object.fromEntries(
  PORTFOLIO.map((project) => [project.id, project])
);

export const VIEWABLE_PORTFOLIO_IDS = PORTFOLIO.filter((p) => p.viewable).map((p) => p.id);
export const ENGINE_PORTFOLIO_IDS = PORTFOLIO.filter((p) => p.tier === "engine").map((p) => p.id);

export const ONGOING = [
  {
    id: "ollocal",
    name: "Ollocal.PH",
    note: "A local farmers market initiative and event organizer across Metro Manila malls.",
  },
  {
    id: "amani",
    name: "Amani Massage and Wellness Spa",
    note: "A massage and wellness spa.",
  },
  {
    id: "argo",
    name: "ARGO Customs Brokerage",
    note: "A customs brokerage service.",
  },
  {
    id: "onyx-clouds",
    name: "ONYX CLOUDS PREMIUM VAPE CO.",
    note: "A premium vape brand.",
  },
  {
    id: "camsnaps",
    name: "Camsnaps Camera Rental",
    note: "A camera rental service.",
  },
  {
    id: "firsthand-travel",
    name: "FirstHand Travel and Tours",
    note: "A travel and tours agency.",
  },
] as const;
