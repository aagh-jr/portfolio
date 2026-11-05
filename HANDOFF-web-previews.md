# Handoff: Binu full-page web previews (finish in a Claude Code cloud session)

Branch `astro-migration`. Paste this to the cloud session:
"Read HANDOFF-web-previews.md and finish it."

## What the owner wants (read first)
These previews are for a **UX design + PM portfolio**. Viewers should see what
each screen looks like **in its entirety, at real desktop proportions**, not
miniature demo crops.
- **Full-width slot** (976 × 513 on the Binu page at 1440): the WHOLE screen as
  the real app lays it out at a 1440-wide viewport. Design the Stage at
  `width={1440} height={757}` using the app's real CSS values (header heights,
  max-widths, font sizes) and let it scale to the slot.
- **Two-up tiles** (480 × 322): close-up crops at real UI sizes (not the page
  shrunk down).
- Everything **animates and loops** (`play="loop"`), 10–16 s, poster = payoff.
- `compact` design under 600px (tiles: under ~420px): the phone layout.
- The finished, accepted example to copy is the quiz:
  `src/components/previews/web/ChatQuiz.tsx` + `chat-quiz.css`, scratch page
  `/previews-web-quiz`. It is already wired into `src/pages/projects/binu.astro`
  (section D04).

## Status
| Page | Files | State |
|---|---|---|
| Chat quiz | `web/ChatQuiz.tsx`, `web/chat-quiz.css`, `/previews-web-quiz` | DONE, wired into binu.astro (replaces the deleted old-quiz tiles) |
| Product page | `web/ProductPage.tsx`, `web/product-page.css`, `/previews-web-product` | PARTIAL: an agent was stopped mid-work. Renders (200). Review and finish |
| Routine + clash check | `web/RoutinePage.tsx`, `web/routine-page.css`, `/previews-web-routine` | PARTIAL, same |
| Home search | `web/HomeSearchPage.tsx`, `web/home-search-page.css`, `/previews-web-search` | PARTIAL, was filming when stopped |
| For You | `web/ForYouPage.tsx`, `web/for-you-page.css`, `/previews-web-foryou` | PARTIAL, was mapping photos when stopped |

Each page exports `<Name>Page` (full row) and `<Name>Tile` (one or two tiles).

## Steps
1. `npm install && npm run dev` (port 4321). For filming: `cd .claude/skills/stageshow && npm install`
   (needs Playwright + Chrome; `CHROME_PATH` if needed).
2. For each PARTIAL page: open its scratch page, read the code, film it
   (`node .claude/skills/stageshow/scripts/film.mjs "http://localhost:4321/previews-web-<name>" --select "<stage wrapper>" --states --states-for 18000 --out shots/<name>.png`,
   plus `--still --reduced`, plus `--width 390`), read every frame, fix the
   largest fault first (framing, hierarchy, motion, polish). Compare to the quiz.
3. Delete the leftover starting files when a page is done:
   `web/_src-product.tsx`, `web/_src-routine.tsx`, `web/_src-search.tsx`,
   `web/product.css`, `web/routine.css`, `web/search.css` (check nothing imports them first).
4. Do NOT wire the four new pages into binu.astro yet: the owner picks which
   slots they go in. Just make every scratch page look finished.
5. Report to the owner: a poster PNG per page (1440 and 390), what is
   illustrative, anything you couldn't match.

## Source of truth for the product
The Binu product code is the private repo `skinsavior/skin_savior` (`main`).
**Attach it to the cloud session** (clone to `~/Developer/skinsavior`); without
it you can't check the real components. Use `apps/web/src/components/*`, their
`*.stories.tsx`, `src/fixtures/*` and `src/app/globals.css` (tokens). The local
session matched pages against a running dev server of that app; in the cloud,
build from components + stories (Storybook: `cd apps/web && npx storybook dev -p 6006 --ci --no-open`).

## Rules (same as every preview here)
- Real strings and real UI only, from the product code, fixtures and stories.
  Anything illustrative must be plausible and listed in the report. No invented
  features, no sparkles / AI decoration, no made-up logos.
- Kit imports by deep path only (`../../stageshow/kit/stage`, `/window`,
  `/phone`, `/motion/Collapse` ...); never `kit/index`, `kit/parts` or
  `kit/controls` index (they need lucide-react, not installed). Icons come from
  `web/icons.tsx` (inlined lucide; add more from lucide's icon nodes the same way).
- Product photos are in `web/img/`; fonts in `web/fonts/` via `web/binu.css`.
- No Claude attribution in commits or PRs.
