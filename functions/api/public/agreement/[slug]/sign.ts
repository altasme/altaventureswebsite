// Cloudflare Pages Function: POST /api/public/agreement/:slug/sign
//
// Service Agreement Generator (CLAUDE.md §29), cloned from the public
// proposal sign endpoint (functions/api/public/proposal/[slug]/sign.ts)
// -- same mechanics, minus the questionnaire-redirect response (service
// agreements have no linked-questionnaire concept) and minus the
// payment-step response shape (signature only). Unlike the proposal
// endpoint, there is no standalone-agreement-auto-creates-a-client
// logic here at all: CLAUDE.md §30 ("must be linked to specific
// CLIENTS") removed that entirely, since a service agreement's
// client_id is always already a real client by the time this fires.
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

  // Best-effort activity log -- never block the signature itself on it.
  // client_id is unconditionally present (CLAUDE.md §30), so this is a
  // straight lookup, not a guarded one.
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
