// Where the Work pill (and /#work) lands: the first case study's cover this
// far below the bottom of the nav pills. Nudge it here; both callers use it.
export const WORK_GAP = 40;

export function scrollToFirstProject(behavior: ScrollBehavior) {
  const first = document.querySelector<HTMLElement>(".work-list .project");
  if (!first) return;
  const nav = document.querySelector<HTMLElement>(".site-nav");
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 56;
  const top = first.getBoundingClientRect().top + window.scrollY - navBottom - WORK_GAP;
  window.scrollTo({ top, behavior });
}
