// Cloudflare Pages Function: POST /api/notify-discord
//
// Staff-facing Discord notification for a completed /foryourbusiness order,
// requested directly by the operator [2026-10-05]. Fires only for successful
// payments: ForYourBusinessThankYouPage.tsx calls this once, on mount, only
// when it has a real `?ref=` order reference in the URL — and that query
// param only ever appears there because functions/api/checkout.ts appends it
// to ganap.net's successRedirectUrl (see that file's header comment). A
// declined/failed payment redirects to failureRedirectUrl instead (back to
// checkout), which never reaches this page at all, so "the thank-you page
// loaded with a ref" already means "payment succeeded" by construction —
// there is no separate payment-status check to make here.
//
// This function looks the order up in D1 by that reference (the same row
// functions/api/checkout.ts inserted as 'pending' before the ganap.net
// call) rather than trusting any order details the client could send, since
// a thank-you-page POST body is not a trustworthy source for business data
// or amounts. If the order can't be found (DB not bound, migration not yet
// run, or the row genuinely doesn't exist), this no-ops rather than erroring
// the page — a missing Discord ping is a smaller problem than breaking the
// one page a customer sees right after paying.
//
// Required env var (Cloudflare Pages dashboard only, never committed):
// DISCORD_WEBHOOK_URL. Optional: DB (the same D1 binding every other
// Function here already uses). Both are treated as optional/best-effort —
// this function always returns 200 to the browser regardless of whether the
// Discord post actually succeeded, since a notification failure is never
// something the customer-facing page should surface or retry.
//
// Idempotent against a thank-you-page revisit/refresh: before posting, this
// checks orders.discord_notified_at (see d1/schema.sql's migration for this
// function) and skips if already set, so bookmarking or reloading the
// thank-you page doesn't re-ping the channel for the same order.

interface Env {
  DISCORD_WEBHOOK_URL?: string;
  DB?: D1Database;
}

interface OrderRow {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  phone: string;
  business_category: string | null;
  business_description: string | null;
  upgrade_type: string;
  upgrade_price: number;
  amount: number;
  created_at: string;
  discord_notified_at: string | null;
}

const STARTER_PHP = 599;

const UPGRADE_LABEL: Record<string, string> = {
  none: "",
  domain_hosting: "Custom Domain & Managed Hosting",
  business_tools: "Website + Business Tools",
};

function money(pesos: number): string {
  return `₱${pesos.toLocaleString("en-PH")}`;
}

function orderDetailsLine(order: OrderRow): string {
  if (order.upgrade_type === "none" || !UPGRADE_LABEL[order.upgrade_type]) {
    return `Starter Website (${money(STARTER_PHP)}, one-time)`;
  }
  return `Starter Website + ${UPGRADE_LABEL[order.upgrade_type]} (${money(order.upgrade_price)}/year)`;
}

function formatManilaDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Always 200 to the browser: this is a best-effort staff notification,
  // never something the thank-you page should block on or retry over.
  if (!env.DB || !env.DISCORD_WEBHOOK_URL) {
    return jsonResponse(200, { skipped: true, reason: "not configured" });
  }

  let ref: unknown;
  try {
    const body = (await request.json()) as { ref?: unknown };
    ref = body.ref;
  } catch {
    return jsonResponse(200, { skipped: true, reason: "invalid body" });
  }

  if (typeof ref !== "string" || !ref) {
    return jsonResponse(200, { skipped: true, reason: "missing ref" });
  }

  let order: OrderRow | null;
  try {
    order = await env.DB.prepare(
      `SELECT id, full_name, business_name, email, phone, business_category, business_description, upgrade_type, upgrade_price, amount, created_at, discord_notified_at
       FROM orders WHERE id = ?`
    )
      .bind(ref)
      .first<OrderRow>();
  } catch (err) {
    console.error("notify-discord: D1 lookup failed", err);
    return jsonResponse(200, { skipped: true, reason: "db error" });
  }

  if (!order) {
    return jsonResponse(200, { skipped: true, reason: "order not found" });
  }
  if (order.discord_notified_at) {
    return jsonResponse(200, { skipped: true, reason: "already notified" });
  }

  const discordBody = JSON.stringify({
    embeds: [
      {
        title: "New Website Order, Paid",
        color: 0x0d68ef,
        fields: [
          { name: "Business Name", value: order.business_name || "—", inline: true },
          { name: "Business Category", value: order.business_category || "—", inline: true },
          { name: "Contact Person", value: order.full_name || "—", inline: true },
          { name: "Email Address", value: order.email || "—", inline: true },
          { name: "Mobile Number", value: order.phone || "—", inline: true },
          { name: "Total Paid", value: money(order.amount), inline: true },
          { name: "Order Reference", value: order.id, inline: false },
          { name: "Order Details", value: orderDetailsLine(order), inline: false },
          { name: "Date and Time", value: formatManilaDateTime(order.created_at), inline: false },
          {
            name: "Tell Us About Your Business and What You Offer",
            value: truncate(order.business_description || "—", 1024),
            inline: false,
          },
        ],
      },
    ],
  });

  try {
    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: discordBody,
    });
    if (!discordResponse.ok) {
      console.error("notify-discord: Discord webhook rejected the payload", discordResponse.status, await discordResponse.text());
      return jsonResponse(200, { skipped: true, reason: "discord error" });
    }
  } catch (err) {
    console.error("notify-discord: Discord webhook request failed", err);
    return jsonResponse(200, { skipped: true, reason: "discord unreachable" });
  }

  try {
    await env.DB.prepare(`UPDATE orders SET discord_notified_at = ? WHERE id = ?`)
      .bind(new Date().toISOString(), order.id)
      .run();
  } catch (err) {
    // Posted successfully but couldn't record it — a possible future
    // duplicate ping is a far smaller problem than erroring this response.
    console.error("notify-discord: failed to mark order as notified", err);
  }

  return jsonResponse(200, { notified: true });
};
