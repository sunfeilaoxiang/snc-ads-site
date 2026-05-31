/**
 * RoasCalculator — Tool 1, the True ROAS Calculator (contribution-margin / breakeven).
 *
 * React island, hydrated client-side (client:visible). Recomputes live on every
 * input change — no submit. Ungated: the result is always visible. An optional
 * email capture posts to Web3Forms (delivers result + the 12-check checklist).
 *
 * Locale-aware: pass locale="ru" | "en". All copy lives in STRINGS so RU and EN
 * render from one component. RU is canonical; EN is a native adaptation.
 *
 * Brand discipline: IBM Plex Mono only, brand-green + sage + bronze palette,
 * square corners, no shadows, numbers over adjectives, no exclamation marks,
 * no emojis, no jargon. Never shows pricing. Never "SNC Media".
 *
 * Logic is spec §2.3 verbatim. Worked example (spend 5000, metaRoas 2.8, aov 60,
 * margin 55, ship 6, returns 8, fees 3) → breakeven 2.59, contributionRoas 1.08,
 * profitAfterAdSpend +€410, verdict "thin".
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";

type Locale = "ru" | "en";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const WEB3FORMS_ACCESS_KEY = "acd1f7f4-6610-45b3-a0fb-4bf078dd6ef7";

// ─── Inputs ─────────────────────────────────────────────────────────────────

type FieldKey =
  | "spend"
  | "metaRoas"
  | "aov"
  | "grossMarginPct"
  | "shipPerOrder"
  | "returnRate"
  | "feesPct";

type Inputs = Record<FieldKey, number>;

const DEFAULTS: Inputs = {
  spend: 5000,
  metaRoas: 2.8,
  aov: 60,
  grossMarginPct: 55,
  shipPerOrder: 6,
  returnRate: 8,
  feesPct: 3,
};

type FieldDef = {
  key: FieldKey;
  unit: "€" | "×" | "%";
  step: number;
  min: number;
  max: number;
};

const FIELDS: FieldDef[] = [
  { key: "spend", unit: "€", step: 100, min: 0, max: 100000 },
  { key: "metaRoas", unit: "×", step: 0.1, min: 0, max: 20 },
  { key: "aov", unit: "€", step: 1, min: 0, max: 2000 },
  { key: "grossMarginPct", unit: "%", step: 1, min: 0, max: 100 },
  { key: "shipPerOrder", unit: "€", step: 0.5, min: 0, max: 200 },
  { key: "returnRate", unit: "%", step: 1, min: 0, max: 100 },
  { key: "feesPct", unit: "%", step: 0.5, min: 0, max: 50 },
];

// ─── Result band ──────────────────────────────────────────────────────────────

type Band = "healthy" | "thin" | "loss" | "broken";

type Result = {
  effContribRate: number;
  breakevenRoas: number;
  contributionRoas: number;
  profitAfterAdSpend: number;
  band: Band;
  leak: "returns" | "fees" | "shipping" | "margin";
};

function compute(i: Inputs): Result {
  const m = i.grossMarginPct / 100;
  const f = i.feesPct / 100;
  const r = i.returnRate / 100;

  const contributionPerOrder = i.aov * m - i.shipPerOrder - i.aov * f;
  const contributionMarginRate = i.aov > 0 ? contributionPerOrder / i.aov : 0;
  const effContribRate = contributionMarginRate * (1 - r);

  // Identify the biggest leak as a share of AOV (for the "where this leaks" line).
  const returnsDrag = contributionMarginRate * r; // share of revenue lost to returns
  const feeDrag = f;
  const shipDrag = i.aov > 0 ? i.shipPerOrder / i.aov : 0;
  const marginGap = 1 - m; // COGS share of revenue
  const leaks: { name: Result["leak"]; v: number }[] = [
    { name: "returns", v: returnsDrag },
    { name: "fees", v: feeDrag },
    { name: "shipping", v: shipDrag },
    { name: "margin", v: marginGap },
  ];
  const leak = leaks.reduce((a, b) => (b.v > a.v ? b : a)).name;

  if (!(effContribRate > 0)) {
    return {
      effContribRate,
      breakevenRoas: Infinity,
      contributionRoas: 0,
      profitAfterAdSpend: -i.spend,
      band: "broken",
      leak,
    };
  }

  const breakevenRoas = 1 / effContribRate;
  const contributionRoas = i.metaRoas * effContribRate;
  const monthlyAdRevenue = i.spend * i.metaRoas;
  const monthlyContribution = monthlyAdRevenue * effContribRate;
  const profitAfterAdSpend = monthlyContribution - i.spend;

  const band: Band =
    contributionRoas >= 1.3
      ? "healthy"
      : contributionRoas >= 1.0
        ? "thin"
        : "loss";

  return {
    effContribRate,
    breakevenRoas,
    contributionRoas,
    profitAfterAdSpend,
    band,
    leak,
  };
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const STRINGS = {
  ru: {
    inputsLabel: "01 — Ваши цифры",
    fields: {
      spend: "Расход на рекламу в месяц, €",
      metaRoas: "ROAS по отчёту Meta",
      aov: "Средний чек (AOV), €",
      grossMarginPct: "Маржа на товар (после себестоимости), %",
      shipPerOrder: "Доставка на заказ, €",
      returnRate: "Доля возвратов, %",
      feesPct: "Комиссии (эквайринг и пр.), %",
    } as Record<FieldKey, string>,
    reset: "Сбросить к примеру",
    resultLabel: "02 — Результат",
    breakeven: "Безубыточный ROAS",
    breakevenNote: "Ниже этого каждый евро расхода теряет деньги.",
    contribution: "Ваш ROAS по прибыли",
    contributionNote:
      "Сколько остаётся после себестоимости, доставки, возвратов и комиссий.",
    profit: "€/месяц после расхода на рекламу",
    profitNote: "Сколько реклама приносит сверх того, что стоит сама.",
    verdict: {
      healthy: "Запас есть. Реклама зарабатывает с подушкой.",
      thin: "Тонко — один плохой месяц до безубыточности.",
      loss: "Ниже безубыточности — вы покупаете выручку себе в убыток.",
      broken: "Маржа слишком тонкая, чтобы выйти в ноль при любом ROAS.",
    } as Record<Band, string>,
    leakLead: "Где утекает сильнее всего:",
    leak: {
      returns:
        "возвраты — каждый возврат обнуляет вклад заказа, а доставку и комиссии вы уже оплатили.",
      fees: "комиссии — съедают заметную долю каждого заказа.",
      shipping: "доставка велика относительно среднего чека.",
      margin: "себестоимость — на товар остаётся мало маржи до рекламы.",
    } as Record<Result["leak"], string>,
    assumption:
      "Вклад до постоянных расходов и зарплат. Возврат считаем как ноль вклада — доставку и комиссии по нему вы уже заплатили. Это та же прикидка на салфетке, что мы делаем перед тем, как назвать цену аудита.",
    ctaTitle:
      "Хотите увидеть, где именно в вашем аккаунте утекает разница? Бесплатный разбор для подходящих проектов. Начинаем с короткого созвона.",
    ctaBtn: "Получить аудит →",
    crossLink: "Ещё 11 вещей, которые двигают эту цифру → Скоринг аккаунта",
    emailLabel: "03 — На почту",
    emailPrompt:
      "Прислать результат и чек-лист «12 проверок Meta-аккаунта» на почту.",
    emailPlaceholder: "you@example.com",
    emailBtn: "Прислать результат и чек-лист на почту",
    emailSending: "Отправляем…",
    emailOk: "Готово. Результат и чек-лист отправлены на почту.",
    emailErr: "Не удалось отправить. Попробуйте ещё раз.",
    subject: "Калькулятор ROAS — результат",
    fromName: "SNC — инструмент",
    sumInputs: "Ввод",
    sumBreakeven: "Безубыточный ROAS",
    sumContribution: "ROAS по прибыли",
    sumProfit: "€/мес после расхода",
    sumVerdict: "Вывод",
  },
  en: {
    inputsLabel: "01 — Your numbers",
    fields: {
      spend: "Monthly ad spend, €",
      metaRoas: "Meta-reported ROAS",
      aov: "Average order value, €",
      grossMarginPct: "Gross margin after COGS, %",
      shipPerOrder: "Shipping cost per order, €",
      returnRate: "Return / refund rate, %",
      feesPct: "Payment + transaction fees, %",
    } as Record<FieldKey, string>,
    reset: "Reset to example",
    resultLabel: "02 — Result",
    breakeven: "Breakeven ROAS",
    breakevenNote: "Below this, every euro of spend loses money.",
    contribution: "Your contribution ROAS",
    contributionNote: "What is left after COGS, shipping, returns, and fees.",
    profit: "€/month after ad spend",
    profitNote: "What the ads net beyond paying for themselves.",
    verdict: {
      healthy: "Healthy cushion. The ads earn with room to spare.",
      thin: "Thin — one bad month from breakeven.",
      loss: "Below breakeven — you're buying revenue at a loss.",
      broken: "Margin too thin to break even at any ROAS.",
    } as Record<Band, string>,
    leakLead: "Where it leaks most:",
    leak: {
      returns:
        "returns — each one zeroes the order, and you already paid shipping and fees on it.",
      fees: "fees — they eat a meaningful share of every order.",
      shipping: "shipping is large relative to the order value.",
      margin: "COGS — little product margin is left before ads.",
    } as Record<Result["leak"], string>,
    assumption:
      "Contribution before fixed costs and opex. A returned order is treated as zero contribution; you still paid shipping and fees on it. This is the same back-of-envelope we run before quoting an audit.",
    ctaTitle:
      "Want to see where exactly that gap leaks in your account? A free audit for a fit. We start with a short call.",
    ctaBtn: "Get an audit →",
    crossLink: "See the 11 other things that move this number → Meta Scorecard",
    emailLabel: "03 — Email it",
    emailPrompt: "Email me the result and the 12-check Meta-account checklist.",
    emailPlaceholder: "you@example.com",
    emailBtn: "Email me the result + checklist",
    emailSending: "Sending…",
    emailOk: "Done. The result and checklist are on their way.",
    emailErr: "Could not send. Try again.",
    subject: "True ROAS Calculator — result",
    fromName: "SNC — tool",
    sumInputs: "Inputs",
    sumBreakeven: "Breakeven ROAS",
    sumContribution: "Contribution ROAS",
    sumProfit: "€/mo after spend",
    sumVerdict: "Verdict",
  },
} satisfies Record<Locale, unknown>;

// ─── Number formatting (RU thin-space, EN comma) ──────────────────────────────

function fmtEuro(v: number, locale: Locale): string {
  const rounded = Math.round(v);
  const sign = rounded < 0 ? "−" : "";
  const abs = Math.abs(rounded).toString();
  const sep = locale === "ru" ? " " : ",";
  const grouped = abs.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return `${sign}€${grouped}`;
}

function fmtRoas(v: number): string {
  if (!isFinite(v)) return "∞";
  return `${v.toFixed(2)}×`;
}

// ─── Animated number ───────────────────────────────────────────────────────────

function AnimNum({
  value,
  format,
}: {
  value: number;
  format: (v: number) => string;
}) {
  const reduced = useReducedMotion();
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  const out = useTransform(mv, (v) => v);

  useEffect(() => {
    if (reduced || !isFinite(value)) {
      setDisplay(value);
      return;
    }
    const controls = animate(mv, value, {
      duration: 0.5,
      ease: [0.2, 0.65, 0.3, 0.95],
    });
    const unsub = out.on("change", (v) => setDisplay(v as number));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, mv, out, reduced]);

  return <span className="tabular-nums">{format(display)}</span>;
}

// ─── Field row ─────────────────────────────────────────────────────────────────

function Field({
  def,
  label,
  value,
  onChange,
}: {
  def: FieldDef;
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const id = `roas-${def.key}`;
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60"
      >
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : ""}
          min={def.min}
          max={def.max}
          step={def.step}
          onChange={(e) => {
            const n = e.target.valueAsNumber;
            onChange(Number.isNaN(n) ? 0 : n);
          }}
          className="w-32 flex-shrink-0 border border-dim bg-[#141414] px-3.5 py-3 text-[14px] tabular-nums text-white transition-colors focus:border-sage focus:outline-none"
        />
        <input
          type="range"
          aria-label={label}
          tabIndex={-1}
          value={
            Number.isFinite(value)
              ? Math.min(Math.max(value, def.min), def.max)
              : def.min
          }
          min={def.min}
          max={def.max}
          step={def.step}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="h-1 flex-1 cursor-pointer accent-sage"
        />
        <span className="w-4 flex-shrink-0 text-right text-[12px] text-white/50">
          {def.unit}
        </span>
      </div>
    </div>
  );
}

// ─── Big result number ───────────────────────────────────────────────────────

function BigNum({
  label,
  note,
  value,
  format,
  tone,
}: {
  label: string;
  note: string;
  value: number;
  format: (v: number) => string;
  tone: "white" | "sage" | "bronze";
}) {
  const color =
    tone === "sage"
      ? "text-sage"
      : tone === "bronze"
        ? "text-bronze"
        : "text-white";
  return (
    <div className="border border-dim bg-white/[0.02] p-6">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
        {label}
      </div>
      <div
        className={`mt-3 text-[clamp(32px,5vw,52px)] font-semibold leading-none tabular-nums ${color}`}
      >
        <AnimNum value={value} format={format} />
      </div>
      <div className="mt-3.5 text-[12px] leading-[1.6] text-white/70">
        {note}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function RoasCalculator({
  locale = "ru",
  contactHref,
  crossHref,
}: {
  locale?: Locale;
  contactHref: string;
  crossHref?: string;
}) {
  const s = STRINGS[locale];
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const result = useMemo(() => compute(inputs), [inputs]);

  const set = (key: FieldKey, v: number) =>
    setInputs((prev) => ({ ...prev, [key]: v }));

  // CTA href: append tool utm params if the href has no query string yet.
  const ctaHref = contactHref.includes("?")
    ? contactHref
    : `${contactHref}?utm_source=site&utm_medium=tool&utm_content=roas-calc`;

  // ── Analytics: fire roas_calc_completed on first render and on debounced settle.
  const firedRef = useRef(false);
  useEffect(() => {
    const t = setTimeout(() => {
      const band = result.band === "broken" ? "loss" : result.band; // map broken into the loss band
      window.gtag?.("event", "roas_calc_completed", {
        below_breakeven: result.contributionRoas < 1,
        contribution_roas_band: band,
      });
      if (!firedRef.current) {
        firedRef.current = true;
        window.fbq?.("trackCustom", "ToolEngaged", { tool: "roas-calculator" });
      }
    }, 600);
    return () => clearTimeout(t);
  }, [result.band, result.contributionRoas]);

  // ── Email capture state.
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<
    "idle" | "sending" | "ok" | "err"
  >("idle");
  const botRef = useRef<HTMLInputElement>(null);

  const profitTone: "sage" | "bronze" =
    result.profitAfterAdSpend >= 0 ? "sage" : "bronze";
  const contribTone: "sage" | "bronze" =
    result.band === "healthy" ? "sage" : "bronze";
  const verdictColor = result.band === "healthy" ? "text-sage" : "text-bronze";

  function resultSummary(): string {
    const verdictText = s.verdict[result.band];
    const lines = [
      `${s.sumInputs}: spend=${inputs.spend}, metaRoas=${inputs.metaRoas}, aov=${inputs.aov}, margin=${inputs.grossMarginPct}%, ship=${inputs.shipPerOrder}, returns=${inputs.returnRate}%, fees=${inputs.feesPct}%`,
      `${s.sumBreakeven}: ${fmtRoas(result.breakevenRoas)}`,
      `${s.sumContribution}: ${fmtRoas(result.contributionRoas)}`,
      `${s.sumProfit}: ${fmtEuro(result.profitAfterAdSpend, locale)}`,
      `${s.sumVerdict}: ${verdictText}`,
    ];
    return lines.join(" | ");
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (botRef.current?.checked) return; // honeypot
    if (!email) return;
    setEmailState("sending");

    const fd = new FormData();
    fd.append("access_key", WEB3FORMS_ACCESS_KEY);
    fd.append("subject", s.subject);
    fd.append("from_name", s.fromName);
    fd.append("tool", "roas-calculator");
    fd.append("result_summary", resultSummary());
    fd.append("email", email);

    // Attribution from sessionStorage (first-touch) + current URL.
    try {
      const store = JSON.parse(
        sessionStorage.getItem("snc-attribution") || "{}",
      );
      const qs = new URLSearchParams(window.location.search);
      (
        [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
          "fbclid",
          "gclid",
        ] as const
      ).forEach((k) => {
        const v = qs.get(k) || store[k];
        if (v) fd.append(k, v);
      });
      fd.append("landing_page", store.landing_page || window.location.pathname);
      fd.append("referrer", store.referrer || document.referrer || "");
    } catch {
      // attribution is best-effort
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const data: { success?: boolean } = await res.json();
      if (data.success) {
        setEmailState("ok");
        window.gtag?.("event", "tool_email_capture", {
          tool: "roas-calculator",
        });
      } else {
        setEmailState("err");
      }
    } catch {
      setEmailState("err");
    }
  }

  return (
    <section
      className="bg-nearblack px-6 py-16 text-white md:px-10 md:py-20"
      aria-labelledby="roas-tool-heading"
    >
      <h2 id="roas-tool-heading" className="sr-only">
        {s.resultLabel}
      </h2>

      <div className="mx-auto grid max-w-[1040px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* ── Inputs ── */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
            {s.inputsLabel}
          </div>
          <div className="mt-7 flex flex-col gap-6">
            {FIELDS.map((def) => (
              <Field
                key={def.key}
                def={def}
                label={s.fields[def.key]}
                value={inputs[def.key]}
                onChange={(v) => set(def.key, v)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setInputs(DEFAULTS)}
            className="mt-7 inline-flex min-h-[44px] items-center text-[11px] font-semibold uppercase tracking-[0.1em] text-sage transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sage"
          >
            {s.reset}
          </button>
        </div>

        {/* ── Result ── */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
            {s.resultLabel}
          </div>

          <div
            className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2"
            aria-live="polite"
          >
            <BigNum
              label={s.breakeven}
              note={s.breakevenNote}
              value={result.breakevenRoas}
              format={fmtRoas}
              tone="white"
            />
            <BigNum
              label={s.contribution}
              note={s.contributionNote}
              value={result.contributionRoas}
              format={fmtRoas}
              tone={contribTone}
            />
            <div className="sm:col-span-2">
              <BigNum
                label={s.profit}
                note={s.profitNote}
                value={result.profitAfterAdSpend}
                format={(v) => fmtEuro(v, locale)}
                tone={profitTone}
              />
            </div>
          </div>

          <p
            className={`mt-5 border-l-2 px-5 py-4 text-[14px] font-semibold leading-[1.5] ${verdictColor} ${
              result.band === "healthy"
                ? "border-sage bg-sage/[0.08]"
                : "border-bronze bg-bronze/[0.08]"
            }`}
            aria-live="polite"
          >
            {s.verdict[result.band]}
          </p>

          {result.band !== "broken" && (
            <p className="mt-4 text-[12px] leading-[1.7] text-white/70">
              <span className="text-white/85">{s.leakLead}</span>{" "}
              {s.leak[result.leak]}
            </p>
          )}
        </div>
      </div>

      {/* ── Assumption ── */}
      <p className="mx-auto mt-12 max-w-[1040px] border-t border-dim pt-6 text-[12px] leading-[1.7] text-white/60">
        {s.assumption}
      </p>

      {/* ── Audit CTA ── */}
      <div className="mx-auto mt-10 max-w-[1040px] bg-green p-8">
        <p className="max-w-[560px] text-[clamp(15px,1.6vw,18px)] font-semibold leading-[1.45] text-white">
          {s.ctaTitle}
        </p>
        <a
          href={ctaHref}
          className="mt-5 inline-block border border-white bg-white px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-green transition-colors hover:bg-transparent hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
        >
          {s.ctaBtn}
        </a>
      </div>

      {/* ── Cross-link to the scorecard ── */}
      {crossHref && (
        <div className="mx-auto mt-6 max-w-[1040px]">
          <a
            href={crossHref}
            className="inline-flex min-h-[44px] items-center border-b border-transparent text-[12px] font-semibold uppercase tracking-[0.1em] text-sage transition-colors hover:border-sage focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sage"
          >
            {s.crossLink}
          </a>
        </div>
      )}

      {/* ── Optional email capture ── */}
      <div className="mx-auto mt-10 max-w-[1040px] border-t border-dim pt-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
          {s.emailLabel}
        </div>
        <p className="mt-4 max-w-[560px] text-[13px] leading-[1.7] text-white/82">
          {s.emailPrompt}
        </p>
        <form
          onSubmit={onEmailSubmit}
          className="mt-5 flex max-w-[520px] flex-col gap-3 sm:flex-row"
        >
          <input
            ref={botRef}
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px]"
          />
          <label htmlFor="roas-email" className="sr-only">
            {s.emailPlaceholder}
          </label>
          <input
            id="roas-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={s.emailPlaceholder}
            disabled={emailState === "ok"}
            className="flex-1 border border-dim bg-[#141414] px-3.5 py-3 text-[13px] text-white transition-colors placeholder:text-white/40 focus:border-sage focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={emailState === "sending" || emailState === "ok"}
            className="border border-sage bg-transparent px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-sage hover:text-nearblack focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-sage disabled:opacity-50"
          >
            {emailState === "sending" ? s.emailSending : s.emailBtn}
          </button>
        </form>
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 min-h-[1em] text-[12px] leading-[1.6] ${
            emailState === "ok"
              ? "text-sage"
              : emailState === "err"
                ? "text-bronze"
                : ""
          }`}
        >
          {emailState === "ok"
            ? s.emailOk
            : emailState === "err"
              ? s.emailErr
              : ""}
        </p>
      </div>
    </section>
  );
}
