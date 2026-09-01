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
- `SelectedWork.tsx` renders all 10 real projects (Altamotors, Aurielle Paris Atelier, Lean and Fit PH, DM HR Consultancy, Vocalyze Lounge, Aulea Skin Essentials, Setmona Booking Engine, Kolekta Billing Engine, Pocket G7iii Camera Rental, Macquia's Camera Rental). Each card: screenshot (only for `viewable` projects — engines render no image), name, category, description, a tier badge (`TIER_LABEL`, suppressed if the project's own `tags` already contains that label, to avoid a duplicate pill) plus `tags`.
- **View Website vs. View Details is data-driven, not per-project logic:** `viewable && url` renders an external `<a href={url} target="_blank">` ("View Website"); otherwise a button opens `CaseStudyModal` ("View Details"). Only the two engine-tier projects (Setmona, Kolekta) are non-viewable and use the modal — everything else links straight out to the live site.
- Below the grid, a "Currently in the studio" line lists `ONGOING` (Ollocal.PH, Amani Massage and Wellness Spa, ARGO Customs Brokerage, Ascend Volleyball Academy, ONYX CLOUDS PREMIUM VAPE CO., Camsnaps Camera Rental, FirstHand Travel and Tours) — real in-progress client work, referenced as social proof only, explicitly marked "(in progress)" and never presented as completed. Macquia's Camera Rental and Pocket G7iii Camera Rental graduated out of this list into `PORTFOLIO` once their sites launched.
- All 10 projects now ship real client-supplied images in `public/images/projects/` (no placeholders remain). Setmona and Kolekta use branded logo cards rather than dashboard screenshots, since both are internal engines with no public URL to screenshot; the other eight are real live-site screenshots.

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
- Open Graph + Twitter card meta; OG image in `public/og/`.
- `LocalBusiness` / `Organization` JSON-LD structured data with brand name, area served (Philippines), and contact channels.
- Semantic headings (one `<h1>` in Hero; section `<h2>`s).
- Prerendered static HTML (Vite build) so content is crawlable without JS execution where possible; if hydration hides content, ensure critical copy is in the initial HTML.

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

---

## 13. LEGAL (open item #6, RESOLVED)

- Privacy Policy and Terms of Service are real client-supplied legal text, rendered in LegalModal from structured section/block data in `content/site.ts` (`LEGAL`).

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
- [x] SEO meta + JSON-LD + OG image present.
- [x] Real assets in place: logo, favicon, OG image, hero photography, four project screenshots, About copy, legal text. Placeholders remain only for analytics IDs.
- [x] Brand palette (§11.1), logo, and tagline applied.
- [x] No backend, no form, no Website Care mention anywhere public.
- [ ] Lighthouse: performance/accessibility/SEO in good range on mobile.
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

**Document content:** `src/content/wsa.ts` holds the full agreement text (`WSA_DOCUMENT`, currently Version 4.0), using its own `WsaBlock`/`WsaSection` types (`p`/`sh`/`ul`/`table`) rather than sharing `LegalBlock` from `content/site.ts`, since the agreement needs pricing tables the Privacy/Terms content doesn't. The page renders it as normal readable HTML (not an embedded PDF viewer) in natural page scroll, so it works smoothly on any device without a nested scroll container.

