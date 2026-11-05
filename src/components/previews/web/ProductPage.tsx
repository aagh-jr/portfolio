// PORTFOLIO PREVIEW: Binu product page. Animated faux UI for the portfolio case
// study, rebuilt from apps/web; not app code and never imported by it.
// Exports: ProductPage (full width, 1440 × 757); ProductTile (480 × 322).
// Status: DONE, not wired in. Workspace guide: design/portfolio-previews/HANDOFF.md

import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Stage } from '../../stageshow/kit/stage'
import { Window } from '../../stageshow/kit/window'
import { Phone } from '../../stageshow/kit/phone'
import { Scroll } from '../../stageshow/kit/motion/Scroll'
import { Swap } from '../../stageshow/kit/motion/Swap'
import type { Act } from '../../stageshow/kit/act'
import { ArrowRight } from './icons'
import ordinaryNiac from './img/ordinary-niac.jpg'
import './binu.css'
import './product-page.css'

// Binu's product page, rebuilt from skinsavior main
// (apps/web/src/app/product/[slug]/page.tsx and what it renders:
// SiteNavView, ProductIdentityView, ProductGallery, ActionTile,
// BuyProductGrid, EvidenceByClaim, ProductProfileSplit, IngredientCardView),
// at the app's own Tailwind sizes, tokens from app/globals.css. Content is
// the live page for The Ordinary Niacinamide 10% + Zinc 1%; the niacinamide
// card's description and paper come from fixtures/insights.fixtures.ts.
//
// The one interaction the page owns: pressing an ingredient in the INCI
// list swaps the ingredient card beside it.
//
// ProductPage (full row, 1440 × 757): the top of the page; it scrolls to the
// evidence-by-claim table, then on to the ingredients; the pointer presses
// "Niacinamide 10.0%" and the card turns from water to the active, its
// benefits and research filling in. The page scrolls back to the top, where
// the card returns to the first ingredient out of view.
// ProductTile (480 × 322): the ingredient split as it stacks below lg, at
// real size: the press, the card swapping under the list, a scroll to its
// benefits, and a press on "Aqua (Water)" that puts it back.

type Sel = 'aqua' | 'niac'
type S = { sel: Sel; hover: string | null; still?: boolean }

const INCI: { id: string; name: string }[] = [
  { id: 'aqua', name: 'Aqua (Water)' },
  { id: 'niac', name: 'Niacinamide 10.0%' },
  { id: 'pentylene', name: 'Pentylene Glycol' },
  { id: 'zinc', name: 'Zinc Pca 1.0%' },
  { id: 'dmi', name: 'Dimethyl Isosorbide' },
  { id: 'tamarind', name: 'Tamarindus Indica Seed Gum' },
  { id: 'xanthan', name: 'Xanthan Gum' },
  { id: 'isoceteth', name: 'Isoceteth-20' },
  { id: 'ethoxy', name: 'Ethoxydiglycol' },
  { id: 'phenoxy', name: 'Phenoxyethanol' },
  { id: 'chlorphenesin', name: 'Chlorphenesin' },
]

const CLAIMS = [
  {
    slug: 'evens-tone',
    label: 'Evens tone',
    grade: 'Strong evidence',
    notches: 4,
    summary:
      'Multiple randomized human trials have measured niacinamide’s impact on skin pigmentation and the appearance of dark patches. These studies observed changes in how pigment is transferred to skin cells. While this evidence is strong, most trials involved small groups of participants, which limits how broadly these findings can be applied to all skin types.',
  },
  {
    slug: 'minimizes-pores',
    label: 'Minimizes pores',
    grade: 'Moderate evidence',
    notches: 3,
    summary:
      'Randomized human trials involving 50 participants measured changes in sebum production and pore appearance after applying 2% niacinamide. While these studies observed changes in skin texture, most were funded by the industry, which can influence how results are reported. Consequently, the evidence supporting these findings is considered moderate.',
  },
]

