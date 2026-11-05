# Shared brief: Binu case-study product previews

You are building ONE product preview for the Binu case study in the portfolio at ~/Developer/portfolio (Astro + React, branch astro-migration). Use the stageshow skill (invoke it with the Skill tool, name "stageshow") and follow it.

## THE RULE (non-negotiable)
We have the ENTIRE real product codebase locally at ~/Developer/skinsavior. No visual may be made from memory, assumption, or the case study's placeholder mocks. For every preview:
1. Open and read the real component code AND the files it imports (its Tailwind classes, the tokens in apps/web/src/app/globals.css, the data types and labels in packages/core, the fixtures in apps/web/src/fixtures).
2. Render the real component in Storybook (or the running app) and screenshot it before writing any code.
3. Build to match what you saw: same layout, components, icons, copy style, colors, type and spacing. Use the product's real assets (icons in apps/web/public, its lucide icons) and real labels/strings. For sample content, take it from the fixtures; if you must write new copy, match the fixtures' voice and flag it as illustrative.
4. Film the result and compare it side by side with the Storybook screenshot. Fix the differences before reporting.
5. In your report, list exactly which files you read and which stories you screenshotted. A preview with no listed reference is not done.
If no reference exists for something, STOP and say so. Don't invent it.

## Environment (already running — do NOT start any servers)
- Portfolio dev server: http://localhost:4321 (Astro hot-reloads new pages).
- Product Storybook: http://localhost:6006. Screenshot a story at http://localhost:6006/iframe.html?id=<story-id>&viewMode=story . Story ids are listed at http://localhost:6006/index.json (e.g. products-evidencebyclaim--default, products-evidencebyclaim--mobile). Screenshot with Playwright (the stageshow scripts use it; e.g. `node ~/.claude/skills/stageshow/scripts/film.mjs "<url>" --select "#storybook-root" --still --out <file>.png --width 1440`, or write a tiny playwright script in your scratch dir). Read every image you take.
- Product web app source: ~/Developer/skinsavior/apps/web/src (components/, app/, fixtures/, app/globals.css). Shared domain types/labels: ~/Developer/skinsavior/packages/core.
- Tokens file: ~/Developer/skinsavior/apps/web/src/app/globals.css. The product font is Hanken Grotesk (import `@fontsource/hanken-grotesk/400.css|600.css|700.css`, already installed in the portfolio).

## The finished pattern to copy
- ~/Developer/portfolio/src/components/previews/EvidenceGrade.tsx + evidence-grade.css (built from apps/web/src/components/products/EvidenceByClaim.tsx). Read it first: it shows how tokens are mapped, how the Stage is used, the 1x1 tile sizing, and the mobile switch. Notes in src/components/previews/REHEARSAL.md.
- Its test page: src/pages/previews-test.astro (unit grid you can copy for your own test page).
- Stageshow kit is at src/components/stageshow/kit/. Import `Stage` from `../stageshow/kit/stage`, `Bar` from `../stageshow/kit/window`, types from `../stageshow/kit/act`. Do NOT import `kit/index` (it pulls in lucide-react, which is not installed in the portfolio). For lucide icons, copy the exact SVG paths from the product's node_modules (find lucide-react under ~/Developer/skinsavior/node_modules or apps/web/node_modules) and inline them.
- Product art already copied: public/previews/binu/ (claim icons). If you need more product assets, copy them from ~/Developer/skinsavior/apps/web/public into public/previews/binu/ (new files only).

## Sizes
- Tile unit: 1x1 = 480 x 322 (measure width, fixed height 322, like GradeTile). On the page a tile is wrapped in `<div class="cs-preview" style="--basis: 363px">`. It must also work in a 350px phone column.
- Read src/pages/projects/binu.astro (READ ONLY) around your line numbers to see the slot, caption and surrounding copy your preview replaces. The case study styles are src/cases/binu-styles.css (read only).

## FILE RULE
Create ONLY your own new files: src/components/previews/<Name>.tsx + <name>.css (plus REHEARSAL notes inside your own new file if you want, e.g. src/components/previews/<Name>.REHEARSAL.md), any new assets under public/previews/binu/, and your own test page src/pages/previews-<name>.astro. Do NOT edit binu.astro, previews-test.astro, binu-styles.css, EvidenceGrade.*, the kit, or anything in ~/Developer/skinsavior. Don't touch git (no commits, no stash, no checkout). Other agents are working in parallel on other previews.

## Filming
Film with `node ~/.claude/skills/stageshow/scripts/film.mjs http://localhost:4321/previews-<name> --width 1440` and again with `--width 390`, both `--still` and as a contact sheet, plus `--gate`. Put output images in your own scratch dir (not the repo). Read every image. Compare each against your Storybook screenshot side by side and fix differences before reporting.

## Report (your final message)
- Component name(s), export(s), file paths, and size (e.g. 1x1 480x322).
- Files you read in ~/Developer/skinsavior (exact paths).
- Storybook story ids you screenshotted (and app routes, if any).
- The differences you checked between your build and the reference, and what you fixed.
- Anything unverified, and every string that is illustrative (not from fixtures/code).
- The snippet to drop into binu.astro (import line + the `<div class="cs-preview" ...>` markup with a good aria-label), but don't insert it yourself.
Keep the report concise.
