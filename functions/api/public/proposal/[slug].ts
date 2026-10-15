// Cloudflare Pages Function: GET /api/public/proposal/:slug?t=TOKEN
//
// Public, unauthenticated -- reached by a client opening the proposal
// link ClientKeeper generated. The slug alone is NOT authentication (a
// client-name slug is predictable); the `t` query param access token is
// the real gate, checked against the stored row before anything is
// returned. Never exposes client_id, created_by, or any other internal
// bookkeeping field -- only what the public proposal page needs to
// render and let the client sign.

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../_lib/publicDocs";

interface ProposalRow {
  id: string;
  title: string;
  content_html: string;
  status: string;
  access_token: string;
  questionnaire_id: string | null;
}

export const onRequestGet: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const proposal = await db
    .prepare(`SELECT id, title, content_html, status, access_token, questionnaire_id FROM proposals WHERE slug = ?`)
    .bind(slug)
    .first<ProposalRow>();

  if (!proposal || !token || !tokensMatch(token, proposal.access_token)) {
    return jsonResponse(404, { error: "This proposal link isn't valid." });
  }

  if (["draft"].includes(proposal.status)) {
    return jsonResponse(404, { error: "This proposal isn't available yet." });
  }
  if (["revoked", "expired"].includes(proposal.status)) {
    return jsonResponse(410, { error: "This proposal link is no longer active. Please contact us for an updated link." });
  }

  // Always render the latest PUBLISHED version's content, never the
  // live (possibly mid-edit) draft buffer directly -- the draft only
  // becomes visible once the admin publishes it.
  const latestVersion = await db
    .prepare(`SELECT title, content_html FROM proposal_versions WHERE proposal_id = ? ORDER BY version_number DESC LIMIT 1`)
    .bind(proposal.id)
    .first<{ title: string; content_html: string }>();

  if (!latestVersion) return jsonResponse(404, { error: "This proposal isn't available yet." });

  let signature: { signerName: string; signedAt: string } | null = null;
  if (proposal.status === "signed") {
    const sig = await db
      .prepare(`SELECT signer_name, signed_at FROM proposal_signatures WHERE proposal_id = ? ORDER BY signed_at DESC LIMIT 1`)
      .bind(proposal.id)
      .first<{ signer_name: string; signed_at: string }>();
    if (sig) signature = { signerName: sig.signer_name, signedAt: sig.signed_at };
  }

  return jsonResponse(200, {
    title: latestVersion.title,
    contentHtml: latestVersion.content_html,
    status: proposal.status,
    hasQuestionnaire: !!proposal.questionnaire_id,
    signature,
  });
};
