/**
 * AuditTeardown — embedded anonymized audit teardown for the homepage.
 *
 * Renders as a React island, hydrated client-side. Uses Framer Motion for
 * scroll-triggered + interaction animations and respects prefers-reduced-motion
 * (Framer Motion does this natively when useReducedMotion is used).
 *
 * Animations:
 *   - Hero number animates 0 → 43 on first scroll into view
 *   - Stat cards stagger-fade-in as section enters viewport
 *   - Expand reveal uses AnimatePresence + height auto layout transition
 *   - Bar widths animate to target percentages when expand happens
 *   - Sparkline draws in
 *   - Each expanded section fades up as user scrolls past
 *
 * Brand discipline: single typeface (IBM Plex Mono), brand-green + sage + bronze
 * palette only, square corners (no border-radius), no shadows, no decorative
 * motion — every animation expresses a cause-effect relationship.
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

// ─── Animated counter ────────────────────────────────────────────────────────

function CountUp({ end, duration = 1.2, suffix = '%' }: { end: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reduced = useReducedMotion();
  const motionVal = useMotionValue(reduced ? end : 0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(reduced ? end : 0);

  useEffect(() => {
    if (!inView || reduced) {
      setDisplay(end);
      return;
    }
    const controls = animate(motionVal, end, {
      duration,
      ease: [0.2, 0.65, 0.3, 0.95],
    });
    const unsub = rounded.on('change', (v) => setDisplay(v as number));
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, end, duration, motionVal, rounded, reduced]);

  return (
    <span ref={ref} aria-label={`${end} процентов`}>
      {display}
      <span className="text-[0.55em] text-sage/70 ml-1">{suffix}</span>
    </span>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  n,
  title,
  detail,
  delay,
}: {
  n: string;
  title: string;
  detail: string;
  delay: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="border border-dim bg-white/[0.025] p-6"
    >
      <div className="text-[clamp(28px,3.2vw,36px)] font-semibold leading-none text-white tabular-nums">
        {n}
      </div>
      <div className="mt-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage">
        {title}
      </div>
      <div className="mt-3 text-[13px] leading-[1.65] text-white/78">{detail}</div>
    </motion.div>
  );
}

// ─── Animated budget bar ─────────────────────────────────────────────────────

function BudgetBar({
  amount,
  name,
  note,
  pct,
  color,
  delay,
  expanded,
}: {
  amount: string;
  name: string;
  note: string;
  pct: number;
  color: 'sage' | 'bronze' | 'white';
  delay: number;
  expanded: boolean;
}) {
  const reduced = useReducedMotion();
  const fillBg = {
    sage: 'bg-sage',
    bronze: 'bg-bronze',
    white: 'bg-white/40',
  }[color];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span className="text-[14px] font-semibold text-white tabular-nums">{amount}</span>
        <span className={`text-[13px] ${color === 'bronze' ? 'text-bronze' : 'text-white/70'}`}>
          {name}
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full ${fillBg}`}
          initial={reduced ? false : { width: 0 }}
          animate={{ width: expanded ? `${pct}%` : 0 }}
          transition={{ duration: 0.9, delay, ease: [0.2, 0.65, 0.3, 0.95] }}
        />
      </div>
      <div className="text-[12px] text-white/55">{note}</div>
    </div>
  );
}

// ─── ROAS sparkline ──────────────────────────────────────────────────────────

function RoasSparkline({ expanded }: { expanded: boolean }) {
  const reduced = useReducedMotion();
  // Jan, Feb, Mar, Apr, May  (months, ROAS)
  const points = [
    { m: 'Янв', v: 1.31 },
    { m: 'Фев', v: 1.17 },
    { m: 'Мар', v: 1.31 },
    { m: 'Апр', v: 0.96 },
    { m: 'Май', v: 0.79 },
  ];
  const W = 320;
  const H = 80;
  const maxV = 1.6;
  const minV = 0.6;
  const xs = points.map((_, i) => (i * W) / (points.length - 1));
  const ys = points.map((p) => H - ((p.v - minV) / (maxV - minV)) * H);
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x},${ys[i]}`).join(' ');
  const peakIdx = points.reduce((mx, p, i, arr) => (p.v > arr[mx].v ? i : mx), 0);

  return (
    <div className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H + 24}`}
        className="w-full max-w-[480px] h-auto"
        role="img"
        aria-label="ROAS по месяцам: пик 1.31× в марте, спад до 0.79× в мае"
      >
        {/* Breakeven reference line at 2.2× — out of chart range, so just a label */}
        <motion.path
          d={path}
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="1.5"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: expanded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={p.m}
            cx={xs[i]}
            cy={ys[i]}
            r={i === peakIdx ? 4 : 2.5}
            fill={i === peakIdx ? 'var(--color-sage)' : 'var(--color-nearblack)'}
            stroke="var(--color-sage)"
            strokeWidth="1.5"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
          />
        ))}
        {/* Month labels */}
        {points.map((p, i) => (
          <text
            key={p.m}
            x={xs[i]}
            y={H + 18}
            textAnchor="middle"
            className="fill-white/50"
            style={{ fontSize: 10, fontFamily: 'inherit' }}
          >
            {p.m}
          </text>
        ))}
        {/* Peak label */}
        <text
          x={xs[peakIdx]}
          y={ys[peakIdx] - 10}
          textAnchor="middle"
          className="fill-sage"
          style={{ fontSize: 10, fontFamily: 'inherit', fontWeight: 600 }}
        >
          1.31×
        </text>
      </svg>
    </div>
  );
}

