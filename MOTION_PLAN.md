# sncads.com — Motion & "Wow" Build Plan

Status: **proposal, not built.** Written 2026-05-31. Greenlight a tier before any code.

Goal: make the site _feel_ like a senior agency's site (the webflow.com lane of
polish) without betraying SNC's austere brand. Reference sites cyclemon.com /
makemepulse.com are the Awwwards WebGL-studio league and are deliberately **out of
brand** — we borrow their _craft level_, not their maximalism.

---

## 1. Brand guardrails (these constrain every motion decision)

From `snc-media-site/CLAUDE.md` + `brand.md`:

- IBM Plex Mono only. Square corners. No shadows.
- "No decorative motion — **every animation is cause-effect**." Motion must _explain_
  (reveal hierarchy, show a number changing, signal interactivity), never just decorate.
- Numbers over adjectives. Ascetic. No exclamation marks, no emoji.
- Palette: Money Green / Deep Forest / Sage / Bronze (≤10% bronze) / offwhite / near-black.

**Translation to motion language:** restrained, fast, eased, monochrome. Think Linear /
Vercel / Stripe — precision, not circus. If an effect would look at home on a crypto
landing page, it's wrong for SNC.

---

## 2. Tech decisions

| Concern             | Choice                                               | Why                                                                                                                       |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Smooth scroll       | **Lenis** (`@studio-freight/lenis`)                  | Tiny (~3kb), the de-facto premium smooth-scroll; drives all scroll choreography. The single biggest "premium feel" lever. |
| Animation           | **Framer Motion 12** (already installed)             | `useScroll`/`useTransform`/`useInView` for scroll-linked motion; reuse the `AuditTeardown` island pattern.                |
| Page transitions    | **Astro View Transitions** (`<ClientRouter />`) + FM | Native to Astro 5, near-zero cost, removes the white-flash reload between pages.                                          |
| WebGL (Tier 3 only) | **OGL** or **react-three-fiber**                     | Only if we commit to a shader hero. Heavy; gated behind Tier 3.                                                           |

**Architecture (must respect static-first):**

- Stay static-HTML-first. Motion ships only via React islands (`client:visible` /
  `client:load`) or a tiny global `is:inline` script for Lenis. Do NOT turn pages into
  a React app.
- **Every motion path guarded by `prefers-reduced-motion`.** Reduced-motion users get
  the final state instantly — no scroll-jacking, no parallax.
- **Lenis disabled on touch / reduced-motion** (native scroll on mobile; smooth-scroll
  is a desktop polish, not a mobile requirement).
- Perf budget: keep Lighthouse ≥90. No layout-shift from entrance animation (animate
  transform/opacity only, never width/height/top).

---

## 3. Global systems

1. **Smooth scroll (Lenis)** — desktop only, reduced-motion off. Wire Lenis's `raf`
   loop to Framer's scroll so `useScroll` reads Lenis position. Lerp tuned tight
   (not floaty — SNC is precise, not dreamy).
2. **Scroll-progress rail** — a 1px Money-Green bar at top or a thin right-edge tick
   that fills with scroll. Mono, unobtrusive. Cause-effect: "where am I."
3. **Custom cursor (subtle)** — a small square (brand: square corners) ring that
   scales on interactive elements and shows a mono label on the audit CTA ("→").
   Desktop + fine-pointer only. Off for reduced-motion.
4. **Page transitions** — View Transitions: outgoing content lifts/fades 120ms,
   incoming staggers in. Header/footer persist (no reload flash).

---

## 4. Per-section choreography (the actual homepage)

| #   | Section                   | Motion (cause-effect rationale)                                                                                                        |
| --- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| —   | `.hero` (h1.hero-h1)      | **Set-piece** — see §5. Replace the current CSS load-in with a mono mask/clip reveal of the H1, line by line; sub + CTA stagger after. |
| 1   | `.principles`             | Items wipe in left→right on enter, hairline rules draw (scaleX 0→1). Reveals reading order.                                            |
| 2   | `.pos` (01 Позиция, dark) | The position statement does a word-stagger reveal; sec-label "01 — Позиция" counts/types in. Sage label on dark.                       |
| 3   | `.services` (02)          | Service rows stagger up; on hover each row lifts 2px + bronze hairline draws underneath (intent signal).                               |
| 4   | `.how` (03)               | Steps reveal sequentially as a connecting vertical line draws down the left gutter (shows process = sequence).                         |
| 5   | `.fit` (04)               | Two-column "fit / not-fit" — columns slide in from opposite sides, meeting at the divider.                                             |
| —   | `AuditTeardown` island    | Already animated. Leave as-is; ensure Lenis scroll feeds its `useInView` correctly.                                                    |
| 6   | `.founders` (05)          | B&W founder photos do a clip-reveal (top→bottom); names/credentials type in.                                                           |
| 7   | `.closing`                | The closing statement scales/masks in; CTA gets a magnetic hover + the custom-cursor "→". Final strong beat.                           |

