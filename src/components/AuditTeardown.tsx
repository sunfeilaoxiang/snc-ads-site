/**
 * AuditTeardown — embedded anonymized audit teardown for the homepage.
 *
 * React island, hydrated client-side (client:visible). Framer Motion for
 * scroll + interaction animation; respects prefers-reduced-motion natively.
 *
 * Locale-aware: pass locale="ru" | "en". All copy lives in STRINGS so RU and
 * EN render from one component. Numbers are identical across locales (only the
 * thousands separator differs: RU uses thin-space, EN uses comma).
 *
 * Brand discipline: IBM Plex Mono only, brand-green + sage + bronze palette,
 * square corners, no shadows, no decorative motion (every animation is
 * cause-effect).
 */
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from 'framer-motion';

type Locale = 'ru' | 'en';

// ─── Copy ─────────────────────────────────────────────────────────────────────

const STRINGS = {
  ru: {
    label: '04 — Разбор',
    ledeTitle: 'Анонимизированный аудит одного аккаунта.',
    ledeSub: 'EU косметика премиум · мульти-SKU Shopify · €8 тыс. в Meta · 4,5 месяца данных.',
    heroSub: 'продающего бюджета — впустую',
    stats: [
      { n: '0.33×', t: 'Истинный ROAS', d: 'vs 1.09×, который показывал кабинет Meta. Безубыточность — 2.2×.' },
      { n: '6', t: 'Мёртвых регионов', d: 'ROAS ≤ 0.12×. €2 тыс. потрачено — €184 вернулось.' },
      { n: '50%', t: 'Появлений креатива — неправильные', d: 'Одно видео во всех плейсментах. В ленте — обрезанные головы. В Stories — пустые поля.' },
    ],
    expand: 'Развернуть разбор полностью',
    collapse: 'Свернуть разбор',
    b1: { t: 'Где деньги исчезают', lede: 'Из €8 218 потраченных в Meta за период бюджет дробится на три потока:' },
    bars: [
      { amount: '€3 991 · 49%', name: 'Продающие кампании с заказами', note: '49 заказов на €2 720' },
      { amount: '€2 968 · 36%', name: 'Продающие кампании · 0 заказов', note: 'Главная утечка бюджета · крупнейший резерв роста' },
      { amount: '€1 259 · 15%', name: 'Охватные кампании · офлайн-магазины', note: 'Офлайн-события не настроены — эффект не измеряется' },
    ],
    b2: {
      t: 'Два табло. Реальность — между ними.',
      lede: 'Meta показывает свой ROAS. Shopify показывает свой. Оба ниже порога безубыточности.',
      metaLabel: 'Что говорит Meta', metaDetail: '118 заказов · €8 995 ценности конверсий',
      shopLabel: 'Что подтверждает Shopify', shopDetail: '49 заказов · €2 720 выручки',
      months: ['Месяц 1', 'Месяц 2', 'Месяц 3', 'Месяц 4', 'Месяц 5'],
      sparkAria: 'ROAS по месяцам: пик 1.31× на третьем месяце, спад до 0.79× на пятом',
      conclusion: 'ROAS рос два месяца, достиг пика 1.31× на третьем месяце и с тех пор снижается до 0.79× к пятому. Усталость креатива — наиболее вероятная причина.',
    },
    b3: {
      t: 'Остановка 1 · Аудитория',
      lede: 'Meta сам распределяет бюджет по возрасту. Решает не клик, а превращение корзины в покупку.',
      head: ['Возраст', 'Бюджет', 'CTR', 'ROAS', 'Вывод'],
      rows: [
        { tone: '', c: ['18–24', '€1 445', '5.4%', '1.17×', 'Минимизировать'] },
        { tone: '', c: ['25–34', '€1 827', '5.3%', '1.27×', 'Сохранить'] },
        { tone: 'bad', c: ['35–44', '€2 422', '6.3%', '0.85×', 'Диагностировать — 715 корзин, 3.2% конверсия'] },
        { tone: 'good', c: ['45–54', '€2 263', '5.3%', '1.81×', 'Усилить — скрытый чемпион'] },
        { tone: '', c: ['55–64', '€951', '3.7%', '0.60×', 'Отключить'] },
        { tone: '', c: ['65+', '€588', '3.2%', '0.35×', 'Отключить'] },
      ],
      conclusion: '€926 на мужскую аудиторию: CTR 0.21%, около 9 покупок. Исключение мужчин — действие в один клик, возвращает почти весь бюджет.',
    },
    b4: {
      t: 'Остановка 2 · География',
      lede: 'Шесть регионов с ROAS ≤ 0.12× получили €2 021 — вернули €184. Один регион в плюсе.',
      head: ['Регион', 'Расход', 'Возврат', 'ROAS', 'Вывод'],
      rows: [
        { tone: 'good', c: ['Регион в плюсе', '€179', '€300', '1.68×', 'Масштабировать'] },
        { tone: '', c: ['Столица', '€4 803', '€1 385', '0.29×', 'Таргетировать прицельно (видимый ROAS занижен — охватные кампании здесь)'] },
        { tone: 'bad', c: ['6 мёртвых регионов', '€2 021', '€184', '≤0.12×', 'Отключить · перенести бюджет в столицу'] },
      ],
    },
    b5: {
      t: 'Остановка 3 · Креатив',
      lede: 'Одно видео крутится во всех плейсментах сразу — у ленты и Stories разные пропорции. Один креатив не может выглядеть правильно везде.',
      items: [
        { good: false, strong: '50% появлений в ленте — с дефектом.', rest: ' Обрезанные головы в Facebook Feed, пустые поля по бокам в Stories.' },
        { good: false, strong: 'Карусель ведёт на главную.', rest: ' Клик по конкретному товару открывает не его, а главную страницу. Часть посетителей уходит — клик оплачен, продажа потеряна.' },
        { good: false, strong: 'AI-улучшения Meta включены.', rest: ' Функции, которые непредсказуемо меняют готовый креатив. Для бренд-контента отключают.' },
        { good: true, strong: 'Эталон уже в аккаунте.', rest: ' Одно объявление: 13 покупок · ROAS 1.81× · CTR 3.01%. Формат Advantage+ Shopping, один товар-герой. Норма, на которую нужно равняться.' },
      ],
    },
    b6: {
      t: 'План · Этап 1 · в рамках того же бюджета',
      brief: 'По этому аккаунту мы бы работали с тем, что уже видно в разборе: вернули бы видимость продаж через корректную сквозную аналитику, перенесли бюджет с убыточных сегментов и регионов на прибыльные, перевели оптимизацию на покупки и привели креативы к правильному формату под каждый плейсмент. Точный список шагов и приоритеты фиксируем после доступа к аккаунту.',
      conclusion: 'Перераспределение не сделает Meta прибыльной мгновенно: порог безубыточности 2.2×, лучший сегмент сейчас 1.81×. Этап 1 останавливает потери и концентрирует бюджет; полная прибыльность канала потребует работы над конверсией сайта и средним чеком.',
    },
    disclaimer: 'Имя бренда и продуктов скрыто с разрешения клиента. Числа округлены минимально, чтобы сохранить структурную точность. Период: 5 месяцев.',
    ctaText: 'Хотите такой же разбор для вашего аккаунта?',
    ctaBtn: 'Получить аудит →',
    inlineCta: 'Разобрать мой аккаунт →',
  },
  en: {
    label: '04 — Teardown',
    ledeTitle: 'Anonymized audit of a single account.',
    ledeSub: 'EU premium cosmetics · multi-SKU Shopify · €8K in Meta · 4.5 months of data.',
    heroSub: 'of the selling budget — wasted',
    stats: [
      { n: '0.33×', t: 'True ROAS', d: 'vs 1.09× shown in the Meta dashboard. Break-even is 2.2×.' },
      { n: '6', t: 'Dead regions', d: 'ROAS ≤ 0.12×. €2K spent — €184 returned.' },
      { n: '50%', t: 'Of creative impressions — incorrect', d: 'One video across every placement. Cropped heads in feed. Empty bars in Stories.' },
    ],
    expand: 'Expand the full teardown',
    collapse: 'Collapse',
    b1: { t: 'Where the money disappears', lede: 'Of the €8,218 spent in Meta over the period, the budget splits into three streams:' },
    bars: [
      { amount: '€3,991 · 49%', name: 'Selling campaigns with orders', note: '49 orders worth €2,720' },
      { amount: '€2,968 · 36%', name: 'Selling campaigns · 0 orders', note: 'The main budget leak · the biggest growth reserve' },
      { amount: '€1,259 · 15%', name: 'Reach campaigns · offline stores', note: 'Offline events not set up — impact unmeasured' },
    ],
    b2: {
      t: 'Two scoreboards. The truth is between them.',
      lede: 'Meta reports one ROAS. Shopify reports another. Both are below break-even.',
      metaLabel: 'What Meta claims', metaDetail: '118 orders · €8,995 conversion value',
      shopLabel: 'What Shopify confirms', shopDetail: '49 orders · €2,720 revenue',
      months: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
      sparkAria: 'ROAS by month: peak 1.31× in month 3, declining to 0.79× in month 5',
      conclusion: 'ROAS climbed for two months, peaked at 1.31× in month 3, and has slid to 0.79× by month 5. Creative fatigue is the likeliest cause.',
    },
    b3: {
      t: 'Stop 1 · Audience',
      lede: "Meta allocates budget across ages on its own. What matters isn't the click — it's turning a cart into a purchase.",
      head: ['Age', 'Budget', 'CTR', 'ROAS', 'Verdict'],
      rows: [
        { tone: '', c: ['18–24', '€1,445', '5.4%', '1.17×', 'Minimize'] },
        { tone: '', c: ['25–34', '€1,827', '5.3%', '1.27×', 'Keep'] },
        { tone: 'bad', c: ['35–44', '€2,422', '6.3%', '0.85×', 'Diagnose — 715 carts, 3.2% conversion'] },
        { tone: 'good', c: ['45–54', '€2,263', '5.3%', '1.81×', 'Scale — hidden champion'] },
        { tone: '', c: ['55–64', '€951', '3.7%', '0.60×', 'Turn off'] },
        { tone: '', c: ['65+', '€588', '3.2%', '0.35×', 'Turn off'] },
      ],
      conclusion: '€926 on the male audience: 0.21% CTR, about 9 purchases. Excluding men is a one-click move that recovers almost all of it.',
    },
    b4: {
      t: 'Stop 2 · Geography',
      lede: 'Six regions with ROAS ≤ 0.12× received €2,021 — returned €184. One region is in the black.',
      head: ['Region', 'Spend', 'Return', 'ROAS', 'Verdict'],
      rows: [
        { tone: 'good', c: ['Region in the black', '€179', '€300', '1.68×', 'Scale'] },
        { tone: '', c: ['Capital region', '€4,803', '€1,385', '0.29×', 'Target precisely (visible ROAS understated — reach campaigns run here)'] },
        { tone: 'bad', c: ['6 dead regions', '€2,021', '€184', '≤0.12×', 'Turn off · move budget to the capital'] },
      ],
    },
    b5: {
      t: 'Stop 3 · Creative',
      lede: "One video runs across every placement at once — feed and Stories have different proportions. One creative can't look right everywhere.",
      items: [
        { good: false, strong: '50% of feed impressions are defective.', rest: ' Cropped heads in the Facebook feed, empty side bars in Stories.' },
        { good: false, strong: 'The carousel links to the homepage.', rest: ' Clicking a specific product opens the homepage instead. Some visitors leave — the click is paid for, the sale is lost.' },
        { good: false, strong: "Meta's AI enhancements are on.", rest: ' Features that unpredictably alter finished creative. For brand content, you turn them off.' },
        { good: true, strong: 'The benchmark is already in the account.', rest: ' One ad: 13 purchases · 1.81× ROAS · 3.01% CTR. Advantage+ Shopping format, one hero product. The bar to match.' },
      ],
    },
    b6: {
      t: 'Plan · Phase 1 · within the same budget',
      brief: "For this account, we'd work from what the teardown already shows: restore sales visibility with proper end-to-end tracking, move budget off the losing segments and regions onto the profitable ones, switch optimization to purchases, and bring creative into the right format for each placement. The exact steps and priorities are set once we have account access.",
      conclusion: "Reallocation won't make Meta profitable overnight: break-even is 2.2×, the best segment is 1.81× today. Phase 1 stops the losses and concentrates the budget; full channel profitability will need work on site conversion and average order value.",
    },
    disclaimer: "Brand and product names hidden with the client's permission. Numbers rounded minimally to preserve structural accuracy. Period: January — May 2026.",
    ctaText: 'Want the same teardown for your account?',
    ctaBtn: 'Get an audit →',
    inlineCta: 'Audit my account →',
  },
} satisfies Record<Locale, unknown>;

