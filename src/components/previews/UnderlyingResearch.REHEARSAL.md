# Underlying research preview: rehearsal notes

- **Reference:** `apps/web/src/components/research/ProductResearch.tsx` (pill toggle) and `IngredientResearch.tsx` (loading line, SkeletonCard, ResearchPaperList, PaperCard, badgeTone), `ScientistAvatar.tsx`, tokens from `apps/web/src/app/globals.css`. Papers come from `apps/web/src/fixtures/research.fixtures.ts`. Checked against the Storybook stories research-productresearch--multiple-ingredients / --single-ingredient and research-ingredientresearch--loading.
- **1x1 (`ResearchTile`)**: plays once in view. The scientist is "pulling up the research" over skeleton cards, then the papers unfold top to bottom and the loading line folds away. The poster is the loaded list.
- **Narrow (<400px)**: the pill row is dropped, which is the product's SingleIngredient case, so the first paper still fits whole.
- **Deviations:** the badge and journal wrap at this width (the product does the same), and `row-gap` is 2px so they read as one item (the product uses 10px). Each paper line fades in once the unfolding edge has passed it.
- **Gate:** passes at 1440 and 390. Remaining warning: the faint skeleton bars are cut by the collapsing edge (filler only).
- **Not used:** `StudyTypeIcon` is not part of ProductResearch. It belongs to the ingredient sheet's PaperCard (`products/IngredientCardView.tsx`), so it was left out instead of being merged in.
