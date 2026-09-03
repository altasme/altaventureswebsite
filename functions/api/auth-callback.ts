// Cloudflare Pages Function: GET /api/auth-callback
//
// WorkOS AuthKit redirects here with a `code` query param after the
// customer finishes the hosted login flow started at /api/auth-start. This
// exchanges that code for the authenticated user (server-side only — the
// exchange needs WORKOS_API_KEY, which must never reach the client), then
// upserts a row in the D1 `customers` table (if a DB is bound) and sends
// the browser back to the thank-you page with a state flag it uses to show
// a success or error message.
//
// API shape verified against the WorkOS Node SDK's own source
// (github.com/workos/workos-node) rather than workos.com's docs directly,
// since this sandbox's egress proxy blocks workos.com outright:
//   POST https://api.workos.com/user_management/authenticate
//   body: { grant_type: "authorization_code", client_id, client_secret, code }
//   response: { user: { id, email, first_name, last_name, ... }, access_token, refresh_token, ... }
//
// This does not set up a persistent session/login cookie — there's no
// account dashboard yet to protect, so there's nothing to keep a session
// for. Add that once a real post-payment dashboard exists.
//
// Required env vars: WORKOS_API_KEY, WORKOS_CLIENT_ID. Optional: DB (a
// bound D1 database, see d1/schema.sql) — customer upsert is skipped, not
// an error, if it isn't bound.

interface Env {
  WORKOS_API_KEY: string;
  WORKOS_CLIENT_ID: string;
  DB?: D1Database;
}

interface WorkosUser {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

const THANK_YOU_URL = "https://altasme.com/foryourbusiness/thank-you";

async function upsertCustomer(env: Env, user: WorkosUser): Promise<void> {
  if (!env.DB) return;

  const order = await env.DB.prepare("SELECT id FROM orders WHERE email = ? ORDER BY created_at DESC LIMIT 1")
    .bind(user.email)
    .first<{ id: string }>();

  await env.DB.prepare(
    `INSERT INTO customers (id, email, first_name, last_name, order_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       email = excluded.email,
       first_name = excluded.first_name,
       last_name = excluded.last_name,
       order_id = COALESCE(excluded.order_id, customers.order_id)`
  )
    .bind(user.id, user.email, user.first_name, user.last_name, order?.id ?? null, new Date().toISOString())
    .run();
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const authError = url.searchParams.get("error");

  if (authError || !code || !env.WORKOS_API_KEY || !env.WORKOS_CLIENT_ID) {
    if (authError) console.error("WorkOS returned an error on callback:", authError);
    return Response.redirect(`${THANK_YOU_URL}?error=auth_failed`, 302);
  }

  let authResponse: Response;
  try {
    authResponse = await fetch("https://api.workos.com/user_management/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: env.WORKOS_CLIENT_ID,
        client_secret: env.WORKOS_API_KEY,
        code,
      }),
    });
  } catch (err) {
    console.error("WorkOS authenticate request failed", err);
    return Response.redirect(`${THANK_YOU_URL}?error=auth_failed`, 302);
  }

  if (!authResponse.ok) {
    const text = await authResponse.text().catch(() => "");
    console.error(`WorkOS authenticate failed: ${authResponse.status} ${text}`);
    return Response.redirect(`${THANK_YOU_URL}?error=auth_failed`, 302);
  }

  const data = (await authResponse.json().catch(() => null)) as { user?: WorkosUser } | null;
  if (!data?.user) {
    console.error("WorkOS authenticate response missing user", data);
    return Response.redirect(`${THANK_YOU_URL}?error=auth_failed`, 302);
  }

  try {
    await upsertCustomer(env, data.user);
  } catch (err) {
    // The account was created successfully with WorkOS either way; a D1
    // hiccup here shouldn't block the customer from seeing a success state.
    console.error("Failed to upsert customer in D1", err);
  }

  return Response.redirect(`${THANK_YOU_URL}?welcome=1`, 302);
};
