# Page: Home

## Meta

- **URL:** `/`
- **Page title:** `SNC Advertising — Performance-маркетинг для ecommerce-брендов`
- **Meta description:** `Senior-level Meta-реклама для ecommerce-фаундеров. Без лишних созвонов и агентского театра. Прозрачная письменная отчётность.`
- **OG title:** `SNC Advertising — Performance, без театра.`
- **OG description:** `Meta ads для ecommerce. Senior-исполнение, прозрачная отчётность, асинхронный формат работы.`
- **OG image:** brand cover (green canvas + S mark + "SNC Advertising" wordmark, 1200×630)
- **Primary H1:** `Performance-маркетинг для ecommerce. Без театра.`
- **Language:** RU primary. EN mirror — not at launch.
- **Primary CTA on this page:** `Получить аудит` → `/contact`

## Page goal

Visitor — ecommerce-фаундер, который пришёл по рекомендации или по рекламе, —
за 60 секунд понимает: (1) что мы делаем, (2) для кого, (3) почему мы — не
очередное агентство, (4) как сделать следующий шаг (бесплатный аудит). Уйти
должны два типа: те, кто не подходит (бюджеты < €1k/мес, ожидают гарантий ROAS,
нет ecommerce), — мы их сами отсеиваем тоном. Остальные жмут CTA.

## Reader

Russian-speaking ecommerce-фаундер в CE/WE. Уже тратит на рекламу €1–10k/мес
сам или через фрилансера. Недоволен текущим перформансом, отчётностью или
коммуникацией. Прагматик. Уважает цифры. Не любит маркетинг-жаргон.

---

## Block-by-block

### Block 01 — Hero (full screen)
- **Tilda block:** T123 custom (Tilda's stock heroes won't hold the typography rules)
- **Custom HTML file:** `custom-html/01-home-hero.html`
- **Background:** Money Green `#1E4D3A` (full bleed). Thin white rule line top + bottom (`1px solid rgba(255,255,255,0.08)`), 40px inset.
- **Copy:**
  - Top-left label (9px, tracked, white/60%): `SNC ADVERTISING · PERFORMANCE`
  - Top-right meta (9px, tracked, white/40%): `RIGA / EU · С 2026`
  - Headline (clamp 60–120px, IBM Plex Mono 600, letter-spacing 0.04em, white):
    ```
    Performance-
    маркетинг
    для ecommerce.
    Без театра.
    ```
  - Subhead (clamp 14–18px, IBM Plex Mono 400, white/70%, max-width 560px):
    `Meta-реклама для брендов, которые выросли из самостоятельного запуска,
     но не готовы платить агентствам по €5k/мес за дашборды и созвоны.`
  - CTA primary (button, white bg, green text, no radius): `Получить аудит` → `/contact`
  - CTA secondary (text link, white/60%, underline on hover): `Как мы работаем →` → `/approach`
- **Notes:**
  - On mobile, headline collapses to 4 lines, font-size 40px.
  - Use the `cover-rule-h` pattern from the brand book — horizontal rule across the bottom 140px above the footer of the section.
  - No hero image. Type-driven only.

### Block 02 — Numbers strip
- **Tilda block:** T123 custom
- **Custom HTML file:** `custom-html/01-home-stats.html`
- **Background:** Near-black `#0C0C0C`. Thin `#1A1A1A` divider top.
- **Copy:** Four columns, left-aligned, in IBM Plex Mono.

  | Number | Label |
  |---|---|
  | `2` | `сооснователя` |
  | `4` | `года в перформансе` |
  | `€2M+` | `прокрученного бюджета` |
  | `100%` | `письменная отчётность` |

  - Number style: 48px, 600, Money Green `#1E4D3A`.
  - Label style: 10px, 400, white/50%, tracked 0.1em, uppercase.
- **Notes:**
  - These are TRUE numbers from the Meta cofounder's history, reframed as "what the agency brings to the table." Verify with cofounder before publishing. If `€2M+` is overstated, drop to the real number.
  - No animation. Static. The brand is ascetic.

### Block 03 — Positioning statement
- **Tilda block:** ZB (Zero Block) or T230 with custom CSS overrides
- **Background:** Near-black `#0C0C0C`. Thin divider top.
- **Copy:**
  - Section label (9px tracked, Money Green): `01 — ПОЗИЦИЯ`
  - Statement (40px clamp, 600, white):
    ```
    Senior-исполнение
    без агентского балласта.
    ```
  - Body (13px, 400, white/70%, max-width 640px, line-height 1.75):
    `Большинство SMB-брендов платят агентствам не за работу, а за инфраструктуру:
     аккаунт-менеджмент, созвоны, презентации, «стратегические сессии». Мы
     убрали всё, что не двигает цифру. Остался senior-уровень исполнения,
     прозрачные дашборды и письменный формат коммуникации. Это позволяет нам
     стоить меньше при том же качестве работы.`
