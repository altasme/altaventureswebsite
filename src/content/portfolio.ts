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
    id: "macquia",
    name: "Macquia's Camera Rental",
    note: "A local camera rental service in Tarlac.",
  },
  {
    id: "pocketg7iii",
    name: "Pocket G7iii Camera Rental",
    note: "A local camera rental service in Palawan.",
  },
] as const;
