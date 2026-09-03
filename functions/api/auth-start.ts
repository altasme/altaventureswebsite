// Cloudflare Pages Function: GET /api/auth-start
//
// Entry point for the post-payment "Create Your Account" flow. Redirects
// the browser to WorkOS AuthKit's hosted login page (email/password, magic
// link, or whatever methods are enabled in the WorkOS dashboard). WorkOS
// then redirects back to REDIRECT_URI with a `code` query param, which
// functions/api/auth-callback.ts exchanges for the authenticated user.
//
// client_id is not a secret (it's meant to be public, the same way a
// Stripe publishable key is), but it's still read from an env var here so
// there's one source of truth and nothing needs to be duplicated into the
// frontend bundle.
//
// Required env var: WORKOS_CLIENT_ID (from the WorkOS dashboard). The exact
// REDIRECT_URI below must also be added on WorkOS's Redirects settings
// page, or WorkOS will reject the request.

interface Env {
  WORKOS_CLIENT_ID: string;
}

const REDIRECT_URI = "https://altasme.com/api/auth-callback";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.WORKOS_CLIENT_ID) {
    return new Response("Account creation isn't configured yet. Please contact us directly.", { status: 500 });
  }

  const url = new URL("https://api.workos.com/user_management/authorize");
  url.searchParams.set("client_id", env.WORKOS_CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("provider", "authkit");

  return Response.redirect(url.toString(), 302);
};
