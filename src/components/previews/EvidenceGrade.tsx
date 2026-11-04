import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import './evidence-grade.css'

// Binu's "Evidence by claim", rebuilt from the product's own component
// (skinsavior apps/web/src/components/products/EvidenceByClaim.tsx) and its
// tokens (apps/web/src/app/globals.css): four rising bars in sage, the grade
// in bold caps, claim badges (bespoke art for pores and collagen, an ink
// letter disc otherwise), ingredient chips tinted by each ingredient's own
// grade, Hanken Grotesk, cream and soft-tan surfaces.
//
// 1x1 (GradeTile): one claim row, as the product stacks it on mobile, close
// up. Plays once in view: the bars rise to the grade, then the grade label
// and its summary arrive.
//
// 2x2 (GradeHero): the desktop table, all four tiers. Plays once in view:
// rows are graded top to bottom, each row's bars filling to its grade, then
// its label and summary. The still is the finished table.

type Certainty = 'strong' | 'moderate' | 'limited' | 'very_limited'

const META: Record<Certainty, { label: string; notches: number }> = {
  strong: { label: 'Strong evidence', notches: 4 },
  moderate: { label: 'Moderate evidence', notches: 3 },
  limited: { label: 'Limited evidence', notches: 2 },
  very_limited: { label: 'Very limited evidence', notches: 1 },
}

type Claim = {
  slug: string
  label: string
  certainty: Certainty
  ingredients: { name: string; certainty: Certainty }[]
  summary: string
}

/** Bespoke claim artwork, as in the product; other claims keep the letter badge. */
const ICONS: Record<string, string> = {
  'minimizes-pores': '/previews/binu/minimizes-pores.svg',
  'supports-collagen': '/previews/binu/supports-collagen.svg',
}

const PORES: Claim = {
  slug: 'minimizes-pores',
  label: 'Minimizes pores',
  certainty: 'moderate',
  ingredients: [
    { name: 'Niacinamide', certainty: 'moderate' },
    { name: 'Zinc PCA', certainty: 'limited' },
  ],
  summary:
    'Controlled studies found pores looked smaller, but most were short and small, which holds the certainty at moderate.',
}

const TABLE: Claim[] = [
  {
    slug: 'controls-oil',
    label: 'Controls oil',
    certainty: 'strong',
    ingredients: [
      { name: 'Niacinamide', certainty: 'strong' },
      { name: 'Zinc PCA', certainty: 'limited' },
    ],
    summary:
      'Across several controlled studies, topical niacinamide reduced measured oil output and the look of shine, and the studies agreed with one another.',
  },
  PORES,
  {
    slug: 'supports-collagen',
    label: 'Supports collagen',
    certainty: 'limited',
    ingredients: [{ name: 'Niacinamide', certainty: 'limited' }],
    summary: 'Most of the support comes from lab studies on skin cells; few trials measured a visible change in firmness.',
  },
  {
    slug: 'hydrates',
    label: 'Hydrates',
    certainty: 'limited',
    ingredients: [{ name: 'Sodium Hyaluronate', certainty: 'limited' }],
    summary: 'Hydration rose in short studies, but they were small and mostly cohort-level.',
  },
  {
    slug: 'soothes',
    label: 'Soothes',
    certainty: 'very_limited',
    ingredients: [{ name: 'Panthenol', certainty: 'very_limited' }],
    summary: 'Only lab studies so far; none measured a visible change in people.',
  },
]

function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(initial)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      if (node.clientWidth) setWidth(Math.round(node.clientWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width] as const
}

function Badge({ claim }: { claim: Claim }) {
  const icon = ICONS[claim.slug]
  if (icon) return <img src={icon} alt="" aria-hidden width={48} height={48} className="eg-badge-art" />
  return (
    <span className="eg-badge-letter" aria-hidden>
      {claim.label.charAt(0).toUpperCase()}
    </span>
  )
}

/** Four rising bars, lit up to `lit` (the grade's notches once graded). */
function StrengthBar({ lit }: { lit: number }) {
  return (
    <span className="eg-bars" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="eg-bar" data-lit={i < lit || undefined} style={{ '--i': i } as CSSProperties} />
      ))}
    </span>
  )
}

/** One claim row. `graded` 0 = not yet, 1 = bars filled, 2 = label + summary in. */
function ClaimRow({ claim, graded }: { claim: Claim; graded: number }) {
  const meta = META[claim.certainty]
  return (
    <li className="eg-row" data-graded={graded || undefined} data-done={graded >= 2 || undefined}>
      <div className="eg-claim">
        <Badge claim={claim} />
        <span className="eg-claim-label">{claim.label}</span>
      </div>
      <div className="eg-strength">
        <StrengthBar lit={graded ? meta.notches : 0} />
        <span className="eg-grade">{meta.label}</span>
      </div>
      <ul className="eg-ingredients" aria-label="Supporting ingredients">
        {claim.ingredients.map((ing) => (
          <li key={ing.name} className="eg-chip" data-certainty={ing.certainty}>
            <span className="eg-chip-name">{ing.name}</span>
            {ing.certainty !== claim.certainty && <span className="eg-chip-own">| {META[ing.certainty].label}</span>}
          </li>
        ))}
      </ul>
      <p className="eg-summary">{claim.summary}</p>
    </li>
  )
}

// ── 1x1 ──────────────────────────────────────────────────────────────────

type One = { graded: number }

async function oneScript(a: Act<One>) {
  await a.wait(500)
  a.set({ graded: 1 })
  await a.wait(700)
  a.set({ graded: 2 })
  await a.wait(2000)
}

export function GradeTile() {
  const [ref, width] = useWidth(480)
  return (
    <div ref={ref} className="eg-host">
      <Stage<One>
        width={width}
        height={322}
        initial={{ graded: 0 }}
        poster={{ graded: 2 }}
        script={oneScript}
        play="once"
        className="eg eg--one"
      >
        {(s) => (
          <ul className="eg-card" data-narrow={width < 400 || undefined}>
            <ClaimRow claim={PORES} graded={s.graded} />
          </ul>
        )}
      </Stage>
    </div>
  )
}

// ── 2x2 ──────────────────────────────────────────────────────────────────

type Two = { graded: number[] }

async function twoScript(a: Act<Two>) {
  await a.wait(500)
  const graded = TABLE.map(() => 0)
  for (let row = 0; row < TABLE.length; row++) {
    graded[row] = 1
    a.set({ graded: [...graded] })
    await a.wait(520)
    graded[row] = 2
    a.set({ graded: [...graded] })
    await a.wait(260)
  }
  await a.wait(2000)
}

export function GradeHero() {
  const [ref, width] = useWidth(976)
  const compact = width < 760
  return (
    <div ref={ref} className="eg-host">
      <Stage<Two>
        width={width}
        height={compact ? 720 : 660}
        initial={{ graded: TABLE.map(() => 0) }}
        poster={{ graded: TABLE.map(() => 2) }}
        script={twoScript}
        play="once"
        className="eg eg--two"
      >
        {(s) => (
          <div className="eg-table" data-compact={compact || undefined}>
            <div className="eg-head" aria-hidden>
              <span>Claim</span>
              <span>Evidence strength</span>
              <span>Supporting ingredients</span>
              <span>Summary</span>
            </div>
            <ul className="eg-card">
              {TABLE.map((claim, i) => (
                <ClaimRow key={claim.slug} claim={claim} graded={s.graded[i]} />
              ))}
            </ul>
          </div>
        )}
      </Stage>
    </div>
  )
}
