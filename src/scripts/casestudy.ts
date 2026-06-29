/**
 * Case-study chrome: sidebar TOC scroll-spy + (Cabrillo's) scroll-progress
 * bar. Re-initialised on every View Transitions navigation; listeners are
 * torn down before each swap so nothing leaks between pages.
 */
let scrollHandler: (() => void) | null = null;

function teardown() {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }
}

function init() {
  teardown();

  // Ensure the gameplay demo video autoplays. The muted *attribute* in the
  // injected markup doesn't reliably set the muted *property* after a View
  // Transitions swap, which makes browsers block autoplay and freeze the
  // video on frame 1 — so set it explicitly and kick playback.
  const video = document.getElementById("gameplayVideo") as HTMLVideoElement | null;
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.sidebar-toc a[href^="#"]'),
  );
  if (!links.length) return;

  const targets = links
    .map((a) => ({
      a,
      el: document.getElementById(a.getAttribute("href")!.slice(1)),
    }))
    .filter((t): t is { a: HTMLAnchorElement; el: HTMLElement } => !!t.el);

  // Cabrillo's fixed scroll-progress bar (first child is the green fill).
  const bar = document.querySelector<HTMLElement>('div[style*="z-index: 199"]');
  const fill = bar?.firstElementChild as HTMLElement | undefined;

  const onScroll = () => {
    const y = window.scrollY + 120;
    let current = targets[0];
    for (const t of targets) if (t.el.offsetTop <= y) current = t;
    for (const t of targets) {
      const on = t === current;
      t.a.classList.toggle("is-active", on);
      t.a.setAttribute("data-current", on ? "true" : "false");
    }
    if (fill) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  scrollHandler = onScroll;
}

export function setupCaseStudy() {
  document.addEventListener("astro:page-load", init);
  document.addEventListener("astro:before-swap", teardown);
}
