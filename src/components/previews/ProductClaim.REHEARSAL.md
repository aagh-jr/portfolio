# Product claim preview (ClaimTile), rehearsal notes

- **Reference:** ~/Developer/skinsavior `apps/web/src/components/products/ProductIdentityView.tsx` (Field, BenefitPill, brand row, serif h1, `grid-cols-2` dl), tokens from `apps/web/src/app/globals.css`, content from `fixtures/products.fixtures.ts` (niacinamideSerum / productIdentityFixture) and `fixtures/insights.fixtures.ts` (productIngredientsUnrated, routineCheckClear). Screenshotted Storybook `products-productidentityview--default`, `--mobile`, `--empty`.
- **Gold copied:** the portfolio's own EvidenceGrade `GradeTile` (same ground, card inset, Stage use, narrow switch) so the two tiles read as one row; card running off the foot like GradeTile.
- **Layout:** the product's mobile stack (no gallery: the fixture's gallery images are labeled placeholders, not product art). Brand row, Newsreader 38px name, Type of product / Benefits, then the next dl row (Irritancy / Conflict labels, values as filler bars) running off the foot. The name is a <p>, not <h1>, to keep the case study outline clean.
- **Motion:** plays once in view, the two benefit pills (the marketed claims) arrive one after the other. Poster = both pills in.
- **Deviations:** section gap 20px (product 30px) to fit 322px; page padding 28/24px (product px-6 = 24px).
- **Font:** Newsreader latin woff2 copied from the product's Next build to `public/previews/binu/newsreader-latin.woff2`, declared as 'Binu Newsreader'.
- **Not checked:** dark mode (product has none on this page); reduced motion beyond the Stage's default.
- **Gate:** film.mjs --gate passed at 1440 and 390. Remaining jumps are hydration (useWidth 480 -> 350 on the narrow tile, same as GradeTile) and font swap.
