import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Stage } from '../../stageshow/kit/stage'
import { Window } from '../../stageshow/kit/window'
import { Phone } from '../../stageshow/kit/phone'
import { Collapse } from '../../stageshow/kit/motion/Collapse'
import { Swap } from '../../stageshow/kit/motion/Swap'
import { Count } from '../../stageshow/kit/motion/Count'
import type { Act } from '../../stageshow/kit/act'
import { ChevronDown, GripVertical } from './icons'
import anuaCleanser from './img/anua-cleanser.jpg'
import arenciaRetinal from './img/arencia-retinal.jpg'
import celimaxCream from './img/celimax-cream.jpg'
import cosrxBha from './img/cosrx-bha.jpg'
import bojSun from './img/boj-relief-sun.jpg'
import './binu.css'
import './routine-page.css'

// The routine page (/routines/[id]) in edit mode, rebuilt from
// skinsavior-for-you: app/routines/[id]/page.tsx (SiteNav, "← My shelf",
// RoutineBuilder, RoutineCompatibility in one 860px column), the builder's
// StepCard / ProductPicker markup, RoutineCompatibility's copy and colors,
// SiteNavView's glass pills and SiteFooter. The route needs sign-in, so it is
// built from those components and the routines fixtures, not a screenshot.
//
// The clash check below is what the real engine (core/scoring/interactions.ts)
// returns for these products' stored INCI lists: COSRX's BHA carries betaine
// salicylate, Arencia's serum "Retinal(200ppm)". Before the add, a morning SPF
// covers the BHA, so the verdict is "Nothing here conflicts."; adding the
// retinal to the same night trips retinoid_plus_bha, titled with the two
// step labels as analyzeRoutine writes it.
//
// RoutinePage (full row, 1440 × 757): the page at the top; it scrolls to the
// night list; "+ Add to night", "retinal" typed, Arencia's serum added into
// the serum slot; the page scrolls on to the clash check, which flips to
// "1 thing worth changing" with the finding (payoff). Reset with a seen
// cause: back up, the retinal step removed (the check clears), the picker
// closed, back to the top.
// RoutineTile (480 × 322): a crop of the picker and the check at the page's
// own sizes: Add → In routine, the check flips, the page scrolls the finding
// into view; the step is removed above and it clears.

const src = (m: unknown) => (typeof m === 'string' ? m : (m as { src: string }).src)

type Id = 'c' | 'e' | 'r' | 'm'
type Item = { img: string; name: string; brand: string; cat: string }
const SUN: Item = { img: src(bojSun), name: 'Relief Sun : Rice + Probiotics (SPF50+ PA++++)', brand: 'Beauty of Joseon', cat: 'Sunscreen' }
const ITEMS: Record<Id, Item> = {
  c: { img: src(anuaCleanser), name: '8 Hyaluronic Acid Hydrating Gentle Foaming Cleanser', brand: 'Anua', cat: 'Cleanser' },
  e: { img: src(cosrxBha), name: 'BHA Blackhead Power Liquid', brand: 'COSRX', cat: 'Exfoliant' },
  r: { img: src(arenciaRetinal), name: 'Retinal Booster Shot Serum', brand: 'Arencia', cat: 'Serum' },
  m: { img: src(celimaxCream), name: 'Oil Control Moisturizing Cream', brand: 'Celimax', cat: 'Moisturizer' },
}
const NIGHT: Id[] = ['c', 'e', 'r', 'm']

type At = 'top' | 'list' | 'check' | 'undo' | 'tStart' | 'tCheck' | 'tUndo'
type S = { at: At; picker: boolean; q: string; hits: boolean; added: boolean; clash: boolean }
type Mode = 'desktop' | 'mobile'

// Where each scroll position puts which element: its top `by` px below the
// viewport's top (the sticky header is 80px tall)
type Anchors = Partial<Record<At, { el: string; by: number }>>