- **Notes:**
  - The "стоить меньше" phrasing leaves price tension intact without showing a number. Good.

### Block 04 — What we do (services preview)
- **Tilda block:** T194 with custom styling, OR T123 custom
- **Background:** Off-white `#F5F3EF` (warm light section — first light section on the page).
- **Copy:** Section label (9px tracked, Money Green): `02 — ЧТО МЫ ДЕЛАЕМ`
- Three columns:

  **Meta Ads — ecommerce**
  Запуск, тестирование креативов, оптимизация. Pixel/CAPI, каталоги,
  Advantage+ Shopping, ретаргет. Еженедельный письменный апдейт.

  **Meta Ads — lead-gen**
  Кампании на заявки для сервисных бизнесов. Цель — стоимость и качество
  лида, не клики. Прозрачная воронка от показа до заявки.

  **Креатив (опционально)**
  Бриф креативов под платформу. Координация с фрилансерами. Продакшн
  оплачивается клиентом отдельно, не входит в ретейнер.

- Below the three columns, single line (10px, graphite, italic):
  `Google Ads, TikTok, SEO, Amazon, инфлюенсеры — пока не делаем. Один канал, который знаем глубоко.`
- CTA (text link, Money Green underline): `Подробнее об услугах →` → `/services`

### Block 05 — How we work (process)
- **Tilda block:** T230 numbered list, OR T123
- **Background:** White.
- **Copy:** Section label (9px tracked, Money Green): `03 — КАК МЫ РАБОТАЕМ`
- Four steps, numbered 01–04, each with title + 2-line description:

  **01 · Аудит**
  30 минут. Смотрим аккаунт, трекинг, креативы. По итогу — письменный отчёт и
  честный ответ: подходим друг другу или нет.

  **02 · Онбординг**
  Доступы, бриф через шаблон, согласование бюджета и KPI. Запуск — в течение 14 дней.

  **03 · Ежедневная оптимизация**
  Тесты креативов, оптимизация бюджетов, масштабирование победителей. Без созвонов.

  **04 · Отчётность**
  Дашборд в реальном времени. Письменный апдейт по пятницам. Стратегический созвон
  раз в месяц — по желанию клиента.

- CTA (text link, Money Green underline): `Подробнее о подходе →` → `/approach`

### Block 06 — Who we're for / not for
- **Tilda block:** T123 custom (two columns, side by side)
- **Custom HTML file:** `custom-html/01-home-fit.html`
- **Background:** Deep Forest `#0F2A20`.
- **Layout:** two columns, equal width, divided by a vertical rule line (`1px solid rgba(255,255,255,0.1)`).
- **Left column** — `ПОДХОДИМ` (label, 9px, Money Green light tint or sage `#7FA898`)
  - Bullet list (each row: `→` + text, 13px, white, line-height 1.8):
    - Ecommerce-бренд с годовым оборотом от €300k
    - Бюджет на рекламу от €1k/мес, комфортный коридор — €3–10k/мес
    - Готовы работать письменно, по шаблонам
    - Хотят прозрачную отчётность с цифрами, не презентации
    - Понимают, что результаты — функция качества продукта, креатива и бюджета, а не только агентства
- **Right column** — `НЕ ПОДХОДИМ` (label, 9px, Engine Bronze `#BF9340`)
  - Bullet list (each row: `×` + text, 13px, white/60%, line-height 1.8):
    - Ищут гарантии ROAS или количества лидов
    - Бюджет на рекламу меньше €1k/мес
    - Нужен ежедневный созвон и доступ в WhatsApp 24/7
    - Хотят, чтобы агентство «придумало стратегию» вместо понимания собственного бизнеса
    - Местный сервисный бизнес без онлайн-продаж (мы — про ecommerce)
- **Notes:** This is the qualification block. It does the filtering work the founders shouldn't have to do on every sales call.

### Block 07 — Cases preview (placeholder until real cases exist)
- **Tilda block:** T123 custom
- **Custom HTML file:** `custom-html/01-home-cases-placeholder.html`
- **Background:** Near-black `#0C0C0C`.
- **Copy:** Section label `04 — КЕЙСЫ`
- Single statement, large (28px, 600, white):
  `Кейсы — в работе. Анонимизированные результаты появятся здесь по мере
   выхода клиентов из NDA.`
