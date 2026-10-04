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

// Real Meta Pixel ID, supplied by the operator [2026-10-04] specifically
// for /foryourbusiness. This is the one site-wide Pixel constant every
// initMetaPixel()/track*() call below already shares (trackInitiateCheckout,
// trackInitiateCheckoutB2B, trackLead) — setting it here means any page that
// calls initMetaPixel() now actually loads and fires the Pixel, which
// currently means /limitedoffer (already called it, previously a no-op)
// and /foryourbusiness's three pages (landing/checkout/thank-you, wired up
// the same day this ID was supplied). /b2b's own InitiateCheckout call
// will also start firing, but only once window.fbq has been loaded by a
// visit to one of the above, since no /b2b page calls initMetaPixel()
// itself yet.
const META_PIXEL_ID = "1776226086741887";

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
  mycafe_landing_view: Record<string, never>;
  mycafe_hero_cta_click: Record<string, never>;
  mycafe_demo_play: Record<string, never>;
  mycafe_feature_section_view: Record<string, never>;
  mycafe_free_access_click: { location: string };
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
 * loads nothing) otherwise. Also safe to call from more than one page
 * component in the same session — it checks window.fbq and does nothing
 * if the Pixel is already loaded, so it won't double-init or double-fire
 * PageView on client-side navigation between pages that each call it.
 * Call once, near the top of each page component that should track a
 * PageView: currently /limitedoffer and /foryourbusiness (landing,
 * checkout, thank-you).
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
 *
 * `value` defaults to 599 (the Starter Website alone) but the checkout
 * page now passes the actual server-validated total [2026-10-02, added
 * for the optional-upgrade checkout redesign] -- 2099 or 6299 when the
 * customer added an upgrade -- so ad reporting reflects what was really
 * charged, same reasoning trackInitiateCheckoutB2B below already applies
 * to its own deposit-only value.
 */
export function trackInitiateCheckout(value: number = 599) {
  track("checkout_started", {});
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", { value, currency: "PHP" });
  }
}

/**
 * Fires when the /b2b checkout form is submitted and the ganap.net
 * checkout session is being created. Same role as trackInitiateCheckout()
 * above, kept as its own function (rather than parametrizing that one)
 * since it's a distinct offer with its own Pixel value, matching this
 * file's existing one-function-per-offer convention (trackLead's channel
 * enum aside). Value is 2499, the ₱2,499 deposit this checkout step
 * actually charges (₱4,999 total, ₱2,499 + ₱2,500 split, see
 * content/b2b.ts and functions/api/checkout.ts) — not the full package
 * price, so ad reporting reflects the real transaction this event
 * corresponds to.
 */
export function trackInitiateCheckoutB2B() {
  track("checkout_started", {});
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", { value: 2499, currency: "PHP" });
  }
}
