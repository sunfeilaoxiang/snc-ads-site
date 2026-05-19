# SNC Advertising — website (Astro)

Project context for any future Claude session working on the SNC Advertising website.

## What this is

The SNC Advertising marketing website, built as a **code project** — Astro, plain CSS,
**bilingual (RU + EN), live on GitHub Pages**. **Not Tilda.** (Tilda was evaluated
and dropped: its API is read-only, you cannot deploy code to it.)

- **Live:** https://sunfeilaoxiang.github.io/snc-media-site/ (RU) and `/en/` (EN)
- **Repo:** github.com/sunfeilaoxiang/snc-media-site (public, account `sunfeilaoxiang`)
- **Deploy:** GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-builds
  and deploys on every push to `main`. Astro action; ~1 min.

## Stack

- **Astro 5** — static site generator. Zero JS shipped by default.
- **Plain CSS** — no Tailwind. Design system in `src/styles/global.css` mirrors the
  brand book directly.
- **IBM Plex Mono** — the only typeface, loaded from Google Fonts in `Base.astro`.
- **Astro i18n** — RU at `/`, EN at `/en/` (`prefixDefaultLocale: false`).
- **GitHub Pages** — hosting. `base: '/snc-media-site'` in `astro.config.mjs`.

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
  pages/
    index.astro services.astro approach.astro cases.astro contact.astro   — RU
    en/index.astro en/services.astro en/approach.astro en/cases.astro en/contact.astro — EN
public/favicon.svg
pages/                   OLD Tilda build specs — kept ONLY as copy reference
brand.md  sitemap.md      brand context + page plan
WEBSITE_VERDICT.md / .html  senior UX verdict (2026-05-18)
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

## Status (2026-05-18)

**Done:** all 10 pages live (5 RU + 5 EN), bilingual with language switcher,
mobile hamburger nav, GitHub Pages auto-deploy. Two design critiques passed
(6/10 → 8/10). Competitor review done (94n, John Galt) — see `WEBSITE_VERDICT`.

**Open — needs DS / founder input (not design work):**
1. **Contact form not wired.** Placeholder `WEB3FORMS_ACCESS_KEY` in BOTH
   `src/pages/contact.astro` AND `src/pages/en/contact.astro`. Get a free key at
   web3forms.com → replace in both → push. Until then the form shows a graceful
   "not connected" message.
2. **No case studies.** `/cases` is methodology-only. Highest-impact gap. Needs
   1–2 anonymized cases from Nikita's prior work (real numbers, anonymized client).
3. **Founder section** — monogram letters (Н/Г, N/G), not photos. Needs real
   photos + named credentials (the agency Nikita came from).
4. **No lead magnet, no real imagery.** See `WEBSITE_VERDICT.md` §8.
5. Analytics pixel IDs — empty slots in `Base.astro` head/body.
6. Real domain — still on the `github.io` subpath.
7. `og-default.png` — referenced but does not exist yet.

**Verdict (2026-05-18):** design 8/10, conversion-readiness 5/10, overall ~6.5/10
as a launch asset. The site is finished as design, unfinished as business — the
remaining work is content/proof, not design. Do not point outreach at it until it
has ≥1 case study, founder photos, and a working form.

## Analytics & ads

Pixels are NOT a platform feature — they're snippets that go in `Base.astro`'s
marked head/body slots: GA4, Meta Pixel + CAPI, TikTok Pixel, Yandex Metrica.
Empty until real IDs exist. The inquiry form posts to **Web3Forms** (static-site
form backend — works on GitHub Pages, no server). When the site moves to a real
domain/Vercel, the form can be swapped for a serverless function → Telegram.
