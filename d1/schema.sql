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
  amount INTEGER NOT NULL,           -- whole pesos (299), see functions/api/checkout.ts AMOUNT_PHP
  webhook_payload TEXT,              -- raw JSON from the confirmed ganap.net webhook
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Checkout redesign [2026-10-02]: optional annual upgrade on top of the
-- Starter Website, plus which offer (`foryourbusiness` vs `b2b`) an order
-- belongs to -- previously undistinguished in this table, since both
-- offers shared one `orders` row shape with no offer column at all. SQLite
-- has no `ADD COLUMN IF NOT EXISTS`; this whole file is already a
-- hand-run-once script (see the header above), so these are written to be
-- run once against the existing remote database, same as every other
-- statement here. Skip these three if the columns already exist.
ALTER TABLE orders ADD COLUMN offer TEXT NOT NULL DEFAULT 'foryourbusiness';
ALTER TABLE orders ADD COLUMN upgrade TEXT NOT NULL DEFAULT 'none'; -- 'none' | 'domain_hosting' | 'business_tools'
ALTER TABLE orders ADD COLUMN upgrade_amount INTEGER NOT NULL DEFAULT 0; -- whole pesos, 0/1500/5700

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
