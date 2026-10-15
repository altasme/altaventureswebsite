// Cloudflare Pages Function: POST /api/public/proposal/:slug/sign
//
// Records the client's e-signature acceptance. Validates everything
// server-side (never trusts a status/version the client might send) --
// the version actually signed is whatever proposal_versions row is
// currently the latest for this proposal at the moment of signing,
// looked up fresh here, not something the client's request can
// influence. On success, tells the browser whether (and where) to
// redirect for the associated questionnaire -- if it isn't published or
// doesn't exist, says so explicitly rather than handing back a link
// that would 404 (spec: "do not send the client to a broken page").

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

interface ProposalRow {
  id: string;
  status: string;
  access_token: string;
  questionnaire_id: string | null;
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
  if (!agreed) return jsonResponse(400, { error: "You must agree to the proposal to sign it." });

  const proposal = await db.prepare(`SELECT id, status, access_token, questionnaire_id FROM proposals WHERE slug = ?`).bind(slug).first<ProposalRow>();
  if (!proposal || !token || !tokensMatch(token, proposal.access_token)) return jsonResponse(404, { error: "This proposal link isn't valid." });
  if (["draft", "revoked", "expired"].includes(proposal.status)) return jsonResponse(409, { error: "This proposal can't be signed right now." });
  if (proposal.status === "signed") return jsonResponse(409, { error: "This proposal has already been signed." });

  const latestVersion = await db.prepare(`SELECT id FROM proposal_versions WHERE proposal_id = ? ORDER BY version_number DESC LIMIT 1`).bind(proposal.id).first<{ id: string }>();
  if (!latestVersion) return jsonResponse(409, { error: "This proposal isn't ready to sign yet." });

  const now = new Date().toISOString();
  const ip = request.headers.get("CF-Connecting-IP") || null;
  const userAgent = request.headers.get("User-Agent") || null;

  await db
    .prepare(
      `INSERT INTO proposal_signatures (id, proposal_id, version_id, signer_name, signer_title, signature_data_url, ip_address, user_agent, signed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(crypto.randomUUID(), proposal.id, latestVersion.id, signerName, signerTitle, signatureDataUrl, ip, userAgent, now)
    .run();

  await db.prepare(`UPDATE proposals SET status = 'signed', updated_at = ? WHERE id = ?`).bind(now, proposal.id).run();

  // Best-effort activity log -- never block the signature itself on it.
  // [2026-10-15] A proposal can now belong to a lead instead of a client
  // (CLAUDE.md §62 / clienthub's §25: "a proposal generator that doesn't
  // need a client") -- client_id is explicitly checked rather than left
  // to this try/catch to swallow the resulting NOT NULL violation, since
  // there's no equivalent "lead activity" timeline to write to instead.
  try {
    const proposalMeta = await db.prepare(`SELECT client_id, title FROM proposals WHERE id = ?`).bind(proposal.id).first<{ client_id: string | null; title: string }>();
    if (proposalMeta?.client_id) {
      await db
        .prepare(`INSERT INTO client_activity (id, client_id, type, description, actor_id, created_at) VALUES (?, ?, 'proposal_signed', ?, NULL, ?)`)
        .bind(crypto.randomUUID(), proposalMeta.client_id, `Proposal "${proposalMeta.title}" signed by ${signerName}`, now)
        .run();
    }
  } catch {
    /* non-fatal */
  }

  if (!proposal.questionnaire_id) {
    return jsonResponse(200, { ok: true, nextQuestionnaire: null });
  }

  const questionnaire = await db
    .prepare(`SELECT slug, access_token, status FROM questionnaires WHERE id = ?`)
    .bind(proposal.questionnaire_id)
    .first<{ slug: string; access_token: string; status: string }>();

  if (!questionnaire || !["published", "submitted"].includes(questionnaire.status)) {
    // Spec: "If the questionnaire has not been published or is
    // unavailable, do not send the client to a broken page." Tell the
    // frontend there's no questionnaire to go to right now rather than
    // handing back a link that would 404 or reject a second submission.
    return jsonResponse(200, { ok: true, nextQuestionnaire: null });
  }

  return jsonResponse(200, {
    ok: true,
    nextQuestionnaire: { slug: questionnaire.slug, token: questionnaire.access_token },
  });
};
