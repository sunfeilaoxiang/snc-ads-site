/**
 * HeroBudgetLine — Tier 2 hero set-piece (MOTION_PLAN §5, concept C).
 *
 * The headline says "we'll find where the ad budget leaks." This draws that
 * sentence as one line: a jagged, descending *leak* on the left that resolves
 * into a clean, smooth *growth* curve on the right, ending on a bronze node.
 * One cause-effect animation — the core promise, not decoration.
 *
 * Pure Framer `pathLength`. No WebGL, no images. Sits behind the hero text in
 * the lower band of the section so it never competes with the H1 for the LCP.
 * Static final state under prefers-reduced-motion (the resolved line, no draw).
 */
"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Jagged poly-line LEAK (chaotic) → smooth bezier GROWTH (controlled). The
   visual contrast between the straight erratic segment and the clean curve is
   the whole story. viewBox is stretched to the hero via preserveAspectRatio
   "none"; vector-effect keeps the stroke crisp regardless. */
const LEAK =
  "M 0 150 L 110 146 L 190 158 L 250 132 L 300 196 L 352 168 L 404 232 " +
  "L 452 204 L 506 258 L 548 236 L 588 270";
const GROWTH = "C 660 252 726 198 802 150 C 876 104 938 78 988 54";
const PATH = `${LEAK} ${GROWTH}`;

/* The "lost budget" — area under the leak trace down to the baseline. Closes
   the leak path to the floor. Faintly filled, fades in after the line draws. */
const LOST_AREA = `${LEAK} L 588 300 L 0 300 Z`;

const EASE = [0.4, 0, 0.2, 1] as const;
const DRAW = 2.2; // seconds to trace the whole line
const START = 0.45; // let the H1 land first

export default function HeroBudgetLine() {
  const reduce = useReducedMotion();

  // Reduced-motion: render the resolved final state, no animation.
  const draw = reduce
    ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
    : {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
        transition: { duration: DRAW, delay: START, ease: EASE },
      };

  return (
    <div className="hero-line" aria-hidden="true">
      <svg
        viewBox="0 0 1000 300"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          {/* Leak (dim white) → growth (sage) → bronze tip. The draw reveals
              the dim leak first, then the bright recovery. */}
          <linearGradient id="snc-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="48%" stopColor="rgba(255,255,255,0.30)" />
            <stop offset="72%" stopColor="#7fa898" />
            <stop offset="100%" stopColor="#bf9340" />
          </linearGradient>
        </defs>

        {/* Faint baseline — the "0" the budget is measured against. */}
        <line
          x1="0"
          y1="300"
          x2="1000"
          y2="300"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* Lost-budget area under the leak. Subtle; appears after the trace. */}
        <motion.path
          d={LOST_AREA}
          fill="rgba(255,255,255,0.035)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: reduce ? 1 : 1 }}
          transition={
            reduce ? undefined : { duration: 0.8, delay: START + DRAW * 0.55 }
          }
        />

        {/* The budget line itself. */}
        <motion.path
          d={PATH}
          fill="none"
          stroke="url(#snc-line-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          {...draw}
        />

        {/* Growth endpoint — bronze node, the recovered trajectory. */}
        <motion.circle
          cx="988"
          cy="54"
          r="4.5"
          fill="#bf9340"
          initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 1 : 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={
            reduce ? undefined : { duration: 0.4, delay: START + DRAW }
          }
          style={{ transformOrigin: "988px 54px" }}
        />
        <motion.circle
          cx="988"
          cy="54"
          r="4.5"
          fill="none"
          stroke="#bf9340"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          initial={{ scale: 1, opacity: 0 }}
          animate={
            reduce ? { opacity: 0 } : { scale: 3.4, opacity: [0, 0.5, 0] }
          }
          transition={
            reduce ? undefined : { duration: 1.1, delay: START + DRAW + 0.1 }
          }
          style={{ transformOrigin: "988px 54px" }}
        />
      </svg>
    </div>
  );
}
