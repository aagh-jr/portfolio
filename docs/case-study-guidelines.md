# Case study guidelines

How a case study page on this site is built and laid out. Read this before
creating or editing one. The reference implementation is the Binu case study:
`src/pages/projects/binu.astro` with `src/cases/binu-styles.css` and the
components in `src/components/case/`.

## Redesigning an existing one

The older case studies (`energy-ave`, `cabrillo`, `cabrillo-design`,
`skin-savior`) render a raw HTML body from `src/cases/<slug>-body.html` with
their own stylesheet. To redesign one:

1. Read its current body and styles and keep every fact, number, quote, image
   and link. Rewrite structure and layout, not substance.
2. Rebuild it as an Astro page on the Binu template (steps below), mapping the
   existing content onto the outline. Leave out a section the project has no
   material for, rather than padding it.
3. Keep the same URL (`/projects/<slug>`), so the homepage card and any shared
   links still work.
4. Once the new page renders, remove the old `<slug>-body.html` and
   `<slug>-styles.css` if nothing else imports them.

## Starting a new one

1. Copy `src/pages/projects/binu.astro` to `src/pages/projects/<slug>.astro`
   and `src/cases/binu-styles.css` to `src/cases/<slug>-styles.css`; import the
   new stylesheet with `?raw` and pass it to `CaseStudyLayout` as `styles`.
2. Keep the page frame (`.cs-layout`, `.cs-rail` back link, `.cs-main`) and the
   spacing tokens unchanged. Change only the content and, if needed, the
   palette tokens (`--cs-blue`, `--cs-pastel-*`, …).
3. Keep it `noindex` and unlinked until the [bracketed] placeholders and
   dashed `Placeholder` boxes are replaced with real copy and images.
4. Reuse the components in `src/components/case/` (SectionLabel, Card,
   PullQuote, DataTable, Placeholder, Pill, Kicker, BeforeAfter,
   WorkflowCarousel) before writing new markup.

## Outline

Each top-level section opens with a `<SectionLabel>`: the small grey title with
a line under it. **Lines only ever separate top-level sections.** Nothing
inside a section gets a rule; parts inside a section are separated by space
alone.

| # | Section (label) | What goes in it |
|---|---|---|
| 0 | Hero (no label) | Pill with the product name, H1 title, one-sentence lede, live-product button, meta row (Role, Topics, Team, Status, Timeline), hero visual with caption |
| 1 | TLDR | 4 cards in one row: Problem, Solution, My role, Where it stands |
| 2 | The opportunity | The problem as a title + prose, evidence of it (screenshots), a pull quote naming the core question, any constraint that shapes it |
| 3 | Discovery | Findings, each a sub-heading + prose + its table or image; interview insights; ends with the product bet (the decision the research led to) as a part |
| 4 | Design | Design decisions (one item per decision: title, why, what was rejected, visuals with captions), then parts for the design system, design workflow, and before/after fidelity |
| 5 | Building and implementation | How it's built (pipeline/architecture), technical choices, how AI was used and where it was overridden, build workflow |
| 6 | What's live today | Shipped features, product screenshots, then the validation plan as a part |
| 7 | Learnings | 3 cards, one learning each |
| — | Next case study button | |

Sections can be dropped or renamed to fit the project, but keep the order
problem → research → design → build → outcome → learnings.

## Structure and spacing

Every gap comes from the spacing tokens at the top of the case stylesheet.
Never hard-code a margin or gap between blocks, and never add one-off
`padding-bottom` to a section.

| Token | Value | Between |
|---|---|---|
| `--sp-section` | 160 | top-level sections (`.cs-main` gap) |
| `--sp-label` | 64 | a section's label line and its first content (SectionLabel handles it) |
| `--sp-part` | 120 | parts of a section, e.g. Design decisions → Design System |
| `--sp-item` | 80 | items of the same kind, e.g. each decision, each finding |
| `--sp-quote` | 80 | above and below a pull quote (PullQuote handles it) |
| `--sp-block` | 32 | a title + text and the image, table or cards it introduces |
| `--sp-media` | 48 | stacked images (each with its caption) |
| `--sp-caption` | 10 | an image and its caption; a note under cards is a caption too |

The nesting that produces these gaps:

```astro
<section class="cs-stack cs-section">            <!-- children 120 apart -->
  <SectionLabel>Design</SectionLabel>             <!-- 64 to the next thing -->
  <div class="cs-stack cs-gap-item">              <!-- a part made of items, 80 apart -->
    <div class="cs-split">…part title + intro…</div>
    <div class="cs-stack cs-gap-block">           <!-- one item, blocks 32 apart -->
      <div class="cs-split cs-split--tight">…sub-heading + prose…</div>
      <figure class="cs-preview-figure">…<figcaption/></figure>
      <figure class="cs-preview-figure">…</figure>  <!-- auto 48 from the figure above -->
    </div>
  </div>
  <div class="cs-stack cs-gap-block">…a part that is one block…</div>
</section>
```

- A row of images that stacks under another image gets `cs-media` so it takes
  the 48px media gap: `<div class="cs-row cs-media">`.
- A note under cards goes in `<div class="cs-stack cs-gap-caption">` with the
  cards, so it reads as their caption.
- Side-by-side tiles use `.cs-row` (16px gap) or `.cs-grid`.
- A part that continues the same topic stays inside its section. Do not start
  a new `<section>` for it, or it gets the 160 gap and looks like a new
  section.

## Type

- **All titles in the page flow are one size: 30px**, rounded display face,
  bold, ink color. This covers part titles (`.cs-h2`), sub-headings
  (`.cs-h3`, `.cs-finding`) and card titles (`.cs-card-title`,
  `.cs-learning-title`). Do not create title levels by size; spacing and
  section labels carry the structure.
- **All paragraphs are 17px**, line height 1.65 (`.cs-prose`, `.cs-body`,
  card body text).
- Smaller sizes are only for things that are clearly a different kind of text:
  table cells and pills (15px), labels (14px), captions (13px), step names
  inside a diagram (20px).
- The only larger text: the 72px H1 and the 40px pull quotes.
- Section labels are SectionLabel: 20px, semibold, muted grey, line under.

## Images and product previews

- Every image or preview is a `figure.cs-preview-figure` with a one-line
  `figcaption` that says what to notice, not what it is.
- Phone previews use the stageshow `Phone`; check them in a Firefox-based
  browser as well as Chrome, since clip and transform bugs show only there.
- Placeholders (`Placeholder`) describe the missing image in [brackets] so
  they can be found and replaced.

## Before calling a case study done

- Measure the gaps in the browser and check that they match the token table.
- Look at it in Chrome and in Firefox/Zen, desktop and phone width.
- Search the page for `[` to find leftover placeholders.