// ─── Section block wrapper with scroll-fade ──────────────────────────────────

function Block({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
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
        <span className="text-[11px] font-semibold tracking-[0.2em] text-sage tabular-nums">
          {n}
        </span>
        <h3 className="text-[clamp(18px,2vw,22px)] font-semibold leading-tight text-white">
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  );
}

// ─── The whole thing ─────────────────────────────────────────────────────────

export default function AuditTeardown({ contactHref }: { contactHref: string }) {
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  return (
    <section
      className="bg-nearblack py-16 md:py-20 px-6 md:px-10"
      aria-labelledby="razbor-heading"
    >
      {/* Section label */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
        04 — Разбор
      </div>

      {/* Lede */}
      <h2
        id="razbor-heading"
        className="mt-7 max-w-[720px] text-[clamp(20px,2.6vw,28px)] font-semibold leading-[1.35] text-white tracking-[0.005em]"
      >
        Анонимизированный аудит одного аккаунта.
        <span className="block mt-3.5 text-[clamp(12px,1.2vw,13px)] font-normal tracking-[0.05em] text-white/60">
          EU&nbsp;косметика премиум · мульти-SKU Shopify · €8 тыс. в Meta · 4,5 месяца 2026.
        </span>
      </h2>

      {/* Hero number */}
      <div className="mt-12 py-8 border-t border-b border-dim">
        <div
          className="text-[clamp(72px,14vw,168px)] font-semibold leading-[0.95] tracking-[-0.02em] text-sage tabular-nums"
        >
          <CountUp end={43} />
        </div>
        <div className="mt-3 max-w-[480px] text-[clamp(13px,1.3vw,15px)] leading-[1.6] text-white/85">
          продающего бюджета — впустую
        </div>
      </div>

      {/* Three stat cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          n="0.33×"
          title="Истинный ROAS"
          detail="vs 1.09×, который показывал кабинет Meta. Безубыточность — 2.2×."
          delay={0}
        />
        <StatCard
          n="6"
          title="Мёртвых регионов"
          detail="ROAS ≤ 0.12×. €2 тыс. потрачено — €184 вернулось."
          delay={0.08}
        />
        <StatCard
          n="50%"
          title="Появлений креатива — сломаны"
          detail="Одно видео во всех плейсментах. В ленте — обрезанные головы. В Stories — пустые поля."
          delay={0.16}
        />
      </div>

      {/* Expand button */}
      <button
        type="button"
        className="mt-9 inline-flex items-center gap-3.5 min-h-[56px] px-7 py-4.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white bg-transparent border border-sage cursor-pointer transition-colors hover:bg-sage hover:text-nearblack focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[3px] active:scale-[0.98]"
        aria-expanded={expanded}
        aria-controls="razbor-content"
        onClick={() => setExpanded((x) => !x)}
      >
        <span>
          {expanded ? 'Свернуть разбор' : 'Развернуть разбор полностью'}
        </span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="inline-block"
        >
          ↓
        </motion.span>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="razbor-content"
            key="content"
            initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.95] },
              opacity: { duration: 0.3, delay: reduced ? 0 : 0.1 },
            }}
            className="overflow-hidden"
          >
            <div className="mt-12 pt-12 border-t border-dim">
              {/* 01 — Where money goes */}
              <Block n="01" title="Где деньги исчезают">
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">
                  Из €8&nbsp;218 потраченных в Meta за период бюджет дробится на три потока:
                </p>
                <div className="mt-6 flex flex-col gap-4.5">
                  <BudgetBar
                    amount="€3 991 · 49%"
                    name="Продающие кампании с заказами"
                    note="49 заказов на €2 720"
                    pct={49}
                    color="sage"
                    delay={0}
                    expanded={expanded}
                  />
                  <BudgetBar
                    amount="€2 968 · 36%"
                    name="Продающие кампании · 0 заказов"
                    note="Главная утечка бюджета · крупнейший резерв роста"
                    pct={36}
                    color="bronze"
                    delay={0.15}
                    expanded={expanded}
                  />
                  <BudgetBar
                    amount="€1 259 · 15%"
                    name="Охватные кампании · офлайн-магазины"
                    note="Офлайн-события не настроены — эффект не измеряется"
                    pct={15}
                    color="white"
                    delay={0.3}
                    expanded={expanded}
                  />
                </div>
              </Block>

              {/* 02 — ROAS reality */}
              <Block n="02" title="Два табло. Реальность — между ними.">
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">
                  Meta показывает свой ROAS. Shopify показывает свой. Оба ниже порога безубыточности.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-6 border border-dim bg-white/[0.02]">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                      Что говорит Meta
                    </div>
                    <div className="mt-3 text-[clamp(36px,4.5vw,56px)] font-semibold leading-none text-white tabular-nums">
                      1.09×
                    </div>
                    <div className="mt-3.5 text-[12px] text-white/70 tabular-nums">
                      118 заказов · €8 995 ценности конверсий
                    </div>
                  </div>
                  <div className="p-6 border border-sage bg-sage/[0.06]">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                      Что подтверждает Shopify
                    </div>
                    <div className="mt-3 text-[clamp(36px,4.5vw,56px)] font-semibold leading-none text-sage tabular-nums">
                      0.33×
                    </div>
                    <div className="mt-3.5 text-[12px] text-white/70 tabular-nums">
                      49 заказов · €2 720 выручки
                    </div>
                  </div>
                </div>
                <RoasSparkline expanded={expanded} />
                <p className="mt-6 px-5.5 py-4.5 bg-sage/[0.08] border-l-2 border-sage text-[13px] leading-[1.7] text-white/92">
                  ROAS рос два месяца, достиг пика 1.31× в марте и с тех пор снижается до 0.79× в мае. Усталость креатива — наиболее вероятная причина.
                </p>
              </Block>

              {/* 03 — Audience */}
              <Block n="03" title="Остановка 1 · Аудитория">
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">
                  Meta сам распределяет бюджет по возрасту. Решает не клик, а превращение корзины в покупку.
                </p>
                <div className="mt-5 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                  <table className="w-full text-[13px] tabular-nums border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">
                          Возраст
                        </th>
                        <th className="text-right p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">
                          Бюджет
                        </th>
                        <th className="text-right p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">
                          CTR
                        </th>
                        <th className="text-right p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">
                          ROAS
                        </th>
                        <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">
                          Вывод
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_td]:p-3.5 [&_td]:border-b [&_td]:border-white/[0.04] [&_td]:leading-[1.5] [&_tr:last-child_td]:border-b-0">
                      <tr className="text-white/85"><td>18–24</td><td className="text-right">€1 445</td><td className="text-right">5.4%</td><td className="text-right">1.17×</td><td>Минимизировать</td></tr>
                      <tr className="text-white/85"><td>25–34</td><td className="text-right">€1 827</td><td className="text-right">5.3%</td><td className="text-right">1.27×</td><td>Сохранить</td></tr>
                      <tr className="text-bronze"><td>35–44</td><td className="text-right">€2 422</td><td className="text-right">6.3%</td><td className="text-right">0.85×</td><td className="text-bronze/85">Диагностировать — 715 корзин, 3.2% конверсия</td></tr>
                      <tr className="text-sage"><td>45–54</td><td className="text-right">€2 263</td><td className="text-right">5.3%</td><td className="text-right">1.81×</td><td className="text-sage/85">Усилить — скрытый чемпион</td></tr>
                      <tr className="text-white/85"><td>55–64</td><td className="text-right">€951</td><td className="text-right">3.7%</td><td className="text-right">0.60×</td><td>Отключить</td></tr>
                      <tr className="text-white/85"><td>65+</td><td className="text-right">€588</td><td className="text-right">3.2%</td><td className="text-right">0.35×</td><td>Отключить</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-6 px-5.5 py-4.5 bg-sage/[0.08] border-l-2 border-sage text-[13px] leading-[1.7] text-white/92">
                  €926 на мужскую аудиторию: CTR 0.21%, около 9 покупок. Исключение мужчин — действие в один клик, возвращает почти весь бюджет.
                </p>
              </Block>

              {/* 04 — Geography */}
              <Block n="04" title="Остановка 2 · География">
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">
                  Шесть регионов с ROAS ≤ 0.12× получили €2 021 — вернули €184. Один регион в плюсе.
                </p>
                <div className="mt-5 overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
                  <table className="w-full text-[13px] tabular-nums border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">Регион</th>
                        <th className="text-right p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">Расход</th>
                        <th className="text-right p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">Возврат</th>
                        <th className="text-right p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">ROAS</th>
                        <th className="text-left p-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50 border-b border-dim">Вывод</th>
                      </tr>
                    </thead>
                    <tbody className="[&_td]:p-3.5 [&_td]:border-b [&_td]:border-white/[0.04] [&_td]:leading-[1.5] [&_tr:last-child_td]:border-b-0">
                      <tr className="text-sage"><td>Регион в плюсе</td><td className="text-right">€179</td><td className="text-right">€300</td><td className="text-right">1.68×</td><td className="text-sage/85">Масштабировать</td></tr>
                      <tr className="text-white/85"><td>Столица</td><td className="text-right">€4 803</td><td className="text-right">€1 385</td><td className="text-right">0.29×</td><td>Таргетировать прицельно (видимый ROAS занижен — охватные кампании здесь)</td></tr>
                      <tr className="text-bronze"><td>6 мёртвых регионов</td><td className="text-right">€2 021</td><td className="text-right">€184</td><td className="text-right">≤0.12×</td><td className="text-bronze/85">Отключить · перенести бюджет в столицу</td></tr>
                    </tbody>
                  </table>
                </div>
              </Block>

              {/* 05 — Creative */}
              <Block n="05" title="Остановка 3 · Креатив">
                <p className="text-[14px] leading-[1.7] text-white/82 max-w-[640px]">
                  Одно видео крутится во всех плейсментах сразу — у ленты и Stories разные пропорции. Один ассет не может выглядеть правильно везде.
                </p>
                <ul className="mt-5 flex flex-col gap-3.5 list-none p-0">
                  <li className="p-4.5 bg-white/[0.025] border-l-2 border-dim text-[13px] leading-[1.7] text-white/85">
                    <strong className="text-white font-semibold">50% появлений в ленте — с дефектом.</strong> Обрезанные головы в Facebook Feed, пустые поля по бокам в Stories.
                  </li>
                  <li className="p-4.5 bg-white/[0.025] border-l-2 border-dim text-[13px] leading-[1.7] text-white/85">
                    <strong className="text-white font-semibold">Карусель ведёт на главную.</strong> Клик по конкретному товару открывает не его, а главную страницу. Часть посетителей уходит — клик оплачен, продажа потеряна.
                  </li>
                  <li className="p-4.5 bg-white/[0.025] border-l-2 border-dim text-[13px] leading-[1.7] text-white/85">
                    <strong className="text-white font-semibold">AI-улучшения Meta включены.</strong> Функции, которые непредсказуемо меняют готовый креатив. Для бренд-контента отключают.
                  </li>
                  <li className="p-4.5 bg-sage/[0.06] border-l-2 border-sage text-[13px] leading-[1.7] text-white/85">
                    <strong className="text-white font-semibold">Эталон уже в аккаунте.</strong> Одно объявление: 13 покупок · ROAS 1.81× · CTR 3.01%. Формат Advantage+ Shopping, один товар-герой. Норма, на которую нужно равняться.
                  </li>
                </ul>
              </Block>

              {/* 06 — Plan */}
              <Block n="06" title="План · Этап 1 · в рамках того же бюджета">
                <ol className="mt-5 p-0 list-none grid grid-cols-1 gap-2.5 [counter-reset:plan]">
                  {[
                    'UTM-метки на всю рекламу Meta — половина продаж снова станет видимой',
                    'Отключить 65+, 55–64 и мужчин; группу 18–24 минимизировать',
                    'Сфокусироваться на столице; шесть мёртвых регионов отключить',
                    'Видео в двух форматах (квадрат + вертикаль); отключить AI-улучшения',
                    'Меньше кампаний, дольше срок жизни, адекватный дневной бюджет',
                    'Перевести оптимизацию с «Initiate Checkout» на «Purchase»',
                    'Карусель: каждая карточка ведёт на страницу своего товара',
                    'Пилот каталожной рекламы — самый дешёвый формат для e-commerce',
                  ].map((line, i) => (
                    <li
                      key={i}
                      className="p-4.5 pl-14 bg-white/[0.025] text-[13px] leading-[1.6] text-white/88 relative"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute left-4.5 top-4.5 text-[12px] font-semibold tracking-[0.1em] text-sage tabular-nums"
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {line}
                    </li>
                  ))}
                </ol>
                <p className="mt-6 px-5.5 py-4.5 bg-sage/[0.08] border-l-2 border-sage text-[13px] leading-[1.7] text-white/92">
                  Перераспределение не сделает Meta прибыльной мгновенно: порог безубыточности 2.2×, лучший сегмент сейчас 1.81×. Этап 1 останавливает потери и концентрирует бюджет; полная прибыльность канала потребует работы над конверсией сайта и средним чеком.
                </p>
              </Block>

              {/* Disclaimer */}
              <p className="mt-14 pt-6 border-t border-dim text-[11px] leading-[1.7] text-white/50 max-w-[640px]">
                Имя бренда и продуктов скрыто с разрешения клиента. Числа округлены минимально, чтобы сохранить структурную точность. Период: январь — май 2026.
              </p>

              {/* CTA */}
              <div className="mt-9 p-8 bg-green">
                <p className="text-[clamp(16px,1.6vw,18px)] font-semibold text-white max-w-[460px] leading-[1.4]">
                  Хотите такой же разбор для вашего аккаунта?
                </p>
                <a
                  href={contactHref}
                  className="mt-5 inline-block px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] bg-white text-green border border-white transition-colors hover:bg-transparent hover:text-white"
                >
                  Получить аудит →
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
