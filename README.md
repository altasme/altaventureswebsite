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

## Known placeholders (pending real assets from the client)

- `TODO(about)`: About section copy (`src/content/site.ts` -> `ABOUT`)
- `TODO(asset)`: real logo, hero visual, and project screenshots
  (`public/images/brand/`, `public/images/projects/`); regenerate placeholders
  with `node scripts/gen-placeholders.mjs` (requires `npm i -D sharp` first)
- `TODO(legal)`: Privacy Policy / Terms of Service boilerplate
  (`src/content/site.ts` -> `LEGAL`)
- `TODO(analytics)`: GA4 / Meta Pixel `MEASUREMENT_ID`
  (`src/lib/analytics.ts`)
- `TODO(domain)`: canonical/OG URLs in `index.html` use a placeholder domain

## Deployment

Cloudflare Pages: connect this repo, build command `npm run build`, output
directory `dist`. No runtime environment variables required.
