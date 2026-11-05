// PORTFOLIO PREVIEW: Binu For You page. Animated faux UI for the portfolio case
// study, rebuilt from apps/web; not app code and never imported by it.
// Exports: ForYouPage (full width, 1440 × 757); ForYouTile (480 × 322).
// Status: DONE, not wired in. Workspace guide: design/portfolio-previews/HANDOFF.md

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Stage } from '../../stageshow/kit/stage'
import { Window } from '../../stageshow/kit/window'
import { Phone } from '../../stageshow/kit/phone'
import { Swap } from '../../stageshow/kit/motion/Swap'
import type { Act } from '../../stageshow/kit/act'
import anuaNiac from './img/anua-niac.jpg'
import arenciaRetinal from './img/arencia-retinal.jpg'
import bojGlow from './img/boj-glow.jpg'
import ordinaryNiac from './img/ordinary-niac.jpg'
import celimaxRetinol from './img/celimax-retinol.jpg'
import './binu.css'
import './for-you-page.css'

// Binu's For You page, rebuilt from skinsavior-for-you main:
// app/for-you/page.tsx (heading, category chips, the footer note),
// components/for-you/ForYouBubbles.tsx (the "Picked for you" cluster, its
// packCluster layout copied as is, the Recommended / Price toggle, the
// selected pick's details and the order list), components/fit/FitBadge.tsx,
// fit-group.ts (group words, never a number), price-view.ts (the value
// weights), SiteNavView.tsx + glass.ts (the frosted header), globals.css
// (.bubble-glass, .bubble-selected, .bubble-move). Every string is the
// product's own; the five serums, their prices and the "why" lines are real
// catalogue rows and real reason texts from match.ts, their scores (only
// used to size the bubbles) are illustrative.
//
// ForYouPage (full row, 1440 × 757): the whole desktop page. Beats: the top
// of the page; it scrolls to the picks; Price is pressed and the same five
// picks re-weigh for value, the cheapest good fit gliding to the middle and
// growing while the list re-orders; the pointer rests on the retinal serum
// and the details say why it suits you; Recommended puts the cluster back,
// the page scrolls to the top.
//
// ForYouTile (480 × 322): the selected pick's details at real size. Price
// is pressed and the details hand over to the price leader, still a "Great
// fit", with its reason; Recommended hands back.

type Id = 'anua' | 'arencia' | 'boj' | 'ordinary' | 'celimax'
type Group = 'great' | 'good'
type Pick = { id: Id; brand: string; name: string; img: string; price: string; pv: number; score: number; group: Group; why: string }

const src = (m: string | { src: string }) => (typeof m === 'string' ? m : m.src)

// Illustrative profile: combination skin, breakouts now and then, marks
// that fade, a few fine lines, budget "$20 – $50" (the chat-quiz demo's
// answers). The why is each pick's first positive reason, as match-db does.
const BRIGHT = 'Contains brightening actives that target uneven tone and dark spots.'
const AGING = 'Contains actives studied for fine lines and firmness.'
const PICKS: Pick[] = [
  { id: 'anua', brand: 'Anua', name: 'Niacinamide 10 TXA 4 Serum', img: src(anuaNiac), price: '$28.00', pv: 28, score: 92, group: 'great', why: BRIGHT },
  { id: 'arencia', brand: 'Arencia', name: 'Retinal Booster Shot Serum', img: src(arenciaRetinal), price: '$24.00', pv: 24, score: 88, group: 'great', why: AGING },
  { id: 'boj', brand: 'Beauty of Joseon', name: 'Glow Serum Propolis + Niacinamide', img: src(bojGlow), price: '$13.60', pv: 13.6, score: 86, group: 'great', why: BRIGHT },
  { id: 'ordinary', brand: 'The Ordinary', name: 'Niacinamide 10% + Zinc 1%', img: src(ordinaryNiac), price: '$6.00', pv: 6, score: 84, group: 'great', why: BRIGHT },
  { id: 'celimax', brand: 'Celimax', name: 'The Vita A Retinol Shot Tightening Serum', img: src(celimaxRetinol), price: '$23.40', pv: 23.4, score: 78, group: 'good', why: AGING },
]
const BUDGET: [number, number] = [20, 50]

