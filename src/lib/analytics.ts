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

// TODO(pixel): set when the client provides a Meta Pixel ID for /limitedoffer.
// initMetaPixel() and trackLead() no-op safely until this is set.
const META_PIXEL_ID = "";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
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
  wsa_agreement_submit: Record<string, never>;
  qualifier_start: Record<string, never>;
  qualifier_complete: Record<string, never>;
  portfolio_view: { project: string };
  phase2_cta_click: Record<string, never>;
  lead: { channel: "messenger" | "viber" | "whatsapp"; businessType?: string; yearsInBusiness?: string; objectives?: string };
  checkout_started: Record<string, never>;
  payment_return: Record<string, never>;
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

/**
 * Loads the Meta Pixel base code and fires PageView, but only when
 * META_PIXEL_ID is configured. Safe to call unconditionally; no-ops (and
 * loads nothing) otherwise. Call once, near the top of the /limitedoffer
 * page component.
 */
export function initMetaPixel() {
  if (!META_PIXEL_ID || typeof window === "undefined" || window.fbq) return;

  // Meta's standard Pixel bootstrap snippet, adapted to TypeScript. The
  // queueing function is inherently dynamic (it grows properties onto
  // itself), so it's built loosely typed here and only exposed through the
  // typed `Window.fbq` declaration once fully constructed.
  type FbqQueue = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[][] };
  const queue: unknown[][] = [];
  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  }) as FbqQueue;
  fbq.queue = queue;

  window.fbq = fbq;
  window._fbq = window._fbq ?? fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");
}

/**
 * Fires the Meta `Lead` conversion on chat-channel handoff (never on
 * qualifier completion). Only non-PII qualifier context is included; no
 * name or contact details are ever sent. Also mirrors to dataLayer as
 * `lead` regardless of whether the Pixel is configured.
 */
export function trackLead(params: AnalyticsEventMap["lead"]) {
  track("lead", params);
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      businessType: params.businessType,
      yearsInBusiness: params.yearsInBusiness,
      objectives: params.objectives,
    });
  }
}

/**
 * Fires when the /foryourbusiness checkout form is submitted and the
 * ganap.net checkout session is being created. Mirrors Meta's
 * InitiateCheckout, no-ops on the Pixel side until META_PIXEL_ID is set.
 */
export function trackInitiateCheckout() {
  track("checkout_started", {});
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", { value: 299, currency: "PHP" });
  }
}
