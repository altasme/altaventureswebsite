// Cloudflare Pages Function: POST /api/public/mailbox-request/:slug/submit
//   { t, localPart, domainId }
//
// The client's mailbox request from a one-time link (CLAUDE.md §74). The
// token travels in the body here and in `?t=` on the GET, the same split
// the proposal/questionnaire routes already use. No login, no session:
// the link's own service_id is the whole authorization.
//
// This writes to the same tables ClientKeeper's paid entitlement engine
// depends on, so the reservation below is a copy of
// requestMailboxByClient's INSERT (clientkeeper/functions/_lib/
// emailServices/engine.ts, the canonical version), statement for
// statement. Read that file's header before changing anything here:
// every check that guards a slot (link still open, service state, plan,
// expiry, domain belongs to the service, one pending request, capacity)
// lives INSIDE the single INSERT ... SELECT that consumes it. D1 runs
// each statement atomically and serializes writes, so two simultaneous
// submissions can never both pass a "one slot left" or "link still open"
// check. Never split this into a SELECT followed by a write. The SELECTs
// after a zero-row write only explain why it failed.
//
// The only adaptation: requestMailboxByClient's ownership predicate
// `s.client_id = ?` (a logged-in client) becomes a join through
// mail_request_links on the link's id with `l.status = 'open'`. The link
// is marked used in the same batch (one D1 transaction), conditional on
// the mailbox row existing, so a request and its link's 'used' state
// commit or fail together.
//
// The resulting row is exactly what requestMailboxByClient creates:
// 'reserved', reserved_until NULL (held until staff fulfill or decline),
// created_by_type 'client', created_by = the service's client_id. Never
// primary (staff decide that), never calls a provider.
//
// Not copied: requestMailboxByClient's sweepStaleMailboxes() call. It only
// expires STAFF reservations' 2-minute leases, which never count against
// the allowance once expired anyway (COUNTED_MAILBOX_SQL is time-bound),
// so it can't make this check wrong; at worst an expired staff
// reservation for the very same address still holds the address and the
// client gets "already taken". ClientKeeper sweeps it on its next read.

import {
  MAILBOX_COUNTED_SQL,
  MAILBOX_LINK_INVALID,
  MAILBOX_PROVISIONABLE_SQL_LIST,
  MAILBOX_PROVISIONABLE_STATUSES,
  MAILBOX_TOTAL_ALLOWANCE_SQL,
  jsonResponse,
  normalizeLocalPart,
  tokensMatch,
  type PublicDocsEnv,
} from "../../../../_lib/publicDocs";

interface LinkRow {
  id: string;
  service_id: string;
  access_token: string;
  status: string;
}

function isUniqueViolation(err: unknown, column: string): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("UNIQUE constraint failed") && msg.includes(column);
}

const fail = (status: number, code: string, error: string) => jsonResponse(status, { error, code });