const FIT: Record<Group, string> = { great: 'Great fit', good: 'Good fit' }

const CATEGORIES = ['Cleansers', 'Toners', 'Serums', 'Moisturizers', 'Sunscreens', 'Exfoliants', 'Masks']

type View = 'rec' | 'price'

// ── weights and the cluster (ForYouBubbles.tsx, price-view.ts) ─────────────

function priceWeights(picks: Pick[]): number[] {
  const prices = picks.map((p) => p.pv)
  const lo = Math.min(...prices)
  const hi = Math.max(...prices)
  const [wFit, wRel, wBudget] = [0.4, 0.4, 0.2]
  return picks.map((p) => {
    const fit = Math.max(0, Math.min(1, (p.score - 60) / 40))
    const rel = 1 - (p.pv - lo) / hi
    const [a, b] = BUDGET
    const bud = p.pv > b ? Math.max(0, 1 - (p.pv - b) / b) : p.pv < a ? 0.9 : 1
    return wFit * fit + wRel * rel + wBudget * bud
  })
}

type Circle = { index: number; r: number; x: number; y: number }

function packCluster(order: number[], weights: number[]) {
  const GAP = 4
  const ws = order.map((i) => weights[i])
  const lo = Math.min(...ws)
  const hi = Math.max(...ws)
  const radius = (w: number) => 58 + (hi === lo ? 1 : (w - lo) / (hi - lo)) * 46
  const bodies: Circle[] = order.map((index) => ({ index, r: radius(weights[index]), x: 0, y: 0 }))
  const golden = Math.PI * (3 - Math.sqrt(5))
  bodies.forEach((b, i) => {
    const dist = i === 0 ? 0 : 60 + i * 24
    b.x = Math.round(Math.cos(i * golden) * dist * 1000) / 1000
    b.y = Math.round(Math.sin(i * golden) * dist * 1000) / 1000
  })
  for (let step = 0; step < 600; step++) {
    for (let i = 1; i < bodies.length; i++) {
      bodies[i].x -= bodies[i].x * 0.035
      bodies[i].y -= bodies[i].y * 0.035
    }
    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        const a = bodies[i]
        const c = bodies[j]
        const dx = c.x - a.x || 0.01
        const dy = c.y - a.y || 0.01
        const dist = Math.sqrt(dx * dx + dy * dy)
        const min = a.r + c.r + GAP
        if (dist < min) {
          const push = (min - dist) / dist
          const wa = i === 0 ? 0 : 0.5
          const wc = i === 0 ? 1 : 0.5
          a.x -= dx * push * wa
          a.y -= dy * push * wa
          c.x += dx * push * wc
          c.y += dy * push * wc
        }
      }
    }
  }
  const PAD = 12
  const minX = Math.min(...bodies.map((b) => b.x - b.r)) - PAD
  const minY = Math.min(...bodies.map((b) => b.y - b.r)) - PAD
  const maxX = Math.max(...bodies.map((b) => b.x + b.r)) + PAD
  const maxY = Math.max(...bodies.map((b) => b.y + b.r)) + PAD
  return {
    circles: bodies.map((b) => ({ ...b, x: b.x - minX, y: b.y - minY })),
    width: maxX - minX,
    height: maxY - minY,
  }
}

function viewOf(view: View) {
  const weights = view === 'rec' ? PICKS.map((p) => Math.max(0, Math.min(1, (p.score - 60) / 40))) : priceWeights(PICKS)
  const order = PICKS.map((_, i) => i).sort((a, b) => weights[b] - weights[a] || a - b)
  return { order, layout: packCluster(order, weights) }
}
const VIEWS = { rec: viewOf('rec'), price: viewOf('price') }

