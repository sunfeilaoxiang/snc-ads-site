/**
 * MetaScorecard — interactive version of the 12-item Meta self-audit.
 *
 * React island, hydrated client-side (client:visible). The founder answers 12
 * yes/partly/no questions across 5 layers; gets a 0–100 score, a band, a
 * per-layer breakdown, and the list of their own red flags — then the audit CTA.
 *
 * Locale-aware: pass locale="ru" | "en". All copy lives in STRINGS so RU and EN
 * render from one component. RU is canonical; the RU translation of the 12 items
 * needs Nikita's sign-off (per FREE_TOOLS_SPEC §6 / TASKS H4).
 *
 * Brand discipline: IBM Plex Mono only, brand-green + sage + bronze palette,
 * square corners, no shadows, numbers over adjectives, no exclamation marks,
 * no emojis. Never show pricing. Never write "SNC Media".
 *
 * Analytics: fires the SOFT `scorecard_completed` / `tool_email_capture` events
 * only — NEVER `generate_lead` / fbq `Lead` (reserved for real audit requests).
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion, motion } from "framer-motion";

type Locale = "ru" | "en";
type Answer = 0 | 1 | 2;
type LayerKey = "tracking" | "structure" | "creative" | "audience" | "numbers";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const WEB3FORMS_ACCESS_KEY = "acd1f7f4-6610-45b3-a0fb-4bf078dd6ef7";
const LAYER_ORDER: LayerKey[] = [
  "tracking",
  "structure",
  "creative",
  "audience",
  "numbers",
];

// Which layer each of the 12 questions belongs to (index 0..11 → question 01..12).
const QUESTION_LAYERS: LayerKey[] = [
  "tracking",
  "tracking", // 01–02
  "structure",
  "structure",
  "structure", // 03–05
  "creative",
  "creative",
  "creative", // 06–08
  "audience",
  "audience", // 09–10
  "numbers",
  "numbers", // 11–12
];

// ─── Copy ─────────────────────────────────────────────────────────────────────

interface Q {
  prompt: string;
  help: string;
  fix: string; // one-line fix shown when answered "No" (red flag)
}

interface Strings {
  label: string;
  options: { yes: string; partly: string; no: string };
  layers: Record<LayerKey, string>;
  questions: Q[];
  crossLink: string; // appears on Q11 & Q12
  progress: (done: number, total: number) => string;
  resultLabel: string;
  scoreOutOf: string;
  bands: { tight: Band; solid: Band; leaking: Band; worst: Band };
  layerBreakdownTitle: string;
  redFlagsTitle: string;
  redFlagsNone: string;
  reset: string;
  cta: { title: string; body: string; btn: string };
  capture: {
    title: string;
    placeholder: string;
    btn: string;
    sending: string;
    ok: string;
    err: string;
    subject: string;
    fromName: string;
  };
  ariaRadioGroup: (n: string) => string;
}

interface Band {
  name: string;
  note: string;
}

const STRINGS: Record<Locale, Strings> = {
  ru: {
    label: "Инструмент — Скоринг",
    options: { yes: "Да", partly: "Частично", no: "Нет / не знаю" },
    layers: {
      tracking: "Трекинг",
      structure: "Структура",
      creative: "Креатив",
      audience: "Аудитория",
      numbers: "Цифры",
    },
    questions: [
      {
        prompt: "Conversions API установлен и дедуплицируется с Pixel.",
        help: "События приходят и из браузера, и с сервера, дубли отсекаются. Браузерный Pixel в одиночку теряет iOS-пользователей и тех, кто за баннером cookie — нередко 30–50% реальных конверсий.",
        fix: "Подключить Conversions API и включить дедупликацию событий с Pixel.",
      },
      {
        prompt: "UTM-метки на каждой ссылке в объявлениях.",
        help: "Без них продажи из Meta падают в Shopify как «прямые» или «органика», и отчётный ROAS занижается — иногда сильно.",
        fix: "Добавить utm_source / utm_medium / utm_campaign / utm_content на все ссылки в рекламе.",
      },
      {
        prompt:
          "Активны только 1–2 кампании на конверсии (без пересечения аукционов).",
        help: "Несколько кампаний на одну аудиторию конкурируют между собой и поднимают ваш же CPM. Система не может собрать единую модель покупателя, если её всё время дробить.",
        fix: "Свести к 1–2 кампаниям на конверсии одновременно; убрать дубли по аудитории и плейсменту.",
      },
      {
        prompt:
          "Кампании получают полное окно обучения (~7 дней) до отключения или масштабирования.",
        help: "Фазе обучения нужно около 50 событий конверсии. Отключение на 2–3 день — это суждение до того, как кампания доучилась. Нервничаете — снижайте дневной бюджет, а не срок.",
        fix: "Давать каждой кампании пройти фазу обучения целиком; вместо ранней остановки снижать бюджет.",
      },
      {
        prompt:
          "Событие конверсии — Purchase (не AddToCart / Initiate Checkout).",
        help: "Оптимизируете на «Добавление в корзину» — Meta найдёт тех, кто добавляет, но не покупает. Система даёт ровно то, что просите.",
        fix: "Переключить оптимизацию на событие Purchase.",
      },
      {
        prompt:
          "Отдельные креативы 9:16 и 1:1/4:5, плейсменты зафиксированы (без авто-кропа).",
        help: "Вертикальное видео в ленте обрезает головы; квадрат в Stories даёт пустые поля. Авто-кроп Meta регулярно центрирует не то.",
        fix: "Делать отдельный файл 9:16 для Stories/Reels и 1:1 или 4:5 для ленты, с фиксацией плейсментов под формат.",
      },
      {
        prompt:
          "AI-улучшения Advantage+ выключены (кроме «Релевантные комментарии»).",
        help: "Meta может переписать текст, непредсказуемо обрезать видео, поменять CTA и наложить чужую музыку. Для бренда, который вам важен, плюса в этом нет.",
        fix: "Выключить все улучшения креатива Advantage+, оставить только «Релевантные комментарии».",
      },
      {
        prompt:
          "Каталожная / Advantage+ Shopping кампания запущена, с бюджетом, ведёт на карточки товара.",
        help: "Для e-commerce каталог систематически дешевле за конверсию — Meta подбирает товар под зрителя. Это ~30–50% бюджета, а не ноль. Клики должны вести на страницу товара, а не на главную.",
        fix: "Запустить каталожную кампанию с бюджетом и диплинками на страницы товаров.",
      },
      {
        prompt: "Возрастной диапазон сужен до реального ICP (не 18–65+).",
        help: "По умолчанию 18–65+ — ловушка. У 55+ один из самых высоких CTR (кликают на всё), но покупают редко. Откройте Разбивки → Возраст и сравните стоимость покупки по группам.",
        fix: "Сузить возраст до реальной целевой аудитории; держать 55+ ниже 10% бюджета, если это не ваш ICP.",
      },
      {
        prompt:
          "Ретаргет-аудитории запущены и с бюджетом (тёплый трафик 5–15% бюджета).",
        help: "Посетители сайта, брошенные корзины, прошлые покупатели должны видеть другое сообщение за меньшую цену. Если 100% бюджета на холодный трафик — вы пропускаете самые дешёвые конверсии.",
        fix: "Запустить ретаргет на тёплые аудитории с 5–15% бюджета и отдельными креативами под стадию.",
      },
      {
        prompt:
          "Отчётный ROAS сходится с выручкой в Shopify / blended-выручкой.",
        help: "После iOS14 отчётный ROAS завышен из-за пересечения атрибуции. Что важно — blended ROAS: вся выручка ÷ весь рекламный расход. Число агентства должно быть в той же зоне, а не вдвое выше.",
        fix: "Сверять отчётный ROAS с выручкой в Shopify и считать blended ROAS по всем каналам.",
      },
      {
        prompt: "Вы знаете целевой ROAS из юнит-экономики (≈ 1 ÷ маржа).",
        help: "Минимальный жизнеспособный ROAS = 1 ÷ маржа, с поправкой на окно окупаемости. Ниже него каждая «продажа» в минус.",
        fix: "Вывести целевой ROAS из маржи, среднего чека, доли возвратов и окна окупаемости.",
      },
    ],
    crossLink: "Не уверены в цифре? → Калькулятор ROAS",
    progress: (done, total) => `Отвечено ${done} из ${total}`,
    resultLabel: "Результат",
    scoreOutOf: "из 100",
    bands: {
      tight: {
        name: "Аккаунт собран плотно",
        note: "Явных потерь мало. Рычаг — в слое цифр.",
      },
      solid: {
        name: "Крепко, но с пробелами",
        note: "Несколько устранимых утечек.",
      },
      leaking: {
        name: "Протекает",
        note: "Несколько слоёв нужно привести в порядок до увеличения бюджета.",
      },
      worst: {
        name: "Это плата не за рекламу. Это плата за неэффективность.",
        note: "Дело не в бюджете, а в слое под ним.",
      },
    },
    layerBreakdownTitle: "По слоям",
    redFlagsTitle: "Ваши красные флаги",
    redFlagsNone:
      "Красных флагов нет. Вопросы, где вы ответили «частично», — следующая зона роста.",
    reset: "Пройти заново",
    cta: {
      title: "Хотите увидеть, где именно в вашем аккаунте утекают деньги?",
      body: "Бесплатный разбор для подходящих проектов. Начинаем с короткого созвона.",
      btn: "Получить аудит",
    },
    capture: {
      title: "Прислать полный чек-лист на почту",
      placeholder: "you@example.com",
      btn: "Прислать чек-лист",
      sending: "Отправляем…",
      ok: "Готово. Чек-лист придёт на почту.",
      err: "Не удалось отправить. Попробуйте ещё раз.",
      subject: "Скоринг аккаунта — результат",
      fromName: "SNC — инструмент",
    },
    ariaRadioGroup: (n) => `Ответ на вопрос ${n}`,
  },
  en: {
    label: "Tool — Scorecard",
    options: { yes: "Yes", partly: "Partly", no: "No / don't know" },
    layers: {
      tracking: "Tracking",
      structure: "Structure",
      creative: "Creative",
      audience: "Audience",
      numbers: "Numbers",
    },
    questions: [
      {
        prompt: "Conversions API installed and de-duplicating with the Pixel.",
        help: "Events arrive from both browser and server, with deduplication on. A browser-only Pixel misses iOS users and anyone behind a cookie banner — often 30–50% of real conversions.",
        fix: "Install the Conversions API and turn on event deduplication with the Pixel.",
      },
      {
        prompt: "UTM parameters on every ad URL.",
        help: 'Without them, Meta-driven sales land in Shopify as "Direct" or "Organic" and your reported ROAS underreads — sometimes by a lot.',
        fix: "Add utm_source / utm_medium / utm_campaign / utm_content to every ad URL.",
      },
      {
        prompt: "Only 1–2 active conversion campaigns (no auction overlap).",
        help: "Multiple campaigns on the same audience bid against each other and inflate your own CPM. The system also cannot build a coherent buyer model if you keep splitting it.",
        fix: "Cut down to 1–2 conversion campaigns running at once; remove audience and placement overlap.",
      },
      {
        prompt:
          "Campaigns get a full ~7-day learning window before kill or scale.",
        help: "The learning phase needs ~50 conversion events. Killing at 2–3 days judges a campaign before it finished learning. If you are nervous, lower the daily budget — not the runtime.",
        fix: "Let each campaign finish its learning phase; lower the budget instead of stopping early.",
      },
      {
        prompt:
          "Conversion event is Purchase (not AddToCart / Initiate Checkout).",
        help: 'Optimize for "Add to Cart" and Meta finds cart-adders who never buy. The system gives you exactly what you ask for.',
        fix: "Switch the optimization event to Purchase.",
      },
      {
        prompt:
          "Separate 9:16 and 1:1/4:5 creatives, placements locked (no auto-crop).",
        help: "Vertical video in Feed crops heads; square in Stories leaves empty bars. Meta auto-crop routinely centres the wrong thing.",
        fix: "Ship a dedicated 9:16 file for Stories/Reels and a 1:1 or 4:5 for Feed, with placements locked to each format.",
      },
      {
        prompt:
          "Advantage+ creative enhancements OFF (except Relevant comments).",
        help: "Meta can rewrite your copy, crop video unpredictably, swap your CTA, even drop in stock music. For a brand you care about there is no upside.",
        fix: "Turn off every Advantage+ creative enhancement; keep only Relevant comments.",
      },
      {
        prompt:
          "Catalog / Advantage+ Shopping campaign live, funded, deep-linked to PDPs.",
        help: "For ecommerce, catalog ads are systematically cheaper per acquisition — Meta picks the right product per viewer. They should be ~30–50% of spend, not zero. Clicks must land on the product page, not the homepage.",
        fix: "Run a funded catalog campaign deep-linked to product pages.",
      },
      {
        prompt: "Age range tightened to your real ICP (not 18–65+).",
        help: "Default 18–65+ is a trap. 55+ users have some of the highest CTRs (they click everything) but rarely buy. Open Breakdowns → Age and compare cost per purchase by bracket.",
        fix: "Tighten the age range to your real ICP; keep 55+ under 10% of spend unless that is your ICP.",
      },
      {
        prompt:
          "Retargeting custom audiences live and funded (warm 5–15% of budget).",
        help: "Site visitors, cart abandoners, and past purchasers should see different messaging at lower CPA. If 100% of budget is cold prospecting, you skip the cheapest conversions in the funnel.",
        fix: "Run retargeting on warm audiences at 5–15% of budget, with creative tailored to the stage.",
      },
      {
        prompt: "Reported ROAS reconciles with Shopify / blended revenue.",
        help: "Post-iOS14, reported ROAS is inflated by attribution overlap. What matters is blended ROAS: total revenue ÷ total ad spend. The agency number should be in the same ballpark, not 2× it.",
        fix: "Reconcile reported ROAS against Shopify revenue and compute blended ROAS across all channels.",
      },
      {
        prompt: "You know your target ROAS from unit economics (≈ 1 ÷ margin).",
        help: 'Your minimum viable ROAS = 1 ÷ gross margin, adjusted for the payback window you can afford. Below it, every "sale" loses money.',
        fix: "Derive your target ROAS from margin, AOV, return rate, and payback window.",
      },
    ],
    crossLink: "Not sure of your number? → ROAS calculator",
    progress: (done, total) => `Answered ${done} of ${total}`,
    resultLabel: "Result",
    scoreOutOf: "of 100",
    bands: {
      tight: {
        name: "Tight account",
        note: "Little obvious waste. The leverage is in the numbers layer.",
      },
      solid: { name: "Solid, with gaps", note: "A few fixable leaks." },
      leaking: {
        name: "Leaking",
        note: "Several layers need work before more spend.",
      },
      worst: {
        name: "You're paying for inefficiency, not media.",
        note: "The fix is the layer underneath, not the budget.",
      },
    },
    layerBreakdownTitle: "By layer",
    redFlagsTitle: "Your red flags",
    redFlagsNone:
      'No red flags. The questions you answered "partly" are the next place to look.',
    reset: "Start over",
    cta: {
      title: "Want to see exactly where the money leaks in your account?",
      body: "A free audit for a fit. It starts with a short call.",
      btn: "Get an audit",
    },
    capture: {
      title: "Email me the full checklist",
      placeholder: "you@example.com",
      btn: "Send the checklist",
      sending: "Sending…",
      ok: "Done. The checklist is on its way.",
      err: "Could not send. Please try again.",
      subject: "Meta Scorecard — result",
      fromName: "SNC — tool",
    },
    ariaRadioGroup: (n) => `Answer for question ${n}`,
  },
};

// ─── Scoring ───────────────────────────────────────────────────────────────────

type BandKey = "tight" | "solid" | "leaking" | "worst";

function bandFor(score: number, redFlags: number): BandKey {
  if (score < 40 || redFlags >= 4) return "worst";
  if (score >= 80) return "tight";
  if (score >= 60) return "solid";
  return "leaking"; // 40..59
}

function bandTone(b: BandKey): { text: string; border: string; bg: string } {
  // sage for healthy, bronze for the lower bands.
  if (b === "tight")
    return { text: "text-sage", border: "border-sage", bg: "bg-sage/[0.08]" };
  if (b === "solid")
    return { text: "text-sage", border: "border-sage", bg: "bg-sage/[0.06]" };
  if (b === "leaking")
    return {
      text: "text-bronze",
      border: "border-bronze",
      bg: "bg-bronze/[0.06]",
    };
  return {
    text: "text-bronze",
    border: "border-bronze",
    bg: "bg-bronze/[0.08]",
  };
}

// ─── Attribution (mirror contact.astro) ─────────────────────────────────────────

const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;

function readAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === "undefined") return out;
  try {
    const store = JSON.parse(
      sessionStorage.getItem("snc-attribution") || "{}",
    ) as Record<string, string>;
    const qs = new URLSearchParams(window.location.search);
    ATTR_KEYS.forEach((k) => {
      const v = qs.get(k) || store[k];
      if (v) out[k] = v;
    });
    out.landing_page = store.landing_page || window.location.pathname;
    out.referrer = store.referrer || document.referrer || "";
  } catch {
    /* sessionStorage unavailable — skip */
  }
  return out;
}

