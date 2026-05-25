# Analytics setup — SNC Advertising site

**Status (2026-05-23) — ✅ INSTALLED (consent-gated)**
- **GA4 `G-C480L71EX6`** + **Meta Pixel `1857063391638735`** are installed in
  `src/layouts/Base.astro`, loaded **only after** the visitor accepts the GDPR
  consent banner. `Lead` / `generate_lead` conversion events fire on a successful
  contact-form submit. Verified live: nothing tracks before consent; both tags
  load on Accept; banner is locale-aware (RU/EN).
- **CAPI** (server-side conversions) still pending — needs a backend, waits for
  the move off GitHub Pages (TASKS.md D2.d).
- **To verify in Meta:** open the live site, click **Accept** on the banner, then
  check Events Manager → Test Events. The Pixel only fires after consent, so you
  must Accept first.
- **GA4 data-stream URL:** ✅ updated to `https://sunfeilaoxiang.github.io/snc-ads-site/`
  (2026-05-23). Realtime confirmed receiving events.

Live site (new URL after the 2026-05-23 rename):
**https://sunfeilaoxiang.github.io/snc-ads-site/**

---

## 1. GA4 (Google Analytics 4) — you already have the ID

`G-C480L71EX6` is ready to install. Two notes:
- A GA4 tag tracks whatever page it's placed on, so it works on the new URL.
- Its **data stream was registered against the OLD `/snc-media-site/` URL**. The
  tag still tracks fine, but to keep reporting clean, update the stream URL:
  → analytics.google.com → **Admin** (gear, bottom-left) → **Data streams** →
  click the "SNC Website" stream → edit **Stream URL** →
  `https://sunfeilaoxiang.github.io/snc-ads-site/`

**If you ever need a fresh Measurement ID:**
1. analytics.google.com → **Admin** → (create a Property if needed) →
   **Data streams** → **Add stream** → **Web**
2. Enter the site URL, name it, **Create stream**
3. The **Measurement ID** (`G-XXXXXXXXXX`) is at the top-right of the stream details.

## 2. Meta Pixel (now called a "Dataset" in Events Manager) — needs creating

1. Go to **business.facebook.com/events_manager** (log in with the Facebook
   account that has access to your ad account).
2. Top-left: pick the right **Business Portfolio**. Ideally the **agency's
   Business Manager** — check with **Nikita** first, since he runs Meta delivery
   and the Conversions API / events should live in his BM. (If SNC has no
   Business Manager yet, create one at business.facebook.com — that's a
   prerequisite.)
3. Click **Connect data sources** (or the **+ / Add**). Choose **Web** → **Connect**.
4. Name it **SNC Advertising Website**. Enter URL
   `https://sunfeilaoxiang.github.io/snc-ads-site/`.
5. When it asks how to install the code — choose **"Install code manually"** (or
   just close the wizard). **You don't paste anything** — Claude wires the code.
6. The **Dataset / Pixel ID** is the **15–16-digit number** at the top of the
   dataset (e.g. `1234567890123456`). Copy it → send it to Claude.

> Conversions API (CAPI) is a later step — it needs a server, so it waits until
> the site moves off GitHub Pages (D2.d). The browser-side Pixel alone tracks
> page views, leads, and purchases for now.

## 3. One decision before install — GDPR consent

EU traffic + GA4/Pixel both set cookies. Pick one:
- **Minimal consent banner** — tags fire only after the visitor clicks "Accept."
  Recommended for EU compliance.
- **Ship without** for now, add a banner later.

Tell Claude which; the banner is a small addition to `Base.astro`.

---

## Parked notes (unrelated to analytics — moved here so they're not lost)
- **Nikita:** dislikes the contact-form dropdowns at `/contact/` — wants them
  more minimalistic. (Now tracked as TASKS.md **D3.j**.)
- **"Prepare FMS case"** — relates to Case Study #1 (TASKS.md **C2 / D3.f**),
  using the delivered audit report as raw material.
