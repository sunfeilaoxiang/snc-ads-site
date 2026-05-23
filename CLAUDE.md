# SNC Advertising — website (Astro)

Project context for any future Claude session working on the SNC Advertising website.

## What this is

The SNC Advertising marketing website, built as a **code project** — Astro, plain CSS,
**bilingual (RU + EN), live on GitHub Pages**. **Not Tilda.** (Tilda was evaluated
and dropped: its API is read-only, you cannot deploy code to it.)

- **Live:** https://sunfeilaoxiang.github.io/snc-ads-site/ (RU) and `/en/` (EN)
- **Repo:** github.com/sunfeilaoxiang/snc-ads-site (public, account `sunfeilaoxiang`)
- **Deploy:** GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-builds
  and deploys on every push to `main`. Astro action; ~1 min.

> **Naming:** the brand is **SNC Advertising** (formal) / **SNC Ads** (short form,
> e.g. Calendly handle `dmitrijs-sncads`). Renamed from "SNC Media" on 2026-05-20.
> **Repo + live URL renamed to `snc-ads-site` on 2026-05-23** — base path is now
> `/snc-ads-site` (live at `sunfeilaoxiang.github.io/snc-ads-site/`). The **local
> folder is still `snc-media-site`** — kept deliberately to avoid breaking the many
> doc/path references; it's cosmetic and does not affect the deploy. A real custom
> domain (`sncad.com`) will replace the github.io path later. **Never write
> "SNC Media" in copy or new files.**

## Stack

- **Astro 5** — static site generator. Zero JS shipped by default.
- **Plain CSS** — no Tailwind. Design system in `src/styles/global.css` mirrors the
  brand book directly.
- **IBM Plex Mono** — the only typeface, loaded from Google Fonts in `Base.astro`.
- **Astro i18n** — RU at `/`, EN at `/en/` (`prefixDefaultLocale: false`).
- **GitHub Pages** — hosting. `base: '/snc-ads-site'` in `astro.config.mjs`.

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
pages/                       OLD Tilda build specs — kept ONLY as copy reference
brand.md  sitemap.md          brand context + page plan
WEBSITE_VERDICT.md / .html    senior UX verdict (2026-05-18)
ANALYTICS_SETUP.md            DS-facing guide: how to get GA4 + Meta Pixel IDs
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

## Status (2026-05-20)

**Done since the 2026-05-18 verdict:**
- ✅ Rebrand SNC Media → SNC Advertising across the site + all PCFO docs
  (47 files, 129 replacements; logo sub-word now "Advertising"; placeholder
  email `hello@snc-ads.com`).
- ✅ Contact form wired with Web3Forms key `acd1f7f4-6610-45b3-a0fb-4bf078dd6ef7`
  in BOTH `src/pages/contact.astro` and `src/pages/en/contact.astro`.
  Submissions land at the email registered with Web3Forms.
- ✅ Calendly inline widget embedded on both contact pages —
  `calendly.com/dmitrijs-sncads/30min`, themed to brand green via URL params.
- ✅ Lead magnet **content** drafted: "The Meta Self-Audit" — 12 items in 5
  sections, synthesised from Nikita's actual audit of Feel My Skin. See
  `lead-magnet/`. Designed printable HTML ships immediately via Ctrl+P → PDF;
  a Claude Design brief is also written for a polished v2.

**Still open — needs DS / founder input (not design work):**
1. **GA4 + Meta Pixel IDs** — DS to follow `ANALYTICS_SETUP.md` to create
   accounts and send Claude the two IDs. Slots are ready in `Base.astro`.
   GDPR-consent banner decision pending alongside install.
2. **Lead magnet — publish step.** Content is done. Still to do: Nikita signs
   off on the 12 items; PDF saved to `public/downloads/`; build the
   `/audit-checklist` landing page with email-capture form (uses Web3Forms);
   add homepage CTA strip; translate to RU.
3. **No case studies.** `/cases` is methodology-only. Highest-impact gap. Needs
   1–2 anonymized cases from Nikita's prior work (real numbers, anonymized).
4. **Founder section** — monogram letters (Н/Г, N/G), not photos. Needs real
   photos + named credentials.
5. **Test the wired form** — DS to submit once and confirm the email arrives.
6. Real domain — still on the `github.io` subpath.
7. `og-default.png` — referenced but does not exist yet.

**Verdict (still 2026-05-18 baseline; not re-rated):** design 8/10,
conversion-readiness was 5/10 — moving up as items 1, 2, 5 ship.
The site is finished as design; the remaining work is content/proof + analytics
plumbing, not design.

## Analytics & ads

Pixels are NOT a platform feature — they're snippets that go in `Base.astro`'s
marked head/body slots: GA4, Meta Pixel + CAPI, TikTok Pixel, Yandex Metrica.
Empty until DS provides IDs (see `ANALYTICS_SETUP.md`). The inquiry form posts
to **Web3Forms** (static-site form backend — works on GitHub Pages, no server).
When the site moves to a real domain/Vercel, the form can be swapped for a
serverless function → Telegram.

## Funnel infrastructure already wired

- **Form:** Web3Forms, key in both `contact.astro` files. Rotate the key in
  BOTH files if you change it.
- **Booking:** Calendly inline embed, `calendly.com/dmitrijs-sncads/30min`.
- **Lead magnet:** content + designed HTML ready in `lead-magnet/`.
- **Analytics:** slots ready in `Base.astro`, IDs pending.
