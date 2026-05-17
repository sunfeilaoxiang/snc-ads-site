# SNC Media — website (Astro)

Project context for any future Claude session working on the SNC Media website.

## What this is

The SNC Media marketing website, built as a **code project** — Astro, plain CSS,
deployed to Vercel. **Not Tilda.** (Tilda was evaluated and dropped: its API is
read-only, you cannot deploy code to it. See the cofounder message in project
history for the full rationale.)

## Stack

- **Astro 5** — static site generator. Zero JS shipped by default.
- **Plain CSS** — no Tailwind. The brand is hand-crafted and type-driven; a global
  design system in `src/styles/global.css` mirrors the brand book directly.
- **IBM Plex Mono** — the only typeface, loaded from Google Fonts in `Base.astro`.
- **Vercel** — hosting + deploy. Auto-deploys on `git push` once connected.

## Structure

```
src/
  styles/global.css     design tokens + reset + shared primitives (buttons, labels)
  layouts/Base.astro     HTML shell — head, fonts, OG tags, analytics slots, header+footer
  components/
    Header.astro         sticky nav — transparent on green, near-black on scroll
    Footer.astro         Deep Forest footer
  pages/
    index.astro          HOME — all 10 sections, scoped styles
public/
  favicon.svg            S-mark
pages/                   OLD Tilda build specs — kept ONLY as copy reference
brand.md                 brand voice, colors, ICP, voice rules (RU + EN)
sitemap.md               page plan
```

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

- **Language:** Russian-first. Cyrillic copy is canonical; English mirror later
  (would live under `src/pages/en/`).
- **Vertical:** lead with ecommerce; lead-gen is the secondary service line.
- **Pricing:** never shown on the public site — qualified in conversation.
- **Audit CTA:** "Получить аудит" is a qualify-gated hook, NOT an instant free
  audit. Never promise an instant/ungated audit (Operations Bible §3.4).
- **Tone:** ascetic, short sentences, numbers over adjectives, no exclamation
  marks, no emojis, no marketing jargon.

## Status (2026-05-17)

- Scaffolded, builds clean. Home page complete (10 sections), renders correctly.
- **Not yet deployed.** Next: git repo → GitHub → connect Vercel.
- Pages still to build: `/services`, `/approach`, `/cases`, `/contact` (see `sitemap.md`).
- **Open:** real domain (currently targeting `snc-media.vercel.app`); analytics
  pixel IDs (slots are in `Base.astro`, empty); `€2M+` stat in the hero needs
  verification with Nikita; founder photos; OG image (`/og-default.png`).

## Analytics & ads

Pixels are NOT a platform feature — they're snippets that go in `Base.astro`'s
marked head/body slots: GA4, Meta Pixel + CAPI, TikTok Pixel, Yandex Metrica.
Empty until real IDs exist. The inquiry form (on `/contact`, not yet built) will
POST to a Vercel serverless function → Telegram + tracking sheet.
