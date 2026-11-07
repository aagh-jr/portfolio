// PORTFOLIO PREVIEW: Binu signed-in home + search. Animated faux UI for the portfolio case
// study, rebuilt from apps/web; not app code and never imported by it.
// Exports: HomeSearchPage (full width, 1440 × 757); HomeSearchTile (480 × 322).
// Status: DONE, not wired in. Workspace guide: design/portfolio-previews/HANDOFF.md

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Stage } from '../../stageshow/kit/stage'
import { Window } from '../../stageshow/kit/window'
import { Phone } from '../../stageshow/kit/phone'
import type { Act } from '../../stageshow/kit/act'
import ordinaryNiac from './img/ordinary-niac.jpg'
import anuaNiac from './img/anua-niac.jpg'
import bojGlow from './img/boj-glow.jpg'
import anuaCleanser from './img/anua-cleanser.jpg'
import celimaxCream from './img/celimax-cream.jpg'
import cosrxBha from './img/cosrx-bha.jpg'
import arenciaRetinal from './img/arencia-retinal.jpg'
import './binu.css'
import './home-search-page.css'

// Binu's signed-in home, rebuilt from skinsavior-for-you main:
// app/home/page.tsx (welcome + search, the routine summarised underneath),
// components/home/HeroSearch.tsx + HomeSearchView.tsx (the pill: the compact
// mode circle, the field, the send button, the All / Skincare / Ingredients /
// Brands chips) and SearchDropdown.tsx (the live panel: five skeleton rows
// while loading, then the closest matches and "See all results"),
// HomeRoutineSummary.tsx (Morning and Night side by side), SiteNavView.tsx
// (the glass pills; the nav search folds to its icon while the hero search is
// on screen). Tailwind values are written out in px in home-search-page.css.
//
// Story: click into the search, type "niacinamide", the panel drops with
// skeleton rows and the matches fade in; the panel runs past the fold, so the
// page scrolls to it; the pointer rests on The Ordinary's serum. Select all
// and delete clears the field, which closes the panel (as HeroSearch does),
// and the page scrolls back up for the next loop.

const src = (m: unknown) => (typeof m === 'string' ? m : (m as { src: string }).src)

const QUERY = 'niacinamide'

