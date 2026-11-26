// Shared helpers for the public Proposal/Questionnaire endpoints
// (CLAUDEproposalquestionnaire.md). These are the one place in this repo
// with genuine cross-file shared logic (token verification, Cloudinary
// upload), so a small _lib module was introduced here specifically for
// them -- every other existing function in this repo is self-contained
// by convention, but duplicating this across ~6 new files would be a
// real maintenance risk for logic that gates access to private client
// documents and signatures.
//
// This repo's D1 binding is NEW -- this is the one app in the
// Altaventures ecosystem that previously had zero database access.
// `DB` must be bound in the Cloudflare Pages dashboard to the exact same
// shared database id clienthub/clientkeeper already bind (see
// clienthub/d1/schema.sql's "Proposals & Questionnaires" section for the
// full cross-repo architecture note) before any of this works in
// production.

export interface PublicDocsEnv {
  DB?: D1Database;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  // [2026-10-29] Reused for the proposal payment-step's two emails
  // (email-copy.ts, mark-paid.ts) -- the exact same credentials already
  // required for submit-wsa.ts's email delivery, so no new env var is
  // needed for this feature.
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

export function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

/** Constant-time-ish string compare so token verification isn't a timing oracle. */
export function tokensMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Sends one email via Resend, optionally with a base64 attachment (same
 * shape/credentials as functions/api/submit-wsa.ts's own inline helper,
 * pulled out here since the proposal payment-step's two new endpoints
 * both need it too -- real, now-duplicated-three-ways logic, the same
 * bar this file's own header comment already sets for living in _lib).
 */
export async function sendResendEmail(
  env: PublicDocsEnv,
  to: string,
  subject: string,
  html: string,
  attachment?: { filename: string; base64: string }
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) throw new Error("Email delivery is not configured yet.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      ...(attachment ? { attachments: [{ filename: attachment.filename, content: attachment.base64 }] } : {}),
    }),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Resend failed to send to ${to}: ${response.status} ${text}`);
  }
}

async function signCloudinaryParams(params: Record<string, string>, apiSecret: string): Promise<string> {
  const toSign =
    Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&") + apiSecret;
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(toSign));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Uploads a questionnaire file-answer upload to Cloudinary via a signed
 * server-side upload (same pattern as functions/api/submit-wsa.ts's
 * archival upload, reused here since it's the exact credentials/approach
 * this repo already has for a different purpose). Returns the secure
 * delivery URL to store in questionnaire_answers.file_url.
 */
export async function uploadToCloudinary(
  env: PublicDocsEnv,
  fileBytes: ArrayBuffer,
  contentType: string,
  publicIdHint: string
): Promise<string> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("File uploads are not configured yet.");
  }
  // Chunked rather than a single String.fromCharCode(...bytes) spread --
  // that blows the call stack on anything beyond a few MB (same fix
  // already applied to src/lib/wsaPdf.ts's bytesToBase64 for the same
  // reason).
  const bytes = new Uint8Array(fileBytes);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const base64 = btoa(binary);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const publicId = `questionnaire-uploads/${publicIdHint}-${timestamp}`;
  const signature = await signCloudinaryParams({ public_id: publicId, timestamp }, env.CLOUDINARY_API_SECRET);

  const form = new FormData();
  form.set("file", `data:${contentType};base64,${base64}`);
  form.set("api_key", env.CLOUDINARY_API_KEY);
  form.set("timestamp", timestamp);
  form.set("public_id", publicId);
  form.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: "POST", body: form });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Cloudinary upload failed: ${response.status} ${text}`);
  }
  const data = (await response.json()) as { secure_url: string };
  return data.secure_url;
}

// ---------------------------------------------------------------------------
// Mailbox request links (CLAUDE.md §74): the email-services rules the
// public /mailbox-request routes need, DUPLICATED from ClientKeeper's
// canonical copies in clientkeeper/functions/_lib/emailServices/
// (policy.ts, engine.ts, validation.ts). The two apps are separate
// deployables with no shared module, so this follows the same "kept in
// sync by hand" convention as the .proposal-content CSS block in
// src/index.css. If the canonical rules change there, change them here
// too: these decide who gets a paid mailbox slot.

// policy.ts PROVISIONABLE_SERVICE_STATUSES: the only service states in
// which a new mailbox may be requested.
export const MAILBOX_PROVISIONABLE_STATUSES = ["pending_setup", "active", "provisioning_error"];
export const MAILBOX_PROVISIONABLE_SQL_LIST = MAILBOX_PROVISIONABLE_STATUSES.map((s) => `'${s}'`).join(", ");

// policy.ts COUNTED_MAILBOX_SQL: a mailbox row (alias `m`) that counts
// against the allowance. One `?` (now). A 'reserved' row with no lease is
// a client request awaiting staff, and holds its slot indefinitely.
export const COUNTED_MAILBOX_SQL = `(m.status IN ('provisioning', 'active', 'needs_review', 'deleting') OR (m.status = 'reserved' AND (m.reserved_until IS NULL OR m.reserved_until > ?)))`;

// engine.ts TOTAL_ALLOWANCE_SQL / COUNTED_SQL (alias s). COUNTED_SQL has
// one `?` (now).
export const MAILBOX_TOTAL_ALLOWANCE_SQL = `(s.included_mailboxes + COALESCE((SELECT SUM(e.quantity) FROM email_service_entitlements e WHERE e.service_id = s.id), 0))`;
export const MAILBOX_COUNTED_SQL = `(SELECT COUNT(*) FROM email_mailboxes m WHERE m.service_id = s.id AND ${COUNTED_MAILBOX_SQL})`;

// validation.ts normalizeLocalPart: lowercase dot-atom subset (letters,
// digits, . _ - +), no leading/trailing/double dots, max 64 chars.
export function normalizeLocalPart(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const l = raw.trim().toLowerCase();
  if (l.length < 1 || l.length > 64) return null;
  if (!/^[a-z0-9._+-]+$/.test(l)) return null;
  if (l.startsWith(".") || l.endsWith(".") || l.includes("..")) return null;
  return l;
}

// Every "can't use this link" case (bad token, revoked, used, unknown
// slug) answers with this one 404, so a stranger can't tell them apart.
export const MAILBOX_LINK_INVALID = "This link isn't valid or has already been used. Please ask us for a new one.";