/** fitArc from ForYouBubbles: the name, shortened to the arc's room. */
function fitArc(name: string, fontSize: number) {
  const room = Math.floor((Math.PI * 41 * 0.86) / (fontSize * 0.56))
  return name.length <= room ? name : `${name.slice(0, Math.max(1, room - 1)).trimEnd()}…`
}

// ── the page ───────────────────────────────────────────────────────────────

type S = { view: View; sel: Id | null; scroll: number; drag?: boolean }
type Mode = 'desktop' | 'phone'

/** The column the cluster gets, and the height it may take (maxH in the app). */
const FIELD = { desktop: { w: 716, maxH: 430 }, phone: { w: 353, maxH: 420 } }

function Cluster({ view, sel, mode }: { view: View; sel: Id | null; mode: Mode }) {
  const { order, layout } = VIEWS[view]
  const room = FIELD[mode]
  const scale = Math.max(0.85, Math.min(room.w / layout.width, room.maxH / layout.height, 1.4))
  const fieldW = layout.width * scale
  const fieldH = layout.height * scale
  const current = sel ?? PICKS[order[0]].id
  return (
    <div className="fy-field" style={{ height: Math.min(fieldH, room.maxH) }}>
      <div className="fy-field-inner" style={{ width: fieldW, height: fieldH }}>
        {PICKS.map((p, index) => {
          const c = layout.circles.find((x) => x.index === index)!
          const d = c.r * 2 * scale
          const fontPx = Math.min(15, Math.max(11, d * 0.06))
          const fs = (fontPx * 100) / d
          return (
            <span
              key={p.id}
              data-target={`bub-${p.id}`}
              data-cursor="pointer"
              className="fy-bubble"
              data-on={p.id === current || undefined}
              style={{ left: (c.x - c.r) * scale, top: (c.y - c.r) * scale, width: d, height: d, '--fy-drift': `${7 + (index % 3) * 1.3}s`, '--fy-delay': `${-index * 1.7}s` } as CSSProperties}
            >
              <svg viewBox="0 0 100 100" className="fy-arc" aria-hidden="true">
                <path id={`fy-arc-${mode}-${p.id}`} d="M 9,50 A 41,41 0 0 1 91,50" fill="none" />
                <text fontSize={fs} fontWeight={600} letterSpacing={fs * 0.02}>
                  <textPath href={`#fy-arc-${mode}-${p.id}`} startOffset="50%" textAnchor="middle">
                    {fitArc(p.name, fs)}
                  </textPath>
                </text>
              </svg>
              <span className="fy-photo">
                <img src={p.img} alt="" />
              </span>
              <span className="fy-price" data-strong={view === 'price' || undefined}>
                {p.price}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

function Toggle({ view }: { view: View }) {
  return (
    <div className="fy-toggle" data-view={view}>
      <span className="fy-tab" data-target="tab-rec" data-cursor="pointer" data-on={view === 'rec' || undefined}>
        Recommended
      </span>
      <span className="fy-tab" data-target="tab-price" data-cursor="pointer" data-on={view === 'price' || undefined}>
        Price
      </span>
    </div>
  )
}

function Details({ p }: { p: Pick }) {
  return (
    <div className="fy-details" data-target="details">
      <Swap id={p.id}>
        <div className="fy-details-in">
          <span className="fy-brand">{p.brand}</span>
          <span className="fy-name">{p.name}</span>
          <div className="fy-fitrow">
            <span className="fy-badge" data-group={p.group}>
              {FIT[p.group]}
            </span>
            <span className="fy-dprice">{p.price}</span>
          </div>
          <p className="fy-why">{p.why}</p>
          <span className="fy-more">See why it suits you →</span>
        </div>
      </Swap>
    </div>
  )
}

function OrderList({ view, current }: { view: View; current: Id }) {
  const { order } = VIEWS[view]
  return (
    <div className="fy-list" style={{ height: PICKS.length * 47 - 1 }}>
      {PICKS.map((p, i) => {
        const rank = order.indexOf(i)
        return (
          <div key={p.id} className="fy-li" data-on={p.id === current || undefined} style={{ transform: `translateY(${rank * 47}px)` }}>
            <span className="fy-li-n">
              <Swap id={`${p.id}-${rank}`}>{String(rank + 1)}</Swap>
            </span>
            <span className="fy-li-name">
              <span className="fy-li-brand">{p.brand} · </span>
              {p.name}
            </span>
            <span className="fy-li-price">{p.price}</span>
            <span className="fy-li-go">→</span>
          </div>
        )
      })}
    </div>
  )
}

function SearchScan() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" stroke="#0D1B36" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.25 13.17a5.92 5.92 0 1 0 0-11.84 5.92 5.92 0 0 0 0 11.84Z" strokeWidth=".75" />
      <path d="m11.48 11.48 3.19 3.19" strokeWidth=".87" />
      <path d="M3.92 5.98v-.9c0-.37.3-.64.67-.64h.79M9.16 4.44h.86c.38 0 .68.3.68.67v.9M3.92 8.67v.98c0 .37.3.67.67.67h.79M9.16 10.32h.86c.38 0 .68-.3.68-.67v-.94" strokeWidth=".56" />
      <circle cx="5.75" cy="6.8" r=".64" fill="#0D1B36" stroke="none" />
      <circle cx="8.9" cy="6.8" r=".64" fill="#0D1B36" stroke="none" />
      <path d="M6.31 8.52c.27.64 1.58.72 2.03 0" strokeWidth=".5" />
    </svg>
  )
}

function Profile() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" stroke="#121A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 7.08c1.84 0 3.33-1.3 3.33-2.91S11.84 1.25 10 1.25 6.67 2.56 6.67 4.17 8.16 7.08 10 7.08Z" />
      <path d="M3.33 17.5c0-2.21.7-4.33 1.95-5.9C6.54 10.05 8.23 9.17 10 9.17s3.46.88 4.71 2.44c1.25 1.56 1.96 3.68 1.96 5.89H3.33Z" />
    </svg>
  )
}

function Nav({ mode }: { mode: Mode }) {
  return (
    <header className="fy-nav">
      <div className="fy-glass fy-nav-left">
        <span className="fy-wordmark">binu</span>
        {mode === 'desktop' && (
          <nav className="fy-links">
            <span>Search</span>
            <span>Products</span>
            <span>Ingredients</span>
            <span data-on>For you</span>
            <span>Brands</span>
          </nav>
        )}
      </div>
      <div className="fy-nav-right">
        {mode === 'desktop' && (
          <span className="fy-glass fy-search">
            <SearchScan />
            <span>Search products</span>
          </span>
        )}
        <span className="fy-glass fy-avatar">
          <Profile />
        </span>
      </div>
    </header>
  )
}

function Page({ s, mode }: { s: S; mode: Mode }) {
  const { order } = VIEWS[s.view]
  const current = PICKS.find((p) => p.id === s.sel) ?? PICKS[order[0]]
  return (
    <div className="fy-page" data-mode={mode}>
      <Nav mode={mode} />
      <div className="fy-scroll" data-drag={s.drag || undefined} style={{ transform: `translateY(${-s.scroll}px)` }} data-target="page">
        <main className="fy-main">
          <div className="fy-crumb">For you</div>
          <div className="fy-h1">Matched to your skin</div>
          <p className="fy-lede">
            Your best matches for each kind of product, from your quiz answers and each product&apos;s ingredients. Tap any one to see which ingredients suit your skin and why.
          </p>
          <div className="fy-chips">
            {CATEGORIES.map((c) => (
              <span key={c} className="fy-chip" data-on={c === 'Serums' || undefined}>
                {c}
              </span>
            ))}
          </div>

          <section className="fy-picked">
            <div className="fy-head" data-target="picked">
              <div>
                <div className="fy-h2">Picked for you</div>
                <p className="fy-sub">
                  <Swap id={s.view}>
                    {s.view === 'rec'
                      ? 'Bigger bubbles suit your skin better. All of these are among your best matches.'
                      : 'Your same best matches, re-weighed for value: fit, price and your usual price range. Bigger bubbles are better value.'}
                  </Swap>
                </p>
              </div>
              <Toggle view={s.view} />
            </div>

            <div className="fy-left">
              <Cluster view={s.view} sel={s.sel} mode={mode} />
              <p className="fy-hint">Drag to move around. Tap a bubble or a name to open the product.</p>
            </div>

            <div className="fy-right">
              <Details p={current} />
              <OrderList view={s.view} current={current.id} />
              <p className="fy-listed">
                <Swap id={s.view}>{s.view === 'rec' ? 'Listed best fit first.' : 'Listed best value first. Products with no price yet go last.'}</Swap>
              </p>
            </div>
          </section>

          <div className="fy-total">
            <span>Chosen from 312 serums · 9 hidden as not for you</span>
            <span className="fy-link">See all serums by fit →</span>
          </div>
        </main>
      </div>
    </div>
  )
}

// ── stages ─────────────────────────────────────────────────────────────────

/** Picks the phone design under 600px, for the touch cursor too. */
function useNarrow(ref: React.RefObject<HTMLDivElement | null>, below: number) {
  const [narrow, setNarrow] = useState(false)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => setNarrow(el.getBoundingClientRect().width < below)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, below])
  return narrow
}

