# SNC Advertising — website (Astro)

Project context for any future Claude session working on the SNC Advertising website.

## What this is

The SNC Advertising marketing website, built as a **code project** — Astro, plain CSS,
**bilingual (RU + EN), live on Vercel at sncads.com**. **Not Tilda.** (Tilda was
evaluated and dropped: its API is read-only, you cannot deploy code to it.)

- **Live:** https://sncads.com/ (RU) and `/en/` (EN). `www.sncads.com` 308 → apex.
- **Repo:** github.com/sunfeilaoxiang/snc-ads-site (public, account `sunfeilaoxiang`)
- **Hosting:** Vercel (scope `sunfeilaoxiang's projects`, Hobby plan as of 2026-05-25).
- **Deploy:** Vercel auto-deploys on every push to `main` (~45-60s). The old
  `.github/workflows/deploy.yml` for GitHub Pages was removed 2026-05-25.

> **Naming:** the brand is **SNC Advertising** (formal) / **SNC Ads** (short form,
> e.g. Calendly handle `dmitrijs-sncads`). Renamed from "SNC Media" on 2026-05-20.
> Repo renamed `snc-media-site` → `snc-ads-site` on 2026-05-23; custom domain
> `sncads.com` cut over to Vercel on 2026-05-25 (GitHub Pages sunset). The **local
> folder is still `snc-media-site`** — kept deliberately to avoid breaking the
> many doc/path references; it's cosmetic and does not affect the deploy.
> **Never write "SNC Media" in copy or new files.**

## Stack

> **Stack migrated 2026-05-31** (branch `feat/react-stack`): added Tailwind v4 +
> React 19 islands + Framer Motion + shadcn/ui. The site is still
> **static-HTML-first** — client JS ships only via explicit React islands. The
> original plain-CSS design system is untouched and still drives every `.astro`
> page. This was a *targeted* addition for the animated teardown, not a full
> React rewrite.

- **Astro 5** with `output: 'static'`. All pages pre-render at build time; one
  serverless function (`/api/meta-capi`) ships via `@astrojs/vercel` adapter by
  exporting `prerender = false`.
- **Tailwind v4** — CSS-first (`@import "tailwindcss"` at the top of
  `global.css`, no `tailwind.config.js`). SNC brand tokens are mapped into the
  `@theme` block so React-island utilities (`bg-green`, `text-sage`,
  `font-mono`, `border-dim`) pull from the same palette as the Astro/CSS
  components.
- **React 19 islands + Framer Motion 12** — interactive sections are React
  components hydrated with `client:visible`. **One island today:**
  `src/components/AuditTeardown.tsx` (the animated Meta-account teardown on both
  homepages, fully bilingual via a `locale` prop). Everything else is static
  Astro. Motion respects `prefers-reduced-motion` (Framer `useReducedMotion` in
  the island; a `@media (prefers-reduced-motion: no-preference)` guard on the
  global scroll-reveal + hero load-in in `Base.astro`/`global.css`).
- **shadcn/ui** — Base UI primitives (NOT Radix). Only `ui/button.tsx` is
  installed so far. The `@theme inline` block in `global.css` overrides shadcn's
  default font to keep the single-typeface discipline (no Geist).
- **Plain CSS** — the design system in `src/styles/global.css` mirrors the brand
  book directly and remains the source of truth for all `.astro` page styling.
  Section-specific styles stay scoped in each `.astro` component.
- **IBM Plex Mono** — the only typeface, loaded from Google Fonts in `Base.astro`.
- **Astro i18n** — RU at `/`, EN at `/en/` (`prefixDefaultLocale: false`).
- **Vercel** — hosting at `sncads.com` (root, no base path). Env vars
  `META_PIXEL_ID` and `META_CAPI_TOKEN` configured in project settings.
  Vercel auto-deploys `main` → production; any other branch → a password-gated
  preview URL.

## Structure

```
src/
  styles/global.css     design tokens + reset + shared primitives
  i18n/ui.ts             header/footer/CTA UI strings, both locales
  lib/links.ts           url() + localizedUrl() + logicalPath() — base/locale aware
  layouts/Base.astro     HTML shell — head, fonts, OG, analytics slots, header+footer
  components/
    Header.astro         locale-aware nav + hamburger mobile menu + language switcher
    Footer.astro         locale-aware Deep Forest footer
    CtaClosing.astro     reusable closing CTA band, locale-aware
    AuditTeardown.tsx    React island — animated Meta-account teardown (RU/EN), Framer Motion
    ui/button.tsx        shadcn/ui Button primitive (Base UI)
  pages/
    index.astro services.astro approach.astro cases.astro contact.astro   — RU
    en/index.astro en/services.astro en/approach.astro en/cases.astro en/contact.astro — EN
    404.astro en/404.astro                       — not-found pages (RU is the Vercel default)
    thank-you.astro en/thank-you.astro          — post-form-submit; fires Lead pixel + CAPI
    api/meta-capi.ts                            — server-side CAPI mirror (Vercel function)
public/favicon.svg  og-default.png
pages/                       OLD Tilda build specs — kept ONLY as copy reference
brand.md  sitemap.md          brand context + page plan
WEBSITE_VERDICT.md / .html    senior UX verdict (2026-05-18)
ANALYTICS_SETUP.md            installation history for GA4 + Meta Pixel + CAPI
lead-magnet/
  meta-self-audit-en.md           Content (12-item Meta Self-Audit, EN)
  meta-self-audit-en.html         Printable A4 designed HTML (Ctrl+P → PDF)
  CLAUDE_DESIGN_BRIEF.md          Brief for Claude Design to redo the visual
```

