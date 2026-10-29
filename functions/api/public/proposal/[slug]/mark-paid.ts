// Cloudflare Pages Function: POST /api/public/proposal/:slug/mark-paid
//
// The "Done Paying" button on the public payment screen (CLAUDE.md §67).
// There is no payment gateway integration here -- the actual payment is a
// manual GCash/bank transfer the client confirms by sending a screenshot
// directly to Altaventures, same honest "message us, a person verifies
// it" pattern already established elsewhere in this ecosystem (e.g. the
// marketing site's own /foryourbusiness DeveloperHandoffPanel). This
// endpoint records the client's OWN CLAIM that they paid -- never a
// confirmed payment -- and best-effort notifies staff by email so
// someone actually checks. Idempotent: clicking it twice (a page reload,
// a double-tap) doesn't re-notify for the same proposal.

import { jsonResponse, sendResendEmail, tokensMatch, type PublicDocsEnv } from "../../../../_lib/publicDocs";

const DEFAULT_NOTIFY_EMAIL = "altasmeworks@gmail.com";

interface ProposalRow {
  id: string;
  title: string;
  status: string;
  access_token: string;
  questionnaire_id: string | null;
  payment_amount_label: string;
  payment_marked_paid_at: string | null;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

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
  const token = typeof (body as Record<string, unknown>).t === "string" ? ((body as Record<string, unknown>).t as string) : "";

  const proposal = await db
    .prepare(`SELECT id, title, status, access_token, questionnaire_id, payment_amount_label, payment_marked_paid_at FROM proposals WHERE slug = ?`)
    .bind(slug)
    .first<ProposalRow>();
  if (!proposal || !token || !tokensMatch(token, proposal.access_token)) return jsonResponse(404, { error: "This proposal link isn't valid." });
  if (proposal.status !== "signed") return jsonResponse(409, { error: "This proposal hasn't been signed yet." });

  if (!proposal.payment_marked_paid_at) {
    const now = new Date().toISOString();
    await db.prepare(`UPDATE proposals SET payment_marked_paid_at = ?, updated_at = ? WHERE id = ?`).bind(now, now, proposal.id).run();

    try {
      await sendResendEmail(
        env,
        DEFAULT_NOTIFY_EMAIL,
        `Client marked a proposal as paid — ${proposal.title}`,
        `<p>A client clicked "Done Paying" on their proposal payment screen. This is their own claim, not a confirmed payment -- verify the actual GCash/bank transfer before treating the project as funded.</p>
         <ul>
           <li><strong>Proposal:</strong> ${escapeHtml(proposal.title)}</li>
           <li><strong>Amount expected:</strong> ${escapeHtml(proposal.payment_amount_label || "(not set)")}</li>
         </ul>`
      );
    } catch (err) {
      // Best-effort -- a missed staff notification must never block the
      // client-facing confirmation they just acted on.
      console.error("mark-paid notification failed", err);
    }
  }

  if (!proposal.questionnaire_id) return jsonResponse(200, { ok: true, nextQuestionnaire: null });

  const questionnaire = await db
    .prepare(`SELECT slug, access_token, status FROM questionnaires WHERE id = ?`)
    .bind(proposal.questionnaire_id)
    .first<{ slug: string; access_token: string; status: string }>();

  if (!questionnaire || !["published", "submitted"].includes(questionnaire.status)) {
    return jsonResponse(200, { ok: true, nextQuestionnaire: null });
  }

  return jsonResponse(200, { ok: true, nextQuestionnaire: { slug: questionnaire.slug, token: questionnaire.access_token } });
};
