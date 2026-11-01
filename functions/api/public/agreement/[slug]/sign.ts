// Cloudflare Pages Function: POST /api/public/agreement/:slug/sign
//
// Service Agreement Generator (CLAUDE.md §29), cloned from the public
// proposal sign endpoint (functions/api/public/proposal/[slug]/sign.ts)
// -- same mechanics, minus the questionnaire-redirect response (service
// agreements have no linked-questionnaire concept) and minus the
// payment-step response shape (signature only).
//
// Records the client's e-signature acceptance. Validates everything
// server-side (never trusts a status/version the client might send) --
// the version actually signed is whatever service_agreement_versions
// row is currently the latest for this agreement at the moment of
// signing, looked up fresh here, not something the client's request can
// influence.

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

interface ServiceAgreementRow {
  id: string;
  status: string;
  access_token: string;
}

interface StandaloneAgreementMeta {
  client_id: string | null;
  lead_id: string | null;
  prospect_full_name: string | null;
  prospect_business_name: string | null;
  prospect_email: string | null;
  prospect_phone: string | null;
}

const EMAIL_SAFE_NAME = /^.{1,200}$/;

export const onRequestPost: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid request body" });
  }
  const b = body as Record<string, unknown>;
  const token = typeof b.t === "string" ? b.t : "";
  const signerName = typeof b.signerName === "string" ? b.signerName.trim() : "";
  const signerTitle = typeof b.signerTitle === "string" && b.signerTitle.trim() ? b.signerTitle.trim() : null;
  const signatureDataUrl = typeof b.signatureDataUrl === "string" ? b.signatureDataUrl : "";
  const agreed = b.agreed === true;

  if (!signerName || !EMAIL_SAFE_NAME.test(signerName)) return jsonResponse(400, { error: "Your full name is required." });
  if (!signatureDataUrl.startsWith("data:image/")) return jsonResponse(400, { error: "A signature is required." });
  if (!agreed) return jsonResponse(400, { error: "You must agree to the agreement to sign it." });

  const agreement = await db.prepare(`SELECT id, status, access_token FROM service_agreements WHERE slug = ?`).bind(slug).first<ServiceAgreementRow>();
  if (!agreement || !token || !tokensMatch(token, agreement.access_token)) return jsonResponse(404, { error: "This service agreement link isn't valid." });
  if (["draft", "revoked", "expired"].includes(agreement.status)) return jsonResponse(409, { error: "This service agreement can't be signed right now." });
  if (agreement.status === "signed") return jsonResponse(409, { error: "This service agreement has already been signed." });

  const latestVersion = await db.prepare(`SELECT id FROM service_agreement_versions WHERE service_agreement_id = ? ORDER BY version_number DESC LIMIT 1`).bind(agreement.id).first<{ id: string }>();
  if (!latestVersion) return jsonResponse(409, { error: "This service agreement isn't ready to sign yet." });

  const now = new Date().toISOString();
  const ip = request.headers.get("CF-Connecting-IP") || null;
  const userAgent = request.headers.get("User-Agent") || null;

  await db
    .prepare(
      `INSERT INTO service_agreement_signatures (id, service_agreement_id, version_id, signer_name, signer_title, signature_data_url, ip_address, user_agent, signed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), agreement.id, latestVersion.id, signerName, signerTitle, signatureDataUrl, ip, userAgent, now)
    .run();

  await db.prepare(`UPDATE service_agreements SET status = 'signed', updated_at = ? WHERE id = ?`).bind(now, agreement.id).run();

  // Auto-create a real client from a standalone agreement's stored
  // prospect info the moment it's signed, identical reasoning and logic
  // to the proposal generator's own sign.ts (CLAUDE.md §63): deliberately
  // scoped to ONLY the standalone case (both client_id and lead_id
  // null); a lead-backed agreement's signing behavior is unchanged by
  // design, it still just flips to "signed" above with no client
  // auto-created.
  //
  // Best-effort and never blocks the signature itself. Runs BEFORE the
  // activity-log block below so that block's own fresh re-read of
  // client_id picks up the client this just created.
  try {
    const meta = await db
      .prepare(`SELECT client_id, lead_id, prospect_full_name, prospect_business_name, prospect_email, prospect_phone FROM service_agreements WHERE id = ?`)
      .bind(agreement.id)
      .first<StandaloneAgreementMeta>();

    if (meta && !meta.client_id && !meta.lead_id && meta.prospect_email && meta.prospect_full_name && meta.prospect_business_name) {
      // Match the existing ganap.net webhook's own idempotent-by-email
      // linking (clienthub's functions/api/webhooks/ganap.ts), same as
      // the proposal sign endpoint's identical logic -- this prospect
      // may already be a real client through another channel, in which
      // case this agreement should link to that existing record, never
      // create a duplicate.
      const existingClient = await db
        .prepare(`SELECT id FROM clients WHERE LOWER(email) = LOWER(?)`)
        .bind(meta.prospect_email)
        .first<{ id: string }>();

      let clientId: string;
      if (existingClient) {
        clientId = existingClient.id;
        await db
          .prepare(`UPDATE clients SET mobile = COALESCE(mobile, ?), updated_at = ? WHERE id = ?`)
          .bind(meta.prospect_phone, now, clientId)
          .run();
      } else {
        clientId = crypto.randomUUID();
        await db
          .prepare(
            `INSERT INTO clients (id, email, full_name, business_name, mobile, invitation_status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
          )
          .bind(clientId, meta.prospect_email, meta.prospect_full_name, meta.prospect_business_name, meta.prospect_phone, now, now)
          .run();
      }

      await db.prepare(`UPDATE service_agreements SET client_id = ?, updated_at = ? WHERE id = ?`).bind(clientId, now, agreement.id).run();
    }
  } catch {
    /* non-fatal -- the signature above already succeeded */
  }

  // Best-effort activity log -- never block the signature itself on it.
  try {
    const agreementMeta = await db.prepare(`SELECT client_id, title FROM service_agreements WHERE id = ?`).bind(agreement.id).first<{ client_id: string; title: string }>();
    if (agreementMeta) {
      await db
        .prepare(`INSERT INTO client_activity (id, client_id, type, description, actor_id, created_at) VALUES (?, ?, 'service_agreement_signed', ?, NULL, ?)`)
        .bind(crypto.randomUUID(), agreementMeta.client_id, `Service agreement "${agreementMeta.title}" signed by ${signerName}`, now)
        .run();
    }
  } catch {
    /* non-fatal */
  }

  return jsonResponse(200, { ok: true });
};