// How far each design scrolls to bring the picks up (page px)
const PICKS_AT = { row: 196, rowPhone: 398, tile: 0 }

const rowInitial: S = { view: 'rec', sel: null, scroll: 0 }

/** A swipe on the phone: the page follows the finger, then rests. */
async function swipe(a: Act<S>, from: { x: number; y: number }, to: { x: number; y: number }, start: number, end: number) {
  await a.move(from, { duration: 500 })
  await a.drag(to, (at, f) => {
    const t = Math.max(0, Math.min(1, (f.y - at.y) / (from.y - to.y)))
    a.put({ scroll: start + (end - start) * t, drag: true })
  }, { duration: 650 })
  await a.set({ scroll: end, drag: false })
}

async function rowScript(a: Act<S>) {
  if (a.layout === 'compact') {
    await a.wait(1300)
    a.mark('scroll')
    await swipe(a, { x: 230, y: 470 }, { x: 236, y: 140 }, 0, PICKS_AT.rowPhone)
    await a.wait(700)
    a.mark('price')
    await a.click({ at: 'tab-price', x: 0.5, y: 0.55 })
    await a.set({ view: 'price', sel: null })
    a.mark('payoff')
    await a.wait(3200)
    await a.click({ at: 'tab-rec', x: 0.55, y: 0.55 })
    await a.set({ view: 'rec', sel: null })
    await a.wait(1600)
    await swipe(a, { x: 236, y: 150 }, { x: 230, y: 480 }, PICKS_AT.rowPhone, 0)
    await a.wait(900)
    return
  }
  await a.wait(1400)
  a.mark('scroll')
  await a.move('rest-page', { duration: 700 })
  await a.set({ scroll: PICKS_AT.row })
  await a.wait(1300)
  a.mark('price')
  await a.click({ at: 'tab-price', x: 0.62, y: 0.6 })
  await a.set({ view: 'price', sel: null })
  await a.wait(500)
  await a.move('rest-gap', { duration: 900 })
  a.mark('lens')
  await a.wait(1500)
  a.mark('hover')
  await a.move({ at: 'bub-arencia', x: 0.42, y: 0.66 }, { duration: 900 })
  a.put({ sel: 'arencia' })
  a.mark('payoff')
  await a.wait(2600)
  a.mark('back')
  await a.click({ at: 'tab-rec', x: 0.7, y: 0.6 })
  await a.set({ view: 'rec', sel: null })
  await a.wait(1400)
  await a.move('rest-page', { duration: 700 })
  await a.set({ scroll: 0 })
  await a.wait(1300)
}

