import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Stage } from '../stageshow/kit/stage'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import './claim-rows-still.css'

// "Final, 1 row per claim": a still of Binu's Evidence by claim table, rebuilt
// from skinsavior apps/web/src/components/products/EvidenceByClaim.tsx (desktop
// grid 96 / 160 / 220 / 1fr, gap 32) with the rows of its Storybook "Default"
// story (fixtures/claims.fixtures.ts: strongClaim + zincOilClaim, moderateClaim,
// veryLimitedClaim). Labels from @skinsavior/core CLAIM_BADGES and
// CERTAINTY_META.
//
// Half-width slot (480 x 322, down to 350 on a phone). Wide: the table is
// drawn at 560 and scaled to the slot, cropped after the Supporting
// ingredients column, running off the right and fading out at its foot over
// the third row. Compact (< 440): a tighter crop at about 1:1, Claim and
// Evidence strength only.

type Certainty = 'strong' | 'moderate' | 'limited' | 'very_limited'

const META: Record<Certainty, { label: string; notches: number }> = {
  strong: { label: 'Strong evidence', notches: 4 },
  moderate: { label: 'Moderate evidence', notches: 3 },
  limited: { label: 'Limited evidence', notches: 2 },
  very_limited: { label: 'Very limited evidence', notches: 1 },
}

type Row = {
  label: string
  certainty: Certainty
  ingredients: { name: string; certainty: Certainty }[]
}

// The Default story, grouped by badge as groupByBadge() does.
const ROWS: Row[] = [
  {
    label: 'Controls oil',
    certainty: 'strong',
    ingredients: [
      { name: 'Niacinamide', certainty: 'strong' },
      { name: 'Zinc PCA', certainty: 'limited' },
    ],
  },
  { label: 'Antioxidant', certainty: 'moderate', ingredients: [{ name: 'Vitamin C', certainty: 'moderate' }] },
  { label: 'Supports barrier', certainty: 'very_limited', ingredients: [{ name: 'Panthenol', certainty: 'very_limited' }] },
]

const WIDE = 560
// Ends between the Evidence strength and Supporting ingredients columns
const COMPACT = 352
const BELOW = 440
const TILE_H = 322

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

function StrengthBar({ notches }: { notches: number }) {
  return (
    <span className="crs-bars" aria-hidden>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="crs-bar" data-lit={i < notches || undefined} />
      ))}
    </span>
  )
}

function ClaimRow({ row }: { row: Row }) {
  const meta = META[row.certainty]
  return (
    <li className="crs-row">
      <div className="crs-claim">
        <span className="crs-badge" aria-hidden>
          {row.label.charAt(0).toUpperCase()}
        </span>
        <span className="crs-claim-label">{row.label}</span>
      </div>
      <div className="crs-strength">
        <StrengthBar notches={meta.notches} />
        <span className="crs-grade">{meta.label}</span>
      </div>
      <ul className="crs-ingredients">
        {row.ingredients.map((ing) => (
          <li key={ing.name} className="crs-chip" data-certainty={ing.certainty}>
            <span>{ing.name}</span>
            {ing.certainty !== row.certainty && <span className="crs-chip-own">| {META[ing.certainty].label}</span>}
          </li>
        ))}
      </ul>
    </li>
  )
}

/** Holds the table back until its faces have loaded, so a still never swaps fonts in view. */
function useFontsReady() {
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => {
    if (typeof document === 'undefined' || !document.fonts) return setReady(true)
    let live = true
    Promise.all(
      ['400 14px "Hanken Grotesk"', '600 14px "Hanken Grotesk"', '700 12px "Hanken Grotesk"', '700 14px "Binu Space Grotesk"'].map((f) =>
        document.fonts.load(f),
      ),
    )
      .catch(() => {})
      .then(() => live && setReady(true))
    return () => {
      live = false
    }
  }, [])
  return ready
}

export function ClaimRowsStill() {
  const [ref, width] = useWidth(480)
  const ready = useFontsReady()
  const compact = width < BELOW
  const designW = compact ? COMPACT : WIDE
  // Keep the tile 322 tall at any width: the design height follows the scale.
  const designH = Math.round((TILE_H * designW) / width)
  // Fade the foot out just below the second row (or over the last 16px when
  // the tile is too short for that), in the table's own coordinates.
  const top = compact ? 20 : 24
  // Two rows end at 292 (stage px); the third row's label starts ~76px below.
  const fadeEnd = Math.min(designH, 292 + 72) - top
  const fadeStart = Math.min(292 + 4, designH - 16) - top
  return (
    <div ref={ref} className="crs-host" data-ready={ready || undefined}>
      <Stage width={designW} height={designH} fill className="crs" greys="cool">
        {() => (
          <div
            className="crs-table"
            data-compact={compact || undefined}
            style={{ '--crs-fade-a': `${fadeStart}px`, '--crs-fade-b': `${fadeEnd}px` } as CSSProperties}
          >
            <div className="crs-head" aria-hidden>
              <span>Claim</span>
              <span>Evidence strength</span>
              <span>Supporting ingredients</span>
            </div>
            <ul className="crs-card">
              {ROWS.map((row) => (
                <ClaimRow key={row.label} row={row} />
              ))}
            </ul>
          </div>
        )}
      </Stage>
    </div>
  )
}
