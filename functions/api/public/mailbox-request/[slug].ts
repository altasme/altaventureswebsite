// Cloudflare Pages Function: GET /api/public/mailbox-request/:slug?t=TOKEN
//
// Public, unauthenticated -- reached by a client opening the one-time
// mailbox request link staff generated in ClientKeeper (CLAUDE.md §74).
// Same posture as the proposal routes: the slug is readable and
// predictable, the `t` access token is the real gate (constant-time
// compare), and a bad token, a revoked link and a used link all get the
// SAME 404 so nobody can probe which links exist.
//
// Returns only what the page needs to let the client make a sensible
// request: their business name (greeting), the service's active domains
// (to pick from), the remaining mailbox slots (so "no slots left" is
// never a surprise after typing a name), and any request of theirs still
// waiting on staff. Never exposes client_id, service status internals,
// prices, or anyone else's data.

import {
  COUNTED_MAILBOX_SQL,
  MAILBOX_LINK_INVALID,
  MAILBOX_PROVISIONABLE_STATUSES,
  jsonResponse,
  tokensMatch,
  type PublicDocsEnv,
} from "../../../_lib/publicDocs";

interface LinkRow {
  id: string;
  service_id: string;
  access_token: string;
  status: string;
}

export const onRequestGet: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const link = await db.prepare(`SELECT id, service_id, access_token, status FROM mail_request_links WHERE slug = ?`).bind(slug).first<LinkRow>();
  if (!link || !token || !tokensMatch(token, link.access_token) || link.status !== "open") {
    return jsonResponse(404, { error: MAILBOX_LINK_INVALID });
  }

  const now = new Date().toISOString();
  // A copy of ClientKeeper's getAllowance() (clientkeeper/functions/_lib/
  // emailServices/engine.ts, the canonical version): included + add-ons +
  // overrides, against active and still-held mailboxes. Display only --
  // the submit route re-checks capacity inside the INSERT that reserves.
  const service = await db
    .prepare(
      `SELECT s.status, s.expires_at, s.plan_id, c.business_name,
              s.included_mailboxes AS included,
              COALESCE((SELECT SUM(quantity) FROM email_service_entitlements e WHERE e.service_id = s.id AND e.kind = 'addon'), 0) AS additional,
              COALESCE((SELECT SUM(quantity) FROM email_service_entitlements e WHERE e.service_id = s.id AND e.kind = 'override'), 0) AS overrides,
              (SELECT COUNT(*) FROM email_mailboxes m WHERE m.service_id = s.id AND m.status = 'active') AS active,
              (SELECT COUNT(*) FROM email_mailboxes m WHERE m.service_id = s.id AND m.status <> 'active' AND ${COUNTED_MAILBOX_SQL}) AS pending
       FROM email_services s JOIN clients c ON c.id = s.client_id WHERE s.id = ?`
    )
    .bind(now, link.service_id)
    .first<{ status: string; expires_at: string | null; plan_id: string | null; business_name: string; included: number; additional: number; overrides: number; active: number; pending: number }>();
  if (!service) return jsonResponse(404, { error: MAILBOX_LINK_INVALID });

  const total = Number(service.included) + Number(service.additional) + Number(service.overrides);
  const used = Number(service.active) + Number(service.pending);

  const domains = await db
    .prepare(`SELECT id, domain FROM email_domains WHERE service_id = ? AND status = 'active' ORDER BY is_primary DESC, created_at`)
    .bind(link.service_id)
    .all<{ id: string; domain: string }>();

  const pending = await db
    .prepare(`SELECT address FROM email_mailboxes WHERE service_id = ? AND status = 'reserved' AND created_by_type = 'client' LIMIT 1`)
    .bind(link.service_id)
    .first<{ address: string }>();

  // Same rule the reservation enforces: a provisionable state, a plan,
  // and (policy.ts's effective-expiry rule) not past expires_at.
  const acceptingRequests = MAILBOX_PROVISIONABLE_STATUSES.includes(service.status) && !!service.plan_id && (service.expires_at === null || service.expires_at > now) && domains.results.length > 0;

  return jsonResponse(200, {
    businessName: service.business_name,
    domains: domains.results.map((d) => ({ id: d.id, domain: d.domain })),
    allowance: { total, used, available: Math.max(0, total - used) },
    pendingRequestAddress: pending?.address ?? null,
    acceptingRequests,
  });
};
