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
2. **Case studies are modals, not pages.** "View Project" opens an in-page modal. This overrides source §41's "case-study pages."
3. **Static frontend, zero backend.** React + Vite + TypeScript + Tailwind. No Supabase, no database, no server. Deployed to Cloudflare Pages.
4. **No contact form.** The only conversion is opening a chat channel. No email capture, no form submission. Qualification happens in-chat (source §4, §24).
5. **Website Care is NOT on the public site.** No pricing, no plans, no mention in the funnel (source §3, §43). Internal upsell only.
6. **Free-offer copy is blunt and uses "flagship."** Approved wording:
   > "We'll build your flagship website free: you only pay for the domain."
   Keep the source's premium framing terms available elsewhere ("Complimentary Website Build", "No upfront website development fee") but the primary offer line is the blunt one above.
7. **Real work only (launch integrity).** No fabricated interfaces, no stock-photo mockups standing in for real products, no invented testimonials. Project visuals must be real Altaventures screenshots. Ship with clearly-marked placeholders until real assets are provided.

---

## 1. OPEN ITEMS (do not block build; use flagged defaults)

| # | Item | Default used in build | Action needed from client |
|---|------|----------------------|---------------------------|
| 1 | **About section copy** | Written from brand message (§47) as a credible placeholder. Marked `TODO(about)` in `content/site.ts`. | Replace with real story / founder / positioning details. |
| 2 | **Real project screenshots** | Placeholder images with `TODO(asset)` labels. | Provide real screenshots for Setmona, Altamotors, Kolekta, Vocalyze. |
| 3 | ~~Brand color + logo~~ **RESOLVED [v1.1]** | Logo supplied; palette locked from logo (see §11.1). Tagline supplied. | N/A |
| 4 | **Messenger branding mismatch** | Link points to `m.me/vanamaranto.moto`, which shows a personal-style profile ("Van Amaranto"), not "Altaventures". | Consider a dedicated Altaventures Facebook Page for brand consistency. |
| 5 | **Analytics ID** | Tracking layer scaffolded with a `MEASUREMENT_ID` constant left blank; events fire to `dataLayer` regardless. | Provide GA4 / Meta Pixel IDs when ready. |
| 6 | **Legal pages** | Privacy Policy + Terms rendered as modals with placeholder boilerplate. | Provide real legal text. |

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
- **Hero visual:** real interface composition (website + dashboard/booking/CRM). Placeholder `TODO(asset)` until real screenshots provided. Never generic stock.

### 6.2 CredibilityStrip (§12)
- Headline: **Not Just Websites. Real Business Systems.**
- Sub per §12.
- Four labeled projects: SETMONA (Booking & Scheduling), ALTAMOTORS (Motorcycle Financing & Sales), KOLEKTA (Loan Management & Billing), VOCALYZE (Entertainment Website & Digitalization).
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

### 6.5 SelectedWork (§15)
- Headline: **We've Built It. Now Let's Build Yours.**
- Four cards; each card: visual, name, category, short description, capability tags, **View Project** → CaseStudyModal.

### 6.6 CaseStudyModal (§16–19)
- One reusable modal, content keyed by project id from `content/site.ts`.
- Fields per project: title, category, overview, "What We Built" list, project type, business value, contextual CTA.
- **Vocalyze** additionally has a "Future Development" list (§19); render it clearly labeled as *planned*, never as existing capability (launch integrity).
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

### 6.14 About (`TODO(about)`, open item #1)
- Placeholder built from §47 brand message. Anchor target for nav "About".
- Keep short, credible, editable. Flag clearly in `content/site.ts` for replacement.

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

## 13. LEGAL (open item #6)

- Privacy Policy and Terms of Service render in LegalModal with placeholder boilerplate marked `TODO(legal)`.
- Do not present placeholder legal text as final.

---

## 14. DEPLOYMENT

- Build: `vite build` → static `dist/`.
- Deploy target: Cloudflare Pages (connect GitHub repo; build command `npm run build`, output dir `dist`).
- No runtime env vars required. Analytics/Pixel IDs, when added, injected at build time via `import.meta.env`.

---

## 15. DEFINITION OF DONE

- [ ] Single page, all sections in §5 order, all copy pulled from `content/site.ts`.
- [ ] All CTAs open ContactModal; channel links correct; WhatsApp prefills, Messenger/Viber do not falsely claim to.
- [ ] Four case-study modals working, Vocalyze future-dev clearly labeled as planned.
- [ ] Sticky mobile CTA present and non-obstructing.
- [ ] Analytics events firing to `dataLayer` (IDs optional).
- [ ] SEO meta + JSON-LD + OG image present.
- [ ] Placeholders clearly marked for: About copy, project screenshots, legal text, analytics IDs.
- [ ] Brand palette (§11.1), logo, and tagline applied.
- [ ] No backend, no form, no Website Care mention anywhere public.
- [ ] Lighthouse: performance/accessibility/SEO in good range on mobile.
- [ ] Static `dist/` deploys clean to Cloudflare Pages.

---

## 16. GUARDRAILS (do not violate)

1. No fabricated screenshots, testimonials, or "clients". Real work only.
2. No Website Care pricing or plans on the public site.
3. No contact form or email capture. Chat channels are the only conversion.
4. Don't imply Messenger/Viber prefill a message.
5. Don't reintroduce multi-page routing or case-study pages. Single page + modals is final.
