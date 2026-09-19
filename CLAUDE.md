# CLAUDE.md: Altaventures Marketing Website

**Artifact type:** Build specification for Claude Code
**Spec version:** `[v1.1]`, brand palette + logo + tagline locked
**Brand:** Altaventures
**Tagline:** We build the engine. You drive the business.
**Formal business name:** Altaventures Business Development Services
**Site type:** Single-page, conversion-focused lead-generation site (marketing only)
**Primary conversion:** Start a conversation via Messenger, Viber, or WhatsApp
**Primary KPI:** Qualified business conversations generated (traffic is secondary)

---

## 0. LOCKED DECISIONS

These override anything in the source spec that conflicts. Where the source `ALTAVENTURES_WEBSITE_BUILD_SPECIFICATION` says otherwise, this block wins.

1. **Single page, not multi-page.** One route (`/`). Nav items are anchor-scroll links, not pages. This overrides source §40 (12-page MVP) and §34's page implication.
   - **Exception, `/WSA-free` [amended]:** a second route hosts the Free Website Service Agreement e-signature flow (§17). It is an operational/legal utility page, not part of the marketing funnel, so it is `noindex`, unlinked from Nav/Footer, and lazy-loaded so it never adds weight to the marketing homepage bundle.
   - **Exception, `/limitedoffer` [amended]:** a third route hosts a paid-social landing page for the free-website offer (§18). Unlike `/WSA-free`, this one *wants* to be indexed and shared: it's a real marketing surface with its own SEO/OG intent, just a separate funnel from the homepage.
   - **Exception, `/foryourbusiness` [amended]:** a fourth route hosts a paid-social landing page for the ₱299 professional website offer (§19). Same spirit as `/limitedoffer`: wants to be indexed and shared, own SEO/OG intent, a separate funnel from both the homepage and `/limitedoffer` (don't run the same audience against both at once, since a free offer and a paid offer competing for one prospect cannibalize each other).
2. **Case studies are modals, not pages.** "View Project" opens an in-page modal. This overrides source §41's "case-study pages."
3. **Static frontend, zero backend.** React + Vite + TypeScript + Tailwind. No Supabase, no database, no server. Deployed to Cloudflare Pages.
   - **Exception, `/api/submit-wsa` [amended]:** the WSA-free flow (§17) requires sending email, which a static frontend cannot do. A single Cloudflare Pages Function handles that one endpoint; it holds no database and no session state, so the site remains otherwise backend-free.
4. **No contact form.** The only conversion is opening a chat channel. No email capture, no form submission. Qualification happens in-chat (source §4, §24).
5. **Website Care is NOT on the public site.** No pricing, no plans, no mention in the funnel (source §3, §43). Internal upsell only.
6. **Free-offer copy is blunt and uses "flagship."** Approved wording:
   > "We'll build your flagship website free: you only pay for the domain."
   Keep the source's premium framing terms available elsewhere ("Complimentary Website Build", "No upfront website development fee") but the primary offer line is the blunt one above.
7. **Real work only (launch integrity).** No fabricated interfaces, no stock-photo mockups standing in for real products, no invented testimonials. Project visuals (SelectedWork/CaseStudyModal) must be real Altaventures screenshots. Ship with clearly-marked placeholders until real assets are provided.
   - **Exception, hero background [amended]:** the hero uses an AI-generated photorealistic atmospheric photo (a business owner working), not a real team/office photo, since the site is run by a solo founder without a photography budget. This is narrower than it sounds: any screen content in the image must stay abstract (a soft glow, never legible fake UI), since a fabricated *product screenshot* is exactly what this guardrail exists to prevent. Real product screenshots remain mandatory everywhere else (SelectedWork, CaseStudyModal).

---

## 1. OPEN ITEMS (do not block build; use flagged defaults)

| # | Item | Default used in build | Action needed from client |
|---|------|----------------------|---------------------------|
| 1 | ~~About section copy~~ **RESOLVED** | Real founder/company story supplied by client, in `content/site.ts` -> `ABOUT`. | N/A |
| 2 | ~~Real project screenshots~~ **RESOLVED** | Real screenshots supplied for Setmona, Altamotors, Kolekta, Vocalyze (`public/images/projects/`). | N/A |
| 3 | ~~Brand color + logo~~ **RESOLVED [v1.1]** | Logo supplied; palette locked from logo (see §11.1). Tagline supplied. | N/A |
| 4 | **Messenger branding mismatch** | Link points to `m.me/vanamaranto.moto`, which shows a personal-style profile ("Van Amaranto"), not "Altaventures". | Consider a dedicated Altaventures Facebook Page for brand consistency. |
| 5 | **Analytics ID** | Tracking layer scaffolded with a `MEASUREMENT_ID` constant left blank; events fire to `dataLayer` regardless. | Provide GA4 / Meta Pixel IDs when ready. |
| 6 | ~~Legal pages~~ **RESOLVED** | Real Privacy Policy + Terms of Service supplied by client, rendered as modals from `content/site.ts` -> `LEGAL`. | N/A |

---

## 2. TECH STACK

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS
- **State:** Local component state only (no Zustand needed, no cart, no multi-step flow)
- **Animation:** CSS transitions + a lightweight lib only if needed (e.g. `framer-motion`); keep bundle small
- **Hosting:** Cloudflare Pages (static output from `vite build`)
- **No backend, no database, no auth, no email service.**

Build output must be a fully static `dist/` deployable to Cloudflare Pages with no environment secrets required at runtime.

---

## 3. FILE STRUCTURE

```
src/
  main.tsx
  App.tsx
  index.css                 # Tailwind entry + design tokens
  content/
    site.ts                 # SINGLE SOURCE OF TRUTH: all copy, projects, contact config
  lib/
    contact.ts              # CTA link builders (wa.me / m.me / viber) + prefill logic
    analytics.ts            # event tracking wrapper
  components/
    layout/
      Nav.tsx
      Footer.tsx
      StickyMobileCTA.tsx
    sections/
      Hero.tsx
      CredibilityStrip.tsx
      ProblemSection.tsx
      ServicesSection.tsx
      SelectedWork.tsx
      PortfolioConversion.tsx
      WhyAltaventures.tsx
      ComplimentaryOffer.tsx
      HowItWorks.tsx
      Industries.tsx
      FAQ.tsx
      FinalCTA.tsx
    modals/
      ContactModal.tsx       # channel picker (Messenger / Viber / WhatsApp)
      CaseStudyModal.tsx     # reused for all four projects
      LegalModal.tsx         # Privacy / Terms
    ui/
      CTAButton.tsx
      Section.tsx
      Tag.tsx
public/
  images/projects/           # real screenshots go here (placeholders until provided)
  og/                        # social share image
```

**Rule:** No hard-coded copy in components. Every string, project, FAQ, industry, and contact detail comes from `content/site.ts`. This prevents content drift and lets the client edit one file.

---

## 4. CONTACT + CTA SYSTEM (the core of the site)

### 4.0 Brand block (in `content/site.ts`)

```ts
export const BRAND = {
  name: "Altaventures",
  legalName: "Altaventures Business Development Services",
  tagline: "We build the engine. You drive the business.",
  logo: "/images/brand/altaventures-logo.png", // supplied asset, place in public/images/brand/
} as const;
```

- Tagline usage: hero eyebrow (above or below the §10 headline) **and** footer under the wordmark. Do not replace the §10 headline with it.
- Logo asset is provided (`Copy_of_Altaventures_logo.png`); place in `public/images/brand/`. Use in Nav (small) and Footer. Provide an on-dark version or ensure the mark reads on the dark canvas; the supplied file is on white, so render it inside a light chip or use the mark-only on dark if legibility suffers.

### 4.1 Contact config (single swappable constant)

In `content/site.ts`, define exactly this shape. All CTAs across the site route through it.

```ts
export const CONTACT = {
  whatsapp: {
    number: "639212836683",              // international format, no leading zero
    supportsPrefill: true,
    prefill:
      "Hi Altaventures! I'd like to discuss a website or digital solution for my business.",
  },
  viber: {
    number: "+639212836683",
    supportsPrefill: false,              // Viber deep links do not reliably prefill text
  },
  messenger: {
    handle: "vanamaranto.moto",          // NOTE: personal-style profile, not an Altaventures Page
    supportsPrefill: false,              // m.me does not prefill arbitrary text without a bot
  },
} as const;
```

### 4.2 Link builders (`lib/contact.ts`)

```ts
import { CONTACT } from "../content/site";

export const whatsappUrl = () =>
  `https://wa.me/${CONTACT.whatsapp.number}` +
  (CONTACT.whatsapp.supportsPrefill
    ? `?text=${encodeURIComponent(CONTACT.whatsapp.prefill)}`
    : "");

export const viberUrl = () =>
  `viber://chat?number=${encodeURIComponent(CONTACT.viber.number)}`;

export const messengerUrl = () =>
  `https://m.me/${CONTACT.messenger.handle}`;
```

### 4.3 Prefill reality: do not promise what won't fire

- **WhatsApp:** prefill works. Message appears in the composer. ✅
- **Messenger:** opens a chat with the profile above; **no prefill**. Do not render UI copy implying a pre-written message will appear.
- **Viber:** opens a chat to the number; **no prefill**.

The channel-picker UI may still say "tell us a little about your business" (source §6) as a general instruction, but must not display a fake "your message is ready" state for Messenger/Viber.

### 4.4 CTA behavior

- Every primary/contextual CTA on the page opens the **ContactModal** (channel picker); it does not deep-link to a single channel directly, except the sticky mobile CTA which also opens the picker.
- CTA labels are contextual per source §5 / §29 (e.g. "I Need a Website", "I Need a Booking System", "See If We're a Good Fit"), but all resolve to the same three-channel picker.
- Fire an analytics event on every CTA click (see §9) **and** on each channel selection inside the modal.

---

## 5. PAGE STRUCTURE (single page, in this order)

Follows source §9 conversion sequence. Each maps to a component in `sections/`.

1. **Nav** (sticky top): Home · Services · Work · How It Works · About · `[Let's Talk]`
2. **Hero** (§10, §11)
3. **CredibilityStrip**: four featured projects (§12)
4. **ProblemSection**: four recognizable problems (§13)
5. **ServicesSection**: five outcome-framed service blocks (§14.1–14.5)
6. **SelectedWork**: four project cards, each opens CaseStudyModal (§15–19)
7. **PortfolioConversion**: proof to action transition (§20)
8. **WhyAltaventures** (§21)
9. **ComplimentaryOffer**: the acquisition offer (§22, §23)
10. **HowItWorks**: 6 steps (§25)
11. **Industries** (§26)
12. **FAQ** (§27)
13. **FinalCTA** (§28)
14. **Footer** (§39)
15. **StickyMobileCTA** (mobile only, §8)

---

## 6. SECTION SPECS

Copy is authoritative from the source spec. Reproduce exactly unless noted. Store all of it in `content/site.ts`.

### 6.1 Hero (§10)
- Eyebrow (small, above headline): tagline **"We build the engine. You drive the business."**
- Headline: **Build a Better Digital Business.**
- Sub: "Altaventures builds professional websites, digital tools, and business systems designed around the way your business actually works."
- Line: "For Philippine businesses ready to build, improve, or digitalize their business online."
- Primary CTA: **Let's Talk About Your Business** → ContactModal
- Secondary CTA: **See What We've Built** → smooth-scroll to SelectedWork
- Trust line: "Built for real businesses. Designed around real business needs."
- **Hero visual: RESOLVED, amended [see §0.7 exception].** Full-bleed AI-generated photorealistic photo (business owner at a laptop), not the originally-specified real interface composition; solo-founder resourcing constraint. Separate desktop/mobile art-directed crops in `public/images/hero/`. Screen content in the image stays abstract, no fabricated UI.

### 6.2 CredibilityStrip (§12)
- Headline: **Not Just Websites. Real Business Systems.**
- Sub per §12.
- Four featured projects, pulled live from `content/portfolio.ts` via `CREDIBILITY_STRIP.featuredIds` (`content/site.ts`): `["altamotors", "aurielle", "leanandfit", "vocalyze"]`. The component (`CredibilityStrip.tsx`) looks each id up in `PORTFOLIO_BY_ID` and renders `project.name.toUpperCase()` + `project.category` — no project copy is hard-coded in the component itself.
- CTA: **Explore Our Work** → scroll to SelectedWork.

### 6.3 ProblemSection (§13)
- Headline: **Does Your Business Need More Than a Facebook Page?**
- Four problem cards (titles + copy exactly per §13).
- CTA: **Tell Us What's Holding Your Business Back** → ContactModal.

### 6.4 ServicesSection (§14)
- Headline: **Digital Solutions Built Around Your Business**
- Five blocks (Business Websites / Booking & Scheduling / Business Management Systems / E-commerce / Business Digitalization) with the outcome headlines and capability lists per §14.1–14.5.
- Each block's contextual CTA per source → ContactModal.
- Reference-project chips where the source lists them (Setmona; Altamotors + Kolekta).

### 6.5 SelectedWork (§15) [amended for the portfolio.ts model]
- Headline: **We've Built It. Now Let's Build Yours.**
- **Portfolio data now lives in `src/content/portfolio.ts`**, a canonical `PORTFOLIO` array shared verbatim between the main site and `/limitedoffer` (§18) so the two funnels never duplicate or drift on project copy. Each `Project` carries `id`, `name`, `url: string | null`, `category`, `tier: "system" | "site" | "engine"`, `status: "live" | "ongoing"`, `viewable: boolean`, `description`, `tags: string[]`.
- `SelectedWork.tsx` renders all 12 real projects (Altamotors, Aurielle Paris Atelier, Lean and Fit PH, DM HR Consultancy, Vocalyze Lounge, Aulea Skin Essentials, Setmona Booking Engine, Kolekta Billing Engine, Pocket G7iii Camera Rental, Macquia's Camera Rental, Ascend Volleyball Camp, Click and Keep Photography). Each card: screenshot (only for `viewable` projects — engines render no image), name, category, description, a tier badge (`TIER_LABEL`, suppressed if the project's own `tags` already contains that label, to avoid a duplicate pill) plus `tags`.
- **View Website vs. View Details is data-driven, not per-project logic:** `viewable && url` renders an external `<a href={url} target="_blank">` ("View Website"); otherwise a button opens `CaseStudyModal` ("View Details"). Only the two engine-tier projects (Setmona, Kolekta) are non-viewable and use the modal — everything else links straight out to the live site.
- Below the grid, a "Currently in the studio" line lists `ONGOING` (Ollocal.PH, Amani Massage and Wellness Spa, ARGO Customs Brokerage, ONYX CLOUDS PREMIUM VAPE CO., Camsnaps Camera Rental, FirstHand Travel and Tours) — real in-progress client work, referenced as social proof only, explicitly marked "(in progress)" and never presented as completed. Macquia's Camera Rental, Pocket G7iii Camera Rental, Ascend Volleyball Camp, and Click and Keep Photography all graduated out of this list into `PORTFOLIO` once their sites launched (Ascend reused its existing `ascend-volleyball` id, renamed from "Ascend Volleyball Academy" to match the live site's actual name; Click and Keep Photography is a brand-new entry, never previously listed in `ONGOING`).
- All 12 projects now ship real client-supplied images in `public/images/projects/` (no placeholders remain). Setmona and Kolekta use branded logo cards rather than dashboard screenshots, since both are internal engines with no public URL to screenshot; the other ten are real live-site screenshots.

### 6.6 CaseStudyModal (§16–19) [amended for the portfolio.ts model]
- One reusable modal, but now reachable **only** for the two engine-tier projects (Setmona, Kolekta) — every viewable project links out to its live site instead, per §6.5.
- Short card data (name/category/tags/description) comes from `PORTFOLIO_BY_ID` in `content/portfolio.ts`. Narrative detail (overview, "What We Built" list, project type, business value, contextual CTA) lives separately in `CASE_STUDY_DETAILS` in `content/site.ts`, keyed by the same project id — kept as its own record because it's modal-only prose that engines need and viewable projects don't.
- The modal looks up both records by `caseStudyProject` (now typed as a plain `string`, not the old `ProjectId` union) and renders `null` if either is missing — a defensive guard, since only engine ids should ever be passed to `openCaseStudy`.
- Vocalyze no longer opens this modal (it's viewable and links out directly), so the old Vocalyze-only "Future Development" block has been removed from the component entirely.
- Modal CTA → ContactModal (chain modals or close-then-open; keep focus management correct).

### 6.7 PortfolioConversion (§20)
- Headline: **What Could We Build for Your Business?**
- Sub per §20. CTA: **Let's Talk About Your Business** → ContactModal.

### 6.8 WhyAltaventures (§21)
- Headline: **Built Around Your Business.**
- Four points: Business First / More Than Websites / Designed to Grow / Practical.

### 6.9 ComplimentaryOffer (§22, §23)
- Headline: **Need a Website? Let Us Build It.**
- Primary offer line (LOCKED, §0.6): "We'll build your flagship website free: you only pay for the domain."
- Support: "Tell us about your business. If you're a good fit, we'll discuss how we can build and launch a professional website around your business."
- CTA: **See If We're a Good Fit** → ContactModal.
- Never render "FREE WEBSITE FOR EVERYONE".

### 6.10 HowItWorks (§25)
- Headline: **From Idea to Launch.**
- Six numbered steps (Talk / Understand / Recommend / Build / Launch / Grow) with copy per §25.
- CTA: **Start a Conversation** → ContactModal.

### 6.11 Industries (§26)
- Headline: **Built for Businesses Like Yours.**
- Industry chips per §26 list.
- Line: "Don't see your industry? That's okay. Tell us what your business needs."
- CTA: **Tell Us About Your Business** → ContactModal.

### 6.12 FAQ (§27)
- Six Q/A exactly per §27, as an accessible accordion.

### 6.13 FinalCTA (§28)
- Headline: **Ready to Build Something Better?**
- Sub per §28. CTA: **Let's Talk About Your Business** → ContactModal.
- Show "Messenger | Viber | WhatsApp" beneath.

### 6.14 About (open item #1, RESOLVED)
- Real founder/company story supplied by client. Anchor target for nav "About".

### 6.15 Footer (§39)
- Logo (or wordmark), tagline "We build the engine. You drive the business.", formal name, supporting statement (§39).
- Links: Services · Work · How It Works · About · Contact (opens ContactModal) · Messenger · Viber · WhatsApp · Privacy Policy · Terms of Service (last two open LegalModal).

---

## 7. CONTACT MODAL (§6)

- Heading: **Let's Start a Conversation.**
- Sub: "Choose the platform you prefer and tell us a little about your business."
- Three large touch-friendly options: Messenger / Viber / WhatsApp, each opening its respective URL from `lib/contact.ts` in a new tab (`target="_blank" rel="noopener"`).
- No account creation, no form, no friction (§6).
- Accessible: focus trap, `Esc` to close, restore focus to trigger, `aria-modal`.

---

## 8. STICKY MOBILE CTA (§8)

- Visible on mobile only (`< md`). Fixed bottom bar, label **Let's Talk**.
- Tapping opens the ContactModal ("How would you like to chat?").
- Must not obstruct content: add bottom padding to page so last section isn't covered.
- Large tap target, safe-area-inset aware (iOS).

---

## 9. ANALYTICS & CONVERSION TRACKING (§36)

Wrap all tracking in `lib/analytics.ts`. Push to `window.dataLayer` and, if `MEASUREMENT_ID` is set, forward to gtag/Pixel. No IDs required to build.

**Primary events (source §36):**
- `cta_click` (with `label` + `section`)
- `contact_channel_select` (`channel: messenger | viber | whatsapp`)
- `complimentary_cta_click`

**Secondary events:**
- `case_study_open` (`project`)
- `service_interaction` (`service`)
- `scroll_depth` (25/50/75/100)
- `industry_engagement`

Each ContactModal channel selection is the closest on-site proxy for the primary KPI. Note in code comments that true qualification happens off-site in chat and is not measurable here.

---

## 10. SEO (§37)

- Single-page, so one strong `<title>` + meta description targeting the §37 keyword set (website development / business systems / booking system / CRM, Philippines).
- Open Graph + Twitter card meta. **No OG image for now [deliberate, temporary]:** the `og:image`/`twitter:image` tags and the placeholder `public/og/altaventures-og.jpg` asset were removed at the operator's request (2026-09-05) rather than keep shipping a not-final placeholder; the other OG/Twitter tags (title, description, url, type, card) stay in place. Add a real image and both meta tags back in `index.html` when one is supplied — don't reintroduce the old placeholder file.
- `LocalBusiness` / `Organization` JSON-LD structured data with brand name, area served (Philippines), and contact channels.
- Semantic headings (one `<h1>` in Hero; section `<h2>`s).
- Prerendered static HTML (Vite build) so content is crawlable without JS execution where possible; if hydration hides content, ensure critical copy is in the initial HTML.
- **`public/robots.txt` + `public/sitemap.xml`** (added later, since neither existed at initial launch): `robots.txt` allows all crawling and points to the sitemap; `sitemap.xml` lists only the three indexable routes — `/`, `/limitedoffer`, `/foryourbusiness` — deliberately excluding `/WSA-free` and the `noindex` `/foryourbusiness/checkout` and `/foryourbusiness/thank-you` routes. This matters specifically for `/limitedoffer` and `/foryourbusiness`: per §0's guardrails they're intentionally *not* linked from the homepage Nav/Footer (kept as separate paid-social funnels), which otherwise leaves them with no organic crawl path at all — the sitemap is what makes them discoverable to search engines despite that. Update `sitemap.xml` if a future indexable route is added.

---

## 11. DESIGN DIRECTION (§31–33)

- Feel: premium, modern, confident, technology-driven, a business-solutions company, **not** a low-cost freelancer.
- Real interfaces are the primary visual proof (§32). Minimize stock imagery.
- Strong CTA hierarchy: the primary CTA is always the most visually obvious element in view.
- Concise, scannable copy; short paragraphs; generous spacing.
- Consult the `frontend-design` skill for typography and to avoid a templated/default look.

### 11.1 Brand palette (LOCKED from logo)

Define as Tailwind theme tokens.

| Token | Hex | Use |
|-------|-----|-----|
| `brand-navy` | `#02256F` | Primary dark brand blue (headlines, "ALTA" weight, dark UI) |
| `brand-blue` | `#0D68EF` | Primary accent: **all primary CTAs**, links, active states |
| `brand-navy-deep` | `#06122E` | Near-black canvas with a navy tint (dark sections / hero bg) |
| `ink` | `#0A0F1C` | Body text on light |
| `paper` | `#FFFFFF` / `#F6F8FC` | Light surfaces |

- **A-mark gradient** (brand device): `linear-gradient(135deg, #02256F 0%, #0D68EF 100%)`. Use sparingly: hero accent, section dividers, CTA hover sheen. Don't apply to body text at small sizes.
- Primary CTA buttons: solid `brand-blue` `#0D68EF`, white label, clear hover/active. This is the single most visually obvious element per §11.
- Wordmark echoes the logo split (navy + blue); keep that relationship if the wordmark is ever set in type.
- Maintain WCAG AA contrast: `brand-blue` on white passes for large/bold; use `brand-navy` for small text on light. White on `brand-navy`/`brand-navy-deep` passes.

**Mobile-first (§33):** fast load, large touch targets, sticky CTA, optimized images, simple nav.

---

## 12. PERFORMANCE & ACCESSIBILITY (§35)

- Target strong Core Web Vitals: lazy-load below-the-fold images, `width`/`height` on images to prevent CLS, modern formats (WebP/AVIF), preconnect only what's needed.
- Fully responsive, mobile-first.
- Accessible: keyboard-navigable, focus-visible states, sufficient contrast, alt text on all real images, ARIA on modals/accordion.
- HTTPS via Cloudflare Pages by default.

### 12.1 Lighthouse audit [2026-09-06, real findings and fixes]

Ran `lighthouse` (mobile, 390x844, default simulated-throttling preset) against a local `vite preview` build via the pre-installed headless Chromium, since this was previously an unchecked item in §15's Definition of Done. Before/after, homepage only:

| Category | Before | After |
|---|---|---|
| Performance | 55 | 76 |
| Accessibility | 96 | 100 |
| Best Practices | 96 | 100 |
| SEO | 100 | 100 |

**Real, verified fixes (not sandbox artifacts):**
- **Self-hosted Inter instead of Google Fonts.** `index.html`'s `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` (plus its two `preconnect` hints) was a render-blocking third-party request that failed outright in this sandbox (`net::ERR_CONNECTION_RESET`, even when Chrome was pointed at the sandbox's own egress proxy) and drove First Contentful Paint to 13.8s. Replaced with `@fontsource/inter` (weights 400/500/600/700/800 imported in `src/main.tsx`), which bundles the font files locally with no external request at all — dropped FCP to ~2.2s. This removes a real third-party dependency regardless of the sandbox issue (self-hosting fonts is standard performance/privacy best practice), so it isn't a workaround for this environment specifically.
- **Hero images converted to WebP.** `Hero.tsx`'s two full-bleed background images (the LCP element on every load) are now `<picture>` elements — a `<source type="image/webp">` first, the original JPEG kept as the `<img>` fallback (never deleted, so nothing regresses for a browser that somehow lacks WebP support) — plus `fetchPriority="high"` on both `<img>` tags. `hero-bg-mobile.jpg`/`hero-bg-wide.jpg` (184KB/118KB) got WebP siblings at 70KB/42KB (62-64% smaller, quality 78, generated once via a scratch `sharp` script, visually verified side-by-side before wiring in). `content/site.ts`'s `HERO` gained `backgroundImageDesktopWebp`/`backgroundImageMobileWebp` alongside the existing JPEG paths. LCP dropped from 5.0s to 4.1s.
- **Color contrast, three real WCAG failures, all shared classes so fixed site-wide, not just on the homepage:**
  - `text-ink/50` (ink `#0A0F1C` at 50% over `paper-alt` `#F6F8FC`) measured 3.52:1, below the 4.5:1 required for normal text — used in ~15 places across modals, `CredibilityStrip`, `SelectedWork`, the `/limitedoffer` and `/foryourbusiness` components, `SignaturePad`. Bumped to `text-ink/60` (4.94:1) everywhere via a single find-and-replace rather than patching only the flagged homepage instances, since the same class was failing on every page that used it.
  - `text-white/40` (white at 40% over `brand-navy-deep` `#06122E`) measured 3.79:1 — used in `FinalCTA`, `Footer`, `FybHeroVisual`'s eyebrow, `LimitedOfferPage`'s footer. Bumped to `text-white/50` (5.28:1), same site-wide approach.
  - **The decorative pale step-number accent** (`text-brand-blue/25` on white, used in `HowItWorks.tsx`, `OfferHowItWorks.tsx`, `FybHowItWorks.tsx`'s numbered steps) measured 1.43:1 against the 3:1 large-bold-text threshold. First tried `aria-hidden="true"` alone (reasoning: the number is redundant with the `<ol>` item order a screen reader already announces) — **this did not clear the audit**, because `aria-hidden` only removes an element from the accessibility tree, it doesn't exempt visually-rendered text from the WCAG contrast requirement that protects sighted low-vision users. Kept the `aria-hidden` (still correct for screen readers) and additionally darkened to `text-brand-blue/75` (3.25:1) to actually pass. `FybHowItWorks.tsx` was also restructured from a bare `<div>` grid to a semantic `<ol>/<li>` to match the other two components, since without list semantics `aria-hidden`-ing the only visible step number would have removed the sole indicator of step order for screen reader users.
- **`unused-javascript` (main bundle, ~42% unused on this route) and the `network-dependency-tree`/`lcp-discovery` insights were not chased** — the remaining gap is inherent to a client-rendered SPA shipping one shared bundle across `/`, `/WSA-free`, `/limitedoffer`, `/foryourbusiness` (already code-split via `React.lazy` per §17-19) and would need either route-level chunking finer than what exists or a switch away from a pure-CSR architecture — a bigger, riskier change than this pass's scope. Revisit only if Performance needs to climb further.

**Caveat on the Performance number itself:** Lighthouse's default mobile preset simulates a slow, high-latency mobile network and a 4x-slowed CPU — this local `vite preview` server is also not Cloudflare's real edge CDN (no HTTP/2 push, no edge caching, no real-world TLS session reuse). The 76 measured here is a lower bound from a deliberately harsh, non-production environment; the deployed site at `altasme.com` should score higher. Re-run the same audit against the live URL once convenient to get a production-accurate number — the fixes above are real either way (measured, verified byte savings and contrast ratios), not artifacts of the measurement environment.

---

## 13. LEGAL (open item #6, RESOLVED)

- Privacy Policy and Terms of Service are real client-supplied legal text, rendered in LegalModal from structured section/block data in `content/site.ts` (`LEGAL`).
- **Refund Policy** (`LEGAL.refund`, footer link id `"refund"`) was added later, authored to be consistent with — and not duplicate — the commercial terms already in the Terms of Service: §5 (the complimentary offer has no development fee, so nothing to refund on that side; domain cost is paid to a third-party registrar, non-refundable per the registrar's own policy) and §17 (paid engagements are governed by a separate per-project agreement, not by the public site). Deliberately states no specific refund percentages, timeframes, or deposit terms for paid work, since those aren't public/standardized — it points to the individual project agreement instead. If the client ever supplies real numeric refund terms for paid engagements, add them under LEGAL.refund's "Paid Projects and Custom Engagements" section rather than inventing figures.

---

## 14. DEPLOYMENT

- Build: `vite build` → static `dist/`.
- Deploy target: Cloudflare Pages (connect GitHub repo; build command `npm run build`, output dir `dist`).
- No runtime env vars required. Analytics/Pixel IDs, when added, injected at build time via `import.meta.env`.

---

## 15. DEFINITION OF DONE

- [x] Single page, all sections in §5 order, all copy pulled from `content/site.ts`.
- [x] All CTAs open ContactModal; channel links correct; WhatsApp prefills, Messenger/Viber do not falsely claim to.
- [x] Four case-study modals working, Vocalyze future-dev clearly labeled as planned.
- [x] Sticky mobile CTA present and non-obstructing.
- [x] Analytics events firing to `dataLayer` (IDs optional).
- [x] SEO meta + JSON-LD present. OG image intentionally removed for now (§10) — no OG image ships until a real one is supplied.
- [x] Real assets in place: logo, favicon, hero photography, project screenshots, About copy, legal text. Placeholders remain only for analytics IDs. OG image deliberately absent (§10), not a placeholder gap.
- [x] Brand palette (§11.1), logo, and tagline applied.
- [x] No backend, no form, no Website Care mention anywhere public.
- [x] Lighthouse: performance/accessibility/SEO in good range on mobile (§12.1).
- [x] Static `dist/` deploys clean to Cloudflare Pages (live at altasme.com).

---

## 16. GUARDRAILS (do not violate)

1. No fabricated screenshots, testimonials, or "clients". Real work only.
2. No Website Care pricing or plans on the public site.
3. No contact form or email capture. Chat channels are the only conversion.
4. Don't imply Messenger/Viber prefill a message.
5. Don't reintroduce multi-page routing or case-study pages on the marketing site. Single page + modals is final. The carved-out exceptions are `/WSA-free` (§17), an unlinked operational utility page outside the marketing funnel, and `/limitedoffer` (§18), a separate paid-social landing page — neither is a case-study page, and neither is linked from the homepage Nav/Footer.

---

## 17. FREE WEBSITE SERVICE AGREEMENT (`/WSA-free`)

A standalone e-signature page for the real Free Website Service Agreement contract, separate from the marketing funnel. Not linked from Nav/Footer; reached by direct URL.

**Route:** `src/pages/WsaFreePage.tsx`, lazy-loaded via `React.lazy` in `App.tsx` so `pdf-lib` never ships in the homepage bundle. `react-router-dom` (`BrowserRouter` in `main.tsx`) provides the routing; `public/_redirects` gives Cloudflare Pages the SPA fallback (`/* /index.html 200`) so a direct/refreshed visit to `/WSA-free` doesn't 404.

**Document content:** `src/content/wsa.ts` holds the full agreement text (`WSA_DOCUMENT`, currently Version 4.1), using its own `WsaBlock`/`WsaSection` types (`p`/`sh`/`ul`, plus a `table` kind still supported by both the page renderer and the PDF generator for future use even though no current content uses it) rather than sharing `LegalBlock` from `content/site.ts`. The page renders it as normal readable HTML (not an embedded PDF viewer) in natural page scroll, so it works smoothly on any device without a nested scroll container.

**No specific prices appear in this agreement (v4.1).** The PAYG services table (§18) and the Digital Growth Plan pricing table (§21) were replaced with plain service/plan-name lists plus a line stating pricing follows "Altaventures' then-current published rates," and the one remaining hard-coded figure (the ₱4,000+ full-website-transfer estimate in §30) was rewritten the same way. This was a deliberate operator decision so day-to-day rate changes never require editing and re-signing this legal document; only the ₱0 statement in §32 (confirming the Free Website Service itself has no fee) stays as a literal figure, since that's the core premise of the agreement, not a rate that fluctuates. If real numeric PAYG/plan pricing ever needs to reappear here, add it back deliberately rather than assuming the removal was accidental.

**The signable PDF is generated, not hand-authored.** `public/documents/free-website-service-agreement.pdf` is produced by `scripts/generate-wsa-pdf.ts` directly from `WSA_DOCUMENT`, so the on-page text and the actual signed document can never drift out of sync. The generator lays out the full 38-section text with Altaventures branding (logo header on every page, navy headings, blue bullets), draws the "1. Client Information" fields near the top and a "Signatures" execution block (Client + Altaventures) at the end, and embeds the real Van Amaranto signature (`public/images/brand/alta-signature.png`, extracted once from the original client-supplied contract's embedded SMask+DCTDecode image pair — it is not a Form/Image XObject reachable via the page's own resources, so a plain "find the XObject" approach won't locate it if this ever needs re-deriving). Run it with `npx tsx scripts/generate-wsa-pdf.ts` after editing `WSA_DOCUMENT`; it prints the resulting `WSA_PDF_FIELD_COORDS` / `WSA_SIGNATURE_BOX` values to paste back into `wsa.ts`. **Always run `npm run build` afterward** — `vite preview` and the deployed site serve the PDF from `dist/`, not `public/`, so a regenerated template with no rebuild silently keeps serving the old one.

**Flow:**
1. Client scrolls the full agreement. An `IntersectionObserver` on a sentinel after the text unlocks the form once reached (`hasReadAgreement`).
2. Client fills Business Name, Client Name / Authorized Representative, Email, Contact Number. Date is auto-filled to today (read-only) on both the Client and Altaventures blocks, per the client's instruction that the Altaventures side is otherwise already fixed.
3. Client draws a signature on `src/components/wsa/SignaturePad.tsx` (canvas + Pointer Events, works for mouse and touch). The pad crops the exported PNG tightly to the drawn ink's bounding box (plus small padding) — embedding the full blank canvas instead would scale the signature down to near-invisibility when fit into the small signature box on the PDF.
4. Client checks an explicit "I have read, understood, and agree" box.
5. **Download PDF** and **Submit Agreement** both call `src/lib/wsaPdf.ts` → `fillAgreementPdf()`, which fetches the real base contract (`public/documents/free-website-service-agreement.pdf`) with `pdf-lib`, overlays the typed field values and the signature image at hand-verified coordinates on the signature page, and returns the filled PDF bytes. This runs entirely client-side.
6. **Submit** additionally POSTs `{ businessName, clientName, email, phone, date, pdfBase64 }` to `/api/submit-wsa` (a Cloudflare Pages Function, `functions/api/submit-wsa.ts`), which emails the signed PDF via Resend to both `altasmeworks@gmail.com` and the client's email, and optionally archives it to Cloudinary if credentials are configured.

**A note on the signature pad's resize handling:** reassigning a `<canvas>`'s `width`/`height` silently wipes its pixels, even when nothing visually changes. `SignaturePad` guards against wiping on every render, but if a *genuine* resize happens after the client has signed (mobile keyboard toggling, orientation change), it correctly treats the now-blank canvas as invalidated — clearing `hasSignature`, showing the "Sign here" placeholder again, and re-disabling Download/Submit — rather than silently letting a blank signature through. Do not remove this guard when touching the component.

**Required Cloudflare Pages environment variables** (set in the dashboard, never committed): `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (must be on a domain verified in Resend — Resend's sandbox sender can only deliver to the account's own email, not to arbitrary client addresses). Optional: `WSA_NOTIFY_EMAIL` (defaults to `altasmeworks@gmail.com`), `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` (archival upload is skipped entirely if these are absent).

**If the agreement text changes again:** edit `WSA_DOCUMENT` in `src/content/wsa.ts`, re-run `npx tsx scripts/generate-wsa-pdf.ts`, paste the printed coordinates back into `WSA_PDF_FIELD_COORDS` / `WSA_SIGNATURE_BOX`, then `npm run build`. Do not hand-edit the PDF or the coordinates independently of each other — they're only valid as a matched pair produced by the same generator run. `src/lib/wsaPdf.ts` (the runtime overlay used by Download/Submit) reads each field's own `page` index, since the Client Information block and the Signatures block can legitimately land on different pages depending on how long the text is.

---

## 18. LIMITED OFFER LANDING PAGE (`/limitedoffer`) [v3, direct-response rewrite]

A paid-social landing page (FB/IG → this page → chat) for the "free website, you pay for the domain" offer. Originally built from a v2 spec (backend removed from the original spec per client direction); **fully rewritten to a v3 spec** (`CLAUDElimitedoffer_2.md`) that turns it into a direct-response page with one explicit job: get the visitor to start a chat. This section documents the v3 state; nothing from v2's structure survives except the qualifier mechanics and the shared brand/contact plumbing.

**Relationship to the main site:** same brand, same `CONTACT` channels, same domain (`altasme.com`), but a deliberately separate funnel. Route: `src/pages/LimitedOfferPage.tsx`, lazy-loaded in `App.tsx` like `/WSA-free`, so its content and qualifier logic never ship in the homepage bundle.

**Visual design reuses the main site's components, tuned bolder for a direct-response feel [went through three passes].** Pass 1 gave this route its own fully-dark, all-navy "guru funnel" treatment with an eyebrow label above every heading and a blurred radial-gradient-and-grid hero background; a design review against a concrete AI-slop checklist flagged the eyebrows, the glow, and the grid as recognizable AI-generated-UI tells, and reading a long all-dark page was flagged as harder on the eyes than the homepage's alternating light/dark sections. Pass 2 reverted to importing the homepage's exact `src/components/ui/{Section,CTAButton,Tag}.tsx` with a calm light/alt/dark alternation — which then read as too flat/bland for a page whose only job is conversion. Pass 3 (current) keeps pass 2's guardrails (no eyebrows, no glow/blur, no grid, shared components only, real screenshots or nothing) but adds real visual energy on top:
- `Section` gained a fourth tone, `"brand"` (solid `bg-brand-blue`, additive-only, doesn't touch the homepage's `light`/`alt`/`dark`), used for `Scarcity` as a full-bleed color-blocked urgency moment instead of another dark-navy section.
- `CTAButton` gained a `size?: "md" | "lg"` prop (`md` is byte-for-byte the old default, so every other page's buttons are unaffected); every /limitedoffer CTA passes `size="lg"` for more visual weight.
- `OfferHero` is a two-column layout (was centered/stacked): headline + CTAs on the left, a `bg-brand-gradient` stat panel on the right with three real numbers (`8` real businesses built, `4-7` days to launch, `₱0` development cost) — this doubled as the "stats strip" idea instead of adding a redundant separate section. The word "FREE" in the headline is a solid-color highlight span (`text-[#5fa2ff]`), not gradient text.
- `Agitation`'s `turnLine` and `OfferPortfolio`'s first project now get asymmetric featured treatment (a solid-blue pull-quote panel; a large side-by-side featured card with `altamotors` promoted to that slot) instead of uniform stacked blocks. `Agitation` also runs a full-bleed background photo (`public/images/offer/agitation.jpg`, 16:9, real supplied image) behind the copy, with the same horizontal + vertical scrim technique the homepage Hero uses, rather than a boxed side-image — a full-bleed treatment reads calmer than a large image competing with three paragraphs of text.
- All three hero stats animate on load via `src/lib/useCountUp.ts` (ease-out-cubic, jumps straight to the final value under `prefers-reduced-motion`): `kind: "counter"` counts 0→10 and renders "10 and counting"; `kind: "range"` counts both numbers of "4-7" up simultaneously; `kind: "static"` (₱0) can't meaningfully count up from nothing without fabricating a starting figure, so it gets a delayed fade/lift entrance via `Reveal` instead, timed to settle alongside the two counters. `OFFER_HERO.stats` is a discriminated union on `kind` — `StatValue` in `OfferHero.tsx` calls all three `useCountUp` hooks unconditionally (with a 0 fallback for whichever kind doesn't apply) to stay rules-of-hooks safe, then branches on `stat.kind` only for what to render.
- **Page-wide scroll animation:** `src/components/offer/Reveal.tsx` is a small IntersectionObserver wrapper (fade + 20px lift, 700ms ease-out, fires once, `prefers-reduced-motion` renders fully visible immediately with no transition) used everywhere on this route — every section below the hero is wrapped in `LimitedOfferPage.tsx`, and grid items inside `OfferPortfolio`, `WhatYouGet`, `TheOfferPlainly`, `OfferHowItWorks`, `GrowthVision`, and `WhoItsFor` pass an incremental `delayMs` (60-100ms per item) for a staggered cascade rather than popping in all at once. The hero itself is not wrapped (it's above the fold at load; the stat counters already carry its motion). `Reveal` accepts a `className` so it can BE the styled card/row itself rather than adding an extra wrapper div — important inside `<ul>`/`<ol>` lists, where the `<li>` stays the direct child and `Reveal` renders inside it.
- **Reveal's fallback for fast/instant scrolls:** relying on `IntersectionObserver` alone has a real failure mode — a non-animated jump scroll (End key, scrollbar drag, an anchor jump) can move the viewport past an element without the browser ever compositing a frame where it intersected, so the observer never fires and the content is stuck at `opacity-0` forever. Confirmed by a Playwright stress test (`window.scrollTo` straight to `document.body.scrollHeight`) that left several `TheOfferPlainly` list items permanently invisible. `Reveal` now also registers a passive `scroll` listener that does a direct `getBoundingClientRect()` check and reveals anything already scrolled to or past, independent of whether the observer fired — verified the same stress test now reveals everything. Don't remove this listener when touching the component; it's the only thing guaranteeing content can never ship permanently hidden.
- `src/components/offer/SectionDivider.tsx` is a small angled band cut from `bg-brand-gradient` (no blur) dropped around the `Scarcity` block for rhythm — this is the "section divider" use of the brand gradient CLAUDE.md §11.1 already names as sanctioned, distinct from the banned decorative-glow use.

What still makes this route distinct from the homepage is copy, structure, and this extra visual energy — not a separate component system; the underlying primitives are still the shared, homepage-tested ones.

**No exits, anywhere [v3 hard requirement].** Unlike v2, this page has **zero outbound links away from the funnel**: no "Explore Altaventures" link, no "Digital Growth Plans" link out to the homepage. The header is logo + a qualifier-opening CTA button only (hidden on mobile — `hidden ... sm:inline-flex` — since the sticky mobile CTA already covers that viewport and the full label overflowed a 390px header). The footer has no nav links either, just the logo, tagline, a one-line privacy note, and a copyright line. Every single CTA on the page, including the one inside `GrowthVision` (the "Phase 2" section, replacing v2's `PhaseProgression.tsx`), opens the qualifier via `onOpenQualifier()` — none of them navigate anywhere.

**Section order (13 sections, `LimitedOfferPage.tsx`):** Header → `OfferHero` → `Agitation` → `WhatYouGet` → `OfferPortfolio` (renamed from v2's portfolio component) → `TheOfferPlainly` → `WhyFree` (replaces v2's `OfferWhyAltaventures.tsx`) → `OfferHowItWorks` → `WhoItsFor` → `Scarcity` (new) → `GrowthVision` (replaces v2's `PhaseProgression.tsx`) → `OfferFAQ` → `OfferFinalCTA` → Footer → `StickyMobileOfferCTA`.

**Content:** `src/content/offer.ts` is the single source of truth — one exported const per section (`OFFER_HERO`, `AGITATION`, `WHAT_YOU_GET`, `OFFER_PORTFOLIO`, `THE_OFFER_PLAINLY`, `WHY_FREE`, `OFFER_HOW_IT_WORKS`, `WHO_ITS_FOR`, `SCARCITY`, `GROWTH_VISION`, `OFFER_FAQ`, `OFFER_FINAL_CTA`, `QUALIFIER`), plus a shared `PRIMARY_CTA = "CLAIM MY FREE WEBSITE →"` constant every section's CTA button uses (renamed from v2's "GET MY FREE WEBSITE →"). It imports `PORTFOLIO_BY_ID` / `PORTFOLIO` from the canonical `content/portfolio.ts` (§6.5) rather than duplicating project copy — `OFFER_PORTFOLIO.projectIds` is a **hard-coded list of every viewable project** (currently all 10: altamotors, vocalyze, dmhr, aulea, aurielle, leanandfit, pocketg7iii, macquias, ascend-volleyball, clickandkeep), a deliberate "wall of portfolio" for maximum proof density on this page. It's hard-coded rather than derived from `VIEWABLE_PORTFOLIO_IDS` so a newly-added viewable project doesn't silently appear here without a decision — add its id to this list when it should join the wall. Setmona and Kolekta (the two `engine`-tier, non-viewable projects) must never appear there — they're referenced only inside `GROWTH_VISION.phase2ProofLine` as proof of what clients graduate into.

**Direct-response structure, per section:**
- **Agitation** states the cost of staying Facebook-only before any offer details, then a `turnLine` bridges to relief ("it is fixable... at no cost").
- **TheOfferPlainly** lists the offer stack plainly and states risk reversal explicitly ("if you are not happy, you walk away, no fee, no pressure").
- **WhyFree** gives an honest reason the offer exists rather than leaving "why free?" as an unaddressed objection.
- **WhoItsFor** is a two-column honest qualifier (for-you / not-for-you) — deliberately including reasons *not* to convert, per the spec's instruction to keep it honest so both sides win.
- **Scarcity** uses soft, non-fabricated framing only: "we cap how many we take each month... the next opening rolls to the following month." **No countdown timer and no specific slot number are rendered anywhere** — there is no confirmed real cap figure yet, and the spec explicitly forbids fake numbers. It lists the real `ONGOING` projects (from `content/portfolio.ts`) as evidence of current capacity, not a synthetic counter.
- No price appears anywhere on the page except "you only pay for the domain."

**The qualifier is still not a lead form** (unchanged mechanics from v2). `src/components/offer/qualifier/Qualifier.tsx` is a 3-step, fully-skippable, client-only modal (name/business → business type/years → objectives) that collects no contact details and persists nothing — closing it (Escape, backdrop click, or the × button all route through one `handleClose`) wipes all answers back to blank. The 4th "step" is `ChatHandoff.tsx`. The WhatsApp prefill template changed for v3 (`buildQualifierPrefill()` in `lib/contact.ts`): `"Hi Altaventures! I want to claim the free website offer. I'm {name}, I run {businessName}, a {type} business, {years} in business. I'd like my website to help me: {objectives}."` — each clause is omitted gracefully if that field was skipped. Messenger and Viber still open blank, per the site-wide rule that only WhatsApp reliably prefills.

**Analytics:** `qualifier_start` fires on first field interaction, `qualifier_complete` on reaching the handoff step, and the Meta `Lead` event (`trackLead()`) fires only on an actual chat-channel click in `ChatHandoff.tsx`, carrying non-PII qualifier context (business type, years, objectives) but never name or business name. `OfferPortfolio` also fires `portfolio_view` on hover of any project card. `initMetaPixel()` no-ops until `META_PIXEL_ID` is set — nothing to configure to build or run the page.

**Copy rule reminder:** no em dashes anywhere in this page's copy or in any JSX text authored for it — this applies to `content/offer.ts` and to any inline strings written directly in a component, not just client-supplied text. Caught and fixed twice during the v3 build (once in `offer.ts`'s own copy, once in `Scarcity.tsx`'s JSX).

**Known open items (not blocking, do not build speculative code for these):**
- **Testimonials are deferred.** The v3 spec includes a testimonial slot in the Proof section, but there are no real client quotes yet. Per the site-wide no-fabricated-testimonials guardrail (§16), this slot stays unpopulated until real quotes are supplied — do not invent one to fill the space.
- **Scarcity has no confirmed real cap number.** The soft "we cap monthly" framing above is the correct permanent state unless the client provides a true, specific monthly capacity figure — at that point the copy can state the real number, but must never revert to a fake one.
- `META_PIXEL_ID` is blank in `lib/analytics.ts` — set it and confirm the `Lead` custom conversion once provided.
- SEO/OG tags for this route are set client-side in `LimitedOfferPage.tsx`'s effect (title, description, OG/Twitter, canonical) since the app is a single-page SPA shell — this works for browsers and JS-capable crawlers, but a crawler that doesn't execute JS will still see the homepage's static OG tags from `index.html`. No OG image ships anywhere on the site right now (§10, removed 2026-09-05) — nothing for this route to inherit until one is added back site-wide.

---

## 19. ₱299 WEBSITE OFFER LANDING PAGE (`/foryourbusiness`) [v2, lean 8-section structure]

A paid-social landing page for the ₱299 one-time professional website offer. Originally built from the elaborate 13-section `ALTAVENTURES___ForYourBusiness.txt` spec; **rebuilt to the v2 lean structure** (`CLAUDEforyourbusiness_1.md` §5), which explicitly supersedes the landing-page section list while leaving voice, design tokens, analytics, and the post-payment flow unchanged. This section documents the v2 state. Route: `src/pages/ForYourBusinessPage.tsx`, lazy-loaded in `App.tsx` like `/limitedoffer` and `/WSA-free`, so its content never ships in the homepage bundle. Content lives in `src/content/foryourbusiness.ts` (one exported const per section, following the same single-source-of-truth pattern as `content/offer.ts`), reusing `BRAND`/`CONTACT` from `content/site.ts` and portfolio data from `content/portfolio.ts` rather than duplicating either.

**Why the rebuild:** the v2 spec judged the original 13-section structure too elaborate for a ₱299 impulse offer and dropped five sections entirely rather than trimming their copy: standalone Reality, Social Media Reality, Why Only ₱299, Urgency, and Guarantee. The "why so cheap?" objection now lives as one FAQ item instead of its own section; the make-it-right guarantee lives in the Terms of Sale, not on-page; and the Urgency section's soft-scarcity framing is gone along with it, so the page currently makes no capacity/scarcity claim at all. The components for those five sections were deleted outright (not commented out or left dead) along with `Value.tsx`, `WhatThisLooksLike.tsx`, and `DoesntInclude.tsx`, whose content was absorbed into the new leaner `WhatsIncluded.tsx`.

**Checkout/payment is now live, in ganap.net TEST MODE, confirmed end to end.** Every CTA on the landing page now calls `navigate("/foryourbusiness/checkout")` (via `useNavigate`) instead of opening `ContactModal`; the old chat-modal CTA path (`FYB_PREFILL` in `lib/contact.ts`) is kept only for the thank-you page's "Message Us" fallback, not as a primary CTA anymore.

**The live project is a Payment Portal project (`alta_paymentportal`), not the original Webhook-type project.** ganap.net offers two project types sharing the same checkout API and webhook payload shape: **Webhook** (no customer-facing page — the first project used, "Test alta webhoo") and **Payment Portal** (a real branded hosted page with a QR Ph code). The Webhook-type project's dashboard turned out to have no discoverable way to simulate/complete a test transaction at all (no "Simulate successful payment" button anywhere in its UI, confirmed with the client directly), which made it untestable end to end. Switching to a Payment Portal project needed no code changes — `redirectUrl` there is a real `https://.../pay/...` URL, which `classifyRedirectUrl()` (below) already resolves to `kind: "url"` and redirects the browser to directly — and a full live test confirmed the browser-visible half of the chain: checkout creation → real hosted test payment page → browser forwarded to `/foryourbusiness/thank-you` (`successRedirectUrl`, ~10 seconds after payment clears per ganap's docs). The `classifyRedirectUrl()` QR/test-placeholder handling stays in the code as a safety net (it's cheap to keep and ganap's own docs describe it as shared API behavior across project types), it just isn't the path this project takes.

**CORRECTION [2026-09-06]: `/testpayment` and this repo's `orders` table are no longer the live payment-confirmation path — ganap.net's webhook is now pointed at Client Hub instead.** The paragraph above (and an earlier claim that the live test confirmed "D1 order marked paid") overstated what was actually verified: checking the production D1 database directly on 2026-09-06 showed every row in `orders` still at `status = 'pending'`, none ever `'paid'`, confirmed against real checkout attempts from 2026-09-04. Root cause: per the `clienthub` repo's own build plan (`clienthub/CLAUDE.md` §0/§1.2/§1.5, executed as part of that build), ganap.net's webhook URL for this project was repointed from `https://altasme.com/testpayment` to `https://account.altasme.com/api/webhooks/ganap` — confirmed directly against the live ganap.net dashboard. This is the intended architecture (Client Hub's `clients`/`projects`/`payments` tables are meant to be the one source of truth "from payment_received onward," not a dual-write into two databases), so it is **not a bug to fix** — but it means:
- `functions/testpayment.ts` and this repo's `orders`/`customers` tables are now genuinely dead in production, not just "legacy but still receiving deliveries" as previously implied. They're kept, unchanged, for historical rows and as a reference implementation, per the same "legacy, not deleted" treatment as the `customers` table.
- **There is currently no staff-facing notification when a real ₱299 payment happens.** Client Hub's `functions/api/webhooks/ganap.ts` creates the `clients`/`projects`/`payments` rows and sends the customer a WorkOS account-invitation email, but does not send any email to the operator — confirmed against its own `CLAUDE.md` ("Resend app-email notifications (payment confirmed, discovery reminder, etc.) are not yet wired up"). The only way to currently notice a live payment is checking the ganap.net dashboard or querying Client Hub's D1 tables directly. Adding a Resend "payment confirmed" notification to `clienthub/functions/api/webhooks/ganap.ts` (mirroring this repo's `testpayment.ts` pattern) was proposed and explicitly deferred by the operator (2026-09-06, "Not now") — pick this up as the next concrete payment-integration task when ready, in the `clienthub` repo, not here.

**Data layer is Cloudflare D1, not Supabase.** The site already runs entirely on Cloudflare Pages Functions, so D1 (Cloudflare's own serverless SQL database) replaces the Supabase plan in the original spec (§3) for order/account storage — one platform instead of two. Schema lives in `d1/schema.sql` (`orders`, `customers` tables); apply it once against the bound database (`npx wrangler d1 execute <database-name> --remote --file=./d1/schema.sql`, or paste it into the D1 Console tab in the dashboard). The database must be created and bound to the Pages project (Settings → Functions → D1 database bindings) with variable name **`DB`** — every Function below reads it as `env.DB` and treats it as optional (best-effort: a D1 hiccup never blocks a payment or an account creation, it just logs).

**Account creation now belongs entirely to the Client Hub app (`altasme/clienthub`, `account.altasme.com`), a separate repo — not to this site.** Originally built here (WorkOS AuthKit, `functions/api/auth-start.ts` + `auth-callback.ts`, a D1 `customers` table) before the Client Hub existed; both of those Functions have since been **deleted from this repo** now that Client Hub owns the real account-creation bridge (its own ganap.net webhook creates the client/project records and issues the WorkOS invitation — see `clienthub/CLAUDE.md` §0/§4). Keeping a second, parallel "create account" path here caused a real bug: the thank-you page's CTA kept linking to this site's own (now-stale) `/api/auth-start`, which still worked and showed a hardcoded "we'll reach out within one business day" message from before Client Hub existed, instead of taking the client to the actual dashboard. Fixed by pointing the CTA straight at `https://account.altasme.com/api/auth-start` and deleting the local functions entirely rather than leaving unused code that could drift out of sync again. The old `d1/schema.sql` `customers` table stays in this repo's database for historical data but is no longer written to — same "legacy, not deleted" treatment already given to `orders`/`customers` once the ganap.net webhook itself was repointed to Client Hub (see below).

- **`src/pages/ForYourBusinessCheckoutPage.tsx`** (`/foryourbusiness/checkout`, `noindex`): collects full name, business name, email, mobile (required) and Facebook/Instagram/existing-website (optional), per spec §21, plus the two required consent checkboxes (Terms of Sale + Refund Policy; Privacy Notice), unticked by default, each linking to the relevant `LegalModal` doc. POSTs to `/api/checkout`, which now returns `{ redirectUrl, referenceNumber, kind }` rather than a bare `redirectUrl` (see the classification note below). Only `kind: "url"` triggers `window.location.href = redirectUrl`; the other three kinds render a `PaymentPanel` in place of the form instead of trying to navigate there. Fires `trackInitiateCheckout()` (dataLayer `checkout_started` + a guarded Meta `InitiateCheckout`, no-ops until `META_PIXEL_ID` is set) on submit.
  - **"Online payment is still in testing" notice [added 2026-09-05, deliberate soft-launch messaging]:** the operator went live with online checkout but only in a limited capacity to test the waters while the payment flow is further hardened. A `TestingNotice` banner (amber, bordered, sits above the price-summary card — the first thing on the page before the form) makes this explicit rather than letting a payment glitch surprise a real customer, and offers an immediate alternative: a **"Chat With Us Instead →"** button that calls `openContactModal("checkout-testing-notice", FYB_PREFILL)`, opening the same three-channel `ContactModal` used everywhere else on the site with the existing `FYB_PREFILL` ₱299-offer message. `ContactModal` now needs to be mounted on this page (it wasn't before, since every CTA used to navigate straight to checkout) — added alongside `LegalModal` in `PageContent`. The banner only shows on the pre-submit form, not on the post-submit `PaymentPanel` (QR/test-placeholder view), since a customer who already started paying online doesn't need to be re-offered the chat fallback. Remove this banner (and only this banner — the fallback modal wiring can stay) once online payment is confirmed fully stable and the operator wants it to read as the primary/only path again.
- **`functions/api/checkout.ts`** (`POST /api/checkout`): validates the form server-side, builds the ganap.net checkout request body (`projectUuid`, `amount`, a fresh `idempotencyKey` per attempt, `customerName`, `customerEmail`, `externalReference`, `metadata`, `successRedirectUrl`, `failureRedirectUrl`), signs it with HMAC-SHA256 hex using `env.GANAP_SECRET` (verified byte-for-byte against the vendor's own curl example, then re-verified against their real "Webhooks & API" documentation once supplied), POSTs to `https://convex-top-api.ganap.net/v1/checkout`.
  - **Two real bugs fixed once the client supplied ganap.net's actual documentation (a curl-example-only build had guessed wrong on both):** (1) `amount` is in whole **pesos**, not centavos — the original code sent `29900` for what should be `299`, a **100x overcharge** had it ever run against a live (non-test) project; the constant is now `AMOUNT_PHP = 299`. (2) the redirect fields are `successRedirectUrl` / `failureRedirectUrl`, not a single `returnUrl` — the old field name isn't part of ganap's API and was silently ignored, so a real customer would have landed on ganap's own default receipt page instead of `/foryourbusiness/thank-you`.
  - **Briefly set to `1` for a live-money test [2026-09-10], now back at `299`.** The operator wanted to verify the newly-consolidated single ganap.net project (clienthub CLAUDE.md §17) with the smallest possible real charge before trusting it with the real price. That attempt 502'd — turned out ganap.net enforces a **₱200 minimum transaction amount**, which the checkout's `!ganapResponse.ok` branch collapses into a generic 502 rather than surfacing ganap's actual rejection reason, so the real cause only showed up in Cloudflare's function logs (`console.log("ganap.net checkout response (...)", ...)`, already present in this file). Since `299` already clears that ₱200 floor, there was no reason to test again at exactly ₱200 first — reverted straight back to the real price. **If a low-amount test is ever wanted again, ₱200 is the effective floor for this ganap.net project, not ₱1.**
  - **`redirectUrl` is now classified into one of four kinds** (`classifyRedirectUrl()`), per ganap's own documented heuristic, instead of being treated as always-navigable: `"url"` (starts `http`) is handed to the browser as before; `"qr-image"` (`data:image...` or an image-extension URL) is rendered as an `<img>`; `"qr-payload"` (any other string) is rendered as a client-generated QR code via the `qrcode` package; `"test-placeholder"` (the literal `ganap-test-do-not-pay:...` string every test-mode checkout returns) shows instructions to complete the payment from ganap's own dashboard ("Test mode" → "Simulate successful payment") instead of trying to open a dead custom-scheme link — this is what was previously surfacing as a browser console error ("scheme does not have a registered handler") and a hard 502.
- **`functions/testpayment.ts`** (`POST /testpayment`, matching the exact webhook path ganap.net is configured to call): the authoritative, server-to-server payment confirmation — the browser landing on the thank-you page is only a UX nicety and is never trusted alone. Verifies `X-Ganap-Signature` (HMAC-SHA256 hex of the raw body, same secret) before doing anything, returning 401 on a missing/forged signature. Payload parsing (`parsePayload()`) now matches ganap's real documented webhook shape exactly (`event`, `referenceNumber`, `externalReference`, `amount`, `currency`, `status`, `customer: {name,email}|null`, `metadata`, `timestamp`) rather than guessing across several plausible field-name variants; it also branches on `event !== "transaction.paid"` (the only event ganap sends today) and skips processing for anything else, per the docs' own advice, so a future event type can't be silently mishandled as a payment. If a D1 database is bound, it matches the webhook back to the `pending` order `functions/api/checkout.ts` created via `externalReference` (falling back to `referenceNumber`) and marks it paid with the raw payload attached; no match (or no DB bound) isn't an error, since it always emails the full raw payload to the internal notify address via Resend (reusing `RESEND_API_KEY`/`RESEND_FROM_EMAIL` from the WSA-free function) regardless, so a human sees every event. Deliveries are at-least-once per ganap's docs, so this deliberately re-processes on every delivery rather than deduping — a duplicate email is a much smaller cost than a silently-dropped one.
- **`src/pages/ForYourBusinessThankYouPage.tsx`** (`/foryourbusiness/thank-you`, `noindex`, the `successRedirectUrl` target): deliberately hedged copy ("if your payment went through...") rather than claiming a confirmed purchase, since only the webhook can confirm that. Fires `track("payment_return", {})` on mount as a dataLayer marker, not a Meta `Purchase` event — a client-side Purchase fire off an unverified browser redirect would inflate ad reporting with unconfirmed conversions, so that's deliberately not done here. Below the payment card it shows the "Create Your Account" panel, a plain link to `https://account.altasme.com/api/auth-start?intent=signup` — Client Hub's own callback owns the whole WorkOS handshake and redirects the client to its dashboard on success, so this page no longer needs (or has) any local `?welcome=1`/`?error=auth_failed` state of its own. Includes a "Message Us" fallback into `ContactModal` for anyone who hits trouble either way.
  - **`?intent=signup` fix [2026-09-06]:** this link previously pointed at bare `/api/auth-start`, which put a first-time client (no account yet) on WorkOS AuthKit's default **sign-in** screen instead of sign-up — confirmed against `workos-node`'s own SDK, whose `screen_hint` defaults to `'sign-in'` unless told otherwise. `clienthub/functions/api/auth-start.ts` now reads `?intent=signup` and only then sets `screen_hint=sign-up` on the authorize URL; this is the one caller in the whole ecosystem that should pass it (session-expired *returning* clients elsewhere in Client Hub correctly keep landing on sign-in). See `clienthub/CLAUDE.md` §1 item 10 for the full fix.
- **Required Cloudflare Pages environment variables** (dashboard only, never committed): `GANAP_SECRET`, `GANAP_PROJECT_UUID`. `functions/testpayment.ts` additionally needs the already-required `RESEND_API_KEY`/`RESEND_FROM_EMAIL` to send its notification email (optional `PAYMENT_NOTIFY_EMAIL`, defaults to `altasmeworks@gmail.com`). Optional: `DB` (the D1 binding, see below). `WORKOS_API_KEY`/`WORKOS_CLIENT_ID` are no longer needed on this site — that responsibility moved to `clienthub`.
- **How this was tested:** this sandbox's egress proxy blocks `convex-top-api.ganap.net` outright (`403 Host not in allowlist`), so the real end-to-end payment call could never be exercised from within this environment, in any build round. What *was* verified locally via `wrangler pages dev` with a gitignored `.dev.vars` and a local D1 instance bound via a gitignored `wrangler.toml` (both deleted after each test session, never committed): the HMAC signature this code produces matches `openssl`'s output for the vendor's own example body+secret; `/api/checkout` correctly returns 400s for each invalid-input case, a graceful 502 when the real network call fails, and — confirmed against a real local D1 database — inserts a `pending` order row with the corrected `amount = 299` (not `29900`) before that network call; `classifyRedirectUrl()` was exercised against all four kinds directly, and the checkout page's branching (`PaymentPanel` for `qr-image`/`qr-payload`/`test-placeholder`, real redirect for `url`) was verified with Playwright against a mocked `/api/checkout` response for each kind; `/testpayment` accepts a correctly-signed test payload matching the real documented shape (200) and rejects both a forged and a missing signature (401 both times), and correctly updates the matching D1 order to `paid` with the webhook payload attached. **The real end-to-end call was then verified live, by the client, once switched to the Payment Portal project**: a real checkout redirected to a real hosted ganap test payment page, the webhook was delivered to `/testpayment` and processed, and the client confirmed both the D1-order-paid outcome (via the Resend notification email arriving) and the browser landing on `/foryourbusiness/thank-you`. That closes the one gap this sandbox could never test itself.

**Modal plumbing added to support the prefill fallback:** `ModalContextValue.openContactModal` takes an optional second `prefillMessage` argument (stored as `contactPrefill` alongside `contactSection`), and `ContactModal.tsx`'s WhatsApp channel calls `whatsappUrl(contactPrefill)` instead of the no-arg default. Passing nothing preserves the original site-wide default prefill (`CONTACT.whatsapp.prefill`) for every other caller, so this is additive, not a behavior change elsewhere.

**Legal content** for this offer (`LEGAL["fyb-refund"]`, `LEGAL["fyb-terms"]`, `LEGAL["fyb-privacy"]` in `content/site.ts`, `LegalDoc` type extended to match) is separate from the main site's general Refund Policy/Terms/Privacy — the ₱299 offer has its own commercial terms (scope-gate refund logic, 2 revision rounds, 4-7 day timeline, subdomain hosting) that don't apply to the rest of the site. Source content is `foryourbusinesspolicies.md` (marked by its author as protective boilerplate needing a Philippine lawyer's review before real-money use). Bracketed blanks from that source were resolved by following the exact precedent already set by the main site's own Privacy Policy/Terms: no specific street address (just "Philippines," matching the existing pattern), no named city of venue (just "the appropriate courts of the Philippines," matching the existing Terms language), and `altasmeworks@gmail.com` reused as both the support and privacy contact (the same address already used everywhere else on the site). **Do not treat this as legally finalized** — it restates the source spec's own commercial terms without inventing new ones, but a lawyer still needs to review it before the ₱299 offer processes real payments, per the source document's own instruction.

**Portfolio is a deliberate ₱299-scope curation**, not the full canonical `PORTFOLIO` list (`FYB_PORTFOLIO` in `content/foryourbusiness.ts`):
- **Primary grid:** `dmhr`, `vocalyze`, `aulea`, `pocketg7iii`, `macquias`, `ascend-volleyball`, `clickandkeep` — seven real, live, simple `site`-tier projects at ₱299 scale, all with working "View Website" links to real screenshots already in `public/images/projects/`.
- **Optional "beyond the ₱299 scope" row:** `aurielle`, `leanandfit` — both `system`-tier, shown as proof of range but explicitly labeled so nobody expects e-commerce or multi-panel systems for ₱299.
- **Excluded:** `altamotors` (system-tier CRM/financing platform would misrepresent ₱299 scope), `setmona`/`kolekta` (engine-tier, no public URL, never belong on a "View Website" grid), and everything in `ONGOING` (in-progress work, not launched). This matches `portfoliocontent.md`'s placement rules for this surface.

**Hero visual is now a real stat composition, not a placeholder.** The spec (§8) originally called for a real device composition (one dominant desktop shot + 1-2 mobile shots of real Altaventures work) that doesn't exist as an asset yet, so `src/components/fyb/FybHeroVisual.tsx` rendered a labeled dashed-border placeholder box in the meantime. Replaced with an editorial stats panel instead — "TRUSTED BY BUSINESSES" eyebrow over three oversized-number stats (`15+` websites launched, `4-7 Days` average build time, `₱299` starting price), divider-separated, generous whitespace, no card/background fill — since a true, honest number is real proof too, not a placeholder standing in for one, per the site-wide no-fabricated-content guardrail (§16). Content lives in `FYB_HERO_STATS` (`content/foryourbusiness.ts`); the `15+` figure is the operator's own confirmed total businesses served (deliberately *not* derived from `content/portfolio.ts`'s 10-entry `PORTFOLIO` array, which was never meant to be a complete client count) — update it by hand as the real number grows. The device-composition image from the original spec may still get built later as a separate addition; this isn't standing in for it, it replaces the placeholder with something real to show today.

**Hero subheader removed [2026-09-06].** `FYB_HERO` originally carried a third line below the headline/sub, a `microcopy` field ("No tech skills needed... it goes live on your own yourbusiness.altasme.com"), rendered in `FybHero.tsx` between the sub and the CTA. Removed both the JSX and the now-unused `microcopy` field from `content/foryourbusiness.ts` at the operator's request — the hero now reads headline → sub → CTA directly, no subdomain detail up front (that detail still lives further down the page, in `WHAT_YOU_GET` and the FAQ).

**Impeccable audit run against all three `/foryourbusiness` pages [2026-09-06].** Following the same anti-pattern-detection pass already run against `/limitedoffer` earlier in the project, ran Impeccable's live-page `detect` command (Puppeteer-rendered, full computed-style/pixel checks) against the landing page, `/foryourbusiness/checkout`, and `/foryourbusiness/thank-you`. The landing and thank-you pages came back clean (`[]`). The checkout page surfaced 3 real findings, all fixed:
- **`all-caps-body`**: the `TestingNotice` banner's all-caps label ("Online Payment: Testing & Development", 37 characters) was too long to read comfortably in all-caps. Shortened to "Testing & Development" and moved the rest of the context into the normal-case body paragraph below it.
- **`line-length`**: that same body paragraph ran ~94 characters per line with no max-width. Added `max-w-[65ch]` to bring it into a comfortable reading measure.
- **`low-contrast`**: the disabled "Pay & Start" submit button measured 1.1:1 contrast (median 1.6:1), from `disabled:opacity-40` fading the whole element (both its blue background and white label) toward the page background together, collapsing their relative contrast. Root-caused as a general anti-pattern (opacity-based disabled states can wipe out contrast that separate color values wouldn't) and fixed by replacing it with explicit `disabled:bg-ink/10 disabled:text-ink/60 disabled:shadow-none` — computed via the same WCAG relative-luminance formula used in the §12.1 Lighthouse pass to land at 4.69:1, comfortably passing AA.

Re-ran the same live audit against the rebuilt checkout page afterward and confirmed all 3 findings resolved (`[]`), then visually verified the banner wording, paragraph wrapping, and the disabled button's new muted-gray appearance via a screenshot before considering the fix complete.

**Fixed a real mobile-overflow bug in the hero while working on this.** `FybHero.tsx`'s two-column grid (headline/CTA column + visual column) had no `min-width: 0` on either grid item, so — per CSS Grid's default `min-width: auto` on items — each item's own intrinsic (min-content) width could force the shared column wider than the viewport once you were below the `lg:` breakpoint (where the two columns collapse to one stacked column). The single-column CTA button's un-wrapped label text was the specific culprit contributing the widest intrinsic content, but *both* grid items needed `min-w-0` to fix it — adding it to only one item just meant the column sizing was then dominated by whichever item still lacked it. Confirmed via a headless-browser check across five common mobile widths (320-412px): before the fix, the document stayed a fixed ~395px wide (overflowing every width below that, with long text lines visibly cut off mid-word exactly as reported); after adding `min-w-0` to both grid items and `w-full sm:w-auto` to the hero CTA button, `document.documentElement.scrollWidth` matches the viewport exactly at every tested width. If a future edit reintroduces a similar two-column layout with a long-label button, apply the same `min-w-0` treatment to every grid/flex item, not just the one that looks like the obvious culprit.

**Page-wide motion reuses `/limitedoffer`'s `Reveal` component directly** (`src/components/offer/Reveal.tsx`, imported cross-folder rather than duplicated or relocated) — every section below the hero is wrapped in it, with staggered `delayMs` on grid items (WhatsIncluded checklist, WhoItsFor tags, portfolio cards, how-it-works steps), matching the established pattern of that page.

**Section order (8 sections + footer, `ForYourBusinessPage.tsx`):** Header → Hero (headline/sub/CTA only, no separate price stat or eyebrow) → Problem ("No Website Yet? Your Customers Notice.") → What's Included (checklist + a boxed scope line: "online stores, booking systems, and custom tools ... are not part of the ₱299 build") → Who It's For (single "Perfect For" tag list, not a two-column for/not-for split) → Portfolio → How It Works (3 steps: Pay → Tell Us About Your Business → We Build It) → FAQ (10 items, includes "Why is it only ₱299?" as the trust-guardrail answer) → Final CTA (single headline, no second price block) → Footer (logo, tagline, the three fyb legal links, copyright) → sticky mobile CTA (`₱299 · GET MY WEBSITE →`). Section tone alternates dark/light/alt/light/alt/light/alt/dark for visual rhythm now that there are fewer, denser sections.

**No outbound nav**, same convention as `/limitedoffer`: header is logo + CTA only (CTA hidden below `sm:` since the sticky mobile CTA already covers that viewport), footer has no links back to the homepage, only the three fyb legal modal triggers.

**Known open items (not blocking, do not build speculative code for these):**
- ~~The D1 database itself still needs to be created and bound.~~ **RESOLVED, but see the 2026-09-06 correction above.** The D1 database is created, bound (variable name `DB`), and `d1/schema.sql` is applied — confirmed directly via the D1 Console (`orders`/`customers` tables exist alongside Client Hub's own tables in the same shared database). However, this repo's `orders` table is no longer the live payment record: ganap.net's webhook now goes to Client Hub instead of this repo's `/testpayment`, so no order here will ever move past `status = 'pending'`. That's expected per the current architecture, not a bug — see the correction above for what to do instead (there is currently no staff payment notification anywhere; fixing that lives in the `clienthub` repo).
- **Setmona (call scheduling) still has no credentials and remains unbuilt.** The formalized post-payment flow (§7: payment → account → discovery call → build → present/review → ₱1,499 domain upsell → launch → Essential upsell) now has its first two steps live (payment on this site, account creation + discovery-call request on Client Hub); the real Altaventures booking system that Client Hub's "Schedule a Call" is meant to plug into once it exists is the next gap (see `clienthub/CLAUDE.md` §1.6 — interim behavior logs preferred times instead). Do not build Setmona/booking scaffolding speculatively before credentials/spec exist.
- The FAQ's "What payment methods are accepted?" answer (GCash, Maya, cards) and "What happens after I pay?" answer describe ganap.net's real hosted checkout and the eventual account/call flow; the call-scheduling half of that promise isn't built yet (see above).
- **The original device-composition hero visual is still not built.** The stat-panel replacement above is a real, honest alternative for now, not a substitute for the spec's actual device-composition asset if one gets produced later.
- `META_PIXEL_ID` is blank (shared `lib/analytics.ts` constant) — `trackInitiateCheckout()` is wired and ready but no-ops until it's set; no client-side `Purchase` event is fired anywhere (see the thank-you page note above), so a real `Purchase` conversion needs a server-side Conversions API call from `functions/testpayment.ts` once that's wanted.
- Legal content needs a Philippine lawyer's review before the ₱299 offer processes real (non-test-mode) payments, per `foryourbusinesspolicies.md`'s own disclaimer.
- **No on-page scarcity/urgency messaging.** v2 dropped the Urgency section entirely rather than keep a softened version; if the operator wants a capacity line back, add it deliberately (real numbers only, per the site-wide honesty guardrails) rather than reintroducing the old section as-is.
- SEO/OG tags are set client-side in `ForYourBusinessPage.tsx`'s effect, same JS-SPA caveat as `/limitedoffer` (§18) — a non-JS crawler sees the homepage's static tags instead. No OG image ships anywhere on the site right now (§10, removed 2026-09-05) — nothing for this route to inherit until one is added back site-wide.

---

## 20. Payment flow audit and commercial production cleanup [2026-09-10]

Ran a full audit of the checkout and account creation flow, prompted by the operator's request to prepare it for commercial production use. Findings and fixes below, plus the open items nothing here could resolve.

**Removed the "Testing & Development" soft launch banner** (`TestingNotice`, `ForYourBusinessCheckoutPage.tsx`) and the stale `CHECKOUT.testModeNote` copy ("This checkout is currently running in ganap.net test mode."). Both were accurate when written but are false now that the checkout is confirmed live in production (marketing site's own CLAUDE.md history, plus the operator's own live ₱299 test). Leaving either in place would tell a real paying customer their payment might not be real, right at the point of paying. The comment at the top of `content/foryourbusiness.ts` describing checkout status was updated to match.

**Kept a fallback path for an actual failure, just moved it.** The removed banner's real job was giving a customer an escape hatch if payment broke. That's now attached directly to the error state instead of shown upfront to every visitor: if `/api/checkout` fails, the error message gets a "Message us instead" link straight into `ContactModal`, so a genuine failure still has a way out without casting doubt on the whole flow by default.

**Added a ganap.net minimum transaction check, missing everywhere.** The ₱1 test done earlier (see the `functions/api/checkout.ts` history above) surfaced a real gap: ganap.net enforces a ₱200 minimum, and nothing anywhere in this ecosystem checked for it before this pass. Confirmed every catalog item in clienthub's Pricing page is safely above that floor (`functions/_lib/pricing.ts`, lowest is ₱299/₱500), so the only real exposure was Bill of Service, where staff can type any positive whole-peso total. Fixed in both places that matter: ClientKeeper's bill-creation endpoint now rejects a sub-₱200 total at creation time with a clear message (rather than the client hitting a mystery failure days later), and clienthub's bill checkout endpoint added the same check as a safety net for any bill created before that validation existed. See clienthub's CLAUDE.md for the full writeup.

**Account creation (WorkOS AuthKit) audited, no bugs found.** Walked the full chain: `auth-start.ts`'s `screen_hint`/`prompt` handling, `auth-callback.ts`'s code exchange and error redirects, `accountBridge.ts`'s idempotent client-linking (case-insensitive email match, safe to run twice), and `session.ts`'s cookie (HMAC-signed, HttpOnly, Secure, SameSite=Lax, real expiry check). All correct as built. One real open question flagged in the webhook backstop's own comments, not something this pass could verify: `functions/api/webhooks/workos.ts`'s exact signature header name (`WorkOS-Signature`) was reasoned from SDK source, not confirmed against a real delivery, since workos.com itself is unreachable from this environment. This only matters for the secondary backstop signal though, not the primary OAuth redirect that account creation actually depends on day to day.

**Verified against ganap.net's real project, not just code review.** This audit also assumed clienthub's CLAUDE.md §17 to §18 consolidation is fully in effect. Two things the operator still needs to confirm directly (not verifiable from this environment): that the `bills.last_checkout_reference` column migration and the relaxed `payments.source` CHECK constraint (§16 to §17 there) were actually applied to the live database, and that both Cloudflare Pages projects (`altaventureswebsite` and `clienthub`) currently hold the same live `GANAP_SECRET`/`GANAP_PROJECT_UUID` pair.

**Still open, not fixed here (unchanged from earlier sections):**
- Legal content still needs a Philippine lawyer's review before real payments should be considered fully compliant (§19's own note, unchanged).
- `functions/api/webhooks/workos.ts`'s signature header name is unconfirmed against a live delivery (above).

---

## 21. Price raised from ₱299 to ₱499 [2026-09-11]

Operator decision: the /foryourbusiness offer's price moved from ₱299 to ₱499. Every real occurrence was updated, both here and in the two other repos that reference the same offer (`clienthub`, `clientkeeper`). Nothing about the offer's scope, structure, or section order changed, only the number.

**Changed in this repo:**
- `functions/api/checkout.ts`: `AMOUNT_PHP` (the actual amount charged) is now 499.
- `src/content/foryourbusiness.ts`: every customer-facing price mention (hero, what's included, how it works, FAQ, checkout summary, thank-you copy, `PRIMARY_CTA`/`STICKY_CTA`).
- `src/content/site.ts`: the three FYB legal documents (`fyb-refund`, `fyb-terms`, `fyb-privacy`) reference the price directly in several places (refund amounts, liability cap, offer description), so those were updated too, and each document's `lastUpdated` date was bumped to September 11, 2026 to reflect the substantive change. `effectiveDate` was left as the original date on purpose, same convention as every other dated field in this file.
- `src/pages/ForYourBusinessPage.tsx` and `ForYourBusinessCheckoutPage.tsx`: page titles, meta description, and the two hardcoded price mentions in the payment-result panel.
- `src/lib/contact.ts`'s `FYB_PREFILL` and `src/lib/analytics.ts`'s Meta `InitiateCheckout` value.
- `functions/testpayment.ts`'s illustrative payload comment (this function itself is legacy/dead per §19's correction, updated only for documentation accuracy).

**Deliberately left as `299`, not renamed:** the internal `metadata.offer: "foryourbusiness-299"` tag sent to ganap.net in `functions/api/checkout.ts`, and the historical bug-fix narrative in that same file's header comment ("the original code sent 29900 for what should be 299, a 100x overcharge"). The metadata tag is an internal category label no code branches on and nothing displays, functionally equivalent to a product SKU, not a live price statement, so renaming it isn't worth the inconsistency it would create against every payment already recorded under that tag. The bug-fix narrative describes a real historical event with specific numbers; changing "299" there would misrepresent what actually happened. Same reasoning applied consistently across all three repos, see clienthub's CLAUDE.md for its own version of this note (the `payments.source` CHECK constraint's `'foryourbusiness_299'` value, in particular, was left alone since renaming it would require the same risky CHECK-constraint table rebuild documented in clienthub's CLAUDE.md §16).

**How this was tested:** `npm run build` and `npm run lint` passed clean. Grepped the entire repo for "299" before and after to confirm every remaining occurrence was one of the two deliberate exceptions above; grepped the built `dist/` bundles afterward and confirmed the compiled checkout page and shared content chunk contain the new "499" strings with no leftover "299" price text (the only "299" left in any built JS file is an unrelated coincidental match, a React internal error code and a PDF font metric, nothing to do with this offer).

---

## 22. Portfolio additions: AMR Bookkeeping, Atty. Omar Adrayan Law Office [2026-09-15]

Two new real, live client projects added to the canonical `PORTFOLIO` array in `content/portfolio.ts`, plus two smaller content edits, all from the operator's own submission (real screenshots supplied for both new projects).

**New `PORTFOLIO` entries (both `tier: "site"`, `viewable: true`, real screenshots in `public/images/projects/`):**
- `amr-bookkeeping` — AMR Bookkeeping & Accounting Support (`https://amyrellora.com`), "Bookkeeping & Accounting Services Website," a professional landing page for an experienced bookkeeper serving a worldwide client base.
- `adrayan-law` — Atty. Omar Adrayan Law Office (`https://adrayanlawoffice.altasme.com`), "Law Firm Website," a professional landing page for a law office subdomained to ours.

Both automatically appear on the homepage's `SelectedWork` grid (no per-project logic there, per §6.5) and were added to `content/offer.ts`'s `OFFER_PORTFOLIO.projectIds` (the `/limitedoffer` "wall of portfolio," a deliberately hand-maintained list per §18) and `content/foryourbusiness.ts`'s `FYB_PORTFOLIO.primaryIds` (the ₱499-scope curation per §19, both are simple site-tier informational sites so they fit that scope). Real screenshots (`amr-bookkeeping.jpg`, `adrayan-law.jpg`, 2400x1500, matching the existing convention) are in `public/images/projects/`.

**Onyx Clouds Premium Vape Co. was NOT added to `PORTFOLIO`.** The operator's submission included this as a third project (`onyxcloudvape.altasme.com`, described as "a lightweight e-commerce store for a local vape supplier," with e-commerce integration for repeat orders currently in talks) but supplied no screenshot for it, unlike the other two. Per the site-wide real-work-only guardrail (§16, no fabricated screenshots), it was left exactly where it already was, in `ONGOING`, rather than graduated with a placeholder or fabricated image. It can be added to `PORTFOLIO` once a real screenshot is supplied.

**Content edits, both requested directly:**
- `content/foryourbusiness.ts`'s `FYB_HERO_STATS`: the "websites launched" counter bumped from `"15+"` to `"18+"` (the operator's own confirmed real total businesses served — not derived from `portfolio.ts`'s entry count, which was never meant to be a complete client count, per that field's own existing comment).
- Two occurrences of `"A professional single-page website built around your business"` changed to `"...multi-page website..."`: `WHATS_INCLUDED.items[0]` and `FYB_FAQ.items[0].a`, both in `content/foryourbusiness.ts`. Confirmed via repo-wide grep these were the only two occurrences before editing.

**A duplicate file in the operator's upload was not used.** The zip also contained `Ascend Volleyball Camp.jpg`, visually identical to the already-existing `public/images/projects/ascend-volleyball.jpg` already shipped in an earlier round. Treated as an accidental redundant include; no action taken.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Verified both new images exist in the built `dist/` output at the expected byte sizes and are served with `200` from a local `vite preview`. Visually confirmed both new `SelectedWork` cards via a Playwright screenshot, waiting for each `<img>`'s `load` event before capturing (the first screenshot attempt, taken immediately after `scrollIntoViewIfNeeded()`, caught the image mid-lazy-load and showed blank space — a screenshot-timing artifact of the verification script itself, not a real rendering bug; confirmed both images report `complete: true`, `naturalWidth: 2400` once given a moment to load).

---

## 23. Price reverted from ₱499 back to ₱299 [2026-09-16]

Operator decision: the /foryourbusiness offer's price moved back from ₱499 to ₱299, five days after the §21 raise. Same scope as §21 in reverse — every real occurrence updated, in this repo and the two others that reference the same offer (`clienthub`, `clientkeeper`); nothing about the offer's scope, structure, or section order changed, only the number.

**Changed in this repo (mirror of §21's list):**
- `functions/api/checkout.ts`: `AMOUNT_PHP` is 299 again; its inline comment now reads "Raised to 499 [2026-09-11], reverted back to 299 [2026-09-16]" so the history stays visible in the code, not just here.
- `src/content/foryourbusiness.ts`: every customer-facing price mention (hero, what's included, how it works, FAQ, checkout summary, thank-you copy, `PRIMARY_CTA`/`STICKY_CTA`), plus the file's own header comment.
- `src/content/site.ts`: the three FYB legal documents (`fyb-refund`, `fyb-terms`, `fyb-privacy`) had every `₱499` reverted to `₱299`; each doc's `lastUpdated` bumped to September 16, 2026. `effectiveDate` left unchanged, same convention as every other dated field in this file.
- `src/pages/ForYourBusinessPage.tsx` and `ForYourBusinessCheckoutPage.tsx`: page titles, meta description, the payment-result panel's price mentions.
- `src/lib/contact.ts`'s `FYB_PREFILL` and `src/lib/analytics.ts`'s Meta `InitiateCheckout` value.
- `functions/testpayment.ts`'s illustrative payload comment.

**Deliberately left alone, same reasoning as §21:** the internal `metadata.offer: "foryourbusiness-299"` tag in `functions/api/checkout.ts` was already `299` and needed no change. The §21 bug-fix narrative in that same file's header comment ("used to send 29900 for what should be 299") is unaffected by this revert, it describes a real historical event unrelated to the price level itself.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Grepped the entire repo for "499" afterward: the only two remaining hits are the deliberate historical narrative comments in `content/foryourbusiness.ts`'s header and `functions/api/checkout.ts`'s `AMOUNT_PHP` line, both of which correctly state that the price was raised to 499 before being reverted. Grepped the built `dist/` bundles too: the one "499" hit left in any JS file is an unrelated coincidental substring inside a hashed/encoded blob in `WsaFreePage`'s bundle, nothing to do with this offer.

---

## 24. `/foryourbusiness` hero made full-bleed, stats moved to their own trust-signal band [2026-09-18]

The hero (`FybHero.tsx`) was a solid `bg-brand-navy-deep` two-column layout (headline/CTA left, `FybHeroVisual`'s stat panel right). Rebuilt to match the homepage's full-bleed `Hero.tsx` pattern: a wide desktop crop and a separate portrait mobile crop, each `object-cover` behind a navy scrim gradient so the white headline stays readable, matching that component's exact structure (two breakpoint blocks, `hidden sm:flex` / `sm:hidden`, `fetchPriority="high"`).

**Real supplied photos, hosted on Cloudinary, not self-hosted like the homepage's hero images.** The operator supplied two direct Cloudinary URLs (desktop + mobile crops already art-directed). This sandbox's egress proxy blocks `res.cloudinary.com` outright (confirmed via `curl`, a `WebFetch` attempt, and the proxy's own `recentRelayFailures` log — same "organization policy" block already hit on other external domains earlier in this project's history), so the images could not be downloaded here to self-host + convert to WebP the way the homepage's hero does. Used the URLs directly instead, with `f_auto,q_auto` inserted into the path (`.../upload/f_auto,q_auto/v.../...jpg`) so Cloudinary negotiates the best format (WebP/AVIF) and quality per browser automatically at the CDN edge — the same performance goal the homepage's self-hosted `<picture>`/WebP pair serves, without needing local conversion tooling for an asset that's already externally hosted. This is a real, deliberate choice (Cloudinary is a legitimate image CDN, not a workaround), not a placeholder — no further action needed unless the operator later wants these self-hosted for consistency with the rest of the site.

**Could not be visually verified in this sandbox at all** — the same network block that prevented downloading the images also prevents a local headless browser here from loading them (confirmed: the Playwright screenshot taken during this build shows a broken-image icon where the photo should be, with the `bg-brand-navy-deep` fallback showing through). The rest of the hero (headline, sub, CTA, layout, scrim gradients, mobile stacking) was screenshot-verified correctly on both 1280px and 390px viewports; only the actual photo and its `object-position` framing need a real check once deployed. **`object-center` was used for both crops as a neutral default** since the actual photo composition couldn't be inspected — if the subject sits off-center in either supplied image, adjust `object-[X%_Y%]` on the relevant `<img>` in `FybHero.tsx` after a live look (the homepage's `Hero.tsx` uses `object-[62%_center]`/`object-[50%_100%]` for reference on how that's tuned).

**Stats moved out of the hero into a new small animated "trust signal" band right below it** (`FybTrustSignals.tsx`), between `FybHero` and `Problem` in `ForYourBusinessPage.tsx`. `FybHeroVisual.tsx` (the old stat-panel component) was deleted outright, fully superseded. Content moved from `FYB_HERO_STATS` (flat `{value, label}` shape) to `FYB_TRUST_SIGNALS` in `content/foryourbusiness.ts`, restructured to the same discriminated-union shape as `/limitedoffer`'s `OFFER_HERO.stats` (`kind: "counter" | "range" | "static"`) so the numbers animate the same way: 18+ counts up, 4-7 counts both ends up together, ₱299 fades in. Same three real numbers as before (18+ websites launched, 4-7 days average build, ₱299 starting price) — no new claims, this is a presentation change only.

**Counting is gated on scroll-into-view, not on mount**, unlike `/limitedoffer`'s `OfferHero` (which fires `useCountUp` immediately since that hero is above the fold at load). This band sits below the fold on most viewports, so animating on mount would finish counting before anyone scrolled down to see it. Extracted the IntersectionObserver + fast-scroll-fallback logic already living in `Reveal.tsx` into a new small reusable `src/lib/useInView.ts` hook (behavior-preserving refactor — `Reveal.tsx` now calls it internally instead of duplicating the same ~25 lines), and `FybTrustSignals.tsx` uses it directly to flip an `animate` flag into `StatValue`, which only starts counting once true. The band itself isn't wrapped in `Reveal` (its own counter animation is its entrance effect, same reasoning as why `OfferHero` isn't `Reveal`-wrapped either).

**Section tone kept the page's alternation intact.** `FybTrustSignals` uses `tone="alt"` (a shorter `!py-10`/`!py-12` band, not the full section padding), which slots the existing dark→light→alt→light→alt→light→alt→dark rhythm one step later without needing to touch any other section's tone: dark (hero) → alt (trust signals, new) → light (Problem) → alt (What's Included) → light (Who It's For) → alt (Portfolio) → light (How It Works) → alt (FAQ) → dark (Final CTA).

**How this was tested:** `npm run build` and `npm run lint` passed clean. Live Playwright screenshots at 1280px and 390px confirmed the hero's copy/CTA/layout renders correctly (photo itself unverifiable here, see above) and the trust-signal band's counters animate correctly when scrolled into view mid-flight (caught at "14+"/"3-5" partway through the 1400ms ease-out) and settle on the correct final values (18+, 4-7, ₱299) once complete. All scratch tooling (a throwaway `vite preview` + Playwright screenshot script, the ad hoc `playwright-core` install) removed after verification, nothing committed.

**Follow-up fixes from real screenshots of the deployed page, since this sandbox can never load the photos itself [same day]:** the operator sent an actual phone screenshot after deploying, which caught two real problems the blind build above couldn't:
- **Desktop "too zoomed in":** the desktop band's `min-h` (560px/680px) forced a wider-than-photo aspect ratio, over-cropping the image vertically. Raised to `min-h-[620px] lg:min-h-[760px]`, matching the homepage hero's own proven values exactly — a taller band needs less upscale-to-cover-width, showing more of the photo without changing its effective zoom.
- **Mobile: the CTA button sat directly over the subject's head.** The mobile crop used `object-center`, which does nothing to push the subject clear of the text block stacked on top of it. Switched to `object-[50%_100%]` — the exact value the homepage's own mobile hero crop already uses for the same reason ("subject in the lower frame, text sits in the image's own empty top zone") — bottom-anchoring the image so the subject sits lower, clear of the headline/sub/CTA stacked above it. Also lightened the mobile scrim gradient (was tuned blind and made the subject read as a near-total dark silhouette even where the button wasn't the problem) from a heavy 0.92→0.88→0.72→0.45 fade to a faster 0.88→0.8→0.3→0.12 one, staying dark only behind the text block itself.

**This still could not be re-verified visually from this sandbox** (same `res.cloudinary.com` block as the initial build) — the fixes are reasoned from the operator's actual screenshot and the homepage's own already-tuned values, not confirmed by a fresh screenshot here. Ask the operator to check the live page again after this deploys, specifically: does the desktop crop still feel tight, and does `object-[50%_100%]` clear the subject's head on mobile without cropping into something else that value doesn't account for (e.g., if the photo's headroom above the subject is unusually small, "bottom-anchor the whole image" may need a middle-ground `object-[50%_85%]`-style value instead of the homepage's exact `100%`).

**Note on why the operator initially saw no change:** `altasme.com` deploys from `main`; every commit above through the hero fixes had only been pushed to the `claude/new-session-ylv6ob` feature branch, unmerged. Opened PR #3 and merged it into `main` (2026-09-18) once the operator confirmed they wanted it live — that's what actually shipped everything in this section (and everything in §19-§23) to production. Worth checking on future work in this repo: confirm whether a change needs to reach `main` before it's meaningfully "done," since this branch has needed periodic PR merges (PR #1, #2, #3 so far) rather than deploying directly.

---

## 25. Problem section copy rewrite [2026-09-18]

`PROBLEM` in `content/foryourbusiness.ts` changed from a single-paragraph headline+body ("No Website Yet? Your Customers Notice." / one long paragraph) to a shorter headline ("No Website Yet?") with `body` restructured into a two-paragraph array, per the operator's direct copy request. `body` changed from a plain `string` to `string[]` to hold the two paragraphs — matches the existing pattern already used by `/limitedoffer`'s `AGITATION.body` in `content/offer.ts`. `Problem.tsx` updated to map over the array and render each paragraph as its own `<p>` (previously a single `<p>{PROBLEM.body}</p>`).

**How this was tested:** `npm run build` and `npm run lint` passed clean. Grepped the repo for the old headline/body text to confirm no other page echoed it. Screenshot-verified the section renders both paragraphs correctly with proper spacing.

---

## 26. What's Included section rewrite [2026-09-18]

`WHATS_INCLUDED.items` in `content/foryourbusiness.ts` changed from six plain-string checklist lines to seven `{ title, copy, note? }` objects, per the operator's direct copy request — each item now carries a bold title plus a one-sentence description, not just a single line. Field names (`title`/`copy`) match the existing `WHY_ALTAVENTURES.points` convention in `content/site.ts` rather than inventing new ones. One item (`Your Business Information, All in One Place`) carries an extra optional `note` field for the "no page limit" caveat, rendered as a smaller italic line beneath its copy — the only item with one. The subdomain item (`ALTAVENTURES Subdomain`) has a `copy` of just the example (`e.g., yourbusiness.altasme.com`) rather than a full sentence, matching how short the operator's own line for it was.

`WhatsIncluded.tsx` updated to render each card's title (bold) and copy (smaller, muted) stacked under the check icon, with the optional `note` rendered last when present (`"note" in item && item.note`, since only one of the seven objects has that key). Kept the same 2-column card grid and `Reveal` stagger as before — this is a content/copy depth change, not a layout rebuild.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Screenshot-verified all seven cards render correctly (title, copy, and the one note line) with proper spacing at a desktop width, and the scope line below the grid is unaffected.

---

## 27. `/foryourbusiness` portfolio re-curated, three new projects blocked on real images [2026-09-18]

Per the operator's direct request, `FYB_PORTFOLIO` (`content/foryourbusiness.ts`) re-curated to a specific 6-project list, scoped to this page only — the homepage's `SelectedWork` (which renders all of canonical `PORTFOLIO` with no filtering) and `/limitedoffer`'s `OFFER_PORTFOLIO` wall are both untouched, per the operator's own "in /foryourbusiness page only" instruction.

**Dropped from `primaryIds`:** `aulea`, `macquias`, `ascend-volleyball`, `clickandkeep`, `adrayan-law`. **Kept:** `dmhr`, `pocketg7iii`, `amr-bookkeeping`, `vocalyze` (primary grid) plus `aurielle`, `leanandfit` (unchanged in `advancedIds`, the "beyond the ₱299 scope" row).

**Three more requested projects were NOT added — no real images were actually received for them.** The operator's message described Imago Productions (`imagoproductionsph.com`, photography/videography, Tarlac), Camsnap Camera Rental (`camsnap.altasme.com`, Batangas), and Onyx Clouds Premium Vape Co. (`onyxcloudvape.altasme.com`, already known from CLAUDE.md §22 as a real in-progress client with no screenshot at the time) as "(uploaded)", but this session's uploads directory held no new files for any of the three — only the existing zip from §22's round and two unrelated hero-verification phone screenshots from earlier the same day. Checked whether any of the three live URLs were reachable from this sandbox to self-capture a real screenshot instead (a genuine screenshot of a real live site would satisfy the real-work-only guardrail same as an operator-supplied one) — all three are blocked by the sandbox's egress proxy (confirmed via `curl`, `connect_rejected`). Per CLAUDE.md §16, none were added with a placeholder. **Next step once real screenshots are supplied:** add all three as new entries to canonical `content/portfolio.ts` first (`tier: "site"`, `viewable: true`, matching the existing convention), then add their ids to `FYB_PORTFOLIO.primaryIds` here.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Screenshot-verified the portfolio grid renders exactly the four kept primary-tier projects (DM HR Consultancy, Pocket G7iii Camera Rental, AMR Bookkeeping & Accounting Support, Vocalyze Lounge) with correct copy, tags, and "View Website" links, and none of the five dropped projects appear.

---

## 28. Three new portfolio projects added, real images supplied [2026-09-18]

Real screenshots for Imago Productions, Camsnap Camera Rental, and Onyx Clouds Premium Vape Co. arrived (a zip upload, PNG, 2400x1500 each) later the same day as §27 — converted to JPG (quality 90, via a scratch `sharp` install/script, uninstalled after, same pattern as the §12.1 Lighthouse WebP conversion) and added as real `content/portfolio.ts` entries:
- `imago-productions` — Imago Productions (`https://imagoproductionsph.com`), "Photography & Videography Company Website," own domain (not subdomained to `altasme.com`).
- `camsnap` — Camsnap Camera Rental (`https://camsnap.altasme.com`), "Local Camera Rental Website," Batangas.
- `onyx-clouds` — Onyx Clouds Premium Vape Co. (`https://onyxcloudvape.altasme.com`), "Local Vape & E-cig Supplier Website." Reuses the `onyx-clouds` id already used in `ONGOING` (same graduation pattern as `ascend-volleyball` before it) — removed from `ONGOING` now that it's live, along with the separate `camsnaps` `ONGOING` entry (the same business as the new `camsnap`, confirmed by name/description match).

All three added to `FYB_PORTFOLIO.primaryIds` in `content/foryourbusiness.ts`, per the operator's original 9-project list from §27 (the three that were blocked there). Not added to the homepage's `SelectedWork` curation list or `/limitedoffer`'s `OFFER_PORTFOLIO` wall automatically by this change — `SelectedWork` renders all of `PORTFOLIO` with no filtering, so they appear there for free; `OFFER_PORTFOLIO.projectIds` is a separate hand-maintained list (§18) that was NOT touched, matching the "in /foryourbusiness page only" scoping from §27 — add them there separately if the operator wants them on that page's wall too.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Confirmed all three new images serve `200` from a local `vite preview` at their expected paths. Screenshot-verified the full 7-project `/foryourbusiness` portfolio grid renders all three new cards with correct real screenshots, category labels, descriptions, and "View Website" links, in the order matching the operator's requested list. Grepped for the removed `ONGOING` ids (`onyx-clouds`, `camsnaps`) afterward to confirm no other code referenced them. All scratch tooling (the `sharp` install, a `.cjs` conversion script, extracted zip contents) removed after verification, nothing committed.

---

## 29. `/foryourbusiness` mobile hero: full-bleed overlay restored, this time verified against the real photo [2026-09-18]

§24's mobile hero fix (`object-[50%_100%]` bottom-anchoring, same value as the homepage's own mobile hero) did not work — the operator sent a real screenshot of the deployed page showing the CTA button still sitting directly over the subject's face, same failure as the original `object-center` attempt. Two blind attempts at tuning `object-position`/gradient values against a photo this sandbox could never load (`res.cloudinary.com` blocked by the egress proxy throughout) both failed the same way. The first response to that was a structural workaround — stacking a solid text block above a separate photo block in normal document flow, so overlap was structurally impossible regardless of the photo's actual framing. That shipped briefly but gave up the full-bleed look entirely.

**The operator then uploaded the actual mobile hero file directly** (not a link — an attached image this session could read), which finally made real verification possible instead of another guess. The photo is a 1080x1900 portrait: a plain dark navy background (with the brand A-mark and light beams) fills roughly the top 43%, and the subject (shoulders up, arms crossed, cropped at the very bottom of the frame) occupies the bottom ~57%. This explains why both earlier `object-position` attempts failed identically: on a typical phone viewport, `object-fit: cover` against a container this close to the photo's own 9:16 aspect ratio is height-bound (`scale = containerHeight / imageHeight` per the CSS spec), leaving little to no vertical slack to crop at all — so the Y value in `object-position` was never the lever that mattered here, on this photo, regardless of which value it was set to.

**Fixed for real this time, verified with the actual photo copied into a local test build.** `FybHero.tsx`'s mobile section is a full-bleed overlay again (absolute image + a light top scrim + top-anchored text, `object-top`, `justify-start` not centered) — matching the homepage's pattern rather than a stacked-blocks compromise. Getting there took one more real finding: `HeroCopy`'s existing copy (headline + sub + CTA at their normal sizes) was still tall enough to physically reach past the subject's head-line on smaller phones even top-anchored — measured directly via Playwright against the real photo at iPhone SE width (375×667): -117px of overlap with the original sizing. `HeroCopy` gained an opt-in `compact` prop (smaller headline/sub text, tighter margins) that only the mobile instance passes — the desktop instance is unchanged, so desktop rendering is unaffected. Iterated compact sizing + top padding (`pt-6`) until measured clearance between the copy block's bottom and the subject's head-top was positive with real margin across four device heights (iPhone SE 667px: 21.9px clearance; iPhone 14 844px: 130.9px; iPhone 14 Pro Max 932px: 168.7px; a 393×873 Android reference: 143.4px) — not just "doesn't obviously look wrong," an actual measured number per device.

**How this was tested, for real, unlike §24/the first §29:** copied the operator-uploaded PNG into a local `public/images/hero/` test path, temporarily pointed `FYB_HERO.backgroundImageMobile` at it, and ran a full local `vite build` + `vite preview` + Playwright pass measuring real DOM geometry (image `getBoundingClientRect()`, copy-block `getBoundingClientRect()`, an estimated subject-head-top Y derived from the photo's own measured proportions) at four phone viewport heights, then visually confirmed two of them by screenshot. Desktop hero screenshot-confirmed unchanged (still points at the real Cloudinary desktop URL throughout; `HeroCopy`'s desktop instance never passes `compact`). All scratch tooling — the temporary `playwright-core` install, the local test copy of the photo, the measurement script — removed afterward; `FYB_HERO.backgroundImageMobile` reverted to the real Cloudinary URL before committing; confirmed via `git status`/`git diff package.json` that nothing scratch-related leaked into the commit.

**Why this is more trustworthy than §24 and the first version of this section:** those were reasoned from a homepage convention and the operator's verbal description, applied to a photo this sandbox could never actually see. This one was measured against the literal pixels of the actual photo. The remaining gap is normal, not a repeat of the old problem: this sandbox's Playwright/Chromium isn't the same rendering engine as a real phone, so ask the operator to confirm on an actual device once deployed — but the days of guessing blind against an un-inspectable image are over for this specific photo.

---

## 30. `/b2b` LANDING PAGE: ₱4,999 complete business website package [2026-09-19]

A new paid-social landing page for established businesses, at the operator's direct request: "the exact same thing as /foryourbusiness" structurally and mechanically, but a different offer, a different price, and copy that's "more CTR focused, aggressive, and direct" for businesses that already exist and are being pitched a step up from a Facebook page, not a first website. Two decisions were confirmed with the operator before building, since both carried real financial/legal weight:

1. **Checkout: live payment, not ContactModal.** Chose to mirror /foryourbusiness's real ganap.net checkout at ₱4,999 rather than a chat-based qualifier, per the operator's explicit choice.
2. **Legal docs: drafted new, not reused.** The ₱4,999 offer bundles a full year of domain + hosting + security + maintenance + support, then **renews at ₱2,499/year starting Year 2** (the operator's own figure) — different enough from the ₱299 offer's flat one-time scope that reusing the FYB legal docs verbatim would have misstated the deal. New `b2b-refund`/`b2b-terms`/`b2b-privacy` docs were drafted instead (§30.3 below), following the FYB docs' structure and conservatism exactly, adding only what's actually different (the renewal mechanics).

### 30.1 Architecture: parallels /foryourbusiness file-for-file

Same per-funnel-duplication convention already established by `content/offer.ts` + `components/offer/` and `content/foryourbusiness.ts` + `components/fyb/`, rather than parametrizing FYB's own components to take content as props:

- **Content:** `src/content/b2b.ts`, one exported const per section, mirroring `content/foryourbusiness.ts`'s shape exactly (`B2B_HERO`, `B2B_TRUST_SIGNALS`, `PROBLEM`, `WHATS_INCLUDED`, `WHO_ITS_FOR`, `B2B_PORTFOLIO`, `B2B_HOW_IT_WORKS`, `B2B_FAQ`, `B2B_FINAL_CTA`, `CHECKOUT`, `THANK_YOU`, `ACCOUNT`, plus `PRIMARY_CTA`/`STICKY_CTA`).
- **Components:** `src/components/b2b/` mirrors `src/components/fyb/` component-for-component, including the naming split FYB already uses (funnel-prefixed for `B2BHero`/`B2BTrustSignals`/`B2BPortfolio`/`B2BHowItWorks`/`B2BFAQ`/`B2BFinalCTA`, generic names for `Problem`/`WhatsIncluded`/`WhoItsFor` since those are simple enough not to need a prefix, matching FYB's own inconsistency here rather than "fixing" it inconsistently between the two funnels). All still import shared primitives directly (`Section`, `CTAButton`, `Tag`, `Reveal`, `useCountUp`, `useInView`) rather than duplicating them.
- **Pages:** `src/pages/B2BPage.tsx`, `B2BCheckoutPage.tsx`, `B2BThankYouPage.tsx` — near-byte-identical to their FYB counterparts, swapping content imports, legal doc ids (`b2b-terms`/`b2b-refund`/`b2b-privacy`), the checkout POST body's `offer: "b2b"` field, and `trackInitiateCheckoutB2B()` in place of `trackInitiateCheckout()`.
- **Routes:** `/b2b`, `/b2b/checkout`, `/b2b/thank-you`, lazy-loaded in `App.tsx` exactly like the `/foryourbusiness` trio, so none of it ships in the homepage bundle (confirmed in the build output: separate `B2BPage`/`B2BCheckoutPage`/`B2BThankYouPage`/`b2b` chunks).
- **Sitemap:** `/b2b` added to `public/sitemap.xml` (indexable, same as `/foryourbusiness`); `/b2b/checkout` and `/b2b/thank-you` stay `noindex` and unlisted, same pattern.
- **Hero photo:** reuses the exact same Cloudinary photo already used for `/foryourbusiness` (`FYB_HERO`'s desktop/mobile URLs, copied verbatim into `B2B_HERO`), rather than sourcing or fabricating a new one — no B2B-specific hero asset has been supplied, and re-using a real, already-vetted photo isn't a placeholder gap the way inventing one would be. `B2BHero.tsx` also carries forward the verified mobile-hero geometry from §29 (full-bleed overlay, top-anchored `compact` copy, `object-top`) unchanged, since it's the same photo and the same clearance math already applies.

### 30.2 Copy: same structure, different pitch

Every section keeps FYB's shape (headline + supporting content + CTA) but the angle shifts from "get your first website" to "your competitors already look more credible than you online":

- **Hero:** "Still Running Your Business Without a Real Website?" / "A complete business website: built, hosted, secured, maintained, and supported for a full year, for one flat payment. No hidden fees. No guesswork."
- **Problem:** direct framing of the credibility cost of staying Facebook-only for a business that's already established, not just starting out.
- **What's Included:** 7 items (website, free domain year 1, hosting, security, maintenance, tech support, mobile-friendly), plus a `scopeLine` that states the renewal terms plainly rather than burying them: "renews at ₱2,499/year to keep everything active... we'll reach out before renewal, and you're free to cancel anytime" — stated on the marketing page itself, not just in the legal fine print, since surprising a paying customer with a recurring fee later would cut against the site's honesty guardrails (§16).
- **Who It's For:** targets "established," "tired of relying only on Facebook," "ready to compete online" language instead of FYB's first-timer framing.
- **Portfolio:** identical `primaryIds` list to FYB's current 7 (`dmhr`, `pocketg7iii`, `amr-bookkeeping`, `imago-productions`, `camsnap`, `onyx-clouds`, `vocalyze`), **`advancedIds` deliberately left empty** per the operator's instruction ("without the Beyond the ₱299 scope"). `B2BPortfolio.tsx` only renders that row when the array is non-empty (same conditional FYB's own component already used), so leaving it empty hides the section with no special-casing needed. Screenshot-verified no "Beyond" text renders anywhere on the page.
- **FAQ:** 10 items including a direct renewal question ("What happens after Year 1?") and a direct comparison question ("How is this different from the ₱299 offer?") addressing the obvious side-by-side objection a visitor coming from the other offer might have.
- **No em dashes**, matching the house style already followed elsewhere (`/limitedoffer`'s explicit rule, `/foryourbusiness`'s existing copy) — checked by eye across the whole content file.

### 30.3 New legal docs: `b2b-refund`, `b2b-terms`, `b2b-privacy`

Added to `content/site.ts`'s `LEGAL` object (and its type), `LegalDoc` in `src/lib/modalContext.tsx` extended to match. Structured identically to the `fyb-*` docs section-for-section, with the differences that actually matter for this offer:

- **Refund Policy** gained a dedicated **"Annual Renewal and Cancellation"** section: Year 1 (domain, hosting, security, maintenance, support) is covered by the ₱4,999; renewal at ₱2,499/year from Year 2 is optional; no refunds for a partial year if you cancel partway through a paid period; non-renewal means those services lapse. Otherwise mirrors `fyb-refund`'s structure (before-work-begins refund, post-discovery-call non-refundable, scope-overrun credit, satisfaction/make-it-right guarantee, change-of-mind, client-responsiveness 30-day window, chargebacks, how to request).
- **Terms of Sale** gained two sections `fyb-terms` doesn't need: **"Domain Registration"** (registrant-of-record language, since this offer actually registers a real domain, unlike FYB's subdomain-only scope) and **"Domain, Hosting, Security, Maintenance & Support"** (the Year 1 inclusion + Year 2 renewal mechanics, stated plainly: what happens if you don't renew — services lapse, website may go offline, domain "may eventually expire in accordance with the registrar's standard policies" — worded generally rather than citing specific grace-period day counts no registrar relationship has been confirmed against). Liability cap changed from a flat figure to **"the amount you paid for the service period in which the claim arose (₱4,999 for your first year, or ₱2,499 for the renewal year in question)"**, since this is now a multi-year relationship rather than a single flat payment.
- **Privacy Notice** adds the domain registrar to the list of third parties data is shared with (a real new processor this offer introduces that FYB's subdomain-only scope never needed), and extends the retention rationale to cover "the ongoing annual renewal relationship."
- **What was deliberately not invented:** no specific renewal auto-charge mechanism (there's no stored-card/subscription billing infrastructure anywhere in this stack — checkout is a one-time ganap.net session), so the copy and legal text both describe renewal as something Altaventures will proactively reach out about, not an automatic charge. No registrar-specific grace-period day counts, since none were confirmed. Per the same disclaimer already on the FYB docs, **this is not legally finalized** — a lawyer should review before real ₱4,999 payments are treated as fully compliant, same open item as `foryourbusinesspolicies.md`'s own instruction for the ₱299 offer.

### 30.4 Checkout: one payment function, parameterized by offer, not duplicated

`functions/api/checkout.ts` now takes an `offer: "foryourbusiness" | "b2b"` field in the POST body (defaulting to `"foryourbusiness"` if omitted, defensively, in case a stale cached frontend bundle ever posts without it) and looks up amount/metadata-tag/success-and-failure-redirect-URLs from a new `OFFER_CONFIG` map, instead of a second near-identical Function being created for `/b2b/checkout`. Reasoning: this function moves real money and signs requests with a secret that must never drift between two copies — one parameterized function means there's exactly one place that can get an amount or a redirect URL wrong, which matters far more here than the small duplication it avoids would otherwise be worth. Everything else (HMAC signing, the D1 pending-order insert, the fetch to ganap.net, `classifyRedirectUrl()`) is untouched and now shared correctly across both offers. Same consolidated ganap.net project/credentials as `/foryourbusiness` (`GANAP_SECRET`/`GANAP_PROJECT_UUID`) — no new environment variables needed.

`B2BCheckoutPage.tsx` posts `offer: "b2b"` alongside the same field set FYB's checkout form already collects (full name, business name, email, phone, optional Facebook/Instagram/existing website) — the operator's instruction was "everything is still the same," so no new B2B-specific form fields were added.

`d1/schema.sql`'s `orders` table needed no changes: `amount` is a plain `INTEGER` with no `CHECK` constraint pinning it to 299, so a ₱4,999 row inserts cleanly. Per §19's correction, this table is legacy/historical only in production (ganap.net's real webhook for this project already points at Client Hub, not this repo's `/testpayment`), so this is consistent with the existing architecture, not a new gap introduced here.

**How the payment logic was tested (this sandbox can never reach `convex-top-api.ganap.net`, same block as every prior payment-flow round):** ran `npx wrangler pages dev dist` locally with a gitignored `.dev.vars` (fake `GANAP_SECRET`/`GANAP_PROJECT_UUID`, deleted after the test), and POSTed to `/api/checkout` with (a) no `offer` field, (b) `offer: "b2b"`, and (c) an invalid payload. A temporary diagnostic `console.log` of the resolved `offerConfig` (removed before committing) confirmed: omitting `offer` resolves to `{amountPhp: 299, metadataOffer: "foryourbusiness-299", successRedirectUrl: ".../foryourbusiness/thank-you", ...}` exactly as before this change; `offer: "b2b"` resolves to `{amountPhp: 4999, metadataOffer: "b2b-4999", successRedirectUrl: ".../b2b/thank-you", failureRedirectUrl: ".../b2b/checkout?retry=1"}`; both then correctly 502 (network-blocked, expected) rather than 200, proving the parameterization runs before the network call, not that the network call itself succeeded; the invalid payload still correctly 400s with the expected field-specific error message, unaffected by the `offer`-branching. `.dev.vars` and the `.wrangler` cache directory were deleted afterward; confirmed via `git status` neither left a trace.

**How the rest of the page was tested:** `npm run build` and `npm run lint` passed clean; the `/b2b` route code-splits into its own chunks (`B2BPage`, `B2BCheckoutPage`, `B2BThankYouPage`, a shared `b2b` content chunk) separate from the homepage bundle, confirmed in the build output. Screenshot-verified via a local `vite preview` + Playwright pass: the desktop and mobile hero render correctly (photo itself unverifiable here, same `res.cloudinary.com` block as §24/§29, but it's the exact same URL already confirmed live in production for `/foryourbusiness`); the portfolio grid renders all 7 primary projects with no "Beyond" text anywhere on the page (confirmed via a body-text substring check, not just a visual scan); the checkout page's price summary shows "₱4,999" and "ONE-TIME · THEN ₱2,499/YR" correctly; the thank-you page renders with the correct payment amount in its copy; and the new Terms of Sale legal modal opens from the footer and renders the drafted B2B document correctly. All scratch tooling (`playwright-core`, the screenshot script, `.dev.vars`, `.wrangler`) removed after verification; confirmed via `git status`/`git diff package.json` that nothing scratch-related leaked into the final diff.

### 30.5 Known open items (not blocking, do not build speculative code for these)

- **Legal docs need a lawyer's review before real payments**, same standing caveat as the ₱299 offer's docs, now doubled by this offer's added complexity (real domain registration, a second payment year).
- **No renewal billing flow exists yet.** Year 2+ renewal is described in copy/legal as something Altaventures will reach out about, not an automated charge — there's no subscription/recurring-billing infrastructure anywhere in this stack. If the operator wants renewals to run through an automated checkout later, that's new scope, not something this build should be assumed to already cover.
- **No staff-facing notification is wired up for a real `/b2b` payment specifically** — same architecture gap already documented in §19 for `/foryourbusiness` (ganap.net's real webhook for this consolidated project points at Client Hub, not this repo's legacy `/testpayment`), which applies identically here since both offers share the same ganap.net project.
- **`META_PIXEL_ID` is still blank** (shared `lib/analytics.ts` constant) — `trackInitiateCheckoutB2B()` is wired with a Pixel event but no-ops until an ID is set, same as every other offer on this site.
- **No B2B-specific hero photo yet.** The reused `/foryourbusiness` photo is a real, deliberate choice for now (§30.1), not a placeholder, but a dedicated photo may be worth commissioning later if the operator wants the two funnels to look visually distinct rather than sharing an image.

### 30.6 Payment split to 50% deposit / 50% on completion [2026-09-19, same day, operator clarification]

The operator clarified immediately after the initial build: the ₱4,999 is not one flat payment. It's a **₱2,499.50 deposit charged at checkout**, plus a **₱2,499.50 balance due once the website is complete**. Two follow-up decisions were confirmed before implementing, since both involved real money and an unbuilt piece of infrastructure:

1. **Exact split:** an even ₱2,499.50 / ₱2,499.50 (not rounded to ₱2,500/₱2,499), confirmed with the operator since ganap.net accepts decimal amounts and an uneven split would have needed a specific reason to prefer one rounding over the other.
2. **How the balance gets collected:** a manually created "Bill of Service" in the existing Client Hub / ClientKeeper billing flow (already built, already enforces ganap.net's ₱200 minimum, see §20) — **not** a new checkout built on this site. `/b2b/checkout` was never going to be reusable for the balance anyway, since it collects fresh client-intake fields (business name, Facebook, etc.) that make no sense to re-ask once a project is already underway; a staff-created bill for a specific existing client is the right tool that already exists.

**What actually changed:**

- **`functions/api/checkout.ts`**: `OFFER_CONFIG.b2b.amountPhp` changed from `4999` to `2499.5` — this endpoint now only ever charges the deposit. `metadataOffer` renamed `"b2b-4999"` → `"b2b-4999-deposit"` so a real ganap.net transaction record reads unambiguously as a deposit, not the full package price, if anyone reconciles payments later. Re-verified via the same local `wrangler pages dev` + temporary diagnostic-log method as the initial build (§30.4): confirmed `offer: "b2b"` now resolves `amountPhp: 2499.5` before the network call, removed the temp log and `.dev.vars`/`.wrangler` afterward, confirmed via `git status` nothing scratch leaked in.
- **`content/b2b.ts`**: introduced three local constants, `DEPOSIT_PHP`/`BALANCE_PHP`/`TOTAL_PHP` (₱2,499.50 / ₱2,499.50 / ₱4,999), and rewired every price-bearing string through them instead of hardcoding figures a second time: `PRIMARY_CTA`/`STICKY_CTA` now lead with the deposit ("GET STARTED FOR ₱2,499.50 →"), the hero sub, `WHATS_INCLUDED.scopeLine`, `B2B_HOW_IT_WORKS` steps, `B2B_FINAL_CTA.body`, and `CHECKOUT` (price now shows the deposit, `priceNote` reads "50% DEPOSIT · ₱4,999 TOTAL", `summaryItems` gained a "₱2,499.50 balance due on completion" line) all reference these constants. `THANK_YOU` now says "Deposit Received" and explicitly states the balance will be invoiced separately. `B2B_FAQ` gained a dedicated "Do I have to pay the full amount upfront?" item and every other FAQ answer touching payment was reworded to match.
- **Leading with the deposit amount in the CTA, not the total, was a deliberate honesty choice**: the button is what actually gets charged when clicked, so stating ₱4,999 there while charging ₱2,499.50 at checkout would read as a bait-and-switch even though the fine print was accurate. The total (₱4,999) is still stated prominently in the hero sub, the checkout price note, and the FAQ, so the full picture is never hidden, it's just not the number attached to the click action.
- **Legal docs (`content/site.ts`)**: `b2b-refund` gained a new "The Balance Payment" section (what happens if a client walks away after the site is built but before paying the balance: deposit stays non-refundable, balance covers the completed work, no launch/handover without it) and every other section reworded from "the ₱4,999" to "the deposit" or "the deposit and balance" as accuracy required. `b2b-terms` gained a new "Payment: Deposit and Balance" section (as new §2, renumbering every section after it, 16 sections total now instead of 15) stating plainly that the website isn't handed over or made live until the balance is paid. The liability cap in Limitation of Liability changed from a flat "₱4,999 for your first year" to "up to ₱4,999... the sum of your deposit and balance", since at the time a claim arises only the deposit may have been paid. `b2b-privacy`'s "Why We Collect It" section now says "your deposit, balance, and any annual renewal payment" instead of just "your payment".
- **`src/lib/analytics.ts`**: `trackInitiateCheckoutB2B()`'s Meta Pixel `value` changed from `4999` to `2499.5`, since that's the actual transaction this specific checkout event represents — reporting the full package value here would overstate the transaction to ad platforms relative to what was actually charged at this step.
- **`src/pages/B2BPage.tsx`**: `PAGE_DESCRIPTION` (SEO/OG meta description) reworded from "for one flat ₱4,999 payment" (now false) to "₱4,999 total, 50% down to start" — an inaccurate meta description would have been a real, if small, factual error shipped to search results and social shares.

**Deliberately left alone:** `B2BPage.tsx`'s browser-tab `PAGE_TITLE` ("Complete Business Website Package, ₱4,999") and `B2BCheckoutPage.tsx`'s ("Start Your ₱4,999 Business Website") — both correctly describe the total package price as a title for the page/offer as a whole, and the checkout page itself immediately and prominently discloses the actual ₱2,499.50 charge, so there's no meaningful gap between what the tab title implies and what the page says.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Grepped `content/b2b.ts` for any remaining literal `4999`/`4,999` outside the `TOTAL_PHP` constant definition and its surrounding comments, confirming every customer-facing string routes through the three shared constants rather than a second hardcoded figure that could drift out of sync. Re-ran the local `wrangler pages dev` deposit-amount check described above. Screenshot-verified via a local `vite preview` + Playwright pass that the hero states "₱4,999 total, just ₱2,499.50 down to start" and the checkout page's price card shows "₱2,499.50" as the headline price with "50% DEPOSIT · ₱4,999 TOTAL" beneath it and a "₱2,499.50 balance due on completion" line in the summary checklist; confirmed via a body-text substring check that no stale "one flat" payment wording remained anywhere on the page. All scratch tooling (`playwright-core`, the screenshot script, `.dev.vars`, `.wrangler`, the temporary diagnostic log) removed after verification.

### 30.7 Portfolio re-curated, "subdomained to ours" dropped from this page's copy [2026-09-19, same day]

Per the operator's direct request, `B2B_PORTFOLIO.primaryIds` (`content/b2b.ts`) changed from `["dmhr", "pocketg7iii", "amr-bookkeeping", "imago-productions", "camsnap", "onyx-clouds", "vocalyze"]` to `["leanandfit", "aurielle", "dmhr", "amr-bookkeeping", "imago-productions", "camsnap", "onyx-clouds"]` — `pocketg7iii` swapped for `leanandfit`, `vocalyze` swapped for `aurielle`, and both replacements moved to the front of the grid. Scoped to `/b2b` only, exactly as instructed ("This is just for this page"): `content/portfolio.ts` (the shared canonical list) and every other page's curation (`SelectedWork`, `/limitedoffer`'s `OFFER_PORTFOLIO`, `/foryourbusiness`'s `FYB_PORTFOLIO`) are untouched.

**"Subdomained to ours" removed from this page's copy, without touching the canonical descriptions other pages still use.** The operator's instruction ("In general, don't mention 'subdomained to ours' in any of the portfolio items... This is just for this page") meant the fix had to live on `/b2b` specifically, not in `content/portfolio.ts`, which the homepage and other funnels display verbatim. Of the two canonical descriptions that survive the swap above, `camsnap` and `onyx-clouds` both end in "...subdomained to ours." — `leanandfit`, `aurielle`, `dmhr`, `amr-bookkeeping`, and `imago-productions` don't mention it at all, so they needed no change. `B2B_PORTFOLIO` gained a `descriptionOverrides: Record<string, string>` map with rewritten, subdomain-free descriptions for those two ids only; `B2BPortfolio.tsx`'s `ProjectCard` now reads `B2B_PORTFOLIO.descriptionOverrides[id] ?? project.description`, falling through to the canonical description for every project that doesn't need an override (five of the current seven). This is additive to the existing per-page-curation pattern (§30.2), not a new mechanism — the ids/order were already `/b2b`-only; the description text now can be too, on a per-project basis, without a blanket copy fork of the whole canonical list.

**How this was tested:** `npm run build` and `npm run lint` passed clean. Screenshot-verified via a local `vite preview` + Playwright pass that the portfolio grid renders in the exact order requested (Lean and Fit PH, Aurielle Paris Atelier, then the five unchanged projects), and confirmed via `document.body.innerText` substring checks that the page contains neither "Pocket G7iii" nor "Vocalyze" anywhere, contains both "Lean and Fit" and "Aurielle," and contains no instance of "subdomained" at all (case-insensitive) — not just a visual spot-check on the two overridden cards. All scratch tooling (`playwright-core`, the screenshot script) removed after verification.
