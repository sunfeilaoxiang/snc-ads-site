# Analytics & Pixel Setup — SNC Advertising

Step-by-step for DS to obtain the two IDs needed to instrument the site.
Once you have them, send both to Claude — installation into the code is ~10 minutes.

**What you need to end up with:**
1. A **GA4 Measurement ID** — looks like `G-XXXXXXXXXX`
2. A **Meta Pixel ID** — a 15–16-digit number, e.g. `1145573963482550`

**Skip GTM.** For a code-managed site (Claude edits the files), Google Tag Manager
adds an indirection layer with no benefit. GA4 + Meta Pixel go in as direct
snippets. If a non-technical teammate ever needs to manage tags without code, add
GTM then — not now.

---

## PART 1 — Google Analytics 4 (GA4)

**Goal:** a Measurement ID `G-XXXXXXXXXX`.

1. Go to **analytics.google.com**. Sign in with the Google account you want to own
   SNC's analytics (ideally a dedicated SNC Google account, not a personal one).
2. If it's a fresh account you'll see "Start measuring". Otherwise: click the
   **gear icon (Admin)**, bottom-left → **+ Create** → **Account**.
3. **Account setup:**
   - Account name: `SNC Advertising`
   - Leave the data-sharing checkboxes at defaults → **Next**.
4. **Property setup:**
   - Property name: `SNC Advertising Website`
   - Reporting time zone: your zone (e.g. Latvia / GMT+2)
   - Currency: **EUR** → **Next**.
5. **Business details:** industry category → "Jobs & Education" isn't it — pick
   **"Business & Industrial Markets"** or **"Online Communities"**, whichever fits;
   it's not critical. Business size: smallest. → **Next**.
6. **Business objectives:** tick **"Generate leads"** and **"Examine user
   behaviour"** → **Create** → accept the GA4 Terms of Service.
7. **Set up a data stream:** choose **Web**.
   - Website URL: `https://sunfeilaoxiang.github.io/snc-media-site/`
   - Stream name: `SNC Website`
   - Leave **Enhanced measurement ON** (it auto-tracks scrolls, outbound clicks,
     form interactions — useful, free).
   - Click **Create stream**.
8. The stream detail page now shows your **Measurement ID** at the top right:
   **`G-XXXXXXXXXX`**. ← **This is what Claude needs.**

You do NOT need to copy the "Google tag" install snippet — Claude writes that into
the code from the ID.

---

## PART 2 — Meta Pixel

**Goal:** a Pixel ID (15–16-digit number).

1. Go to **business.facebook.com**. Sign in with the Facebook account that should
   administer SNC's ad/tracking assets.
2. **Business Portfolio:** if SNC already has a Business Portfolio (Business
   Manager), use it. If not, create one:
   - business.facebook.com → **Create a business portfolio** → business name
     `SNC Advertising`, your name, a business email → finish.
   - ⚠ Use **SNC's own** portfolio — never a client's, never personal assets.
3. Open **Events Manager**: go to **business.facebook.com/events_manager**.
4. Click **Connect data sources** (or the **+** ) → choose **Web** → **Connect**.
5. **Name the dataset:** `SNC Advertising Website`. (Meta now calls a Pixel a "dataset" —
   same thing.) Enter the website URL `https://sunfeilaoxiang.github.io/snc-media-site/`
   → **Create**.
6. When asked how to set it up, choose **"Install code manually"** /
   **"Do it yourself"**. Meta shows the base pixel code. You only need the number:
   it appears as the **Dataset / Pixel ID** at the top, and inside the code as
   `fbq('init', 'XXXXXXXXXXXXXXX')`. ← **That number is what Claude needs.**
7. Skip "Conversions API" for now — it needs a server; the site is static on
   GitHub Pages. (Revisit when the site moves to a real domain + Vercel.)

---

## Important notes

### Domain verification — defer it
Meta will suggest "verify your domain." You **cannot** verify `github.io` — it's
not your domain. The Pixel still fires PageView and standard events fine without
verification. Do domain verification later, once SNC has its own custom domain.
Same applies to GA4 — it works on the github.io subpath with no extra step.

### GDPR / cookie consent — a real gap to close
The site targets EU founders. Running GA4 + Meta Pixel on EU visitors **without a
cookie-consent banner is not GDPR-compliant.** Options when Claude installs the
pixels:
- **(Recommended)** Add a lightweight consent banner — pixels load only after
  consent. Claude can build a minimal on-brand one (~1 hour).
- Or use Google Consent Mode v2 + Meta limited-data-use (more setup, partial data).
Flag your preference. Do not ship pixels to an EU audience with no banner.

### What to send Claude
Once you have both:
```
GA4 Measurement ID:  G-XXXXXXXXXX
Meta Pixel ID:       XXXXXXXXXXXXXXX
```
Claude installs them into `src/layouts/Base.astro` (the analytics slots already
exist there), builds, and deploys. ~10 minutes.

### Why this matters for SNC specifically
SNC is a Meta-ads agency. Its own site currently has **no Meta Pixel** — while
competitor 94n pixels its own site three ways. An ads agency that doesn't
instrument its own funnel fails its own pitch. This closes that gap, and the Pixel
also lets SNC retarget the warm leads who visit the site.
