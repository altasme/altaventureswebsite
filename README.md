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
- No backend, no database, no auth, no forms. All CTAs open a
  Messenger/Viber/WhatsApp channel picker

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

To regenerate fallback placeholder assets for a future project, run
`node scripts/gen-placeholders.mjs` (requires `npm i -D sharp` first).

## Deployment

Cloudflare Pages: connect this repo, build command `npm run build`, output
directory `dist`. No runtime environment variables required.
