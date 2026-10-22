/**
 * Case-study chrome: sidebar TOC scroll-spy + (Cabrillo's) scroll-progress
 * bar. Re-initialised on every View Transitions navigation; listeners are
 * torn down before each swap so nothing leaks between pages.
 */
let scrollHandler: (() => void) | null = null;
let evidenceCleanup: (() => void) | null = null;

function teardown() {
  if (scrollHandler) {
    window.removeEventListener("scroll", scrollHandler);
    scrollHandler = null;
  }
  evidenceCleanup?.();
  evidenceCleanup = null;
}

// SkinSavior's evidence-by-claim motion: one 5.67s CSS timeline, restarted
// every cycle while the figure is on screen. Unplayed = the finished table.
const EVIDENCE_LOOP_MS = 5666.667;
const EVIDENCE_TYPE_MS = 1666.667;

function setupEvidenceMotion() {
  const fig = document.querySelector<HTMLElement>(".ss-evidence");
  if (!fig || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Split each summary into per-character spans (screen readers get the
  // original text once, via a visually hidden copy).
  fig.querySelectorAll<HTMLElement>(".ss-ev-summary").forEach((p) => {
    if (p.dataset.split) return;
    const text = p.textContent ?? "";
    p.dataset.split = "1";
    p.style.setProperty("--step", `${EVIDENCE_TYPE_MS / text.length}ms`);
    const visual = document.createElement("span");
    visual.setAttribute("aria-hidden", "true");
    Array.from(text).forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ss-ev-ch";
      s.style.setProperty("--i", String(i));
      s.textContent = ch;
      visual.append(s);
    });
    const sr = document.createElement("span");
    sr.className = "ss-sr";
    sr.textContent = text;
    p.replaceChildren(sr, visual);
  });

  let timer: number | undefined;
  const restart = () => {
    fig.classList.remove("is-playing");
    void fig.offsetWidth; // reflow so the animations start over
    fig.classList.add("is-playing");
  };
  const io = new IntersectionObserver(([entry]) => {
    window.clearInterval(timer);
    if (entry.isIntersecting) {
      restart();
      timer = window.setInterval(restart, EVIDENCE_LOOP_MS);
    } else {
      fig.classList.remove("is-playing");
    }
  });
  io.observe(fig);

  evidenceCleanup = () => {
    window.clearInterval(timer);
    io.disconnect();
  };
}

function init() {
  teardown();
  setupEvidenceMotion();

  // Ensure the gameplay demo video autoplays. The muted *attribute* in the
  // injected markup doesn't reliably set the muted *property* after a View
  // Transitions swap, which makes browsers block autoplay and freeze the
  // video on frame 1 — so set it explicitly and kick playback.
  const video = document.getElementById("gameplayVideo") as HTMLVideoElement | null;
  if (video) {
    video.muted = true;
    video.play().catch(() => {});
  }

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

// "Back" to the home page returns to this project's card in Work (or its box
// in the Lab)
// (the home page reads and clears the key). Other ways home start on the paper.
function rememberBack(e: Event) {
  if (!(e.target as Element).closest?.(".sidebar-back, .ss-back")) return;
  sessionStorage.setItem("homeScrollTo", location.pathname.replace(/\/$/, ""));
}

export function setupCaseStudy() {
  if (!window.__caseBackWired) {
    window.__caseBackWired = true;
    document.addEventListener("click", rememberBack);
  }
  document.addEventListener("astro:page-load", init);
  document.addEventListener("astro:before-swap", teardown);
}