export const onRequestPost: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return fail(400, "invalid_body", "Invalid request body");
  }
  const token = typeof body.t === "string" ? body.t : "";

  const link = await db.prepare(`SELECT id, service_id, access_token, status FROM mail_request_links WHERE slug = ?`).bind(slug).first<LinkRow>();
  if (!link || !token || !tokensMatch(token, link.access_token) || link.status !== "open") return fail(404, "link_invalid", MAILBOX_LINK_INVALID);

  const localPart = normalizeLocalPart(body.localPart);
  if (!localPart) return fail(400, "invalid_local_part", "The mailbox name may use letters, numbers, dots, dashes, underscores and plus signs.");
  const domainId = typeof body.domainId === "string" ? body.domainId : "";

  // Only one of this link's own service's active domains. Re-enforced by
  // the JOIN in the INSERT below; this lookup is for the address text and
  // a clear message.
  const domain = await db
    .prepare(`SELECT id, domain FROM email_domains WHERE id = ? AND service_id = ? AND status = 'active'`)
    .bind(domainId, link.service_id)
    .first<{ id: string; domain: string }>();
  if (!domain) return fail(400, "domain_not_found", "Please choose one of the domains listed for your business.");

  const now = new Date().toISOString();
  const mailboxId = crypto.randomUUID();
  const address = `${localPart}@${domain.domain}`;
  // One mailbox row per link, ever, enforced by email_mailboxes'
  // UNIQUE idempotency_key on top of the l.status = 'open' check.
  const idempotencyKey = `mail-request-link:${link.id}`;

  let inserted: number;
  try {
    const [res] = await db.batch([
      // THE reservation: requestMailboxByClient's statement, with the
      // link (still open, this link's service) as the ownership boundary.
      // reserved_until is NULL on purpose. inbound_source is
      // PROVIDER_INBOUND_SOURCE.zcom ('zcom' is the only provider the
      // email_services CHECK allows).
      db
        .prepare(
          `INSERT INTO email_mailboxes (id, service_id, domain_id, local_part, address, is_primary, status, inbound_source, provider_service_id, idempotency_key, reserved_until, created_by, created_by_type, created_at, updated_at)
           SELECT ?, s.id, d.id, ?, ?, 0, 'reserved', 'zcom_poll_sync', s.provider_service_id, ?, NULL, s.client_id, 'client', ?, ?
           FROM mail_request_links l
           JOIN email_services s ON s.id = l.service_id
           JOIN email_domains d ON d.id = ? AND d.service_id = s.id AND d.status = 'active'
           WHERE l.id = ?
             AND l.status = 'open'
             AND s.status IN (${MAILBOX_PROVISIONABLE_SQL_LIST})
             AND s.plan_id IS NOT NULL
             AND (s.expires_at IS NULL OR s.expires_at > ?)
             AND NOT EXISTS (SELECT 1 FROM email_mailboxes p WHERE p.service_id = s.id AND p.status = 'reserved' AND p.created_by_type = 'client')
             AND ${MAILBOX_TOTAL_ALLOWANCE_SQL} > ${MAILBOX_COUNTED_SQL}`
        )
        .bind(mailboxId, localPart, address, idempotencyKey, now, now, domain.id, link.id, now, now),
      // Spend the link, only if the row above now exists.
      db
        .prepare(
          `UPDATE mail_request_links SET status = 'used', used_at = ?, used_mailbox_id = ?, updated_at = ?
           WHERE id = ? AND status = 'open' AND EXISTS (SELECT 1 FROM email_mailboxes WHERE id = ?)`
        )
        .bind(now, mailboxId, now, link.id, mailboxId),
    ]);
    inserted = res?.meta.changes ?? 0;
  } catch (err) {
    // Same unique-index handling as requestMailboxByClient. A collision on
    // the link's idempotency key means the link was already used.
    if (isUniqueViolation(err, "idempotency_key")) return fail(404, "link_invalid", MAILBOX_LINK_INVALID);
    if (isUniqueViolation(err, "address")) return fail(409, "address_taken", `${address} is already taken. Choose a different name.`);
    throw err;
  }

  if (inserted === 0) {
    // Explain the refusal, most specific first. Read-only.
    const current = await db.prepare(`SELECT status FROM mail_request_links WHERE id = ?`).bind(link.id).first<{ status: string }>();
    if (current?.status !== "open") return fail(404, "link_invalid", MAILBOX_LINK_INVALID);
    const pending = await db
      .prepare(`SELECT address FROM email_mailboxes WHERE service_id = ? AND status = 'reserved' AND created_by_type = 'client' LIMIT 1`)
      .bind(link.service_id)
      .first<{ address: string }>();
    if (pending) return fail(409, "request_pending", `Your request for ${pending.address} is still being set up. You can request another mailbox once it's done.`);
    const service = await db.prepare(`SELECT status, expires_at, plan_id FROM email_services WHERE id = ?`).bind(link.service_id).first<{ status: string; expires_at: string | null; plan_id: string | null }>();
    const expired = service?.status === "active" && service.expires_at !== null && service.expires_at <= now;
    if (!service || expired || !MAILBOX_PROVISIONABLE_STATUSES.includes(service.status) || !service.plan_id) {
      return fail(409, "service_not_available", "New mailboxes can't be requested on this email service right now. Please contact us.");
    }
    const stillActive = await db.prepare(`SELECT 1 AS ok FROM email_domains WHERE id = ? AND service_id = ? AND status = 'active'`).bind(domain.id, link.service_id).first();
    if (!stillActive) return fail(400, "domain_not_found", "Please choose one of the domains listed for your business.");
    return fail(409, "allowance_exhausted", "There are no mailbox slots left on your plan. Please contact us to add more.");
  }

  // Audit + the client's timeline, after the fact like the engine's own
  // (best-effort: the request itself is already committed).
  try {
    const clientId = (await db.prepare(`SELECT client_id FROM email_services WHERE id = ?`).bind(link.service_id).first<{ client_id: string }>())?.client_id ?? null;
    await db.batch([
      db
        .prepare(
          `INSERT INTO email_audit_logs (id, service_id, mailbox_id, actor_type, actor_id, action, before_json, after_json, reason, created_at)
           VALUES (?, ?, ?, 'client', ?, 'mailbox_requested_by_client', NULL, ?, NULL, ?)`
        )
        .bind(crypto.randomUUID(), link.service_id, mailboxId, clientId, JSON.stringify({ address, isPrimary: false, via: "request_link", linkId: link.id }), now),
      ...(clientId
        ? [
            db
              .prepare(`INSERT INTO client_activity (id, client_id, type, description, actor_id, created_at) VALUES (?, ?, 'email_mailbox_requested', ?, NULL, ?)`)
              .bind(crypto.randomUUID(), clientId, `Requested mailbox ${address} (via request link)`, now),
          ]
        : []),
    ]);
  } catch (err) {
    console.error("mailbox-request: audit/activity write failed", err);
  }

  return jsonResponse(201, { address });
};
