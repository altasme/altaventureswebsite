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
  full_name TEXT NOT NULL,           -- foryourbusiness: the questionnaire's "Contact Person"
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  facebook TEXT,
  instagram TEXT,
  existing_website TEXT,
  business_category TEXT,            -- foryourbusiness questionnaire only, null for b2b
  business_description TEXT,         -- foryourbusiness questionnaire only, null for b2b
  upgrade_type TEXT NOT NULL DEFAULT 'none', -- foryourbusiness: 'none' | 'domain_hosting' | 'business_tools'
  upgrade_price INTEGER NOT NULL DEFAULT 0,  -- whole pesos, server-computed from upgrade_type
  amount INTEGER NOT NULL,           -- total whole pesos actually charged (Starter + upgrade_price, or b2b's deposit)
  webhook_payload TEXT,              -- raw JSON from the confirmed ganap.net webhook
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Migration [2026-10-04]: run this against an already-deployed database
-- (the CREATE TABLE above only applies to a fresh install). D1/SQLite
-- supports adding columns with a default without rebuilding the table.
-- Run once:
--   npx wrangler d1 execute <database-name> --remote --command "ALTER TABLE orders ADD COLUMN business_category TEXT;"
--   npx wrangler d1 execute <database-name> --remote --command "ALTER TABLE orders ADD COLUMN business_description TEXT;"
--   npx wrangler d1 execute <database-name> --remote --command "ALTER TABLE orders ADD COLUMN upgrade_type TEXT NOT NULL DEFAULT 'none';"
--   npx wrangler d1 execute <database-name> --remote --command "ALTER TABLE orders ADD COLUMN upgrade_price INTEGER NOT NULL DEFAULT 0;"
-- Existing rows get 'none'/0 for the two new NOT NULL columns, which is
-- correct: every order placed before this migration was the Starter
-- package with no upgrade concept to retroactively assign.

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
