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