const BAR_META = [
  { pct: 49, color: 'bg-sage' },
  { pct: 36, color: 'bg-bronze' },
  { pct: 15, color: 'bg-white/40' },
] as const;

// ─── Animated counter ────────────────────────────────────────────────────────

function CountUp({ end, suffix = '%' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reduced = useReducedMotion();
  const motionVal = useMotionValue(reduced ? end : 0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(reduced ? end : 0);

  useEffect(() => {
    if (!inView || reduced) { setDisplay(end); return; }
    const controls = animate(motionVal, end, { duration: 1.2, ease: [0.2, 0.65, 0.3, 0.95] });
    const unsub = rounded.on('change', (v) => setDisplay(v as number));
    return () => { controls.stop(); unsub(); };
  }, [inView, end, motionVal, rounded, reduced]);

  return (
    <span ref={ref} aria-label={`${end}%`}>
      {display}
      <span className="text-[0.55em] text-sage/70 ml-1">{suffix}</span>
    </span>
  );
}

// ─── ROAS sparkline ──────────────────────────────────────────────────────────

function RoasSparkline({ expanded, months, aria }: { expanded: boolean; months: string[]; aria: string }) {
  const reduced = useReducedMotion();
  const vals = [1.31, 1.17, 1.31, 0.96, 0.79];
  const W = 320, H = 80, maxV = 1.6, minV = 0.6;
  const xs = vals.map((_, i) => (i * W) / (vals.length - 1));
  const ys = vals.map((v) => H - ((v - minV) / (maxV - minV)) * H);
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x},${ys[i]}`).join(' ');
  const peakIdx = vals.reduce((mx, v, i) => (v > vals[mx] ? i : mx), 0);

  return (
    <div className="mt-4">
      <svg viewBox={`-30 0 ${W + 60} ${H + 24}`} className="w-full max-w-[480px] h-auto" role="img" aria-label={aria}>
        <motion.path
          d={path} fill="none" stroke="var(--color-sage)" strokeWidth="1.5"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: expanded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {vals.map((_, i) => (
          <motion.circle
            key={i} cx={xs[i]} cy={ys[i]} r={i === peakIdx ? 4 : 2.5}
            fill={i === peakIdx ? 'var(--color-sage)' : 'var(--color-nearblack)'}
            stroke="var(--color-sage)" strokeWidth="1.5"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
          />
        ))}
        {months.map((m, i) => (
          <text key={m} x={xs[i]} y={H + 18} textAnchor="middle" className="fill-white/70" style={{ fontSize: 11, fontFamily: 'inherit' }}>{m}</text>
        ))}
        <text x={xs[peakIdx]} y={ys[peakIdx] - 10} textAnchor="middle" className="fill-sage" style={{ fontSize: 10, fontFamily: 'inherit', fontWeight: 600 }}>1.31×</text>
      </svg>
    </div>
  );
}

// ─── reusable bits ───────────────────────────────────────────────────────────

function StatCard({ n, t, d, delay }: { n: string; t: string; d: string; delay: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="border border-dim bg-white/[0.025] p-6"
    >
      <div className="text-[clamp(28px,3.2vw,36px)] font-semibold leading-none text-white tabular-nums">{n}</div>
      <div className="mt-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">{t}</div>
      <div className="mt-3 text-[13px] leading-[1.65] text-white/78">{d}</div>
    </motion.div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-12 max-w-[880px] first:mt-0"
    >
      <div className="flex items-baseline gap-4 pb-4.5 mb-5 border-b border-dim">
        <span className="text-[11px] font-semibold tracking-[0.2em] text-sage tabular-nums">{n}</span>
        <h3 className="text-[clamp(18px,2vw,22px)] font-semibold leading-tight text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Conclusion({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 px-5.5 py-4.5 bg-sage/[0.08] border-l-2 border-sage text-[13px] leading-[1.7] text-white/92">{children}</p>;
}

function Th({ children, num }: { children: React.ReactNode; num?: boolean }) {
  return <th scope="col" className={`p-3 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 border-b border-dim ${num ? 'text-right' : 'text-left'}`}>{children}</th>;
}

function DataTable({ head, rows }: { head: string[]; rows: { tone: string; c: string[] }[] }) {
  const toneClass = (tone: string) => (tone === 'bad' ? 'text-bronze' : tone === 'good' ? 'text-sage' : 'text-white/85');
  const lastToneClass = (tone: string) => (tone === 'bad' ? 'text-bronze/85' : tone === 'good' ? 'text-sage/85' : '');
  return (
    <div className="mt-5 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
      <table className="w-full min-w-[520px] sm:min-w-0 text-[13px] tabular-nums border-collapse">
        <thead>
          <tr>{head.map((h, i) => <Th key={h} num={i > 0 && i < head.length - 1}>{h}</Th>)}</tr>
        </thead>
        <tbody className="[&_td]:p-3.5 [&_td]:border-b [&_td]:border-white/[0.04] [&_td]:leading-[1.5] [&_tr:last-child_td]:border-b-0">
          {rows.map((r, ri) => (
            <tr key={ri} className={toneClass(r.tone)}>
              {r.c.map((cell, ci) => {
                const isNum = ci > 0 && ci < r.c.length - 1;
                const isLast = ci === r.c.length - 1;
                return <td key={ci} className={`${isNum ? 'text-right whitespace-nowrap' : ''} ${isLast ? lastToneClass(r.tone) : ''}`}>{cell}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function AuditTeardown({ contactHref, locale = 'ru' }: { contactHref: string; locale?: Locale }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();
  const s = STRINGS[locale];

  return (
    <section id="razbor" className="bg-nearblack py-16 md:py-20 px-6 md:px-10 scroll-mt-[56px]" aria-labelledby="razbor-heading">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">{s.label}</div>

      <h2 id="razbor-heading" className="mt-7 max-w-[720px] text-[clamp(20px,2.6vw,28px)] font-semibold leading-[1.35] text-white tracking-[0.005em]">
        {s.ledeTitle}
        <span className="block mt-3.5 text-[clamp(12px,1.2vw,13px)] font-normal tracking-[0.05em] text-white/60">{s.ledeSub}</span>
      </h2>

      <div className="mt-12 py-8 border-t border-b border-dim">
        <div className="text-[clamp(72px,14vw,168px)] font-semibold leading-[0.95] tracking-[-0.02em] text-sage tabular-nums">
          <CountUp end={43} />
        </div>
        <div className="mt-3 max-w-[480px] text-[clamp(13px,1.3vw,15px)] leading-[1.6] text-white/85">{s.heroSub}</div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {s.stats.map((st, i) => <StatCard key={i} n={st.n} t={st.t} d={st.d} delay={i * 0.08} />)}
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
        <button
          type="button"
          className="inline-flex items-center gap-3.5 min-h-[56px] px-7 py-4.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white bg-transparent border border-sage cursor-pointer transition-colors hover:bg-sage hover:text-nearblack focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[3px] active:scale-[0.98]"
          aria-expanded={expanded} aria-controls="razbor-content"
          onClick={() => setExpanded((x) => !x)}
        >
          <span>{expanded ? s.collapse : s.expand}</span>
          <motion.span aria-hidden="true" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2, ease: 'easeOut' }} className="inline-block">↓</motion.span>
        </button>
        <a
          href={contactHref}
          className="inline-flex items-center min-h-[44px] text-[12px] font-semibold uppercase tracking-[0.1em] text-sage border-b border-transparent hover:border-sage transition-colors focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[3px]"
        >
          {s.inlineCta}
        </a>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="razbor-content" key="content"
            initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ height: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.95] }, opacity: { duration: 0.3, delay: reduced ? 0 : 0.1 } }}
            className="overflow-hidden"
          >
            <div className="mt-12 pt-12 border-t border-dim">

              <Block n="01" title={s.b1.t}>
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">{s.b1.lede}</p>
                <div className="mt-6 flex flex-col gap-4.5">
                  {s.bars.map((bar, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <span className="text-[14px] font-semibold text-white tabular-nums">{bar.amount}</span>
                        <span className={`text-[13px] ${i === 1 ? 'text-bronze' : 'text-white/70'}`}>{bar.name}</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className={`h-full ${BAR_META[i].color}`}
                          initial={reduced ? false : { width: 0 }}
                          animate={{ width: expanded ? `${BAR_META[i].pct}%` : 0 }}
                          transition={{ duration: 0.9, delay: i * 0.15, ease: [0.2, 0.65, 0.3, 0.95] }}
                        />
                      </div>
                      <div className="text-[12px] text-white/70">{bar.note}</div>
                    </div>
                  ))}
                </div>
              </Block>

              <Block n="02" title={s.b2.t}>
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">{s.b2.lede}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-6 border border-dim bg-white/[0.02]">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{s.b2.metaLabel}</div>
                    <div className="mt-3 text-[clamp(36px,4.5vw,56px)] font-semibold leading-none text-white tabular-nums">1.09×</div>
                    <div className="mt-3.5 text-[12px] text-white/70 tabular-nums">{s.b2.metaDetail}</div>
                  </div>
                  <div className="p-6 border border-sage bg-sage/[0.06]">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{s.b2.shopLabel}</div>
                    <div className="mt-3 text-[clamp(36px,4.5vw,56px)] font-semibold leading-none text-sage tabular-nums">0.33×</div>
                    <div className="mt-3.5 text-[12px] text-white/70 tabular-nums">{s.b2.shopDetail}</div>
                  </div>
                </div>
                <RoasSparkline expanded={expanded} months={s.b2.months} aria={s.b2.sparkAria} />
                <Conclusion>{s.b2.conclusion}</Conclusion>
              </Block>

              <Block n="03" title={s.b3.t}>
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">{s.b3.lede}</p>
                <DataTable head={s.b3.head} rows={s.b3.rows} />
                <Conclusion>{s.b3.conclusion}</Conclusion>
              </Block>

              <Block n="04" title={s.b4.t}>
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">{s.b4.lede}</p>
                <DataTable head={s.b4.head} rows={s.b4.rows} />
              </Block>

              <Block n="05" title={s.b5.t}>
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">{s.b5.lede}</p>
                <ul className="mt-5 flex flex-col gap-3.5 list-none p-0">
                  {s.b5.items.map((it, i) => (
                    <li key={i} className={`p-4.5 text-[13px] leading-[1.7] text-white/85 border-l-2 ${it.good ? 'bg-sage/[0.06] border-sage' : 'bg-white/[0.025] border-dim'}`}>
                      <strong className="text-white font-semibold">{it.strong}</strong>{it.rest}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block n="06" title={s.b6.t}>
                <p className="mt-5 text-[14px] leading-[1.7] text-white/82 max-w-[640px]">{s.b6.brief}</p>
                <Conclusion>{s.b6.conclusion}</Conclusion>
              </Block>

              <p className="mt-14 pt-6 border-t border-dim text-[12px] leading-[1.7] text-white/70 max-w-[640px]">{s.disclaimer}</p>

              <div className="mt-9 p-8 bg-green">
                <p className="text-[clamp(16px,1.6vw,18px)] font-semibold text-white max-w-[460px] leading-[1.4]">{s.ctaText}</p>
                <a href={contactHref} className="mt-5 inline-block px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] bg-white text-green border border-white transition-colors hover:bg-transparent hover:text-white">{s.ctaBtn}</a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
