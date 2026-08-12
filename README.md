# Altaventures: Marketing Website

Single-page, conversion-focused lead-generation site for Altaventures Business
Development Services. Static React + Vite + TypeScript + Tailwind build,
deployed to Cloudflare Pages with no backend.

Build spec: see `CLAUDE.md` in the repo root for the full specification this
site was built against (locked decisions, section-by-section copy source,
guardrails, definition of done).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS
- No backend, no database, no auth, no forms on the marketing site. All CTAs
  open a Messenger/Viber/WhatsApp channel picker
- One exception: `/WSA-free`, a standalone Free Website Service Agreement
  e-signature page (unlinked from the marketing site), backed by a single
  Cloudflare Pages Function for email delivery. See `CLAUDE.md` §17.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build locally
npm run lint      # oxlint
```

## Content

All copy, project case studies, FAQ, industries, and contact configuration
live in `src/content/site.ts`, the single source of truth. No component
hard-codes copy.

## Known placeholders

Resolved: About copy, logo, favicon, OG image, hero photography, all four
project screenshots, and Privacy Policy / Terms of Service are real content.
Domain is live at altasme.com.

Still pending:

- `TODO(analytics)`: GA4 / Meta Pixel `MEASUREMENT_ID`
  (`src/lib/analytics.ts`)
- `/WSA-free` email delivery needs `RESEND_API_KEY` and `RESEND_FROM_EMAIL`
  set in Cloudflare Pages before it will actually send anything (see
  Deployment below). The page, PDF fill, and download work without them;
  only the Submit → email step needs them.

To regenerate fallback placeholder assets for a future project, run
`node scripts/gen-placeholders.mjs` (requires `npm i -D sharp` first).

## Deployment

Cloudflare Pages: connect this repo, build command `npm run build`, output
directory `dist`. No runtime environment variables required for the marketing
site itself.

### `/WSA-free` environment variables

Set these in the Cloudflare Pages dashboard (Settings → Environment variables)
for `functions/api/submit-wsa.ts` to work. Never commit them.

Required:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — must be on a domain verified in Resend. Resend's
  sandbox sender can only deliver to the account's own email, not to
  arbitrary client addresses, so this needs a verified sending domain
  (e.g. `Altaventures <agreements@altasme.com>`).

Optional:

- `WSA_NOTIFY_EMAIL` — internal notification recipient, defaults to
  `altasmeworks@gmail.com`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — if
  all three are set, the signed PDF is also archived to Cloudinary. If any
  are missing, archiving is skipped entirely; it never blocks email delivery.
