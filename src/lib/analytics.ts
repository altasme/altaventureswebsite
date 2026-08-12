// lib/analytics.ts
// Lightweight tracking wrapper. Pushes every event to window.dataLayer and,
// if a MEASUREMENT_ID is configured, forwards to gtag/Pixel. No IDs are
// required to build or run the site.
//
// Note: a `contact_channel_select` event is the closest on-site proxy for the
// site's real KPI (qualified business conversations). Actual qualification
// happens off-site in chat, once the visitor lands on Messenger/Viber/
// WhatsApp, and is not measurable from this codebase.

// TODO(analytics): set when GA4 / Meta Pixel IDs are provided by the client.
const MEASUREMENT_ID = "";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsEventMap = {
  cta_click: { label: string; section: string };
  contact_channel_select: { channel: "messenger" | "viber" | "whatsapp" };
  complimentary_cta_click: Record<string, never>;
  case_study_open: { project: string };
  service_interaction: { service: string };
  scroll_depth: { depth: 25 | 50 | 75 | 100 };
  industry_engagement: { industry: string };
};

export function track<E extends keyof AnalyticsEventMap>(
  event: E,
  params: AnalyticsEventMap[E] = {} as AnalyticsEventMap[E],
) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });

  if (MEASUREMENT_ID && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
