// Cloudflare Pages Function: POST /api/public/questionnaire/:slug/submit
//
// Records the real response. Re-validates every required question
// server-side against the exact version the client was shown (never
// trusts the client's own idea of which questions exist or which are
// required) and rejects a second submission outright -- the spec's
// "prevent duplicate submissions" guardrail, enforced here by checking
// questionnaires.status before inserting, inside the same request that
// then flips it to 'submitted'. D1 has no interactive transactions over
// HTTP, so this isn't airtight against a true concurrent double-click,
// but a single-operator-tool, one-real-response-expected feature has the
// same tolerance already accepted elsewhere in this project's history
// (e.g. clientkeeper's bill-number sequencing) -- the status check right
// before the insert closes the realistic case (a client who already
// submitted re-opening the same link and trying again).

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

interface QuestionRow {
  id: string;
  field_type: string;
  is_required: number;
}

const URL_RE = /^https?:\/\/.+/i;

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
  const rawAnswers = Array.isArray(b.answers) ? (b.answers as unknown[]) : [];

  const questionnaire = await db
    .prepare(`SELECT id, status, access_token FROM questionnaires WHERE slug = ?`)
    .bind(slug)
    .first<{ id: string; status: string; access_token: string }>();
  if (!questionnaire || !token || !tokensMatch(token, questionnaire.access_token)) return jsonResponse(404, { error: "This questionnaire link isn't valid." });
  if (questionnaire.status === "submitted") return jsonResponse(409, { error: "A response has already been submitted for this questionnaire." });
  if (questionnaire.status !== "published") return jsonResponse(409, { error: "This questionnaire isn't currently accepting responses." });

  const latestVersion = await db.prepare(`SELECT id FROM questionnaire_versions WHERE questionnaire_id = ? ORDER BY version_number DESC LIMIT 1`).bind(questionnaire.id).first<{ id: string }>();
  if (!latestVersion) return jsonResponse(409, { error: "This questionnaire isn't ready yet." });

  const questions = await db
    .prepare(`SELECT id, field_type, is_required FROM questionnaire_questions WHERE version_id = ?`)
    .bind(latestVersion.id)
    .all<QuestionRow>();
  const questionById = new Map(questions.results.map((q) => [q.id, q]));

  type ParsedAnswer = { questionId: string; valueText: string | null; valueJson: string | null; fileUrl: string | null; fileName: string | null };
  const answersByQuestion = new Map<string, ParsedAnswer>();

  for (const raw of rawAnswers) {
    const a = raw as Record<string, unknown>;
    const questionId = typeof a.questionId === "string" ? a.questionId : "";
    const question = questionById.get(questionId);
    if (!question) continue; // ignore answers for questions not in this version (stale client state)

    if (question.field_type === "multi_choice") {
      const list = Array.isArray(a.value) ? (a.value as unknown[]).filter((v): v is string => typeof v === "string") : [];
      answersByQuestion.set(questionId, { questionId, valueText: null, valueJson: list.length ? JSON.stringify(list) : null, fileUrl: null, fileName: null });
    } else if (question.field_type === "file") {
      const fileUrl = typeof a.fileUrl === "string" && a.fileUrl.trim() ? a.fileUrl.trim() : null;
      const fileName = typeof a.fileName === "string" && a.fileName.trim() ? a.fileName.trim() : null;
      answersByQuestion.set(questionId, { questionId, valueText: null, valueJson: null, fileUrl, fileName });
    } else {
      const value = typeof a.value === "string" ? a.value.trim() : "";
      if (question.field_type === "url" && value && !URL_RE.test(value)) {
        return jsonResponse(400, { error: "Please enter a valid URL (starting with http:// or https://)." });
      }
      answersByQuestion.set(questionId, { questionId, valueText: value || null, valueJson: null, fileUrl: null, fileName: null });
    }
  }

  for (const q of questions.results) {
    if (!q.is_required) continue;
    const answer = answersByQuestion.get(q.id);
    const hasValue = answer && (answer.valueText || answer.valueJson || answer.fileUrl);
    if (!hasValue) return jsonResponse(400, { error: "Please answer all required questions before submitting." });
  }

  const now = new Date().toISOString();
  const responseId = crypto.randomUUID();
  const ip = request.headers.get("CF-Connecting-IP") || null;
  const userAgent = request.headers.get("User-Agent") || null;

  const statements = [
    db
      .prepare(`INSERT INTO questionnaire_responses (id, questionnaire_id, version_id, ip_address, user_agent, submitted_at) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(responseId, questionnaire.id, latestVersion.id, ip, userAgent, now),
    ...Array.from(answersByQuestion.values()).map((a) =>
      db
        .prepare(`INSERT INTO questionnaire_answers (id, response_id, question_id, value_text, value_json, file_url, file_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(crypto.randomUUID(), responseId, a.questionId, a.valueText, a.valueJson, a.fileUrl, a.fileName, now)
    ),
    db.prepare(`UPDATE questionnaires SET status = 'submitted', updated_at = ? WHERE id = ?`).bind(now, questionnaire.id),
  ];
  await db.batch(statements);

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
