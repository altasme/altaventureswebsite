// Cloudflare Pages Function: GET /api/public/proposal/:slug?t=TOKEN
//
// Public, unauthenticated -- reached by a client opening the proposal
// link ClientKeeper generated. The slug alone is NOT authentication (a
// client-name slug is predictable); the `t` query param access token is
// the real gate, checked against the stored row before anything is
// returned. Never exposes client_id, created_by, or any other internal
// bookkeeping field -- only what the public proposal page needs to
// render and let the client sign.
//
// [2026-10-29] Also returns `contactEmail` (for the optional "email me a
// copy" field's pre-fill), `altaventuresSignedAt` (the real publish date,
// shown as proof this proposal is already signed on our end), and
// `payment` (null when the proposal's staff-configured payment request is
// turned off) -- see CLAUDE.md §67.

import { jsonResponse, tokensMatch, type PublicDocsEnv } from "../../../_lib/publicDocs";

interface ProposalRow {
  id: string;
  title: string;
  content_html: string;
  status: string;
  access_token: string;
  questionnaire_id: string | null;
  client_id: string | null;
  lead_id: string | null;
  prospect_email: string | null;
  payment_enabled: number;
  payment_amount_label: string;
  payment_gcash_number: string;
  payment_gcash_account_name: string;
  payment_bank_note: string;
  payment_marked_paid_at: string | null;
}

export const onRequestGet: PagesFunction<PublicDocsEnv, "slug"> = async ({ env, params, request }) => {
  if (!env.DB) return jsonResponse(500, { error: "Not configured" });
  const db = env.DB;
  const slug = Array.isArray(params.slug) ? params.slug[0]! : params.slug;
  const token = new URL(request.url).searchParams.get("t") ?? "";

  const proposal = await db
    .prepare(
      `SELECT id, title, content_html, status, access_token, questionnaire_id, client_id, lead_id, prospect_email, payment_enabled, payment_amount_label, payment_gcash_number, payment_gcash_account_name, payment_bank_note, payment_marked_paid_at
       FROM proposals WHERE slug = ?`
    )
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
    .prepare(`SELECT title, content_html, created_at FROM proposal_versions WHERE proposal_id = ? ORDER BY version_number DESC LIMIT 1`)
    .bind(proposal.id)
    .first<{ title: string; content_html: string; created_at: string }>();

  if (!latestVersion) return jsonResponse(404, { error: "This proposal isn't available yet." });

  let signature: { signerName: string; signedAt: string } | null = null;
  if (proposal.status === "signed") {
    const sig = await db
      .prepare(`SELECT signer_name, signed_at FROM proposal_signatures WHERE proposal_id = ? ORDER BY signed_at DESC LIMIT 1`)
      .bind(proposal.id)
      .first<{ signer_name: string; signed_at: string }>();
    if (sig) signature = { signerName: sig.signer_name, signedAt: sig.signed_at };
  }

  // The "pre-fill, but let the signer override it" email for the
  // optional "email me a copy" checkbox (CLAUDE.md §67) -- whatever
  // email is already on file for this proposal's parent, checked in the
  // same client/lead/prospect priority order the rest of this feature
  // already uses. Best-effort: a lookup failure here never blocks the
  // proposal itself from rendering, it just leaves the field blank for
  // the signer to type in themselves.
  let contactEmail: string | null = proposal.prospect_email;
  try {
    if (proposal.client_id) {
      const client = await db.prepare(`SELECT email FROM clients WHERE id = ?`).bind(proposal.client_id).first<{ email: string }>();
      if (client?.email) contactEmail = client.email;
    } else if (proposal.lead_id) {
      const lead = await db.prepare(`SELECT email FROM leads WHERE id = ?`).bind(proposal.lead_id).first<{ email: string | null }>();
      if (lead?.email) contactEmail = lead.email;
    }
  } catch {
    /* non-fatal -- contactEmail just stays whatever it already was */
  }

  return jsonResponse(200, {
    title: latestVersion.title,
    contentHtml: latestVersion.content_html,
    status: proposal.status,
    hasQuestionnaire: !!proposal.questionnaire_id,
    contactEmail,
    // "Already signed on our end" (CLAUDE.md §67): the real date this
    // version was published, since only staff can publish -- not a
    // fabricated signature event, an accurate one.
    altaventuresSignedAt: latestVersion.created_at,
    payment: proposal.payment_enabled
      ? {
          amountLabel: proposal.payment_amount_label,
          gcashNumber: proposal.payment_gcash_number,
          gcashAccountName: proposal.payment_gcash_account_name,
          bankNote: proposal.payment_bank_note,
          markedPaidAt: proposal.payment_marked_paid_at,
        }
      : null,
    signature,
  });
};
