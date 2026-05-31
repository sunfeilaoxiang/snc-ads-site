/**
 * ScrollProgress — thin bronze rail at the very top that fills with scroll.
 * Tier 1 motion. Framer `useScroll` + spring for a smooth, weighted feel.
 * Cause-effect: "where am I in the page." Harmless under reduced-motion
 * (it only reflects scroll position; no autonomous animation).
 */
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}
