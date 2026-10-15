// Cloudflare Pages Function: GET /api/public/questionnaire/:slug?t=TOKEN
//
// Public, unauthenticated. Returns the LATEST PUBLISHED version's
// content_html only -- the client never sees the live draft buffer, and
// never sees any other client's questionnaire (slug+token gate, same
// model as the proposal endpoint). Mirrors the proposal endpoint's own
// shape exactly, since questionnaires are now the same free-text-content
// model (CLAUDE.md's 2026-10-15 redesign: one rich-text content block,
// one open-ended client reply, no structured per-question field types).

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../_lib/publicDocs";

interface QuestionnaireRow {
  id: string;
  title: string;
  status: string;
  access_token: string;
}

export const onRequestGet: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const questionnaire = await db
    .prepare(`SELECT id, title, status, access_token FROM questionnaires WHERE slug = ?`)
    .bind(slug)
    .first<QuestionnaireRow>();

  if (!questionnaire || !token || !tokensMatch(token, questionnaire.access_token)) {
    return jsonResponse(404, { error: "This questionnaire link isn't valid." });
  }
  if (questionnaire.status === "draft") return jsonResponse(404, { error: "This questionnaire isn't available yet." });
  if (questionnaire.status === "closed") return jsonResponse(410, { error: "This questionnaire link is no longer active. Please contact us." });
  if (questionnaire.status === "submitted") return jsonResponse(409, { error: "A response has already been submitted for this questionnaire. Thank you!" });

  const latestVersion = await db
    .prepare(`SELECT id, title, content_html FROM questionnaire_versions WHERE questionnaire_id = ? ORDER BY version_number DESC LIMIT 1`)
    .bind(questionnaire.id)
    .first<{ id: string; title: string; content_html: string }>();
  if (!latestVersion) return jsonResponse(404, { error: "This questionnaire isn't available yet." });

  return jsonResponse(200, {
    title: latestVersion.title,
    contentHtml: latestVersion.content_html,
    versionId: latestVersion.id,
  });
};
