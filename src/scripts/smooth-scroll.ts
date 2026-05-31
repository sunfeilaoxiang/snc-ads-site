/**
 * Lenis smooth-scroll — Tier 1 motion.
 *
 * Desktop + fine-pointer only. Disabled under prefers-reduced-motion and on
 * touch (native scroll there — smooth-scroll is a desktop polish, not a mobile
 * requirement). Exposes the instance on window.__lenis so Framer Motion
 * `useScroll` can read Lenis position in later tiers (pinned/parallax).
 */
import Lenis from "lenis";

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (!prefersReduced && finePointer) {
  const lenis = new Lenis({
    lerp: 0.12, // tight, not floaty — SNC is precise
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Make in-page anchor links use Lenis.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -80 });
      }
    });
  });

  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
}