/** Image imports are strings in Vite and `{ src }` in Astro. */
const src = (m: unknown) => (typeof m === 'string' ? m : (m as { src: string }).src)

// ── Icons: the product's own artwork (apps/web/public/icons) ──────────────

const stroke = { fill: 'none', stroke: '#12181F', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function PlusIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <path {...stroke} d="M15 26.25C21.2132 26.25 26.25 21.2132 26.25 15C26.25 8.7868 21.2132 3.75 15 3.75C8.7868 3.75 3.75 8.7868 3.75 15C3.75 21.2132 8.7868 26.25 15 26.25Z" />
      <path {...stroke} d="M15 10V20M10 15H20" />
    </svg>
  )
}
function CartIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <path {...stroke} stroke="black" d="M10 10H14.1379L16.2069 21.4286H27.2414L30 12.8571H14.8276M16.8966 24.2857H27.931M18.9655 28.5714C18.9655 28.9503 18.8202 29.3137 18.5615 29.5816C18.3029 29.8495 17.952 30 17.5862 30C17.2204 30 16.8696 29.8495 16.6109 29.5816C16.3522 29.3137 16.2069 28.9503 16.2069 28.5714C16.2069 28.1925 16.3522 27.8292 16.6109 27.5613C16.8696 27.2934 17.2204 27.1429 17.5862 27.1429C17.952 27.1429 18.3029 27.2934 18.5615 27.5613C18.8202 27.8292 18.9655 28.1925 18.9655 28.5714ZM28.6207 28.5714C28.6207 28.9503 28.4754 29.3137 28.2167 29.5816C27.958 29.8495 27.6072 30 27.2414 30C26.8756 30 26.5247 29.8495 26.2661 29.5816C26.0074 29.3137 25.8621 28.9503 25.8621 28.5714C25.8621 28.1925 26.0074 27.8292 26.2661 27.5613C26.5247 27.2934 26.8756 27.1429 27.2414 27.1429C27.6072 27.1429 27.958 27.2934 28.2167 27.5613C28.4754 27.8292 28.6207 28.1925 28.6207 28.5714Z" />
    </svg>
  )
}
function BookmarkIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <path {...stroke} d="M7.5 4.375H22.5V25.625L15 21.25L7.5 25.625V4.375Z" />
    </svg>
  )
}
function SearchScanIcon() {
  const s = { fill: 'none', stroke: '#0D1B36', strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path {...s} strokeWidth={0.75} d="M7.25094 13.1685C10.5191 13.1685 13.1685 10.5191 13.1685 7.25094C13.1685 3.98273 10.5191 1.33333 7.25094 1.33333C3.98273 1.33333 1.33333 3.98273 1.33333 7.25094C1.33333 10.5191 3.98273 13.1685 7.25094 13.1685Z" />
      <path {...s} strokeWidth={0.87} d="M11.4831 11.4831L14.6667 14.6667" />
      <path {...s} strokeWidth={0.56} d="M3.9176 5.97753V5.07865C3.9176 4.70412 4.21723 4.44195 4.59176 4.44195H5.37828M9.16105 4.44195H10.0225C10.397 4.44195 10.6966 4.74157 10.6966 5.11611V6.01498M3.9176 8.67416V9.64794C3.9176 10.0225 4.21723 10.3221 4.59176 10.3221H5.37828M9.16105 10.3221H10.0225C10.397 10.3221 10.6966 10.0225 10.6966 9.64794V8.71161" />
      <circle cx="5.75" cy="6.8" r="0.64" fill="#0D1B36" />
      <circle cx="8.9" cy="6.8" r="0.64" fill="#0D1B36" />
      <path {...s} strokeWidth={0.5} d="M6.31461 8.52435C6.57678 9.16105 7.88764 9.23596 8.33708 8.52435" />
    </svg>
  )
}
function PoresIcon() {
  const s = { fill: 'none', stroke: 'black', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden className="pp-claim-art">
      <path {...s} d="M24 27.1C25.7121 27.1 27.1 25.7121 27.1 24C27.1 22.2879 25.7121 20.9 24 20.9C22.2879 20.9 20.9 22.2879 20.9 24C20.9 25.7121 22.2879 27.1 24 27.1Z" />
      <path {...s} d="M7 7L18.6 18.6M18.6 12.4V18.6H12.4M41 7L29.4 18.6M29.4 12.4V18.6H35.6M7 41L18.6 29.4M18.6 35.6V29.4H12.4M41 41L29.4 29.4M29.4 35.6V29.4H35.6" />
    </svg>
  )
}
function ReviewIcon() {
  const s = { stroke: 'black', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <span className="pp-study">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden>
        <path {...s} fill="none" d="M32.4 4H5.6C4.71634 4 4 4.71634 4 5.6V40.4C4 41.2837 4.71634 42 5.6 42H32.4C33.2837 42 34 41.2837 34 40.4V5.6C34 4.71634 33.2837 4 32.4 4Z" />
        <path {...s} fill="none" d="M9.6 10.4H14.4M9.6 15.6H28M9.6 20.8H19.4999M9.6 26L16.4999 26M9.6 31.2H16.9999M9.6 36.4L19.9999 36.5" />
        <path {...s} fill="none" d="M34 34L42 41" />
        <path {...s} fill="white" d="M28 36C32.4183 36 36 32.4183 36 28C36 23.5817 32.4183 20 28 20C23.5817 20 20 23.5817 20 28C20 32.4183 23.5817 36 28 36Z" />
      </svg>
    </span>
  )
}
function AmazonMark() {
  return (
    <svg viewBox="2.167 .438 251.038 259.969" width="54" height="56" aria-label="Amazon">
      <g fill="none" fillRule="evenodd">
        <path fill="#f90" fillRule="nonzero" d="m221.503 210.324c-105.235 50.083-170.545 8.18-212.352-17.271-2.587-1.604-6.984.375-3.169 4.757 13.928 16.888 59.573 57.593 119.153 57.593 59.621 0 95.09-32.532 99.527-38.207 4.407-5.627 1.294-8.731-3.16-6.872zm29.555-16.322c-2.826-3.68-17.184-4.366-26.22-3.256-9.05 1.078-22.634 6.609-21.453 9.93.606 1.244 1.843.686 8.06.127 6.234-.622 23.698-2.826 27.337 1.931 3.656 4.79-5.57 27.608-7.255 31.288-1.628 3.68.622 4.629 3.68 2.178 3.016-2.45 8.476-8.795 12.14-17.774 3.639-9.028 5.858-21.622 3.71-24.424z" />
        <path fill="#000" d="m150.744 108.13c0 13.141.332 24.1-6.31 35.77-5.361 9.489-13.853 15.324-23.341 15.324-12.952 0-20.495-9.868-20.495-24.432 0-28.75 25.76-33.968 50.146-33.968zm34.015 82.216c-2.23 1.992-5.456 2.135-7.97.806-11.196-9.298-13.189-13.615-19.356-22.487-18.502 18.882-31.596 24.527-55.601 24.527-28.37 0-50.478-17.506-50.478-52.565 0-27.373 14.85-46.018 35.96-55.126 18.313-8.066 43.884-9.489 63.43-11.718v-4.365c0-8.018.616-17.506-4.08-24.432-4.128-6.215-12.003-8.777-18.93-8.777-12.856 0-24.337 6.594-27.136 20.257-.57 3.037-2.799 6.026-5.835 6.168l-32.735-3.51c-2.751-.618-5.787-2.847-5.028-7.07 7.543-39.66 43.36-51.616 75.43-51.616 16.415 0 37.858 4.365 50.81 16.795 16.415 15.323 14.849 35.77 14.849 58.02v52.565c0 15.798 6.547 22.724 12.714 31.264 2.182 3.036 2.657 6.69-.095 8.966-6.879 5.74-19.119 16.415-25.855 22.393l-.095-.095" />
      </g>
    </svg>
  )
}

