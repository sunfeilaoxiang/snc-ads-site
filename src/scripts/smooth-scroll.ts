/**
 * Lenis smooth-scroll — Tier 1 motion, View-Transition aware (Tier 2).
 *
 * Desktop + fine-pointer only. Disabled under prefers-reduced-motion and on
 * touch (native scroll there). Exposes the instance on window.__lenis so Framer
 * Motion `useScroll` can read Lenis position.
 *
 * With Astro's <ClientRouter />, page content is swapped without a full reload,
 * so the module script runs only once. Lenis is created once (the RAF loop +
 * instance live on `window`), then on every `astro:page-load` we reset scroll,
 * recompute dimensions (resize), and re-bind in-page anchor links for the new
 * DOM. The listener is registered once and fires on the first load too.
 */
import Lenis from "lenis";

let lenis: Lenis | undefined;

function bindAnchors() {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    if (a.dataset.lenisBound) return; // avoid double-binding
    a.dataset.lenisBound = "1";
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id && id.length > 1 && lenis) {
        e.preventDefault();
        lenis.scrollTo(id, { offset: -80 });
      }
    });
  });
}

function setup() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (prefersReduced || !finePointer) return;

  if (!lenis) {
    lenis = new Lenis({
      lerp: 0.12, // tight, not floaty — SNC is precise
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    const raf = (time: number) => {
      lenis!.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  } else {
    // New page swapped in — jump to top and recompute scroll height.
    lenis.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => lenis!.resize());
  }

  bindAnchors();
}

document.addEventListener("astro:page-load", setup);