const RESULTS = [
  { id: 'ordinary', img: ordinaryNiac, name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', cat: 'Serum' },
  { id: 'anua', img: anuaNiac, name: 'Niacinamide 10 TXA 4 Serum', brand: 'Anua', cat: 'Serum' },
  { id: 'boj', img: bojGlow, name: 'Glow Serum Propolis + Niacinamide', brand: 'Beauty of Joseon', cat: 'Serum' },
]

type Step = { img: unknown; cat: string; brand: string; name: string }
const CLEANSER: Step = { img: anuaCleanser, cat: 'Cleanser', brand: 'Anua', name: '8 Hyaluronic Acid Hydrating Gentle Foaming Cleanser' }
const MOIST: Step = { img: celimaxCream, cat: 'Moisturizer', brand: 'Celimax', name: 'Oil Control Moisturizing Cream' }
const BHA: Step = { img: cosrxBha, cat: 'Exfoliant · 2× a week', brand: 'COSRX', name: 'BHA Blackhead Power Liquid' }
const RETINAL: Step = { img: arenciaRetinal, cat: 'Serum', brand: 'Arencia', name: 'Retinal Booster Shot Serum' }
const MORNING = [CLEANSER, MOIST]
const NIGHT = [CLEANSER, BHA, RETINAL, MOIST]

const NAME = 'Maya'
const ROUTINE = 'Daily routine'

type S = {
  focused: boolean
  q: string
  /** All of the query selected (cmd+a), before it is deleted. */
  sel: boolean
  /** The fetch came back: matches instead of skeleton rows. */
  ready: boolean
  hover: string | null
  /** Page scroll, px. */
  scroll: number
}

// ---------------------------------------------------------------- icons
// The product's own glyphs (apps/web/public/icons), inlined.

function FaceSearch({ size }: { size: 19 | 32 }) {
  const big = size === 32
  const k = big ? 32 / 19.2 : 1
  return (
    <svg width={big ? 32 : 19.2} height={big ? 32 : 19.2} viewBox="0 0 19.2 19.2" fill="none" aria-hidden style={{ opacity: big ? 0.8 : 1 }}>
      <g stroke="#0D1B36" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8.70112" cy="8.70112" r="7.10112" strokeWidth={big ? 2 / k : 1.2} />
        <path d="M13.7798 13.7798L17.6 17.6" strokeWidth={big ? 2 / k : 1.2} />
        <g strokeWidth={big ? 1.1236 / k : 0.674157}>
          <path d="M4.70112 7.17303V6.09438C4.70112 5.64494 5.06067 5.33034 5.51011 5.33034H6.45393" />
          <path d="M10.9933 5.33034H12.027C12.4764 5.33034 12.836 5.68989 12.836 6.13933V7.21798" />
          <path d="M4.70112 10.409V11.5775C4.70112 12.027 5.06067 12.3865 5.51011 12.3865H6.45393" />
          <path d="M10.9933 12.3865H12.027C12.4764 12.3865 12.836 12.027 12.836 11.5775V10.4539" />
        </g>
        <path d="M7.57753 10.2292C7.89213 10.9933 9.46517 11.0831 10.0045 10.2292" strokeWidth={big ? 0.998752 / k : 0.599251} />
      </g>
      <g fill="#0D1B36">
        <circle cx="6.90337" cy="8.1618" r="0.76405" />
        <circle cx="10.6787" cy="8.1618" r="0.76405" />
      </g>
    </svg>
  )
}

function SendArrow() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden style={{ transform: 'rotate(90deg)' }}>
      <path d="M25 15H5M12.5 22.5L5 15L12.5 7.5" stroke="#3A5A8A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Profile() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <g stroke="#121A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 7.08333C11.8409 7.08333 13.3333 5.7775 13.3333 4.16667C13.3333 2.55584 11.8409 1.25 10 1.25C8.15905 1.25 6.66667 2.55584 6.66667 4.16667C6.66667 5.7775 8.15905 7.08333 10 7.08333Z" />
        <path d="M3.33333 17.5C3.33333 15.2899 4.03571 13.1702 5.28595 11.6074C6.5362 10.0446 8.23189 9.16667 10 9.16667C11.7681 9.16667 13.4638 10.0446 14.714 11.6074C15.9643 13.1702 16.6667 15.2899 16.6667 17.5H3.33333Z" />
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------- page parts

type Size = 'xl' | 'phone'

function Nav({ size }: { size: Size }) {
  return (
    <div className="hs-nav">
      <div className="hs-glass hs-nav-pill">
        <span className="hs-wordmark">binu</span>
        {size === 'xl' && (
          <span className="hs-links">
            <span data-on>Search</span>
            <span>Products</span>
            <span>Ingredients</span>
            <span>For you</span>
            <span>Brands</span>
          </span>
        )}
      </div>
      <div className="hs-nav-right">
        {/* SearchBar, folded to its icon while the hero search is visible */}
        {size === 'xl' && (
          <span className="hs-glass hs-nav-search">
            <FaceSearch size={32} />
          </span>
        )}
        <span className="hs-glass hs-avatar">
          <Profile />
        </span>
      </div>
    </div>
  )
}

function SearchPill({ s }: { s: S }) {
  return (
    <div className="hs-search">
      <div className="hs-form">
        <span className="hs-mode">
          <FaceSearch size={19} />
        </span>
        <span className="hs-input" data-target="input" data-cursor="ibeam">
          {s.q ? (
            <span className="hs-q" data-sel={s.sel || undefined}>{s.q}</span>
          ) : (
            <span className="hs-placeholder">Search products, brands, or ingredients</span>
          )}
          <span className="hs-caret" data-on={(s.focused && !s.sel) || undefined} />
        </span>
        <span className="hs-send">
          <SendArrow />
        </span>
      </div>
      <div className="hs-chips">
        {['All', 'Skincare', 'Ingredients', 'Brands'].map((c, i) => (
          <span key={c} className="hs-chip" data-on={i === 0 || undefined}>
            {c}
          </span>
        ))}
      </div>
      <Dropdown s={s} />
    </div>
  )
}

function Dropdown({ s }: { s: S }) {
  const open = s.q.trim().length > 0
  const state = !open ? 'closed' : s.ready ? 'results' : 'loading'
  return (
    <div className="hs-drop" data-state={state}>
      <div className="hs-skel" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="hs-skel-row">
            <span className="hs-skel-thumb" />
            <span className="hs-skel-lines">
              <span style={{ width: '66%' }} />
              <span style={{ width: '33%' }} />
            </span>
          </div>
        ))}
      </div>
      <div className="hs-results">
        {RESULTS.map((r, i) => (
          <div
            key={r.id}
            className="hs-row"
            style={{ ['--i' as string]: i }}
            data-target={`row-${r.id}`}
            data-cursor="pointer"
            data-hover={s.hover === r.id || undefined}
          >
            <span className="hs-thumb">
              <img src={src(r.img)} alt="" />
            </span>
            <span className="hs-row-text">
              <span className="hs-name">{r.name}</span>
              <span className="hs-meta">
                {r.brand} · {r.cat}
              </span>
            </span>
          </div>
        ))}
        <div className="hs-row hs-all" style={{ ['--i' as string]: RESULTS.length }}>
          <span>See all results for &quot;{QUERY}&quot; →</span>
        </div>
      </div>
    </div>
  )
}