// ── Page parts ─────────────────────────────────────────────────────────────

type Variant = 'desktop' | 'phone'

function Nav({ variant }: { variant: Variant }) {
  return (
    <header className="pp-nav">
      <div className="pp-nav-left pp-glass">
        <span className="pp-wordmark">binu</span>
        {variant === 'desktop' && (
          <nav className="pp-links">
            <span>Search</span>
            <span>Products</span>
            <span>Ingredients</span>
            <span>For you</span>
            <span>Brands</span>
          </nav>
        )}
      </div>
      <div className="pp-nav-right">
        {variant === 'desktop' && (
          <span className="pp-search pp-glass">
            <SearchScanIcon />
            <span>Search products</span>
          </span>
        )}
        <span className="pp-login pp-glass">Log in</span>
        {variant === 'desktop' && (
          <span className="pp-start">
            Get started
            <ArrowRight size={16} strokeWidth={1.4} />
          </span>
        )}
      </div>
    </header>
  )
}

function Identity() {
  return (
    <section className="pp-identity pp-container">
      <div className="pp-crumb">Products / Serum</div>
      <div className="pp-identity-grid">
        <div className="pp-left">
          <div className="pp-photo">
            <img src={src(ordinaryNiac)} alt="" />
          </div>
          <p className="pp-caption">Add to</p>
          <div className="pp-tiles">
            <span className="pp-tile">
              <PlusIcon />
              Routines
            </span>
            <span className="pp-tile">
              <CartIcon />
              Wishlist
            </span>
            <span className="pp-tile">
              <BookmarkIcon />
              Library
            </span>
          </div>
          <p className="pp-caption">Buy product</p>
          <div className="pp-buy">
            <span className="pp-store">
              <AmazonMark />
            </span>
            <p className="pp-fine">Amazon search. Results aren’t checked by Binu.</p>
            <p className="pp-fine">
              Some store links earn us a commission. It never affects scores. <u>How we make money</u>
            </p>
          </div>
        </div>
        <div className="pp-right">
          <div className="pp-brand">The Ordinary</div>
          <div className="pp-title">Niacinamide 10% + Zinc 1%</div>
          <dl className="pp-fields">
            <div>
              <dt>Type of product</dt>
              <dd>Serum</dd>
            </div>
            <div>
              <dt>Benefits</dt>
              <dd className="pp-pills">
                <span className="pp-pill">Evens tone</span>
                <span className="pp-pill">Minimizes pores</span>
              </dd>
            </div>
            <div>
              <dt>Irritancy</dt>
              <dd>
                Unrated
                <span className="pp-sub">0 rated · 11 unrated</span>
              </dd>
            </div>
            <div>
              <dt>Conflict</dt>
              <dd>
                <span className="pp-link">Sign in to check your routine</span>
              </dd>
            </div>
          </dl>
          <p className="pp-desc">A universal serum for blemish-prone skin that smooths, brightens, and supports.</p>
        </div>
      </div>
    </section>
  )
}

