// Shared helpers for the public Proposal/Questionnaire endpoints
// (CLAUDEproposalquestionnaire.md). Token verification is the one place
// in this repo with genuine cross-file shared logic for these routes, so
// a small _lib module was introduced here specifically for them -- every
// other existing function in this repo is self-contained by convention.
//
// This repo's D1 binding is NEW -- this is the one app in the
// Altaventures ecosystem that previously had zero database access.
// `DB` must be bound in the Cloudflare Pages dashboard to the exact same
// shared database id clienthub/clientkeeper already bind (see
// clienthub/d1/schema.sql's "Proposals & Questionnaires" section for the
// full cross-repo architecture note) before any of this works in
// production.
//
// [2026-10-15] A Cloudinary file-upload helper used to live here too, for
// the questionnaire builder's "file" question field type -- removed along
// with that whole field type when questionnaires were redesigned to a
// single rich-text content block + one open-ended client reply (the
// operator's direct request, "can the questionnaire be the same as the
// proposal? Free text field for ease for us"). No file uploads happen
// anywhere in this feature anymore.

export interface PublicDocsEnv {
  DB?: D1Database;
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
