// Cloudflare Pages Function: POST /api/public/questionnaire/:slug/upload?t=TOKEN
//
// Uploads one file for a "file" field-type answer, ahead of the final
// submit (the questionnaire form calls this per file as the client
// attaches it, then sends the resulting URL along with the rest of the
// answers on submit). Separate from submit.ts so a large file upload
// doesn't have to succeed atomically with the whole form payload, and so
// the form can show per-file upload progress/errors independently.
//
// Token-gated the same way as the GET endpoint; also re-checks the
// questionnaire is still open (published, not yet submitted/closed) so
// a file can't be uploaded against a questionnaire that's no longer
// accepting one.

import { jsonResponse, tokensMatch, uploadToCloudinary, type PublicDocsEnv } from "../../../../_lib/publicDocs";

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB

export const onRequestPost: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const questionnaire = await db.prepare(`SELECT id, status, access_token FROM questionnaires WHERE slug = ?`).bind(slug).first<{ id: string; status: string; access_token: string }>();
  if (!questionnaire || !token || !tokensMatch(token, questionnaire.access_token)) return jsonResponse(404, { error: "This questionnaire link isn't valid." });
  if (questionnaire.status !== "published") return jsonResponse(409, { error: "This questionnaire isn't currently accepting uploads." });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResponse(400, { error: "Invalid upload." });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return jsonResponse(400, { error: "No file provided." });
  if (file.size === 0) return jsonResponse(400, { error: "That file is empty." });
  if (file.size > MAX_FILE_BYTES) return jsonResponse(400, { error: "That file is too large (15MB max)." });

  try {
    const bytes = await file.arrayBuffer();
    const url = await uploadToCloudinary(env, bytes, file.type || "application/octet-stream", slug);
    return jsonResponse(200, { url, fileName: file.name });
  } catch (err) {
    console.error("questionnaire upload failed", err);
    return jsonResponse(502, { error: "Couldn't upload that file right now. Please try again." });
  }
};