> **RU/EN page pairs are duplicated** (full structure + styles in each). When you
> change a page's layout or styles, change BOTH `src/pages/X.astro` and
> `src/pages/en/X.astro`. Content differs (EN is an adaptation, not a literal
> translation); structure must stay in sync.

## Source of truth

- **Agency facts** (pricing, services, ICP, founders, audit mechanics):
  `../snc-media-ops/00_SNC_Media_Operations_Bible.md` — canonical. The site must
  not contradict it.
- **Brand voice & visuals:** `brand.md` in this folder.
- **Copy reference:** `pages/01-home.md` holds the original Russian home copy
  block by block. It's a Tilda-era artifact — the *format* is dead, the *copy* is
  still the reference. The live page is `src/pages/index.astro`.

## How to work on it

- **Dev:** `npm run dev` → http://localhost:4321
- **Build:** `npm run build` → outputs to `dist/`
- **Add a page:** create `src/pages/<name>.astro`, use the `Base` layout, add it
  to the `Header.astro` nav array.
- Windows env: use PowerShell, not Bash (Bash hangs). `npm`/`npx` work.

## Defaults

- **Language:** Bilingual. RU is canonical (`src/pages/`); EN is an *adaptation*
  (`src/pages/en/`) — native English, not a literal translation. Keep both in sync.
- **Vertical:** lead with ecommerce; lead-gen is the secondary service line.
- **Pricing:** never shown on the public site — qualified in conversation.
- **Audit CTA:** "Получить аудит" is a qualify-gated hook, NOT an instant free
  audit. Never promise an instant/ungated audit (Operations Bible §3.4).
- **Tone:** ascetic, short sentences, numbers over adjectives, no exclamation
  marks, no emojis, no marketing jargon.

## Status (2026-05-26)

**Infrastructure — done:**
- ✅ Rebrand SNC Media → SNC Advertising (47 files, 129 replacements in the May 20 pass).
- ✅ Web3Forms contact form (key `acd1f7f4-6610-45b3-a0fb-4bf078dd6ef7`, both locales).
- ✅ Calendly inline widget on both contact pages — `calendly.com/dmitrijs-sncads/30min`.
- ✅ GA4 `G-C480L71EX6` + Meta Pixel `1857063391638735` live in `Base.astro`,
  consent-gated via a small GDPR banner. Lead/`generate_lead` events fire on
  `/thank-you/`. GA4 data-stream URL updated to `https://sncads.com/`.
- ✅ `og-default.png` shipped in `public/` (1200×630 brand-green wordmark).
- ✅ Vercel cutover 2026-05-25 — repo imported, custom domain `sncads.com`
  configured (apex A record + `www` CNAME at GoDaddy → Vercel), SSL auto-issued.
- ✅ Meta Conversions API live — `/api/meta-capi` POSTs `Lead` to Graph API
  mirroring the browser Pixel (shared `event_id` → Meta dedupes). Round-trip
  smoke-tested via curl; one synthetic event accepted.
- ✅ `sncads.com` added to Meta Events Manager traffic allow list.

**Still open (non-infrastructure):**
1. **Lead magnet — publish step.** Content done. Still to do: Nikita signs off
   on the 12 items; PDF saved to `public/downloads/`; build `/audit-checklist`
   landing page with email-capture form (uses Web3Forms); add homepage CTA strip;
   translate to RU.
2. **No case studies.** `/cases` is methodology-only. Highest-impact gap. Needs
   1–2 anonymized cases from Nikita's prior work (real numbers, anonymized).
3. **Founder section** — monogram letters (Н/Г, N/G), not photos. Needs real
   photos + named credentials.
4. **End-to-end dedup verify** — incognito submit → confirm `Test Events` shows
   one event with Browser + Server source and the deduplicated badge.
5. **Phase 5b — email-hash match quality** — server-side hash user email/phone
   from the contact form for better CAPI attribution. Currently uses IP + UA +
   `_fbc`/`_fbp` cookies only.
6. **Titan email DNS** — MX/SPF/DKIM/DMARC at GoDaddy. The mailbox already
   receives mail at `dmitrijs@sncads.com`; outbound deliverability is the gap.

## Analytics & ads

Pixels are direct snippets in `Base.astro` (no GTM): GA4 + Meta Pixel both load
**only after the visitor accepts the GDPR consent banner**. The contact form
posts to **Web3Forms** (third-party form backend; submissions arrive at the
registered email). On a successful submit the user redirects to `/thank-you/`,
which fires `fbq('track', 'Lead', {}, {eventID})` and `gtag('event',
'generate_lead')`, then POSTs to `/api/meta-capi` with the same `event_id` for
server-side mirroring. Meta dedupes within a few minutes via the shared id.

**Attribution capture (added 2026-05-31).** A small `is:inline` script in
`Base.astro` stores `utm_*` / `fbclid` / `gclid` + landing page + referrer in
`sessionStorage` on the **first** page seen (first-touch wins). Both contact
forms carry matching hidden fields and populate them on load from
`sessionStorage` (falling back to current-URL params for a direct landing on
`/contact?utm=…`). So a lead that arrives from a Meta ad, browses, then submits
still carries its source into the Web3Forms email. No consent gate — these are
the visitor's own URL params, not tracking cookies.

## Funnel infrastructure already wired

- **Form:** Web3Forms, key in both `contact.astro` files. Rotate the key in
  BOTH files if you change it.
- **Booking:** Calendly inline embed, `calendly.com/dmitrijs-sncads/30min`.
- **Lead magnet:** content + designed HTML ready in `lead-magnet/`.
- **Analytics:** GA4 + Meta Pixel + CAPI all live, consent-gated.
