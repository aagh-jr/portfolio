import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import './search-states.css'

// Binu's home search and its live dropdown, rebuilt from the product's own
// components (skinsavior apps/web/src/components/home/HomeSearchView.tsx,
// SearchDropdown.tsx, ProductThumb.tsx, CategoryIcon.tsx), its tokens
// (apps/web/src/app/globals.css) and motion tokens (packages/motion-tokens).
//
// SearchLoadingTile: "serum" is typed, the panel drops with the product's
// five skeleton rows pulsing, then the fixture results fade in top to bottom.
// SearchEmptyTile: a query with no matches. The panel drops on the skeleton,
// then settles on the product's empty line, close up.
//
// Weak evidence: the search UI has no weak-evidence state (results carry no
// grade), so neither tile shows one.

type Status = 'closed' | 'loading' | 'idle'

/** apps/web/src/fixtures/products.fixtures.ts `searchHits` (first five products). */
const HITS = [
  { slug: 'niacinamide', name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', category: 'serum' },
  { slug: 'ce-ferulic', name: 'C E Ferulic', brand: 'SkinCeuticals', category: 'serum' },
  { slug: 'cerave-cleanser', name: 'Hydrating Facial Cleanser', brand: 'CeraVe', category: 'cleanser' },
  { slug: 'cerave-cream', name: 'Moisturizing Cream', brand: 'CeraVe', category: 'moisturizer' },
  { slug: 'uv-clear', name: 'UV Clear Broad-Spectrum SPF 46', brand: 'EltaMD', category: 'sunscreen' },
] as const

const CATEGORY_LABEL: Record<string, string> = {
  serum: 'Serum',
  cleanser: 'Cleanser',
  moisturizer: 'Moisturizer',
  sunscreen: 'Sunscreen',
}

/** CategoryIcon glyphs (the no-photo fallback ProductThumb draws). */
const GLYPHS: Record<string, ReactNode> = {
  serum: (
    <>
      <rect x="9.5" y="3" width="5" height="3" rx="1" />
      <path d="M11 6v8.5M13 6v8.5" />
      <path d="M11 14.5 12 21l1-6.5" />
    </>
  ),
  cleanser: (
    <>
      <rect x="8" y="10" width="8" height="11" rx="2" />
      <path d="M10 10V7h4v3" />
      <path d="M12 7V4h3" />
    </>
  ),
  moisturizer: (
    <>
      <rect x="5" y="9" width="14" height="11" rx="2" />
      <path d="M5 13h14" />
      <path d="M8 9V7h8v2" />
    </>
  ),
  sunscreen: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
}

const FILTERS = ['All', 'Skincare', 'Ingredients', 'Brands']
const SKELETON_ROWS = 5

// Panel heights in px, from the Tailwind classes: a row is py-3 + 44px thumb
// + 1px rule; the "See all" row is py-2.5 + 16px; the empty line py-5 + 20px.
const ROW = 69
const PANEL_H = {
  loading: SKELETON_ROWS * ROW - 1,
  results: HITS.length * ROW + 36,
  empty: 60,
}

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

/** HomeSearchView: mode circle, input, send button, filter chips. */
function SearchBar({ q, focused }: { q: string; focused: boolean }) {
  return (
    <div className="sst-search">
      <div className="sst-bar" role="search">
        <span className="sst-mode">
          <img src="/previews/binu/search-scan-19.svg" alt="" width={19.2} height={19.2} aria-hidden />
        </span>
        <span className="sst-input">
          {q ? <span className="sst-q">{q}</span> : <span className="sst-ph">Search products, brands, or ingredients</span>}
          {focused && <span className="sst-caret" aria-hidden />}
        </span>
        <span className="sst-send" aria-hidden>
          <img src="/previews/binu/send-arrow.svg" alt="" width={30} height={30} />
        </span>
      </div>
      <div className="sst-filters" aria-hidden>
        {FILTERS.map((f, i) => (
          <span key={f} className="sst-chip" data-active={i === 0 || undefined}>
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <ul className="sst-list" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: SKELETON_ROWS }, (_, i) => (
        <li key={i} className="sst-row">
          <span className="sst-sk sst-sk-thumb" />
          <span className="sst-sk-lines">
            <span className="sst-sk sst-sk-name" />
            <span className="sst-sk sst-sk-meta" />
          </span>
        </li>
      ))}
    </ul>
  )
}

function Results({ q, shown }: { q: string; shown: boolean }) {
  return (
    <ul className="sst-list" data-shown={shown || undefined}>
      {HITS.map((p, i) => (
        <li key={p.slug} className="sst-row sst-hit" style={{ '--i': i } as CSSProperties}>
          <span className="sst-thumb">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {GLYPHS[p.category]}
            </svg>
          </span>
          <span className="sst-text">
            <span className="sst-name">{p.name}</span>
            <span className="sst-meta">
              {p.brand} · {CATEGORY_LABEL[p.category]}
            </span>
          </span>
        </li>
      ))}
      <li className="sst-all sst-hit" style={{ '--i': HITS.length } as CSSProperties}>
        See all results for &quot;{q}&quot; →
      </li>
    </ul>
  )
}

/** SearchDropdown: drops on spring.drop; the body follows the search status. */
function Dropdown({ status, q, empty }: { status: Status; q: string; empty?: boolean }) {
  const open = status !== 'closed'
  const height = !open ? 0 : status === 'loading' ? PANEL_H.loading : empty ? PANEL_H.empty : PANEL_H.results
  return (
    <div className="sst-panel" data-open={open || undefined} style={{ height: open ? height + 2 : 0 }}>
      {status === 'loading' && <Skeleton />}
      {status === 'idle' && !empty && <Results q={q} shown />}
      {status === 'idle' && empty && (
        <div className="sst-empty">
          No products matching <strong>&quot;{q}&quot;</strong>
        </div>
      )}
    </div>
  )
}

type S = { q: string; focused: boolean; status: Status }

// ── 1x1: loading ─────────────────────────────────────────────────────────

async function loadingScript(a: Act<S>) {
  await a.wait(500)
  a.set({ focused: true })
  await a.wait(250)
  await a.type('q', 'serum', { interval: 90 })
  a.set({ status: 'loading' })
  await a.wait(1500)
  a.set({ status: 'idle' })
  await a.wait(2000)
}

export function SearchLoadingTile() {
  const [ref, width] = useWidth(480)
  return (
    <div ref={ref} className="sst-host">
      <Stage<S>
        width={width}
        height={322}
        initial={{ q: '', focused: false, status: 'closed' }}
        poster={{ q: 'serum', focused: true, status: 'loading' }}
        script={loadingScript}
        play="once"
        className="sst sst--loading"
      >
        {(s) => (
          <div className="sst-scene" data-narrow={width < 400 || undefined}>
            <SearchBar q={s.q} focused={s.focused} />
            <Dropdown status={s.status} q={s.q} />
          </div>
        )}
      </Stage>
    </div>
  )
}

// ── 1x1: empty ───────────────────────────────────────────────────────────

const NO_MATCH = 'zzzz'

async function emptyScript(a: Act<S>) {
  await a.wait(500)
  a.set({ focused: true })
  await a.wait(250)
  await a.type('q', NO_MATCH, { interval: 110 })
  a.set({ status: 'loading' })
  await a.wait(700)
  a.set({ status: 'idle' })
  await a.wait(2000)
}

export function SearchEmptyTile() {
  const [ref, width] = useWidth(480)
  // Close up where there is room: the bar, chips and the one-line panel fill
  // the tile at 1.3x. In a phone column it stays 1x.
  const zoom = width >= 440 ? 1.3 : 1
  return (
    <div ref={ref} className="sst-host">
      <Stage<S>
        width={width}
        height={322}
        initial={{ q: '', focused: false, status: 'closed' }}
        poster={{ q: NO_MATCH, focused: true, status: 'idle' }}
        script={emptyScript}
        play="once"
        className="sst sst--empty"
      >
        {(s) => (
          <div className="sst-zoom" style={{ '--z': zoom } as CSSProperties}>
            <div className="sst-scene" data-narrow={width < 400 || undefined}>
              <SearchBar q={s.q} focused={s.focused} />
              <Dropdown status={s.status} q={s.q} empty />
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}
