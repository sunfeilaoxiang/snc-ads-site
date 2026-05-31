/**
 * HeroTerminal — Tier 2 hero set-piece v2 (replaces the abstract budget line).
 *
 * Demonstrates the product instead of decorating: a mono "account scan" that
 * types out the kind of leaks SNC finds in a Meta account, with euro figures
 * and a recoverable total. Austere terminal — no window chrome — to fit the
 * IBM Plex Mono brutalist brand. Numbers are flagged `sample / illustrative`
 * (Operations Bible: no fake performance metrics).
 *
 * Types out on load (cause-effect: it's running the scan). Under
 * prefers-reduced-motion the full output shows instantly. Desktop-only panel
 * (hidden ≤860px via global.css); content also lives in the AuditTeardown
 * island below for mobile.
 */
"use client";

import { useEffect, useState } from "react";

type Kind = "cmd" | "info" | "leak" | "total" | "note";
type Seg = { indent?: string; main: string; amount?: string; kind: Kind };

const W = 36; // mono column width for right-aligned amounts

const COPY: Record<"ru" | "en", Seg[]> = {
  en: [
    { main: "$ snc audit --meta", kind: "cmd" },
    { main: "▸ scanning 1,204 ad sets…", kind: "info" },
    { main: "▸ 4 leaks found:", kind: "info" },
    {
      indent: "  ",
      main: "duplicate audiences",
      amount: "−€1.8k/mo",
      kind: "leak",
    },
    { indent: "  ", main: "no CAPI dedup", amount: "−€2.4k/mo", kind: "leak" },
    {
      indent: "  ",
      main: "creative fatigue (14d+)",
      amount: "−€3.1k/mo",
      kind: "leak",
    },
    {
      indent: "  ",
      main: "uncapped broad targeting",
      amount: "−€1.2k/mo",
      kind: "leak",
    },
    { main: "▸ recoverable", amount: "€8.5k/mo", kind: "total" },
    { main: "* illustrative — your audit runs on your account", kind: "note" },
  ],
  ru: [
    { main: "$ snc audit --meta", kind: "cmd" },
    { main: "▸ сканирую 1 204 групп объявлений…", kind: "info" },
    { main: "▸ найдено 4 утечки:", kind: "info" },
    {
      indent: "  ",
      main: "дубли аудиторий",
      amount: "−€1.8k/мес",
      kind: "leak",
    },
    {
      indent: "  ",
      main: "нет дедупликации CAPI",
      amount: "−€2.4k/мес",
      kind: "leak",
    },
    {
      indent: "  ",
      main: "усталость креативов",
      amount: "−€3.1k/мес",
      kind: "leak",
    },
    {
      indent: "  ",
      main: "широкий таргет без лимитов",
      amount: "−€1.2k/мес",
      kind: "leak",
    },
    { main: "▸ можно вернуть", amount: "€8.5k/мес", kind: "total" },
    { main: "* пример — реальный аудит по вашему аккаунту", kind: "note" },
  ],
};

function plainOf(s: Seg): string {
  const left = (s.indent ?? "") + s.main;
  if (!s.amount) return left;
  const pad = Math.max(1, W - left.length - s.amount.length);
  return left + " ".repeat(pad) + s.amount;
}

const RATE = 95; // chars per second
const START_DELAY = 550; // let the H1 land first

export default function HeroTerminal({
  locale = "ru",
}: {
  locale?: "ru" | "en";
}) {
  const lines = COPY[locale];
  const total = lines.reduce((n, s) => n + plainOf(s).length + 1, -1);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setTyped(total);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const n = Math.min(total, Math.floor(((t - start) / 1000) * RATE));
      setTyped(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    const to = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, START_DELAY);
    return () => {
      window.clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  // Which line currently holds the typing head (for the cursor) — never the note.
  let cursorLine = 0;
  {
    let head = typed;
    for (let i = 0; i < lines.length; i++) {
      const len = plainOf(lines[i]).length;
      if (lines[i].kind === "note") {
        cursorLine = Math.max(0, i - 1);
        break;
      }
      if (head <= len) {
        cursorLine = i;
        break;
      }
      head -= len + 1;
      cursorLine = i;
    }
  }

  let head = typed;
  return (
    <div className="hero-term" aria-hidden="true">
      <span className="hero-term-tag">
        {locale === "en" ? "sample" : "пример"}
      </span>
      {lines.map((s, i) => {
        const plain = plainOf(s);
        const vis = Math.max(0, Math.min(head, plain.length));
        head -= plain.length + 1;
        const labelEnd = s.amount
          ? plain.length - s.amount.length
          : plain.length;
        const labelText = plain.slice(0, Math.min(vis, labelEnd));
        const amtText = vis > labelEnd ? plain.slice(labelEnd, vis) : "";
        const showCursor = i === cursorLine;
        return (
          <div className={`ht-line ht-${s.kind}`} key={i}>
            <span className="ht-label">{labelText}</span>
            {s.amount ? <span className="ht-amt">{amtText}</span> : null}
            {showCursor ? <span className="hero-term-cursor" /> : null}
          </div>
        );
      })}
    </div>
  );
}