function Column({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div className="hs-col">
      <div className="hs-col-head">
        <span className="hs-col-title">{title}</span>
        <span className="hs-col-count">
          {steps.length} {steps.length === 1 ? 'step' : 'steps'}
        </span>
      </div>
      {steps.map((st, i) => (
        <div key={i} className="hs-step">
          <span className="hs-step-n">{i + 1}</span>
          <span className="hs-step-thumb">
            <img src={src(st.img)} alt="" />
          </span>
          <span className="hs-step-text">
            <span className="hs-step-cat">{st.cat}</span>
            <span className="hs-step-name">
              <span className="hs-step-brand">{st.brand} · </span>
              {st.name}
            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

function Routine() {
  return (
    <div className="hs-routine">
      <div className="hs-routine-head">
        <div className="hs-routine-title">
          Your routine<span className="hs-routine-name">{ROUTINE}</span>
        </div>
        <div className="hs-routine-links">
          <span className="hs-link">Edit routine</span>
          <span className="hs-muted-link">My shelf →</span>
        </div>
      </div>
      <div className="hs-cols">
        <Column title="Morning" steps={MORNING} />
        <Column title="Night" steps={NIGHT} />
      </div>
    </div>
  )
}

function HomePage({ s, size }: { s: S; size: Size }) {
  return (
    <div className="hs-page" data-size={size} data-target="page">
      <div className="hs-scroll" style={{ transform: `translateY(${size === 'xl' ? -s.scroll : 0}px)` }}>
        <div className="hs-main">
          <div className="hs-hero">
            <div className="hs-welcome">
              <div className="hs-h1">Welcome back {NAME},</div>
              <div className="hs-sub">
                {ROUTINE} · {new Set([...MORNING, ...NIGHT]).size} products
              </div>
            </div>
            <SearchPill s={s} />
          </div>
          <Routine />
        </div>
      </div>
      <Nav size={size} />
    </div>
  )
}

// ---------------------------------------------------------------- scripts

const initial: S = { focused: false, q: '', sel: false, ready: false, hover: null, scroll: 0 }

/** Shared beats: focus, type, the panel loads, the matches arrive. */
async function search(a: Act<S>) {
  await a.wait(900)
  a.mark('focus')
  await a.click({ at: 'input', x: 0.3, y: 0.55 })
  a.put({ focused: true })
  await a.wait(300)
  a.mark('type')
  await a.type('q', QUERY, { interval: 80 })
  await a.wait(520)
  a.mark('results')
  a.put({ ready: true })
  await a.wait(900)
}

async function clear(a: Act<S>) {
  a.mark('clear')
  await a.key('cmd+a')
  a.put({ sel: true })
  await a.wait(380)
  await a.key('delete')
  a.put({ q: '', sel: false, ready: false, hover: null })
  await a.wait(500)
}

function pageScript(scrollTo: number) {
  return async (a: Act<S>) => {
    await search(a)
    if (a.layout === 'wide' && scrollTo) {
      // The panel runs past the fold: two-finger scroll on the page beside it
      a.mark('scroll')
      await a.move('scrollspot', { duration: 700 })
      a.put({ scroll: scrollTo })
      await a.wait(950)
    }
    a.mark('hover')
    await a.move({ at: 'row-ordinary', x: 0.82, y: 0.55 }, { duration: 750 })
    a.put({ hover: 'ordinary' })
    await a.wait(2600)
    await a.move('rest', { duration: 700 })
    a.put({ hover: null })
    await clear(a)
    if (a.layout === 'wide' && scrollTo) {
      a.mark('scrollback')
      await a.move('scrollspot', { duration: 600 })
      a.put({ scroll: 0, focused: false })
      await a.wait(1000)
      await a.move('rest', { duration: 600 })
    } else {
      a.put({ focused: false })
      await a.wait(600)
    }
  }
}

// ---------------------------------------------------------------- stages

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

type Pt = { x: number; y: number }

function Shell({
  kind,
  width,
  height,
  compactHeight,
  scrollTo,
  rest,
  scrollspot,
  children,
}: {
  kind: 'row' | 'tile'
  width: number
  height: number
  compactHeight: number
  scrollTo: number
  rest: { wide: Pt; compact: Pt }
  scrollspot?: Pt
  children: (s: S, layout: 'wide' | 'compact') => ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const below = kind === 'tile' ? 420 : 600
  const narrow = useNarrow(box, below)
  const poster: S = { focused: true, q: QUERY, sel: false, ready: true, hover: 'ordinary', scroll: scrollTo }
  return (
    <div ref={box}>
      <Stage<S>
        width={width}
        height={height}
        compact={{ below, width: 358, height: compactHeight }}
        initial={initial}
        poster={poster}
        script={pageScript(scrollTo)}
        play="loop"
        keys={{ wide: kind === 'row' ? 'bottom-right' : 'bottom', compact: 'bottom' }}
        cursor={{ at: rest, style: narrow ? 'touch' : undefined }}
        className={`binu hs hs--${kind}`}
      >
        {(s, _rect, layout) => (
          <>
            {children(s, layout)}
            <span data-target="rest" style={{ position: 'absolute', left: rest[layout].x, top: rest[layout].y }} />
            {scrollspot && <span data-target="scrollspot" style={{ position: 'absolute', left: scrollspot.x, top: scrollspot.y }} />}
          </>
        )}
      </Stage>
    </div>
  )
}

/** Full row: the whole signed-in home at 1440, in a browser. */
export function HomeSearchPage() {
  return (
    <Shell
      kind="row"
      width={1440}
      height={757}
      compactHeight={600}
      scrollTo={190}
      rest={{ wide: { x: 1160, y: 330 }, compact: { x: 290, y: 150 } }}
      scrollspot={{ x: 1180, y: 520 }}
    >
      {(s, layout) =>
        layout === 'compact' ? (
          <Phone width={326} className="hs-phone">
            <HomePage s={s} size="phone" />
          </Phone>
        ) : (
          <Window url="www.heybinu.com/home" urlShape="pill" className="hs-win">
            <HomePage s={s} size="xl" />
          </Window>
        )
      }
    </Shell>
  )
}

/** Close-up: the search pill and its live results at real size. */
export function HomeSearchTile() {
  return (
    <Shell
      kind="tile"
      width={480}
      height={322}
      compactHeight={330}
      scrollTo={0}
      rest={{ wide: { x: 410, y: 140 }, compact: { x: 300, y: 120 } }}
    >
      {(s, layout) =>
        layout === 'compact' ? (
          <Phone width={326} className="hs-phone hs-phone--tile">
            <HomePage s={s} size="phone" />
          </Phone>
        ) : (
          <div className="hs-crop">
            <SearchPill s={s} />
          </div>
        )
      }
    </Shell>
  )
}
