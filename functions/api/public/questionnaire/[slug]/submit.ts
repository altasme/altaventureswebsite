// Cloudflare Pages Function: POST /api/public/questionnaire/:slug/submit
//
// Records the real response -- now just the client's one free-text
// answer (CLAUDE.md's 2026-10-15 redesign), not a per-question answer
// set. Rejects a second submission outright -- the spec's "prevent
// duplicate submissions" guardrail, enforced here by checking
// questionnaires.status before inserting, inside the same request that
// then flips it to 'submitted'. D1 has no interactive transactions over
// HTTP, so this isn't airtight against a true concurrent double-click,
// but a single-operator-tool, one-real-response-expected feature has the
// same tolerance already accepted elsewhere in this project's history
// (e.g. clientkeeper's bill-number sequencing) -- the status check right
// before the insert closes the realistic case (a client who already
// submitted re-opening the same link and trying again).

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

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
  const answerText = typeof b.answerText === "string" ? b.answerText.trim() : "";

  if (!answerText) return jsonResponse(400, { error: "Please write a response before submitting." });

  const questionnaire = await db
    .prepare(`SELECT id, status, access_token FROM questionnaires WHERE slug = ?`)
    .bind(slug)
    .first<{ id: string; status: string; access_token: string }>();
  if (!questionnaire || !token || !tokensMatch(token, questionnaire.access_token)) return jsonResponse(404, { error: "This questionnaire link isn't valid." });
  if (questionnaire.status === "submitted") return jsonResponse(409, { error: "A response has already been submitted for this questionnaire." });
  if (questionnaire.status !== "published") return jsonResponse(409, { error: "This questionnaire isn't currently accepting responses." });

  const latestVersion = await db.prepare(`SELECT id FROM questionnaire_versions WHERE questionnaire_id = ? ORDER BY version_number DESC LIMIT 1`).bind(questionnaire.id).first<{ id: string }>();
  if (!latestVersion) return jsonResponse(409, { error: "This questionnaire isn't ready yet." });

  const now = new Date().toISOString();
  const ip = request.headers.get("CF-Connecting-IP") || null;
  const userAgent = request.headers.get("User-Agent") || null;

  await db.batch([
    db
      .prepare(`INSERT INTO questionnaire_responses (id, questionnaire_id, version_id, answer_text, ip_address, user_agent, submitted_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(crypto.randomUUID(), questionnaire.id, latestVersion.id, answerText, ip, userAgent, now),
    db.prepare(`UPDATE questionnaires SET status = 'submitted', updated_at = ? WHERE id = ?`).bind(now, questionnaire.id),
  ]);

  try {
    const meta = await db.prepare(`SELECT client_id, title FROM questionnaires WHERE id = ?`).bind(questionnaire.id).first<{ client_id: string; title: string }>();
    if (meta) {
      await db
        .prepare(`INSERT INTO client_activity (id, client_id, type, description, actor_id, created_at) VALUES (?, ?, 'questionnaire_submitted', ?, NULL, ?)`)
        .bind(crypto.randomUUID(), meta.client_id, `Questionnaire "${meta.title}" submitted by the client`, now)
        .run();
    }
  } catch {
    /* non-fatal */
  }

  return jsonResponse(200, { ok: true });
};