Pattern: **directional, staggered, eased (`[0.25,0.1,0.25,1]`), ~0.4–0.5s, `once:true`.**
Consistent across all sections so it reads as a system, not random effects.

---

## 5. Hero set-piece — 3 brand-true concepts (pick one)

All mono, all cause-effect. NOT a decorative gradient (that was the scrapped trial).

- **A — Mask reveal (safest, most "Vercel/Linear").** H1 lines clip-reveal from a
  moving mask; a single hairline underline draws under the key phrase. Sub + CTA
  stagger. Calm, senior, fast.
- **B — Live metrics (most on-brand for an ads agency).** A small mono dashboard
  motif: 2–3 numbers count up on load (e.g. a ROAS / spend-efficiency figure with a
  caveat label), a tiny line chart draws. "Numbers over adjectives" made literal.
  Needs a defensible illustrative number (mark as illustrative or use an anonymized
  real one — must not contradict the Operations Bible).
- **C — Budget-leak line (story in one animation).** A single animated line/flow
  that starts ragged ("budget leaking") and resolves into a clean upward path
  ("growth") as it draws — visualizing the core promise. Most distinctive; most
  design work.

Recommendation: **A for Tier 1**, upgrade to **B or C** in Tier 2.

---

## 6. Micro-interaction inventory

- Magnetic primary CTA (button follows cursor slightly within a few px, snaps back).
- Link underlines wipe in from left on hover (not fade).
- Number tickers (count-up) wherever a metric appears.
- Buttons: 150ms color/transform on hover; pressed state.
- Nav: active-section indicator that slides as you scroll (ties to scroll-progress).
- Hairline rules draw (scaleX) rather than just appear.

---

## 7. Performance & accessibility guardrails (non-negotiable)

- `prefers-reduced-motion: reduce` → all entrance/scroll/parallax off, final state shown,
  Lenis disabled, custom cursor off. (Already the site's stated discipline.)
- Animate only `transform` + `opacity`. Zero CLS from motion.
- Hero set-piece must not delay LCP — text is real DOM, animation only transforms it.
- Mobile: native scroll, lighter choreography, no custom cursor, no parallax depth.
- Lighthouse target stays ≥90 perf. Re-audit after each tier.
- No hard scroll-jacking (no hijacked wheel that traps the user). Pinned sections must
  always allow normal scroll-through.

---

## 8. Build sequencing & effort

**Tier 1 (~1 day) — biggest wow-per-effort, ~70% of perceived premium:**

1. Add Lenis (desktop, reduced-motion/touch guards).
2. Build a reusable `<Reveal>` FM wrapper (direction, stagger, delay props).
3. Replace CSS scroll-reveal across sections 1–7 with `<Reveal>` choreography.
4. Micro-interactions: magnetic CTA, wipe underlines, number tickers, drawing rules.
5. Scroll-progress rail.
   → Branch `feat/motion-tier1`, preview URL, Lighthouse check.

**Tier 2 (+1–2 days):** 6. Hero set-piece (concept A→B/C). 7. Astro View Transitions across all pages. 8. Subtle custom cursor.

**Tier 3 (week+, optional, only if site = pitch centerpiece):** 9. One WebGL/shader hero moment (OGL/r3f), brand-true, gated + perf-budgeted.
Prototype ONE concept first before committing.

Each tier ships on its own branch → Vercel preview → review before merge to `main`.

---

## 9. Risks

- **Brand drift** — motion creeping into "decorative." Mitigation: every effect must
  pass the cause-effect test; if it only decorates, cut it.
- **Perf regression** — Lenis + many islands. Mitigation: islands hydrate `client:visible`,
  reduced-motion + mobile paths stay light, Lighthouse gate per tier.
- **Bilingual sync** — choreography must be applied to BOTH `src/pages/*` (RU) and
  `src/pages/en/*`. Build the `<Reveal>` system once, apply to both.
- **Scroll-jank on low-end** — tune Lenis lerp; test on a throttled CPU.

## 10. Definition of done (per tier)

Both locales animate identically; reduced-motion shows clean static; mobile uses native
scroll; Lighthouse perf ≥90; no CLS; nothing contradicts the brand guardrails in §1.
