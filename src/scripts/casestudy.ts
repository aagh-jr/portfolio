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

  // Booklet flipbooks (Cabrillo): the original interactive viewer was exported
  // as static HTML with no page-turn logic. Re-wire a lightweight one — each
  // `.flipbook` carries its page list in `data-pages`; prev/next + clicking
  // the stage's right/left half turns the page.
  document.querySelectorAll<HTMLElement>(".flipbook").forEach((fb) => {
    if (fb.dataset.wired) return;
    fb.dataset.wired = "1";
    const pages = (fb.dataset.pages || "").split(",").filter(Boolean);
    if (!pages.length) return;
    const img = fb.querySelector<HTMLImageElement>(".flip-img");
    const prev = fb.querySelector<HTMLButtonElement>(".flip-prev");
    const next = fb.querySelector<HTMLButtonElement>(".flip-next");
    const stage = fb.querySelector<HTMLElement>(".flip-stage");
    const counter = fb.querySelector<HTMLElement>(".flip-counter");
    if (!img || !prev || !next || !stage || !counter) return;
    let i = 0;
    const render = () => {
      img.src = pages[i];
      counter.textContent = `${i + 1} / ${pages.length}`;
      for (const [btn, off] of [[prev, i === 0], [next, i === pages.length - 1]] as const) {
        btn.disabled = off;
        btn.style.opacity = off ? "0.3" : "1";
        btn.style.pointerEvents = off ? "none" : "auto";
      }
    };
    const go = (d: number) => { i = Math.max(0, Math.min(pages.length - 1, i + d)); render(); };
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    stage.addEventListener("click", (e) => {
      const r = stage.getBoundingClientRect();
      go((e.clientX - r.left) / r.width > 0.5 ? 1 : -1);
    });
    render();
  });

  document.querySelectorAll<HTMLButtonElement>(".feature-toggle").forEach((button) => {
    if (button.dataset.wired) return;
    const targetId = button.getAttribute("aria-controls");
    const detail = targetId ? document.getElementById(targetId) : null;
    if (!detail) return;
    button.dataset.wired = "1";
    button.textContent = "+";
    button.setAttribute("aria-label", "Show more feature information");
    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!expanded));
      button.textContent = expanded ? "+" : "−";
      button.setAttribute("aria-label", expanded ? "Show more feature information" : "Hide more feature information");
      detail.hidden = expanded;
    });
  });

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
