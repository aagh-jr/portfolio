# Evidence grade previews — rehearsal notes

- **Reference:** the real product, ~/Developer/skinsavior. `apps/web/src/components/products/EvidenceByClaim.tsx` (table + mobile stack), `research/EvidenceMeter.tsx`, `@skinsavior/core/research` CERTAINTY_META (4 tiers, 1–4 notches), tokens from `apps/web/src/app/globals.css`, rendered in its Storybook (Products/EvidenceByClaim Default + Mobile) and compared side by side.
- **Claim art:** `public/previews/binu/*.svg`, copied from the product's `public/icons/claims/`.
- **1×1 (`GradeTile`)**: one claim row in the product's mobile layout, pinned to the tile and running off its foot. Plays once in view: bars fill to Moderate, then the label and summary arrive.
- **2×2 (`GradeHero`)**: the desktop table (Figma 587:7089 layout), five claims across all four tiers. Plays once in view, grading rows top to bottom. Below 760px it switches to the product's own stacked mobile cards.
- **Gate:** one line left, `spills its slot` on the ingredient chips. It's a false positive: the 220px column wraps the chips onto separate lines, the same way the product does.
- **Illustrative:** the grades and summaries for pores, collagen, hydrates and soothes are written in the fixtures' voice, not taken from real grading output. The Controls oil text comes from `claims.fixtures.ts`.