const tileInitial: S = { view: 'rec', sel: null, scroll: 0 }

async function tileScript(a: Act<S>) {
  await a.wait(1300)
  a.mark('price')
  await a.click({ at: 'tab-price', x: 0.62, y: 0.6 })
  await a.set({ view: 'price', sel: null })
  await a.move('rest-tile', { duration: 800 })
  a.mark('payoff')
  await a.wait(3000)
  a.mark('back')
  await a.click({ at: 'tab-rec', x: 0.72, y: 0.6 })
  await a.set({ view: 'rec', sel: null })
  await a.move('rest', { duration: 800 })
  await a.wait(2400)
}

type Spec = {
  size: 'row' | 'tile'
  initial: S
  poster: S
  script: (a: Act<S>) => Promise<void>
  rest: { wide: { x: number; y: number }; compact: { x: number; y: number } }
}

const ROW: Spec = {
  size: 'row',
  initial: rowInitial,
  poster: { view: 'price', sel: null, scroll: PICKS_AT.row },
  script: rowScript,
  rest: { wide: { x: 1240, y: 720 }, compact: { x: 300, y: 470 } },
}

const TILE: Spec = {
  size: 'tile',
  initial: tileInitial,
  poster: { view: 'price', sel: null, scroll: 0 },
  script: tileScript,
  rest: { wide: { x: 300, y: 50 }, compact: { x: 300, y: 300 } },
}

