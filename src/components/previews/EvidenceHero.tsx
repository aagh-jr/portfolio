import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import './evidence-grade.css'
import './evidence-hero.css'

// Binu's "Evidence by claim" table for the case-study hero, full width of the
// text column (976 at desktop, 350 in a phone column).
//
// Rebuilt from skinsavior apps/web/src/components/products/EvidenceByClaim.tsx,
// with the content of its Default story, taken as-is from
// apps/web/src/fixtures/claims.fixtures.ts (strongClaim + zincOilClaim grouped
// under Controls oil, moderateClaim, veryLimitedClaim). As in the product, the
// summary is the claim's explainer, or the badge's cardText when it has none
// (packages/core/src/research/claim-badges.ts). Labels and notches are
// CERTAINTY_META (packages/core/src/research/grading.ts).
//
// Shares the row styles of evidence-grade.css (the 2x2 GradeHero). Plays once
// in view: rows graded top to bottom; the poster is the finished table.

type Certainty = 'strong' | 'moderate' | 'limited' | 'very_limited'

const META: Record<Certainty, { label: string; notches: number }> = {
  strong: { label: 'Strong evidence', notches: 4 },
  moderate: { label: 'Moderate evidence', notches: 3 },
  limited: { label: 'Limited evidence', notches: 2 },
  very_limited: { label: 'Very limited evidence', notches: 1 },
}

type Group = {
  slug: string
  label: string
  certainty: Certainty
  ingredients: { name: string; certainty: Certainty }[]
  summary: string
}

/** Products/EvidenceByClaim — Default, after groupByBadge (strongest first). */
const GROUPS: Group[] = [
  {
    slug: 'controls-oil',
    label: 'Controls oil',
    certainty: 'strong',
    ingredients: [
      { name: 'Niacinamide', certainty: 'strong' },
      { name: 'Zinc PCA', certainty: 'limited' },
    ],
    summary:
      'Across several controlled studies, topical niacinamide reduced measured oil output and the look of shine, and the studies agreed with one another. That consistency is why the evidence here reads as strong.',
  },
  {
    slug: 'antioxidant',
    label: 'Antioxidant',
    certainty: 'moderate',
    ingredients: [{ name: 'Vitamin C', certainty: 'moderate' }],
    summary:
      'A randomized trial supports the antioxidant framing, but several endpoints were laboratory markers rather than a visible change in the skin, which holds the certainty at moderate.',
  },
  {
    slug: 'supports-barrier',
    label: 'Supports barrier',
    certainty: 'very_limited',
    ingredients: [{ name: 'Panthenol', certainty: 'very_limited' }],
    summary: "Supports the skin's moisture barrier",
  },
]

function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(initial)
  const [measured, setMeasured] = useState(false)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      if (node.clientWidth) setWidth(Math.round(node.clientWidth))
      setMeasured(true)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width, measured] as const
}

/** None of these three claims has bespoke art, so all keep the letter badge. */
function Badge({ label }: { label: string }) {
  return (
    <span className="eg-badge-letter" aria-hidden>
      {label.trim().charAt(0).toUpperCase()}
    </span>
  )
}

function StrengthBar({ lit }: { lit: number }) {
  return (
    <span className="eg-bars" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="eg-bar" data-lit={i < lit || undefined} style={{ '--i': i } as CSSProperties} />
      ))}
    </span>
  )
}

/** `graded` 0 = not yet, 1 = bars filled, 2 = label + summary in. */
function ClaimRow({ group, graded }: { group: Group; graded: number }) {
  const meta = META[group.certainty]
  return (
    <li className="eg-row" data-graded={graded || undefined} data-done={graded >= 2 || undefined}>
      <div className="eg-claim">
        <Badge label={group.label} />
        <span className="eg-claim-label">{group.label}</span>
      </div>
      <div className="eg-strength">
        <StrengthBar lit={graded ? meta.notches : 0} />
        <span className="eg-grade">{meta.label}</span>
      </div>
      <ul className="eg-ingredients" aria-label="Supporting ingredients">
        {group.ingredients.map((ing) => (
          <li key={ing.name} className="eg-chip" data-certainty={ing.certainty}>
            <span className="eg-chip-name">{ing.name}</span>
            {ing.certainty !== group.certainty && <span className="eg-chip-own">| {META[ing.certainty].label}</span>}
          </li>
        ))}
      </ul>
      <p className="eg-summary">{group.summary}</p>
    </li>
  )
}

type S = { graded: number[] }

async function script(a: Act<S>) {
  await a.wait(500)
  const graded = GROUPS.map(() => 0)
  for (let row = 0; row < GROUPS.length; row++) {
    graded[row] = 1
    a.set({ graded: [...graded] })
    await a.wait(560)
    graded[row] = 2
    a.set({ graded: [...graded] })
    await a.wait(300)
  }
  await a.wait(2000)
}

/** Natural height of the table, so the stage can end just inside its foot. */
function useHeight(initial: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(initial)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      if (node.offsetHeight) setHeight(node.offsetHeight)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, height] as const
}

/** The card's foot (its border and 40 of the last row's 64px padding) runs off the stage. */
const BLEED = 41

export function EvidenceHero() {
  // The server renders at 976; a phone column swaps to the stacked cards on
  // hydration, so the stage stays hidden until the column has been measured.
  const [ref, width, measured] = useWidth(976)
  const compact = width < 760
  const [tableRef, tableHeight] = useHeight(compact ? 860 : 485)
  const inset = compact ? 16 : 40
  return (
    <div ref={ref} className="eg-host" data-measured={measured || undefined}>
      <Stage<S>
        width={width}
        height={inset + tableHeight - BLEED}
        initial={{ graded: GROUPS.map(() => 0) }}
        poster={{ graded: GROUPS.map(() => 2) }}
        script={script}
        play="once"
        className="eg eg--two eg--hero"
      >
        {(s) => (
          <div ref={tableRef} className="eg-table" data-compact={compact || undefined}>
            <div className="eg-head" aria-hidden>
              <span>Claim</span>
              <span>Evidence strength</span>
              <span>Supporting ingredients</span>
              <span>Summary</span>
            </div>
            <ul className="eg-card">
              {GROUPS.map((group, i) => (
                <ClaimRow key={group.slug} group={group} graded={s.graded[i]} />
              ))}
            </ul>
          </div>
        )}
      </Stage>
    </div>
  )
}
