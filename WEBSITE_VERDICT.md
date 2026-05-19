# Final Verdict — SNC Advertising Website

*Prepared 2026-05-18. Based on: building the site, two design critiques (6/10 → 8/10),
reviewing it rendered in both languages and on mobile, and rendering both competitor
sites — 94n.digital and johngalt-finance.com.*

---

## 1. The bottom line, up front

**SNC Advertising has a genuinely well-designed website and a genuinely unconvincing one —
and those are the same site.** The craft is real: a distinctive brand system,
disciplined execution, bilingual, mobile-correct, fast. The problem is not how it
looks. It is that it contains **no evidence that the agency can do the job** — no
case studies, no client names, no testimonials, no numbers, no faces. It is a
beautifully built empty room.

Against the two benchmarks: SNC **out-designs** 94n and **matches** John Galt on
craft — and **loses to both, decisively, on proof.**

---

## 2. What the site is today

Five pages, two languages (RU primary, EN adapted), live on GitHub Pages,
auto-deploying on every push:

- Home, Services, Approach, Cases, Contact — all five, both languages
- Working language switcher, working mobile navigation, fast static delivery
- A coherent IBM Plex Mono / Money-Green brand system carried faithfully from the brand book
- Honest copy in a real voice: "no agency theatre," the who's-a-fit / who-isn't
  qualification block, "we don't borrow other people's logos or results"

That is a complete, shippable brochure site. Nine of ten brand-new agencies launch
with something visibly worse.

---

## 3. Design verdict — 8 / 10

The brand system is the site's strongest asset and it is genuinely strong.
Monospace-everything, the green/bronze/forest palette, hard left-alignment, hairline
rules, the exhibit-style section numbering — it is *disciplined* and *distinctive*.
Rendered side by side: **SNC's visual identity is more characterful and more
controlled than the direct competitor's.** 94n's site is a competent but generic
light-agency template — hexagon clip-art, magenta accent, and a live
`€0m Client Revenue` bug sitting on their homepage.

What still caps SNC's design at 8, not 9:

- **Zero imagery or motion.** A pure-type site for a *creative* agency is a bold
  stance that also forfeits visual proof.
- **All-monospace** still taxes sustained reading, even at the bumped 14–15px.
- **The hero over-dominates** desktop — the 116px headline eats the first viewport whole.
- **Founder monograms, not faces.**

None of these are defects. They are the ceiling of an austere, deliberate aesthetic.
The design work is essentially *done*.

---

## 4. Conversion verdict — ~5 / 10

This is the honest, uncomfortable score. A website's job is not to be admired; it is
to move a prospect from interested to booked. On the elements that actually do that,
SNC scores near zero.

| Conversion element | 94n | John Galt | **SNC** |
|---|---|---|---|
| Case studies with hard numbers | 3 | 10 | **0** |
| Named testimonials | 4 | 3 | **0** |
| Client logos / scale proof | "120+ brands", real logos | "30+ clients" | **0** |
| Human faces | team photo + case photography | founder photo in hero | **0 — monogram letters** |
| Third-party validation | 6 award badges, Clutch | awards, Trustpilot | **0** |
| Lead magnet | free audit | free financial model | audit only |
| A working contact form | yes | yes | **not wired** |

The site asks to be believed. The competitors *show*. That gap is the whole verdict.

---

## 5. Competitive standing, head to head

**vs 94n (the direct competitor).** SNC wins on brand, discipline, copy sharpness and
honesty — and 94n has a live bug on its homepage. But 94n will out-convert SNC today,
because a founder comparing the two tabs sees award badges, real client logos, three
quantified case studies, a team photo and star-rated reviews on one side — and a
beautiful, faceless, proof-less site on the other. **Better brand, weaker pitch.**

