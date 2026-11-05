# Plain-language explanation preview: rehearsal notes

- **Reference:** `apps/web/src/components/research/EvidenceClaimCard.tsx` ("Why this rating" accordion) as `EvidenceExplainer.tsx` lists it, plus `EvidenceMeter.tsx`, `ClaimBadgeIcon.tsx`, `ui/accordion.tsx`, `ui/badge.tsx`, tokens from `app/globals.css`. Screenshotted in Storybook: research-evidenceclaimcard--strong, --mobile; research-evidenceexplainer--default (Moderate tier opened, Antioxidant "Why this rating" opened at 476 and 350), --mobile, --with-ingredient-names.
- **Copy:** all from `fixtures/claims.fixtures.ts` (`moderateClaim`, next card `longExplainerClaim`). Nothing illustrative.
- **Gold copied:** EvidenceGrade's GradeTile (stage, ground, width measure, plays once). Motion: the accordion opens, then the list scrolls so "Why this rating" lands at the top. The poster is the opened card.
- **Gate:** at 480 wide, one `framing` line: the card runs 7px past the foot. It sits under the bottom mask, which is fully transparent from 8px above the edge, so it never shows. The gate measures geometry and doesn't see the mask. At 350 the gate passes.
- **Not checked:** dark mode (the product has none here). Hydration flashes 480 → measured width on first paint, same as GradeTile.