/** Append default UTM params to the contact href only if it has no query string. */
function withToolUtm(href: string): string {
  if (href.includes("?")) return href;
  return `${href}?utm_source=site&utm_medium=tool&utm_content=scorecard`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function MetaScorecard({
  locale = "ru",
  contactHref,
  crossHref,
}: {
  locale?: Locale;
  contactHref: string;
  crossHref?: string;
}) {
  const s = STRINGS[locale];
  const reduced = useReducedMotion();
  const total = s.questions.length;

  const [answers, setAnswers] = useState<(Answer | null)[]>(() =>
    Array<Answer | null>(total).fill(null),
  );
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureBot, setCaptureBot] = useState("");
  const [captureState, setCaptureState] = useState<
    "idle" | "sending" | "ok" | "err"
  >("idle");
  const analyticsFired = useRef(false);

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === total;

  const { score, redFlags, band, perLayer, redFlagItems } = useMemo(() => {
    const filled = answers.map((a) => (a == null ? 0 : a));
    const rawSum = filled.reduce<number>((acc, v) => acc + v, 0);
    const sc = Math.round((rawSum / (total * 2)) * 100);
    const rf = answers.filter((a) => a === 0).length;
    const bk = bandFor(sc, rf);

    // Per-layer points (sum of answers in that layer) vs max (2 × question count).
    const layerAgg: Record<LayerKey, { pts: number; max: number }> = {
      tracking: { pts: 0, max: 0 },
      structure: { pts: 0, max: 0 },
      creative: { pts: 0, max: 0 },
      audience: { pts: 0, max: 0 },
      numbers: { pts: 0, max: 0 },
    };
    QUESTION_LAYERS.forEach((layer, i) => {
      layerAgg[layer].pts += filled[i];
      layerAgg[layer].max += 2;
    });

    // Red flags = questions explicitly answered "No / don't know" (value 0).
    const flags = answers
      .map((a, i) => ({ a, i }))
      .filter((x) => x.a === 0)
      .map((x) => ({ index: x.i, fix: s.questions[x.i].fix }));

    return {
      score: sc,
      redFlags: rf,
      band: bk,
      perLayer: layerAgg,
      redFlagItems: flags,
    };
  }, [answers, total, s.questions]);

  // Fire the soft completion analytics event once, when all 12 are answered.
  // Soft events only — NEVER generate_lead / fbq Lead (real audit requests only).
  // No-ops when consent declined (window.gtag/fbq are absent until consent).
  useEffect(() => {
    if (allAnswered && !analyticsFired.current) {
      analyticsFired.current = true;
      window.gtag?.("event", "scorecard_completed", {
        score_band: band,
        red_flags: redFlags,
      });
      window.fbq?.("trackCustom", "ToolEngaged", { tool: "meta-scorecard" });
    }
    // Allow re-firing if the user edits answers back to incomplete.
    if (!allAnswered) analyticsFired.current = false;
  }, [allAnswered, band, redFlags]);

  const setAnswer = (qi: number, v: Answer) => {
    setAnswers((prev) => {
      const next = prev.slice();
      next[qi] = v;
      return next;
    });
  };

  const reset = () => {
    setAnswers(Array<Answer | null>(total).fill(null));
    setCaptureState("idle");
  };

  const tone = bandTone(band);
  const bandCopy = s.bands[band];

  const resultSummary = useMemo(() => {
    const ansStr = answers
      .map(
        (a, i) => `Q${String(i + 1).padStart(2, "0")}:${a == null ? "-" : a}`,
      )
      .join(" ");
    return `score=${score}/100 redFlags=${redFlags} band=${band} | ${ansStr}`;
  }, [answers, score, redFlags, band]);

  const submitCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captureBot) return; // honeypot tripped
    if (!captureEmail || !allAnswered) return;
    setCaptureState("sending");
    const fd = new FormData();
    fd.append("access_key", WEB3FORMS_ACCESS_KEY);
    fd.append("subject", s.capture.subject);
    fd.append("from_name", s.capture.fromName);
    fd.append("tool", "meta-scorecard");
    fd.append("result_summary", resultSummary);
    fd.append("email", captureEmail);
    fd.append("botcheck", "");
    const attr = readAttribution();
    Object.entries(attr).forEach(([k, v]) => fd.append(k, v));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      const data = (await res.json()) as { success?: boolean };
      if (data.success) {
        setCaptureState("ok");
        if (typeof window !== "undefined") {
          window.gtag?.("event", "tool_email_capture", {
            tool: "meta-scorecard",
          });
        }
      } else {
        setCaptureState("err");
      }
    } catch {
      setCaptureState("err");
    }
  };

  const ctaHref = withToolUtm(contactHref);

  return (
    <section
      className="bg-nearblack px-6 py-16 md:px-10 md:py-20"
      aria-labelledby="scorecard-heading"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
        {s.label}
      </div>

      {/* Progress */}
      <div
        className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3"
        aria-hidden="true"
      >
        <div className="h-1.5 w-full max-w-[420px] bg-white/[0.06]">
          <motion.div
            className="h-full bg-sage"
            initial={false}
            animate={{ width: `${(answeredCount / total) * 100}%` }}
            transition={
              reduced ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }
            }
          />
        </div>
        <span className="text-[12px] tabular-nums text-white/70">
          {s.progress(answeredCount, total)}
        </span>
      </div>
      <p className="sr-only" aria-live="polite">
        {s.progress(answeredCount, total)}
      </p>

      {/* Questions */}
      <h2 id="scorecard-heading" className="sr-only">
        {locale === "ru" ? "12 проверок" : "12 checks"}
      </h2>
      <ol className="mt-10 flex max-w-[820px] list-none flex-col gap-0 p-0">
        {s.questions.map((q, i) => {
          const layer = QUESTION_LAYERS[i];
          const num = String(i + 1).padStart(2, "0");
          const showCross = i === 10 || i === 11; // Q11 & Q12
          return (
            <li
              key={i}
              className="border-t border-dim py-7 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] font-semibold tabular-nums tracking-[0.15em] text-sage">
                  {num}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  {s.layers[layer]}
                </span>
              </div>
              <p className="mt-3 max-w-[640px] text-[15px] font-semibold leading-[1.5] text-white">
                {q.prompt}
              </p>
              <p className="mt-2.5 max-w-[640px] text-[13px] leading-[1.65] text-white/65">
                {q.help}
              </p>

              {showCross && crossHref && (
                <a
                  href={crossHref}
                  className="mt-3 inline-flex min-h-[36px] items-center text-[12px] font-semibold text-sage transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[3px]"
                >
                  {s.crossLink}
                </a>
              )}

              <div
                role="radiogroup"
                aria-label={`${num} — ${s.ariaRadioGroup(num)}`}
                className="mt-4 flex flex-wrap gap-2.5"
              >
                {(["yes", "partly", "no"] as const).map((key) => {
                  const val: Answer =
                    key === "yes" ? 2 : key === "partly" ? 1 : 0;
                  const selected = answers[i] === val;
                  return (
                    <label
                      key={key}
                      className="relative inline-flex cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        className="peer absolute inset-0 m-0 cursor-pointer opacity-0"
                        checked={selected}
                        onChange={() => setAnswer(i, val)}
                      />
                      <span
                        className={`select-none border px-4 py-3 text-[13px] leading-none transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sage ${
                          selected
                            ? "border-green bg-green text-white"
                            : "border-dim bg-[#141414] text-white/70 hover:border-sage"
                        }`}
                      >
                        {s.options[key]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Result */}
      <div className="mt-12 max-w-[820px]" aria-live="polite">
        {!allAnswered ? (
          <p className="border-t border-dim pt-8 text-[13px] leading-[1.7] text-white/60">
            {s.progress(answeredCount, total)}.{" "}
            {locale === "ru"
              ? "Ответьте на все 12, чтобы увидеть результат."
              : "Answer all 12 to see your result."}
          </p>
        ) : (
          <div className="border-t border-dim pt-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {s.resultLabel}
            </div>

            {/* Score + band */}
            <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
              <div
                className={`text-[clamp(64px,12vw,120px)] font-semibold leading-[0.9] tabular-nums ${tone.text}`}
              >
                {score}
                <span className="ml-2 text-[0.22em] font-normal text-white/50">
                  {s.scoreOutOf}
                </span>
              </div>
              <div
                className={`flex-1 min-w-[240px] border-l-2 ${tone.border} ${tone.bg} px-5 py-4`}
              >
                <div
                  className={`text-[clamp(15px,1.8vw,18px)] font-semibold leading-[1.35] ${tone.text}`}
                >
                  {bandCopy.name}
                </div>
                <p className="mt-2 text-[13px] leading-[1.6] text-white/80">
                  {bandCopy.note}
                </p>
              </div>
            </div>

            {/* Per-layer mini-bars */}
            <div className="mt-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                {s.layerBreakdownTitle}
              </div>
              <div className="mt-5 flex flex-col gap-4">
                {LAYER_ORDER.map((layer) => {
                  const { pts, max } = perLayer[layer];
                  const pct = max === 0 ? 0 : (pts / max) * 100;
                  const low = pct < 50;
                  return (
                    <div key={layer} className="flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-white/80">
                          {s.layers[layer]}
                        </span>
                        <span className="text-[12px] tabular-nums text-white/60">
                          {pts}/{max}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden bg-white/[0.06]">
                        <motion.div
                          className={`h-full ${low ? "bg-bronze" : "bg-sage"}`}
                          initial={reduced ? false : { width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={
                            reduced
                              ? { duration: 0 }
                              : { duration: 0.7, ease: [0.2, 0.65, 0.3, 0.95] }
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Red flags */}
            <div className="mt-10">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-bronze">
                {s.redFlagsTitle}
              </div>
              {redFlagItems.length === 0 ? (
                <p className="mt-4 max-w-[640px] text-[13px] leading-[1.7] text-white/70">
                  {s.redFlagsNone}
                </p>
              ) : (
                <ul className="mt-4 flex list-none flex-col gap-2.5 p-0">
                  {redFlagItems.map(({ index, fix }) => (
                    <li
                      key={index}
                      className="border-l-2 border-bronze bg-bronze/[0.06] py-3.5 pl-4 pr-4 text-[13px] leading-[1.6] text-white/85"
                    >
                      <span className="mr-2 font-semibold tabular-nums text-bronze">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {fix}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex min-h-[44px] items-center text-[12px] font-semibold uppercase tracking-[0.1em] text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[3px]"
            >
              {s.reset}
            </button>

            {/* Audit CTA */}
            <div className="mt-10 bg-green p-8">
              <p className="max-w-[460px] text-[clamp(16px,1.6vw,18px)] font-semibold leading-[1.4] text-white">
                {s.cta.title}
              </p>
              <p className="mt-3 max-w-[460px] text-[13px] leading-[1.6] text-white/85">
                {s.cta.body}
              </p>
              <a
                href={ctaHref}
                className="mt-5 inline-block border border-white bg-white px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-green transition-colors hover:bg-transparent hover:text-white"
              >
                {s.cta.btn}
              </a>
            </div>

            {/* Optional email capture */}
            <form onSubmit={submitCapture} className="mt-8 max-w-[460px]">
              <label
                htmlFor="scorecard-email"
                className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/55"
              >
                {s.capture.title}
              </label>
              {/* honeypot */}
              <input
                type="checkbox"
                tabIndex={-1}
                autoComplete="off"
                className="absolute left-[-9999px]"
                aria-hidden="true"
                checked={!!captureBot}
                onChange={(e) => setCaptureBot(e.target.checked ? "1" : "")}
              />
              <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  id="scorecard-email"
                  type="email"
                  required
                  value={captureEmail}
                  onChange={(e) => setCaptureEmail(e.target.value)}
                  placeholder={s.capture.placeholder}
                  className="min-w-0 flex-1 border border-dim bg-[#141414] px-3.5 py-3 font-mono text-[13px] text-white placeholder:text-white/40 focus:border-sage focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={captureState === "sending"}
                  className="whitespace-nowrap border border-sage bg-transparent px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-sage hover:text-nearblack focus-visible:outline-2 focus-visible:outline-sage focus-visible:outline-offset-[3px] disabled:cursor-default disabled:opacity-50"
                >
                  {captureState === "sending"
                    ? s.capture.sending
                    : s.capture.btn}
                </button>
              </div>
              <p
                className={`mt-3 min-h-[1em] text-[12px] leading-[1.6] ${
                  captureState === "ok"
                    ? "text-sage"
                    : captureState === "err"
                      ? "text-bronze"
                      : "text-transparent"
                }`}
                role="status"
                aria-live="polite"
              >
                {captureState === "ok"
                  ? s.capture.ok
                  : captureState === "err"
                    ? s.capture.err
                    : " "}
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