function ForYouStage({ spec }: { spec: Spec }) {
  const box = useRef<HTMLDivElement>(null)
  const row = spec.size === 'row'
  const narrow = useNarrow(box, row ? 600 : 420)
  return (
    <div ref={box}>
      <Stage<S>
        width={row ? 1440 : 480}
        height={row ? 757 : 322}
        compact={{ below: row ? 600 : 420, width: 358, height: row ? 640 : 330 }}
        initial={spec.initial}
        poster={spec.poster}
        script={spec.script}
        play="loop"
        cursor={{ at: spec.rest, style: narrow ? 'touch' : undefined }}
        className={`binu fy ${row ? 'fy--row' : 'fy--tile'}`}
      >
        {(s, _rect, layout) => (
          <>
            {layout === 'compact' ? (
              <Phone width={326} className="fy-phone">
                <div className="fy-zoom" data-tile={!row || undefined}>
                  <Page s={row ? (s.scroll === PICKS_AT.row ? { ...s, scroll: PICKS_AT.rowPhone } : s) : { ...s, scroll: PICKS_AT.rowPhone + 4 }} mode="phone" />
                </div>
              </Phone>
            ) : row ? (
              <Window url="binu.app/for-you?category=serum" urlShape="pill" className="fy-win">
                <Page s={s} mode="desktop" />
              </Window>
            ) : (
              <TileCrop s={s} />
            )}
            <span data-target="rest" style={{ position: 'absolute', left: spec.rest[layout].x, top: spec.rest[layout].y }} />
            <span data-target="rest-page" style={{ position: 'absolute', left: 820, top: 520 }} />
            <span data-target="rest-gap" style={{ position: 'absolute', left: 870, top: 640 }} />
            <span data-target="rest-tile" style={{ position: 'absolute', left: 360, top: 120 }} />
          </>
        )}
      </Stage>
    </div>
  )
}

/** The tile: the right-hand column of the desktop page at 1:1, the toggle
 * over the selected pick's details, the order list running off the foot. */
function TileCrop({ s }: { s: S }) {
  const { order } = VIEWS[s.view]
  const current = PICKS.find((p) => p.id === s.sel) ?? PICKS[order[0]]
  return (
    <div className="fy-page fy-crop" data-mode="desktop">
      <div className="fy-right">
        <Toggle view={s.view} />
        <Details p={current} />
        <OrderList view={s.view} current={current.id} />
      </div>
    </div>
  )
}

export function ForYouPage() {
  return <ForYouStage spec={ROW} />
}

export function ForYouTile() {
  return <ForYouStage spec={TILE} />
}