**vs John Galt (the in-house benchmark).** John Galt's site is the same aesthetic
*family* as SNC — dark, restrained, confident — but it has a real founder's face in
the hero, ten case studies, a team of thirteen, named credentials, pricing, a lead
magnet. It proves the dark-and-disciplined look **works once it is populated with
reality.** SNC is not a different class of site. It is the same class, **empty.**

---

## 6. The honest gaps, ranked

1. **No case studies.** The single highest-impact missing asset. `/cases` is currently
   an essay about *how you would measure* a result you have never been shown to produce.
2. **No founder proof.** Nikita has a real four-year track record at a real, named
   agency, with real results. The site hides all of it behind "at an agency" and the
   letter "N." That is free credibility already owned and not used.
3. **No human faces.** Both competitors lead with people. People are what a service
   buyer actually buys.
4. **Contact form not wired.** A functional dead end — the one purely mechanical
   failure on the site. Needs the Web3Forms key, in both `contact.astro` files.
5. **No lead magnet.** Nothing captures the prospect who is not ready to talk yet.
6. **`/cases` will underwhelm by design** until real cases exist — correctly demoted
   from the nav, but still a thin page.

Fair caveat: a 2026-launched agency *cannot* have six awards or 120 clients. That is
"can't yet," and nobody will hold it against you. But items 2, 4 and 5 are
**"could do now and aren't"** — and that distinction is the real indictment.

---

## 7. The strategic reframe that matters most

Per the SNC Operations Bible, Phase-1 leads come from **warm introductions and
Telegram founder communities** — not cold inbound. That changes the website's job.
It is **not** the cold-acquisition engine yet. It is the **credibility-check
destination**: someone gets a warm intro to SNC, then opens the site to decide if
you are real.

For that job, proof matters *even more*, not less. A warm lead arrives already
half-sold — and an empty, faceless site **deflates** them. The site's Phase-1 job is
simply: *do not lose the warm lead.* Right now it can lose one, by looking like a
concept rather than a company.

---

## 8. What it would take to win

Not more design. **Content.** In priority order:

1. **One or two anonymized case studies** from Nikita's prior work — real numbers,
   real timeframe, anonymized client ("Beauty DTC, EU — €X → €Y in 90 days"). The
   Operations Bible's Day-30 plan already calls for exactly this. Build `/cases` to
   hold them properly.
2. **Real founder photos + named credentials.** Faces in the founders section; name
   the agency Nikita came from; state real numbers.
3. **Wire the contact form** — 2 minutes once the Web3Forms key exists.
4. **One real visual** — a redacted ad-account dashboard. Breaks the austerity, adds
   proof, stays on-brand.
5. **A lead magnet** — a free Meta-audit checklist or a teardown PDF.

Items 2–4 are doable this week and need only founder input. Item 1 needs a
conversation with Nikita. Item 5 is a half-day.

---

## 9. Final ratings

| Dimension | Score |
|---|---|
| Design & craft | **8 / 10** — distinctive, disciplined, done |
| Conversion readiness | **5 / 10** — no proof, form not wired |
| Competitive standing today | Loses to both — better-built, less convincing |
| **Overall as a launch asset** | **~6.5 / 10** |

**The verdict in one sentence:** the website is finished as a piece of design and
unfinished as a piece of business — and the remaining work is not design, it is
*feeding the site reality*.

**Recommendation:** stop all design polish — it is done. Do not point outreach at
this site until it has, at minimum, **one real case study, founder photos, and a
working form.** Get those three, and the site moves from "a beautiful concept" to
"a real firm you would hire" — at which point it genuinely beats 94n, because you
will have their proof *and* a better brand.

---

## 10. What is already right — and must not be touched

For balance: the following are genuinely good and should be protected through any
future changes.

- The positioning — "performance marketing, no agency theatre" — and the
  who's-a-fit / who-isn't qualification block.
- The honesty. SNC does not fake proof; "cases in progress" is true.
- The brand system — monospace, the palette, the discipline.
- Bilingual structure, working mobile navigation, fast static delivery.
- The native-English adaptation (not a literal translation).
