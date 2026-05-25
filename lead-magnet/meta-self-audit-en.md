# The Meta Self-Audit

**12 checks. 15 minutes. The list we run before quoting an audit.**

*by SNC Advertising — performance marketing for ecommerce founders*

---

If you spend €1k+/month on Meta ads, you should be able to walk through this
list and not flinch.

It's the exact sequence we run before we quote an audit on a new ecommerce
account. Twelve checks. Five layers. About fifteen minutes if you know your way
around Ads Manager. Don't worry about getting them all right — the point is to
know which ones you *can't answer*. That's where the money is.

---

## § 1 — Tracking & attribution

*If you can't see it, you can't optimize it.*

### 01 · Conversions API installed and de-duplicating with the Pixel.

Open Events Manager → your dataset → confirm events come from **both Browser
and Server**, with deduplication on. Browser-only Pixels miss iOS users and
anyone behind a cookie banner — often 30–50% of real conversions.

**Good:** the device split in Ads Manager roughly matches your real iOS/Android
customer mix.
**Bad:** heavy Android skew in your ad reporting = CAPI missing or broken.

### 02 · UTM parameters on every ad URL.

Without them, Meta-driven sales land in Shopify as "Direct" or "Organic" and
your reported ROAS underreads — sometimes by a lot.

**Good:** every ad URL ends in `?utm_source=meta&utm_medium=cpc&utm_campaign=…&utm_content=…`.
**Bad:** clean URLs with no parameters.

---

## § 2 — Account structure

*Let the system learn before you judge it.*

### 03 · One or two active conversion campaigns — not eight.

Multiple campaigns targeting the same audience cause *auction overlap*: your
own ads bid against each other and inflate your own CPM. The system also can't
build a coherent buyer model if you keep splitting it.

**Good:** 1–2 conversion campaigns running simultaneously.
**Bad:** 5+ active, all on the same placement and audience.

### 04 · Campaigns get a 7-day learning window before kill or scale.

Meta's learning phase needs ~50 conversion events. Killing a campaign at 2–3
days means it never finished learning — you're judging it before it had a
chance. If you're nervous, *lower the daily budget*. Don't shorten the runtime.

**Good:** every campaign runs at least a full learning phase before judgement.
**Bad:** panic-kills at 48 hours; same campaign rebuilt from scratch the next week.

### 05 · Conversion event = Purchase.

If you optimize for "Initiate Checkout" or "Add to Cart," Meta will find
cart-adders who don't buy. The system gives you exactly what you ask for.

**Good:** Purchase.
**Bad:** InitiateCheckout, AddToCart, ViewContent.

---

## § 3 — Creative & placement

*This is the #1 lever in 2026. Not targeting. Creative.*

### 06 · Separate 9:16 and 1:1 creatives — never one file in all placements.

Vertical video shoved into Feed gets heads cropped. Square video shoved into
Stories/Reels cuts text and looks cheap. Meta's "auto-crop" is not a solution —
it routinely centres the wrong thing.

**Good:** dedicated 9:16 file for Stories/Reels, dedicated 1:1 or 4:5 for
Feed/Marketplace — each in its own ad set with **placement controls locked to
its format.**
**Bad:** one file, all placements, "let Meta auto-crop it."

### 07 · ALL Advantage+ Creative enhancements OFF (except "Relevant comments").

Meta can rewrite your copy, crop your video unpredictably, swap your CTA, even
drop stock music over your ad. There is no upside for a brand you actually care
about.

**Good:** every enhancement toggle off.
**Bad:** anything at default. (Default is on for most of them.)

> *Specifically toggle off:* Video touch-ups · Text improvements · Visual touch-ups ·
> Show summaries · Enhance CTA · Add video effects · Optimize Website Destination ·
> Browser add-ons. **Keep on:** Relevant comments only.

### 08 · Catalog / Advantage+ Shopping campaign running and funded.

For ecommerce, catalog ads are systematically cheaper per acquisition than
static or video because Meta picks the right product per viewer. They should
be ~30–50% of monthly Meta spend, not zero. And: catalog-ad clicks must land
on the **product page**, not the homepage — otherwise half the click bounces
hunting for what they saw.

**Good:** catalog sales campaign live, well-funded, deep-linked to PDPs.
**Bad:** no catalog at all, or catalog ads pointing at the homepage.

---

## § 4 — Audience

*Where money is quietly wasted.*

### 09 · Age range tightened to your real ICP.

Default 18-65+ is a trap. 55+ users have some of the highest click-through
rates on Meta because they click everything — but they don't buy. Open
Breakdowns → Age and look at cost-per-purchase per bracket.

**Good:** less than 10% of monthly spend on 55+ unless 55+ is your actual ICP.
**Bad:** 40% of spend on 55+, one purchase, €200+ CPA.

### 10 · Retargeting custom audiences are live and funded.

Site visitors, cart abandoners, past purchasers should see different messaging
at lower CPA. If 100% of your budget is cold prospecting, you're skipping the
cheapest conversions in the funnel.

**Good:** 5–15% of monthly budget on warm retargeting, with creative tailored
to the audience stage.
**Bad:** 100% prospecting; no retargeting audiences at all.

---

## § 5 — Numbers

*The honest part.*

### 11 · Your reported ROAS reconciles with Shopify revenue.

Post-iOS14, Meta-reported ROAS is inflated by attribution overlap and platform
self-reporting. What actually matters is **blended ROAS**: total revenue ÷
total ad spend (across all channels). Take last month's Shopify revenue,
divide by your total Meta + Google spend. The agency's number should be in the
same ballpark — not 2× it.

**Good:** the agency reports both Meta-attributed and blended ROAS, and
reconciles to your bank.
**Bad:** the only number you ever see is "Meta dashboard says 4×."

### 12 · You know your target ROAS — derived from unit economics, not vibes.

Your minimum viable ROAS = **1 ÷ gross-margin %**, adjusted for the payback
window your business can afford. Below it, every "sale" loses money.

**Good:** you can name your number, and you know what changes it (margin, AOV,
return rate, payback window).
**Bad:** "we aim for 4 because it sounds healthy."

---

## If 4 or more of these are red flags on your account…

You're not paying for media. You're paying for inefficiency. The fix isn't more
spend — it's the layer underneath.

Want a second pair of eyes? We'll run this same audit on your account, in
writing, and tell you straight what we'd change.

**→ Request an audit at snc-media-site URL**

---

*SNC Advertising — senior-led Meta paid media for ecommerce brands in CE/WE.
One channel, run deeply. Written-first, no agency theatre. Founded 2026,
Riga / EU.*
