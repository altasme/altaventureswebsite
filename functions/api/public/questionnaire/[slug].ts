// Cloudflare Pages Function: GET /api/public/questionnaire/:slug?t=TOKEN
//
// Public, unauthenticated. Returns the LATEST PUBLISHED version's
// question set only -- the client never sees the live draft buffer, and
// never sees any other client's questionnaire (slug+token gate, same
// model as the proposal endpoint).

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../_lib/publicDocs";

interface QuestionnaireRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  access_token: string;
}

interface QuestionRow {
  id: string;
  section_heading: string | null;
  section_description: string | null;
  prompt: string;
  help_text: string | null;
  field_type: string;
  is_required: number;
  options_json: string | null;
  sort_order: number;
}

export const onRequestGet: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const questionnaire = await db
    .prepare(`SELECT id, title, description, status, access_token FROM questionnaires WHERE slug = ?`)
    .bind(slug)
    .first<QuestionnaireRow>();

  if (!questionnaire || !token || !tokensMatch(token, questionnaire.access_token)) {
    return jsonResponse(404, { error: "This questionnaire link isn't valid." });
  }
  if (questionnaire.status === "draft") return jsonResponse(404, { error: "This questionnaire isn't available yet." });
  if (questionnaire.status === "closed") return jsonResponse(410, { error: "This questionnaire link is no longer active. Please contact us." });
  if (questionnaire.status === "submitted") return jsonResponse(409, { error: "A response has already been submitted for this questionnaire. Thank you!" });

  const latestVersion = await db
    .prepare(`SELECT id, title, description FROM questionnaire_versions WHERE questionnaire_id = ? ORDER BY version_number DESC LIMIT 1`)
    .bind(questionnaire.id)
    .first<{ id: string; title: string; description: string | null }>();
  if (!latestVersion) return jsonResponse(404, { error: "This questionnaire isn't available yet." });

  const questions = await db
    .prepare(
      `SELECT id, section_heading, section_description, prompt, help_text, field_type, is_required, options_json, sort_order
       FROM questionnaire_questions WHERE version_id = ? ORDER BY sort_order ASC`
    )
    .bind(latestVersion.id)
    .all<QuestionRow>();

  return jsonResponse(200, {
    title: latestVersion.title,
    description: latestVersion.description,
    versionId: latestVersion.id,
    questions: questions.results.map((q) => ({
      id: q.id,
      sectionHeading: q.section_heading,
      sectionDescription: q.section_description,
      prompt: q.prompt,
      helpText: q.help_text,
      fieldType: q.field_type,
      isRequired: !!q.is_required,
      options: q.options_json ? (JSON.parse(q.options_json) as string[]) : [],
    })),
  });
};
