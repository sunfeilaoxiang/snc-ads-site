/**
 * CustomCursor — Tier 2 micro-interaction (MOTION_PLAN §3.3).
 *
 * A precise sage dot that tracks exactly + a square ring (brand: square corners)
 * that trails with a tight spring and scales over interactive elements. On the
 * audit CTAs (.btn) the ring turns bronze and reveals a "→". Sage reads on both
 * the dark (green/forest) and light (offwhite) sections, so no blend-mode hacks.
 *
 * Desktop + fine-pointer only; never mounts under reduced-motion or on touch —
 * and it only hides the native cursor AFTER it mounts (html.snc-cursor-on), so
 * if JS fails the OS cursor stays. Form fields keep the native caret (global.css).
 */
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [arrow, setArrow] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.documentElement.classList.add("snc-cursor-on");

    const INTERACTIVE =
      "a,button,.btn,[role=button],input,textarea,label,summary,[data-cursor]";

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      setHover(!!t?.closest?.(INTERACTIVE));
      setArrow(!!t?.closest?.(".btn"));
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);
    const onLeave = () => {
      x.set(-100);
      y.set(-100);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("snc-cursor-on");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [x, y]);

  if (!enabled) return null;

  const ringClass = [
    "snc-cursor-ring",
    hover && "is-hover",
    arrow && "is-arrow",
    down && "is-down",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <motion.div
        className="snc-cursor-dot"
        style={{ x, y }}
        aria-hidden="true"
      />
      <motion.div
        className="snc-cursor-ring-wrap"
        style={{ x: ringX, y: ringY }}
        aria-hidden="true"
      >
        <div className={ringClass}>
          <span className="snc-cursor-arrow">&rarr;</span>
        </div>
      </motion.div>
    </>
  );
}
