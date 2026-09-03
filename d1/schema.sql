-- D1 schema for /foryourbusiness order + account persistence.
--
-- Replaces the Supabase plan in CLAUDEforyourbusiness.md §3 with Cloudflare
-- D1, since the site already runs entirely on Cloudflare Pages Functions.
-- Run this once against the bound D1 database after creating it:
--   npx wrangler d1 execute <database-name> --remote --file=./d1/schema.sql
-- (or paste it into the D1 database's Console tab in the Cloudflare dashboard).
--
-- Bind the database to the Pages project (Settings > Functions > D1 database
-- bindings) with variable name DB — the Functions in this repo read it as
-- env.DB.

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,               -- the idempotencyKey sent to ganap.net
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed'
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  facebook TEXT,
  instagram TEXT,
  existing_website TEXT,
  amount INTEGER NOT NULL,           -- centavos, see functions/api/checkout.ts
  webhook_payload TEXT,              -- raw JSON from the confirmed ganap.net webhook
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- One row per WorkOS AuthKit account created from the post-payment
-- "Create Your Account" flow. Linked to the order that most recently
-- matched the account's email at signup time (best-effort, not a strict
-- foreign key relationship since a customer could sign up with a
-- different email than they paid with).
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,               -- WorkOS user id
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  order_id TEXT REFERENCES orders(id),
  created_at TEXT NOT NULL
);
