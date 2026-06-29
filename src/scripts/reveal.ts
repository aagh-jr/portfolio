import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    /** True once the visitor has navigated client-side (after first swap). */
    __spaNav?: boolean;
    /** Guards one-time wiring of the projects page toggle/entrance. */
    __projWired?: boolean;
  }
}

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-triggered reveals: any element tagged `data-reveal` fades/slides up
 * as it enters the viewport. Optional `data-reveal-delay` (seconds) and
 * `data-reveal-y` (px, default 24) tune the motion.
 */
function initScrollReveals() {
  const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
  els.forEach((el) => {
    const delay = parseFloat(el.dataset.revealDelay || "0");
    const y = parseFloat(el.dataset.revealY || "24");
    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      },
    );
  });
}

/**
 * Above-the-fold load animation: items tagged `data-load-item` inside a
 * `data-load-stagger` container fade up on initial paint, staggered.
 */
function showLoadStagger(animate: boolean) {
  const groups = gsap.utils.toArray<HTMLElement>("[data-load-stagger]");
  groups.forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>("[data-load-item]");
    if (!items.length) return;
    if (!animate) {
      // SPA navigation: View Transitions own the cross-fade, so just reveal
      // the items instantly (no stagger) — keeps both directions symmetric.
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }
    const base = parseFloat(group.dataset.loadDelay || "0.05");
    gsap.fromTo(
      items,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.1,
        delay: base,
      },
    );
  });
}

/** Run all reveal animations for the current page. */
export function runReveals() {
  // Reduced motion: the CSS guard already keeps everything visible.
  if (prefersReduced()) return;
  // The staggered load animation only plays on the initial document load;
  // subsequent SPA navigations are clean View Transition cross-fades.
  showLoadStagger(!window.__spaNav);
  initScrollReveals();
  ScrollTrigger.refresh();
}

/**
 * Wire up reveals for Astro's View Transitions lifecycle. `astro:page-load`
 * fires on the initial load and after every navigation; we kill old
 * ScrollTriggers before each swap so they don't leak between pages, and flag
 * that we're now navigating client-side (so entrances don't replay).
 */
export function setupReveals() {
  document.addEventListener("astro:page-load", runReveals);
  document.addEventListener("astro:before-swap", () => {
    window.__spaNav = true;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  });
}