const ROW_ANCHORS: Anchors = {
  top: { el: 'doc', by: 0 },
  list: { el: 'night', by: 96 },
  check: { el: 'picker', by: 96 },
  undo: { el: 'step-r', by: 104 },
}
const TILE_ANCHORS: Anchors = {
  tStart: { el: 'hit', by: 0 },
  tCheck: { el: 'finding', by: 22 },
  tUndo: { el: 'step-r', by: 20 },
}

// The page, scrolled by state so the poster can hold any position. Offsets
// are measured from layout; a change of position eases like a smooth scroll,
// while content changing above it stays put, as scroll anchoring does.
function Viewport({ at, anchors, children, className }: { at: At; anchors: Anchors; children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const doc = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  const [ease, setEase] = useState(false)
  const lastAt = useRef<At | null>(null)
  useLayoutEffect(() => {
    const d = doc.current
    const b = box.current
    if (!d || !b) return
    const measure = () => {
      const spec = anchors[at]
      if (!spec) return
      const r = d.getBoundingClientRect()
      const k = r.height / d.offsetHeight || 1
      const el = spec.el === 'doc' ? d : d.querySelector<HTMLElement>(`[data-anchor="${spec.el}"]`)
      if (!el) return
      const top = (el.getBoundingClientRect().top - r.top) / k
      const max = Math.max(0, d.offsetHeight - b.offsetHeight)
      setY(Math.round(Math.min(max, Math.max(0, top - spec.by))))
    }
    // Ease only when the position itself changes, never on a re-measure
    setEase(lastAt.current !== null && lastAt.current !== at)
    lastAt.current = at
    measure()
    const ro = new ResizeObserver(() => {
      setEase(false)
      measure()
    })
    ro.observe(d)
    return () => ro.disconnect()
  }, [at, anchors])
  return (
    <div ref={box} className={`rp-viewport${className ? ` ${className}` : ''}`}>
      <div ref={doc} className="rp-doc" data-ease={ease || undefined} style={{ transform: `translateY(${-y}px)` }}>
        {children}
      </div>
    </div>
  )
}

function Select({ children }: { children: ReactNode }) {
  return (
    <span className="rp-select">
      {children}
      <ChevronDown size={14} strokeWidth={2} />
    </span>
  )
}

function StepCard({ item, n, also, id }: { item: Item; n: number; also: string; id?: Id }) {
  return (
    <div className="rp-card" data-anchor={id ? `step-${id}` : undefined}>
      <span className="rp-thumb">
        <img src={item.img} alt="" />
        <span className="rp-num">{n}</span>
      </span>
      <span className="rp-card-main">
        <span className="rp-card-title">
          <span className="rp-name">{item.name}</span>
          <span className="rp-brand">{item.brand}</span>
        </span>
        <span className="rp-controls">
          <span className="rp-check-label">
            <span className="rp-box" />
            {also}
          </span>
          <Select>Daily</Select>
          <Select>{item.cat}</Select>
        </span>
      </span>
      <span className="rp-actions">
        <span className="rp-icon" data-target={id ? `grip-${id}` : undefined}>
          <GripVertical size={18} strokeWidth={2} />
        </span>
        <span className="rp-icon rp-remove" data-target={id ? `remove-${id}` : undefined} data-cursor="pointer">
          ✕
        </span>
      </span>
    </div>
  )
}

function Picker({ s }: { s: S }) {
  const inRoutine = s.added
  return (
    <div className="rp-picker" data-anchor="picker">
      <div className="rp-search">
        <span className="rp-search-glyph">⌕</span>
        <span className="rp-input">
          {s.q ? <span className="rp-q">{s.q}</span> : <span className="rp-ph">Search the catalog — try a product, brand, or ingredient</span>}
          <span className="rp-caret" data-on={s.picker || undefined} />
        </span>
        <span className="rp-close" data-target="close-picker" data-cursor="pointer">
          ✕
        </span>
      </div>
      <Collapse open={s.hits}>
        <div className="rp-results">
          <div className="rp-hit" data-anchor="hit">
            <span className="rp-hit-thumb">
              <img src={ITEMS.r.img} alt="" />
            </span>
            <span className="rp-hit-text">
              <span className="rp-hit-name">{ITEMS.r.name}</span>
              <span className="rp-hit-brand">Arencia · Serum</span>
            </span>
            <span className="rp-hit-end">
              <span className="rp-add-btn" data-off={inRoutine || undefined} data-target="add-btn" data-cursor="pointer">
                Add
              </span>
              <span className="rp-in" data-on={inRoutine || undefined}>
                In routine
              </span>
            </span>
          </div>
        </div>
      </Collapse>
    </div>
  )
}

// RoutineCompatibility's body: the no-findings paragraph or the finding,
// crossfading while the surface eases to the new height
function Morph({ clash }: { clash: boolean }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const [h, setH] = useState<number | null>(null)
  const value = clash ? 'clash' : 'ok'
  useLayoutEffect(() => {
    const el = refs.current[value]
    if (!el) return
    const measure = () => setH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [value])
  const layers: Record<string, ReactNode> = {
    ok: (
      <p className="rp-ok">
        Your routine&apos;s actives don&apos;t conflict, nothing is scheduled at a time that works against it, and anything
        sun-sensitising is covered by an SPF.
      </p>
    ),
    clash: (
      <div className="rp-finding" data-anchor="finding">
        <div className="rp-finding-meta">
          <span className="rp-tag">Worth changing</span>
          <span className="rp-tier">Evidence B · Limited human evidence</span>
        </div>
        <div className="rp-finding-title">BHA Blackhead Power Liquid + Retinal Booster Shot Serum</div>
        <p className="rp-finding-body">
          Both increase turnover of the skin&apos;s surface layer. Used in the same routine they frequently tip into irritation and a
          compromised barrier.
        </p>
        <p className="rp-finding-do">
          <b>What to do: </b>Alternate nights, or move the BHA to your morning routine.
        </p>
        <p className="rp-because">Because of: Betaine Salicylate, Retinal(200ppm)</p>
      </div>
    ),
  }
  return (
    <div className="rp-morph" style={{ height: h ?? undefined }}>
      {Object.entries(layers).map(([k, node]) => (
        <div key={k} ref={(el) => void (refs.current[k] = el)} className="rp-layer" data-on={k === value || undefined}>
          {node}
        </div>
      ))}
    </div>
  )
}

function Check({ s }: { s: S }) {
  return (
    <section className="rp-clash" data-clash={s.clash || undefined} data-anchor="check">
      <div className="rp-clash-head">
        <div className="rp-h2 rp-clash-title">Clash check</div>
        <span className="rp-verdict">
          <Swap id={s.clash ? 'clash' : 'ok'}>{s.clash ? '1 thing worth changing' : 'Nothing here conflicts.'}</Swap>
        </span>
      </div>
      <Morph clash={s.clash} />
      <p className="rp-foot">
        Checked against a curated set of documented ingredient interactions and usage rules — not generated by a model, and the
        same routine always gives the same result. Information to weigh, not medical advice.
      </p>
    </section>
  )
}

const ProfileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M10 7.08333C11.8409 7.08333 13.3333 5.7775 13.3333 4.16667C13.3333 2.55584 11.8409 1.25 10 1.25C8.15905 1.25 6.66667 2.55584 6.66667 4.16667C6.66667 5.7775 8.15905 7.08333 10 7.08333Z" stroke="#121A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.33333 17.5C3.33333 15.2899 4.03571 13.1702 5.28595 11.6074C6.5362 10.0446 8.23189 9.16667 10 9.16667C11.7681 9.16667 13.4638 10.0446 14.714 11.6074C15.9643 13.1702 16.6667 15.2899 16.6667 17.5H3.33333Z" stroke="#121A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const SearchScan = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M7.25094 13.1685C10.5191 13.1685 13.1685 10.5191 13.1685 7.25094C13.1685 3.98273 10.5191 1.33333 7.25094 1.33333C3.98273 1.33333 1.33333 3.98273 1.33333 7.25094C1.33333 10.5191 3.98273 13.1685 7.25094 13.1685Z" stroke="#0D1B36" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.4831 11.4831L14.6667 14.6667" stroke="#0D1B36" strokeWidth="0.87" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.9176 5.97753V5.07865C3.9176 4.70412 4.21723 4.44195 4.59176 4.44195H5.37828M9.16105 4.44195H10.0225C10.397 4.44195 10.6966 4.74157 10.6966 5.11611V6.01498M3.9176 8.67416V9.64794C3.9176 10.0225 4.21723 10.3221 4.59176 10.3221H5.37828M9.16105 10.3221H10.0225C10.397 10.3221 10.6966 10.0225 10.6966 9.64794V8.71161" stroke="#0D1B36" strokeWidth="0.56" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5.75" cy="6.8" r="0.64" fill="#0D1B36" />
    <circle cx="8.9" cy="6.8" r="0.64" fill="#0D1B36" />
    <path d="M6.31461 8.52435C6.57678 9.16105 7.88764 9.23596 8.33708 8.52435" stroke="#0D1B36" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// SiteNavView, signed in: the wordmark and links in one frosted pill, the
// search pill and the account circle on the right; the header itself is clear
function Nav({ mode }: { mode: Mode }) {
  return (
    <div className="rp-nav">
      <div className="rp-glass rp-nav-left">
        <span className="rp-wordmark">binu</span>
        {mode === 'desktop' && (
          <span className="rp-links">
            <span>Search</span>
            <span>Products</span>
            <span>Ingredients</span>
            <span>For you</span>
            <span>Brands</span>
          </span>
        )}
      </div>
      <div className="rp-nav-right">
        {mode === 'desktop' && (
          <span className="rp-glass rp-searchbar">
            <SearchScan />
            <span>Search products</span>
          </span>
        )}
        <span className="rp-glass rp-avatar">
          <ProfileIcon />
        </span>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="rp-footer-bar">
    <div className="rp-footer">
      <span className="rp-footer-mark">binu</span>
      <span className="rp-footer-links">
        <span>About</span>
        <span>Privacy</span>
        <span>Affiliate disclosure</span>
      </span>
      <span>© 2026 · Independent &amp; unbiased · Not medical advice.</span>
    </div>
    </div>
  )
}

function NightList({ s }: { s: S }) {
  const shown = NIGHT.filter((id) => id !== 'r' || s.added)
  return (
    <div className="rp-list">
      {NIGHT.map((id) => {
        const card = <StepCard item={ITEMS[id]} n={id === 'r' ? 3 : shown.indexOf(id) + 1} also="Also in the morning" id={id} />
        return id === 'r' ? (
          <Collapse key={id} open={s.added}>
            <div className="rp-li">{card}</div>
          </Collapse>
        ) : (
          <div key={id} className="rp-li">
            {card}
          </div>
        )
      })}
    </div>
  )
}

function Below({ s }: { s: S }) {
  return (
    <>
      <Collapse open={!s.picker}>
        <div className="rp-add-wrap">
          <div className="rp-add" data-target="add-night" data-cursor="pointer">
            + Add to night
          </div>
        </div>
      </Collapse>
      <Collapse open={s.picker}>
        <div className="rp-picker-wrap">
          <Picker s={s} />
        </div>
      </Collapse>
    </>
  )
}

// The whole page, as /routines/[id] lays it out
function RoutineDoc({ s, mode }: { s: S; mode: Mode }) {
  const count = 4 + (s.added ? 1 : 0)
  const night = 3 + (s.added ? 1 : 0)
  return (
    <>
      <div className="rp-main">
        <div className="rp-back">← My shelf</div>
        <div className="rp-head">
          <div className="rp-h1">Daily routine</div>
          <span className="rp-done">Done</span>
        </div>
        <div className="rp-count">
          <Count value={count} duration={500} /> products · drag the handle to reorder each list. Morning and night have their own
          order.
        </div>
        <section className="rp-section">
          <div className="rp-section-head">
            <span className="rp-h2">Morning</span>
            <span className="rp-steps">1 step</span>
          </div>
          <div className="rp-list">
            <div className="rp-li">
              <StepCard item={SUN} n={1} also="Also at night" />
            </div>
          </div>
          <Collapse open={!s.picker}>
            <div className="rp-add-wrap">
              <div className="rp-add">+ Add to morning</div>
            </div>
          </Collapse>
        </section>
        <section className="rp-section" data-anchor="night">
          <div className="rp-section-head">
            <span className="rp-h2">Night</span>
            <span className="rp-steps">
              <Count value={night} duration={500} /> steps
            </span>
          </div>
          <NightList s={s} />
          <Below s={s} />
        </section>
        <Check s={s} />
      </div>
      <Footer />
    </>
  )
}

// The tile's crop: the foot of the night list, the picker and the check
function TileDoc({ s }: { s: S }) {
  return (
    <div className="rp-main rp-main--tile">
      <div className="rp-list">
        <Collapse open={s.added}>
          <div className="rp-li">
            <StepCard item={ITEMS.r} n={3} also="Also in the morning" id="r" />
          </div>
        </Collapse>
        <div className="rp-li">
          <StepCard item={ITEMS.m} n={s.added ? 4 : 3} also="Also in the morning" id="m" />
        </div>
      </div>
      <div className="rp-picker-wrap">
        <Picker s={s} />
      </div>
      <Check s={s} />
    </div>
  )
}

function Screen({ s, mode, anchors, tile }: { s: S; mode: Mode; anchors: Anchors; tile?: boolean }) {
  return (
    <div className="rp-page" data-mode={mode}>
      <Viewport at={s.at} anchors={anchors}>
        {!tile && <div className="rp-navspace" />}
        {tile ? <TileDoc s={s} /> : <RoutineDoc s={s} mode={mode} />}
      </Viewport>
      {!tile && <Nav mode={mode} />}
    </div>
  )
}

// A scroll: the wheel under a resting pointer on desktop, a finger's swipe
// on the phone
async function scrollTo(a: Act<S>, at: At, dir: 1 | -1) {
  if (a.layout === 'compact') {
    const p = a.rect('swipe')
    const from = { x: p.x + p.width / 2, y: p.y + (dir > 0 ? p.height * 0.8 : p.height * 0.25) }
    await a.move(from, { duration: 260 })
    const swipe = a.drag({ x: from.x + 4, y: from.y - dir * p.height * 0.5 }, undefined, { duration: 420 })
    await a.wait(140)
    a.put({ at })
    await swipe
    await a.wait(700)
  } else {
    await a.set({ at })
    await a.wait(1000)
  }
}

const rowInitial: S = { at: 'top', picker: false, q: '', hits: false, added: false, clash: false }
const rowPoster: S = { at: 'check', picker: true, q: 'retinal', hits: true, added: true, clash: true }

async function rowScript(a: Act<S>) {
  await a.wait(1100)
  a.mark('scroll')
  await scrollTo(a, 'list', 1)

  a.mark('open')
  await a.click({ at: 'add-night', x: 0.56, y: 0.55 })
  await a.set({ picker: true })
  await a.wait(380)
  a.mark('type')
  await a.type('q', 'retinal', { interval: 70 })
  await a.wait(220)
  await a.set({ hits: true })
  await a.wait(600)

  a.mark('add')
  await a.click({ at: 'add-btn', x: 0.6, y: 0.6 })
  await a.set({ added: true })
  await a.wait(900)

  a.mark('check')
  await scrollTo(a, 'check', 1)
  await a.set({ clash: true })
  if (a.layout === 'wide') await a.move('rest')
  a.mark('hold')
  await a.wait(2600)

  a.mark('undo')
  await scrollTo(a, 'undo', -1)
  await a.click({ at: 'remove-r', x: 0.5, y: 0.5 })
  await a.set({ added: false })
  await a.wait(350)
  await a.set({ clash: false })
  await a.wait(700)
  await a.click({ at: 'close-picker', x: 0.5, y: 0.5 })
  await a.set({ picker: false, hits: false })
  await a.wait(500)
  await a.snap({ q: '' })
  a.mark('reset')
  await scrollTo(a, 'top', -1)
  await a.wait(300)
}

const tileInitial: S = { at: 'tStart', picker: true, q: 'retinal', hits: true, added: false, clash: false }
const tilePoster: S = { ...tileInitial, at: 'tCheck', added: true, clash: true }

async function tileScript(a: Act<S>) {
  await a.wait(1000)
  a.mark('add')
  await a.click({ at: 'add-btn', x: 0.6, y: 0.6 })
  await a.set({ added: true })
  await a.wait(450)
  a.mark('flip')
  await a.set({ clash: true })
  await a.wait(900)
  a.mark('scroll')
  if (a.layout === 'wide') a.move('rest')
  await scrollTo(a, 'tCheck', 1)
  a.mark('hold')
  await a.wait(2400)
  a.mark('undo')
  await scrollTo(a, 'tUndo', -1)
  await a.click({ at: 'remove-r', x: 0.5, y: 0.5 })
  await a.set({ added: false })
  await a.wait(350)
  await a.set({ clash: false })
  await a.wait(500)
  a.mark('reset')
  await scrollTo(a, 'tStart', 1)
  await a.wait(500)
}

const ROW_REST = { wide: { x: 1190, y: 560 }, compact: { x: 300, y: 470 } }
const TILE_REST = { wide: { x: 410, y: 140 }, compact: { x: 300, y: 250 } }

export function RoutinePage() {
  return (
    <Stage<S>
      width={1440}
      height={757}
      compact={{ below: 600, width: 358, height: 560 }}
      initial={rowInitial}
      poster={rowPoster}
      script={rowScript}
      play="loop"
      cursor={{ at: ROW_REST }}
      className="binu bwp-routine bwp-routine--row"
    >
      {(s, _rect, layout) => (
        <>
          {layout === 'compact' ? (
            <Phone width={326} className="rp-phone">
              <Screen s={s} mode="mobile" anchors={ROW_ANCHORS} />
            </Phone>
          ) : (
            <Window url="binu.app/routines/daily" urlShape="pill" className="rp-win">
              <Screen s={s} mode="desktop" anchors={ROW_ANCHORS} />
            </Window>
          )}
          <span data-target="rest" style={{ position: 'absolute', left: ROW_REST[layout].x, top: ROW_REST[layout].y }} />
          <span data-target="swipe" className="rp-swipe" />
        </>
      )}
    </Stage>
  )
}

export function RoutineTile() {
  return (
    <Stage<S>
      width={480}
      height={322}
      compact={{ below: 420, width: 358, height: 330 }}
      initial={tileInitial}
      poster={tilePoster}
      script={tileScript}
      play="loop"
      cursor={{ at: TILE_REST }}
      className="binu bwp-routine bwp-routine--tile"
    >
      {(s, _rect, layout) => (
        <>
          {layout === 'compact' ? (
            <Phone width={326} className="rp-phone">
              <Screen s={s} mode="mobile" anchors={TILE_ANCHORS} tile />
            </Phone>
          ) : (
            <Window url="binu.app/routines/daily" urlShape="pill" className="rp-win">
              <Screen s={s} mode="mobile" anchors={TILE_ANCHORS} tile />
            </Window>
          )}
          <span data-target="rest" style={{ position: 'absolute', left: TILE_REST[layout].x, top: TILE_REST[layout].y }} />
          <span data-target="swipe" className="rp-swipe" />
        </>
      )}
    </Stage>
  )
}
