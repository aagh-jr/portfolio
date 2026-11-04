# Handoff: Binu case-study product previews (for a Claude Code cloud session)

Branch: `astro-migration`. Page: `src/pages/projects/binu.astro`. Goal: replace placeholder mocks with faux-UI previews built **only** from the real product code.

## Setup on the cloud
1. Portfolio: `npm install && npm run dev` (port 4321).
2. Product reference repo (REQUIRED, not in this repo): clone `git@github.com:skinsavior/skin_savior.git` (private, `main` @ 181d116 or newer) to `~/Developer/skinsavior`. Note: the local machine had 25 uncommitted files on branch `feat/shareable-routines` there; those are NOT pushed.
3. Storybook (start ONCE, before any subagent): `cd ~/Developer/skinsavior/apps/web && npx storybook dev -p 6006 --ci --no-open`. Screenshot `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story`; ids in `/index.json`.
4. Stageshow skill: copied into `.claude/skills/stageshow/` (run `npm install` inside it for the film scripts; Playwright needed). Film with `node .claude/skills/stageshow/scripts/film.mjs http://localhost:4321/previews-<name> --width 1440` and `--width 390`, `--still`, contact sheet, `--gate`.

## THE RULE (repeat verbatim in every subagent brief)
Full shared brief (rule, environment, file rule, report format) is in `HANDOFF-brief.md`. Paths in it say `~/.claude/skills/stageshow`; use `.claude/skills/stageshow` instead. Key points: read the real component + imports + globals.css tokens + packages/core labels + fixtures; screenshot the Storybook story before coding; match it; take copy from fixtures (flag anything illustrative); film and compare side by side; report files read + stories screenshotted. No reference → STOP and say so.

Pattern to copy: `src/components/previews/EvidenceGrade.tsx` + `evidence-grade.css`, notes `src/components/previews/REHEARSAL.md`. Kit: `src/components/stageshow/kit/` (import `kit/stage`, `kit/window`, `kit/act`; never `kit/index`, lucide-react isn't installed, so inline lucide SVG paths). Font: Hanken Grotesk (@fontsource); Newsreader + Space Grotesk woff2 copied into `public/previews/binu/`. Tile 1x1 = 480x322, wrapped in `<div class="cs-preview" style="--basis: 363px">`, must work at 350px.

## Status
| Item | Slot (binu.astro) | Status | Files / export |
|---|---|---|---|
| A1 hero | ~104 (`cs-hero-stage`, lines ~105-140) | DONE, accepted | `EvidenceHero.tsx` → `EvidenceHero`; test `previews-hero` |
| A2 product claim | ~306 | DONE, accepted | `ProductClaim.tsx` → `ClaimTile`; `previews-claim` |
| A3 explanation | ~308 | DONE, accepted | `PlainExplanation.tsx` → `ExplanationTile`; `previews-explanation` |
| A4 research | ~309 | IN PROGRESS when stopped; check `UnderlyingResearch.tsx` exists/works, else redo (ref research/ProductResearch.tsx, StudyTypeIcon.tsx) | |
| A5 final rows still | ~293 | DONE, accepted (re-add the "why it won" caption) | `ClaimRowsStill.tsx` → `ClaimRowsStill`; `previews-rows` |
| A6 quiz card + flow | ~335, ~339 | IN PROGRESS when stopped; check `SkinQuiz.tsx` (ref quiz/QuestionView.tsx, app/quiz/page.tsx) | |
| A7 needs + profile | ~336, ~345 | `ProfileSavedTile` accepted. `NeedsTile`: was sent back to REMOVE invented axis labels ("Oily ↔ Dry"…) and use real quiz question text; verify that was done. Also flag to user: no product screen shows profile-by-axis, it's an arrangement of real quiz parts | `SkinNeeds.tsx` |
| A8 add-by-URL | ~489-490 | DONE, accepted. No story/app render existed; built from code. Illustrative: the 4 URLs and Created/Already-known outcomes | `AddByUrl.tsx` → `AddLinkTile`, `AddResultsTile` |
| A9 search states | ~491-492 | DONE, accepted. Search has NO weak-evidence state; tiles are loading + empty; caption must change | `SearchStates.tsx` → `SearchLoadingTile`, `SearchEmptyTile` |
| C1 design-system cards | ~370-385 | NOT STARTED. Fix "Brand colors" cards + note: real product uses sage for every grade (strength = bars filled) and a "Clinical" palette (white, cream, one blue accent). Rebuild from globals.css. Only after A items finish; may edit only those lines | |

Each finished agent's report (with the exact snippet to paste into binu.astro and aria-labels) is summarized in the component's `*.REHEARSAL.md` where present.

## Remaining steps
1. Finish/verify A4, A6, A7 fix (each report must list files read + stories screenshotted; reject otherwise).
2. C1.
3. Wire all previews into binu.astro (imports from `../../components/previews/...`, `client:visible`).
4. Cleanup: two Space Grotesk copies (`space-grotesk-latin.woff2`, `space-grotesk-latin-700.woff2`) and two Newsreader copies (`newsreader-latin.woff2`, `needs-newsreader-latin.woff2`); keep one each. Check GradeTile/GradeHero letter badges fall back to Courier (Space Grotesk missing in EvidenceGrade).
5. Investigate the hydration warning + 404 (favicon) seen on preview test pages.
6. Film the whole binu page at 1440 and 390, fix, summarize for the user.

User's skip list (they supply these): packaging photo, competitor screenshots, Figma screenshots, search bar before/after, foundations page.

## Update (after the first push): all A agents finished
- A4 DONE, accepted: `UnderlyingResearch.tsx` → `ResearchTile`. It uses ProductResearch; StudyTypeIcon was left out because those icons only appear in IngredientCardView. Ask the user if they want the icons.
- A6 DONE, accepted: `SkinQuiz.tsx` → `QuizCard`, `QuizFlow`. FLAG: the case-study copy says the quiz went "12 → 7 questions", but app/quiz/page.tsx has 14. The user must fix either the copy or the product.
- A7 fix DONE: NeedsTile now uses the real quiz question titles. Which answer each question shows is mapped from the fixture (illustrative).
- Each agent's binu.astro snippet and aria-label are in its `*.REHEARSAL.md` or summarized above. All agents report that the gate shows a hydration mismatch from the kit and a favicon 404.
- Next: C1, then wiring, then whole-page filming (see Remaining steps).