- Below, smaller (11px, white/50%, max-width 480px):
  `Можем поделиться кейсами лично на аудите — присылайте запрос.`
- CTA (text link): `Запросить кейсы →` → `/contact`
- **Notes:** Replace this block with `T813` or custom case-card grid as soon as the first real case is documented. Until then, this is more honest than fake testimonials.

### Block 08 — Founders strip
- **Tilda block:** T123 custom (two side-by-side cards)
- **Custom HTML file:** `custom-html/01-home-founders.html`
- **Background:** White.
- **Copy:** Section label `05 — КТО МЫ`
- Two cards, equal width:

  **Никита** · Meta / Delivery
  4 года ведения Meta Ads для ecommerce-брендов в EU. Отвечает за рекламную
  стратегию, исполнение, QA. До SNC — senior performance marketer в агентстве.

  **Гима** · CCO / финансовая дисциплина
  5+ лет фрактального CFO для SMB и стартапов. Отвечает за коммерческую сторону,
  клиентские отношения, ценообразование, юнит-экономику.

- Each card has a small B&W photo (left-aligned, 80×80, optional — use placeholder S-mark if no photo yet).
- **Notes:** First names confirmed from the Operations Bible §8.1. Add surnames if the founders want them. Founder-led agencies sell because of the founders, not the brand.

### Block 09 — Closing CTA
- **Tilda block:** T123 custom
- **Custom HTML file:** `custom-html/01-home-cta.html`
- **Background:** Money Green `#1E4D3A` full bleed.
- **Copy:**
  - Large statement (clamp 32–56px, 600, white):
    ```
    Разбор вашего
    рекламного аккаунта.
    ```
  - Below (13px, white/70%, max-width 520px):
    `Оставьте заявку — зададим несколько вопросов, чтобы понять, подходим ли друг
     другу. Если да — разберём текущий аккаунт и покажем, что оставляет деньги
     на столе. Если нет — честно скажем сразу.`
  - CTA button (white bg, green text, no radius): `Получить аудит` → `/contact`
- **Notes:** Audit is qualify-gated (Operations Bible §3.4) — the CTA is a hook,
  not an instant free audit. Copy reflects: inquiry → short screening → audit only
  if the lead fits. Do NOT promise an instant/ungated free audit anywhere.

### Block 10 — Footer
- **Tilda block:** T142 (standard) with brand styling, OR T123
- **Custom HTML file:** if T123 — `custom-html/site-footer.html` (shared across all pages)
- **Background:** Deep Forest `#0F2A20`.
- **Contents:**
  - Logo (S-mark + SNC Advertising wordmark, muted white)
  - Three columns:
    - Услуги: Meta Ads (ecommerce), Meta Ads (lead-gen), Креатив
    - Компания: Подход, Кейсы, Контакт
    - Связь: Telegram, Email
  - Bottom rule line
  - Bottom row: `© 2026 SNC Advertising · Riga / EU` left, `IBM Plex Mono · #1E4D3A` right

---

## Custom CSS for this page

```css
/* IBM Plex Mono loaded globally — assumed via site-wide head injection */

/* Hero responsive scaling */
.snc-home-hero h1 {
  font-size: clamp(40px, 9vw, 120px);
  line-height: 0.95;
  letter-spacing: 0.02em;
}

/* Section labels — global pattern */
.snc-section-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #1E4D3A;
  margin-bottom: 28px;
}

/* On dark backgrounds */
.snc-section-label.on-dark { color: #7FA898; }
```

---

## Publish checklist

- [ ] Site-wide: IBM Plex Mono loaded in head (Project Settings → More → HTML in HEAD)
- [ ] Site-wide: brand colors set in Tilda palette
- [ ] All 10 blocks added in order
- [ ] T123 custom blocks pasted from `custom-html/01-home-*.html`
- [ ] Page-level CSS injected (Page Settings → More → HTML)
- [ ] Title, meta description, OG image set
- [ ] Favicon set (S-mark, green on white)
- [ ] Mobile checked at 375px — hero collapses, columns stack correctly
- [ ] All CTAs link to `/contact` or proper anchor
- [ ] Founder names confirmed (no placeholders left in published version)
- [ ] `€2M+` number confirmed with Meta cofounder
- [ ] Published
- [ ] Live URL → Claude for post-publish audit (lighthouse, mobile, content)