**The signable PDF is generated, not hand-authored.** `public/documents/free-website-service-agreement.pdf` is produced by `scripts/generate-wsa-pdf.ts` directly from `WSA_DOCUMENT`, so the on-page text and the actual signed document can never drift out of sync. The generator lays out the full 38-section text with Altaventures branding (logo header on every page, navy headings, blue bullets, pricing tables), draws the "1. Client Information" fields near the top and a "Signatures" execution block (Client + Altaventures) at the end, and embeds the real Van Amaranto signature (`public/images/brand/alta-signature.png`, extracted once from the original client-supplied contract's embedded SMask+DCTDecode image pair — it is not a Form/Image XObject reachable via the page's own resources, so a plain "find the XObject" approach won't locate it if this ever needs re-deriving). Run it with `npx tsx scripts/generate-wsa-pdf.ts` after editing `WSA_DOCUMENT`; it prints the resulting `WSA_PDF_FIELD_COORDS` / `WSA_SIGNATURE_BOX` values to paste back into `wsa.ts`. **Always run `npm run build` afterward** — `vite preview` and the deployed site serve the PDF from `dist/`, not `public/`, so a regenerated template with no rebuild silently keeps serving the old one.

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
- `src/components/offer/SectionDivider.tsx` is a small angled band cut from `bg-brand-gradient` (no blur) dropped around the `Scarcity` block for rhythm — this is the "section divider" use of the brand gradient CLAUDE.md §11.1 already names as sanctioned, distinct from the banned decorative-glow use.

What still makes this route distinct from the homepage is copy, structure, and this extra visual energy — not a separate component system; the underlying primitives are still the shared, homepage-tested ones.

**No exits, anywhere [v3 hard requirement].** Unlike v2, this page has **zero outbound links away from the funnel**: no "Explore Altaventures" link, no "Digital Growth Plans" link out to the homepage. The header is logo + a qualifier-opening CTA button only (hidden on mobile — `hidden ... sm:inline-flex` — since the sticky mobile CTA already covers that viewport and the full label overflowed a 390px header). The footer has no nav links either, just the logo, tagline, a one-line privacy note, and a copyright line. Every single CTA on the page, including the one inside `GrowthVision` (the "Phase 2" section, replacing v2's `PhaseProgression.tsx`), opens the qualifier via `onOpenQualifier()` — none of them navigate anywhere.

**Section order (13 sections, `LimitedOfferPage.tsx`):** Header → `OfferHero` → `Agitation` → `WhatYouGet` → `OfferPortfolio` (renamed from v2's portfolio component) → `TheOfferPlainly` → `WhyFree` (replaces v2's `OfferWhyAltaventures.tsx`) → `OfferHowItWorks` → `WhoItsFor` → `Scarcity` (new) → `GrowthVision` (replaces v2's `PhaseProgression.tsx`) → `OfferFAQ` → `OfferFinalCTA` → Footer → `StickyMobileOfferCTA`.

**Content:** `src/content/offer.ts` is the single source of truth — one exported const per section (`OFFER_HERO`, `AGITATION`, `WHAT_YOU_GET`, `OFFER_PORTFOLIO`, `THE_OFFER_PLAINLY`, `WHY_FREE`, `OFFER_HOW_IT_WORKS`, `WHO_ITS_FOR`, `SCARCITY`, `GROWTH_VISION`, `OFFER_FAQ`, `OFFER_FINAL_CTA`, `QUALIFIER`), plus a shared `PRIMARY_CTA = "CLAIM MY FREE WEBSITE →"` constant every section's CTA button uses (renamed from v2's "GET MY FREE WEBSITE →"). It imports `PORTFOLIO_BY_ID` / `PORTFOLIO` from the canonical `content/portfolio.ts` (§6.5) rather than duplicating project copy — `OFFER_PORTFOLIO.projectIds` is a **hard-coded subset of exactly the 6 viewable projects** (`["dmhr", "vocalyze", "aulea", "altamotors", "aurielle", "leanandfit"]`); Setmona and Kolekta (the two `engine`-tier, non-viewable projects) must never appear there — they're referenced only inside `GROWTH_VISION.phase2ProofLine` as proof of what clients graduate into.

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
- SEO/OG tags for this route are set client-side in `LimitedOfferPage.tsx`'s effect (title, description, OG/Twitter, canonical) since the app is a single-page SPA shell — this works for browsers and JS-capable crawlers, but a crawler that doesn't execute JS will still see the homepage's static OG tags from `index.html`. A dedicated OG image for this route hasn't been supplied either; it currently inherits the homepage's `/og/altaventures-og.jpg`.
