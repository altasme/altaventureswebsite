// Cloudflare Pages Function: GET /api/public/agreement/:slug?t=TOKEN
//
// Service Agreement Generator (CLAUDE.md §29), cloned from the public
// proposal GET endpoint (functions/api/public/proposal/[slug].ts) --
// public, unauthenticated, reached by a client opening the agreement
// link ClientKeeper generated. The slug alone is NOT authentication (a
// client-name slug is predictable); the `t` query param access token is
// the real gate, checked against the stored row before anything is
// returned. Never exposes client_id, created_by, or any other internal
// bookkeeping field -- only what the public agreement page needs to
// render and let the client sign.
//
// No `payment` field here, unlike the proposal endpoint -- service
// agreements are signature-only, per the operator's own confirmed
// decision (no payment-request step for this clone).

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../_lib/publicDocs";

interface ServiceAgreementRow {
  id: string;
  title: string;
  content_html: string;
  status: string;
  access_token: string;
  client_id: string | null;
  lead_id: string | null;
  prospect_email: string | null;
}

export const onRequestGet: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const agreement = await db
    .prepare(
      `SELECT id, title, content_html, status, access_token, client_id, lead_id, prospect_email
       FROM service_agreements WHERE slug = ?`
    )
    .bind(slug)
    .first<ServiceAgreementRow>();

  if (!agreement || !token || !tokensMatch(token, agreement.access_token)) {
    return jsonResponse(404, { error: "This service agreement link isn't valid." });
  }

  if (["draft"].includes(agreement.status)) {
    return jsonResponse(404, { error: "This service agreement isn't available yet." });
  }
  if (["revoked", "expired"].includes(agreement.status)) {
    return jsonResponse(410, { error: "This service agreement link is no longer active. Please contact us for an updated link." });
  }

  // Always render the latest PUBLISHED version's content, never the
  // live (possibly mid-edit) draft buffer directly -- the draft only
  // becomes visible once staff publishes it.
  const latestVersion = await db
    .prepare(`SELECT title, content_html, created_at FROM service_agreement_versions WHERE service_agreement_id = ? ORDER BY version_number DESC LIMIT 1`)
    .bind(agreement.id)
    .first<{ title: string; content_html: string; created_at: string }>();

  if (!latestVersion) return jsonResponse(404, { error: "This service agreement isn't available yet." });

  let signature: { signerName: string; signedAt: string } | null = null;
  if (agreement.status === "signed") {
    const sig = await db
      .prepare(`SELECT signer_name, signed_at FROM service_agreement_signatures WHERE service_agreement_id = ? ORDER BY signed_at DESC LIMIT 1`)
      .bind(agreement.id)
      .first<{ signer_name: string; signed_at: string }>();
    if (sig) signature = { signerName: sig.signer_name, signedAt: sig.signed_at };
  }

  // The "pre-fill, but let the signer override it" email for the
  // optional "email me a copy" checkbox, same priority order as the
  // proposal endpoint's identical lookup. Best-effort: a lookup failure
  // here never blocks the agreement itself from rendering.
  let contactEmail: string | null = agreement.prospect_email;
  try {
    if (agreement.client_id) {
      const client = await db.prepare(`SELECT email FROM clients WHERE id = ?`).bind(agreement.client_id).first<{ email: string }>();
      if (client?.email) contactEmail = client.email;
    } else if (agreement.lead_id) {
      const lead = await db.prepare(`SELECT email FROM leads WHERE id = ?`).bind(agreement.lead_id).first<{ email: string | null }>();
      if (lead?.email) contactEmail = lead.email;
    }
  } catch {
    /* non-fatal -- contactEmail just stays whatever it already was */
  }

  return jsonResponse(200, {
    title: latestVersion.title,
    contentHtml: latestVersion.content_html,
    status: agreement.status,
    contactEmail,
    // "Already signed on our end": the real date this version was
    // published, since only staff can publish -- not a fabricated
    // signature event, an accurate one.
    altaventuresSignedAt: latestVersion.created_at,
    signature,
  });
};