function Strength({ notches, label }: { notches: number; label: string }) {
  return (
    <div className="pp-strength">
      <div className="pp-bars" aria-hidden>
        {[14, 20, 26, 32].map((h, i) => (
          <span key={h} style={{ height: h }} data-on={i < notches || undefined} />
        ))}
      </div>
      <span className="pp-grade">{label}</span>
    </div>
  )
}

function Evidence() {
  return (
    <div className="pp-evidence pp-container" data-target="evidence">
      <div className="pp-table" data-target="evidence-table">
        <div className="pp-thead pp-cols">
          <span className="pp-c">Claim</span>
          <span className="pp-c">Evidence strength</span>
          <span>Supporting ingredients</span>
          <span>Summary</span>
        </div>
        <ul className="pp-tbody">
          {CLAIMS.map((c) => (
            <li key={c.slug} className="pp-claim pp-cols">
              <div className="pp-claim-name">
                {c.slug === 'minimizes-pores' ? <PoresIcon /> : <span className="pp-letter">{c.label[0]}</span>}
                <span>{c.label}</span>
              </div>
              <Strength notches={c.notches} label={c.grade} />
              <div className="pp-bubbles">
                <span className="pp-bubble">Niacinamide</span>
              </div>
              <p className="pp-summary">{c.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Chip({ tone, children }: { tone: 'primary' | 'good' | 'neutral'; children: ReactNode }) {
  return (
    <span className="pp-chip" data-tone={tone}>
      {children}
    </span>
  )
}

function InciList({ sel, hover }: { sel: Sel; hover: string | null }) {
  return (
    <p className="pp-inci">
      {INCI.map((it, i) => (
        <span key={it.id}>
          <span
            className="pp-inci-item"
            data-target={`inci-${it.id}`}
            data-cursor="pointer"
            data-on={sel === it.id || undefined}
            data-hl={hover === it.id || undefined}
          >
            {it.name}
            {i < INCI.length - 1 && <span className="pp-comma">,</span>}
          </span>
          {i < INCI.length - 1 ? ' ' : null}
        </span>
      ))}
    </p>
  )
}

function IngredientCard({ sel }: { sel: Sel }) {
  const n = sel === 'niac'
  return (
    <section className="pp-card" data-target="card">
      <div className="pp-card-top">
        <div className="pp-card-name">
          <Swap id={sel}>{n ? 'Niacinamide 10.0%' : 'Aqua (Water)'}</Swap>
        </div>
        <dl className="pp-rows">
          <div className="pp-row">
            <dt>Role</dt>
            <dd>
              <Swap id={sel}>{n ? <Chip tone="primary">Active</Chip> : <Chip tone="primary">Solvent</Chip>}</Swap>
            </dd>
          </div>
          <div className="pp-row">
            <dt>Irritant</dt>
            <dd>
              <Chip tone="neutral">Unrated</Chip>
            </dd>
          </div>
          <div className="pp-row">
            <dt>Clashes</dt>
            <dd>
              <Chip tone="neutral">None known</Chip>
            </dd>
          </div>
          <div className="pp-row" data-target="row-benefits">
            <dt>Benefits</dt>
            <dd>
              <Swap id={sel}>
                {n ? (
                  <span className="pp-benefits">
                    {['Evens tone', 'Minimizes pores'].map((b) => (
                      <span key={b} className="pp-benefit">
                        <span className="pp-badge">{b[0]}</span>
                        {b}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="pp-muted">Not yet reviewed</span>
                )}
              </Swap>
            </dd>
          </div>
        </dl>
      </div>

      {/* The lower sections crossfade in one cell, so the card keeps its place */}
      <div className="pp-lower">
        <div className="pp-layer" data-on={!n || undefined}>
          <div className="pp-sec">
            <div className="pp-label">Description</div>
            <p className="pp-body pp-muted">
              No plain-language summary yet. Summaries are written from the research after each weekly review.
            </p>
          </div>
          <div className="pp-sec pp-sec--rule">
            <div className="pp-label pp-label--small">Research</div>
            <p className="pp-body pp-muted">Not yet reviewed</p>
          </div>
        </div>
        <div className="pp-layer" data-on={n || undefined}>
          <div className="pp-sec">
            <div className="pp-label">Description</div>
            <div className="pp-desc-body">
              <p className="pp-body">
                A form of vitamin B3 that helps the look of uneven tone and dullness, and helps skin hold on to water.
              </p>
              <div className="pp-label pp-label--small">From the research</div>
              <p className="pp-body pp-body--tight">
                Several randomized trials measured a visible reduction in the look of uneven tone after eight to twelve weeks. Most
                were small, and some were industry-funded, so the size of the effect is uncertain.
              </p>
            </div>
          </div>
          <div className="pp-sec pp-sec--rule">
            <div className="pp-label pp-label--small">Research</div>
            <article className="pp-paper">
              <ReviewIcon />
              <div className="pp-paper-body">
                <div className="pp-paper-title">Topical niacinamide and the appearance of uneven tone: a systematic review</div>
                <p className="pp-paper-meta">Journal of Cosmetic Dermatology · 2021 · Systematic review</p>
                <div className="pp-paper-chips">
                  <Chip tone="good">Free full text</Chip>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function Ingredients({ s }: { s: S }) {
  return (
    <section className="pp-ingredients pp-container" data-target="ingredients">
      <div className="pp-split">
        <aside className="pp-aside">
          <div className="pp-h2">Ingredients ({INCI.length})</div>
          <InciList sel={s.sel} hover={s.hover} />
        </aside>
        <IngredientCard sel={s.sel} />
      </div>
    </section>
  )
}

function FullPage({ s, variant }: { s: S; variant: Variant }) {
  return (
    <Scroll name="page" className="pp-scroll" bar="overlay">
      <div className="pp-page" data-variant={variant} data-still={s.still || undefined}>
        <Nav variant={variant} />
        <main>
          <Identity />
          <Evidence />
          <Ingredients s={s} />
        </main>
      </div>
    </Scroll>
  )
}

/** Picks the phone design under `below`, for the touch cursor too. */
function useNarrow(ref: RefObject<HTMLDivElement | null>, below: number) {
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

const URL = 'binu.app/product/the-ordinary-niacinamide-10-zinc-1'

/**
 * a.scroll measures with the stage's scale only; inside a Phone the screen is
 * scaled again, so a target would land short. Correct the offset for it.
 */
function scrollTo(a: Act<S>, scroller: string, target: string, opts: { duration: number; offset: number; screen?: number }) {
  if (!opts.screen) return a.scroll(scroller, target, opts)
  const box = a.rect(scroller)
  const k = box.width / opts.screen
  const dy = a.rect(target).y - box.y
  return a.scroll(scroller, target, { duration: opts.duration, offset: dy - dy / k + opts.offset })
}

// ── ProductPage: the whole desktop page, 1440 × 757 ────────────────────────

const pageInitial: S = { sel: 'aqua', hover: null }
const PAGE_REST = { wide: { x: 1160, y: 600 }, compact: { x: 290, y: 430 } }

async function pageScript(a: Act<S>) {
  const wide = a.layout === 'wide'
  await a.wait(1600)
  a.mark('evidence')
  await scrollTo(a, 'page', 'evidence-table', { duration: 1500, offset: wide ? 88 : 96, screen: wide ? 0 : 402 })
  await a.wait(wide ? 1700 : 1500)
  a.mark('ingredients')
  await scrollTo(a, 'page', 'ingredients', { duration: 1200, offset: wide ? 40 : 40, screen: wide ? 0 : 402 })
  await a.wait(300)
  a.mark('pick')
  await a.move({ at: 'inci-niac', x: 0.62, y: 0.72 })
  a.put({ hover: 'niac' })
  await a.wait(220)
  await a.click()
  a.mark('swap')
  await a.set({ sel: 'niac', hover: null })
  await a.wait(500)
  if (wide) {
    await a.move('rest-low', { duration: 800 })
  } else {
    // One column: the card sits under the list; read on down to its benefits
    // with the pressed ingredient still in view
    await scrollTo(a, 'page', 'card', { duration: 900, offset: 250, screen: 402 })
  }
  a.mark('payoff')
  await a.wait(2600)
  a.mark('back')
  await a.scroll('page', 0, { duration: 1500 })
  // Out of view: the card returns to the first ingredient, as on a fresh load
  await a.snap({ sel: 'aqua' })
  await a.move('rest', { duration: 600 })
  await a.wait(300)
}

export function ProductPage() {
  const box = useRef<HTMLDivElement>(null)
  const narrow = useNarrow(box, 600)
  return (
    <div ref={box}>
      <Stage<S>
        width={1440}
        height={757}
        compact={{ below: 600, width: 358, height: 520 }}
        initial={pageInitial}
        poster={{ sel: 'niac', hover: null, still: true }}
        script={pageScript}
        play="loop"
        cursor={{ at: PAGE_REST, style: narrow ? 'touch' : undefined }}
        className="binu bwp-product bwp-product--row"
      >
        {(s, _rect, layout) => (
          <>
            {layout === 'compact' ? (
              <Phone width={326} className="pp-phone">
                <FullPage s={s} variant="phone" />
              </Phone>
            ) : (
              <Window url={URL} urlShape="pill" className="pp-win">
                <FullPage s={s} variant="desktop" />
              </Window>
            )}
            <span data-target="rest" style={{ position: 'absolute', left: PAGE_REST[layout].x, top: PAGE_REST[layout].y }} />
            <span
              data-target="rest-low"
              style={{ position: 'absolute', left: layout === 'wide' ? 300 : 300, top: layout === 'wide' ? 640 : 470 }}
            />
          </>
        )}
      </Stage>
    </div>
  )
}

// ── ProductTile: the ingredient split, stacked, 480 × 322 ──────────────────

const tileInitial: S = { sel: 'aqua', hover: null }
const TILE_REST = { wide: { x: 400, y: 250 }, compact: { x: 300, y: 300 } }

async function tileScript(a: Act<S>) {
  const wide = a.layout === 'wide'
  await a.wait(1200)
  a.mark('pick')
  await a.move({ at: 'inci-niac', x: 0.62, y: 0.72 })
  a.put({ hover: 'niac' })
  await a.wait(220)
  await a.click()
  a.mark('swap')
  await a.set({ sel: 'niac', hover: null })
  await a.wait(900)
  a.mark('read')
  await scrollTo(a, 'tile', 'card', { duration: 1100, offset: wide ? 16 : 20, screen: wide ? 0 : 402 })
  await a.move('rest', { duration: 600 })
  a.mark('payoff')
  await a.wait(2600)
  a.mark('back')
  await a.scroll('tile', 0, { duration: 1100 })
  await a.wait(250)
  // The reset is a press: back to the first ingredient, as the page loads
  await a.move({ at: 'inci-aqua', x: 0.6, y: 0.72 })
  a.put({ hover: 'aqua' })
  await a.wait(200)
  await a.click()
  await a.set({ sel: 'aqua', hover: null })
  await a.wait(500)
  await a.move('rest', { duration: 700 })
  await a.wait(400)
}

export function ProductTile() {
  const box = useRef<HTMLDivElement>(null)
  const narrow = useNarrow(box, 420)
  return (
    <div ref={box}>
      <Stage<S>
        width={480}
        height={322}
        compact={{ below: 420, width: 358, height: 330 }}
        initial={tileInitial}
        poster={{ sel: 'niac', hover: null, still: true }}
        script={tileScript}
        play="loop"
        cursor={{ at: TILE_REST, style: narrow ? 'touch' : undefined }}
        className="binu bwp-product bwp-product--tile"
      >
        {(s, _rect, layout) => {
          const body = (
            <Scroll name="tile" className="pp-scroll" bar="overlay">
              <div className="pp-page pp-page--tile" data-variant={layout === 'compact' ? 'phone' : 'stack'} data-still={s.still || undefined}>
                <Ingredients s={s} />
              </div>
            </Scroll>
          )
          return (
            <>
              {layout === 'compact' ? (
                <Phone width={326} className="pp-phone">
                  {body}
                </Phone>
              ) : (
                <Window url={URL} urlShape="pill" className="pp-win">
                  {body}
                </Window>
              )}
              <span data-target="rest" style={{ position: 'absolute', left: TILE_REST[layout].x, top: TILE_REST[layout].y }} />
            </>
          )
        }}
      </Stage>
    </div>
  )
}
