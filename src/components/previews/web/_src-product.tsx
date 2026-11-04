import { Bookmark, CirclePlus, FileSearch, ShoppingCart } from 'lucide-react'
import { Bar, Scroll, Stage, Swap, Window as KitWindow, type Act } from '../../kit'
import type { ReactNode } from 'react'
import ordinaryNiac from '../binu-shared/img/ordinary-niac.jpg'
import '../binu-shared/binu.css'
import './product.css'

// Binu's product page, scrolled. Beats: the top of the page (photo, title,
// the stats row); the pointer scrolls down to the ingredient split; it
// presses "Niacinamide 10%" in the INCI list and the ingredient card beside
// it changes from water to the active: its role, benefits, the research line
// and one paper. The page scrolls back to the top, where the card's
// selection returns to the first ingredient out of view.
//
// Real strings: the title and brand, the four stats, the INCI list, the
// selected ingredient's card. Gallery thumbs, the buy row and paper metadata
// are quiet filler.

const INCI = [
  { id: 'aqua', name: 'Aqua (Water)' },
  { id: 'niac', name: 'Niacinamide 10%' },
  { id: 'pentylene', name: 'Pentylene Glycol' },
  { id: 'zinc', name: 'Zinc PCA 1%' },
  { id: 'dmi', name: 'Dimethyl Isosorbide' },
  { id: 'tamarind', name: 'Tamarindus Indica Seed Gum' },
  { id: 'xanthan', name: 'Xanthan Gum' },
  { id: 'isoceteth', name: 'Isoceteth-20' },
  { id: 'ethoxy', name: 'Ethoxydiglycol' },
  { id: 'phenoxy', name: 'Phenoxyethanol' },
  { id: 'chlorphenesin', name: 'Chlorphenesin' },
]

type Sel = 'aqua' | 'niac'
// `still` is the poster's view: the page as it stands at the payoff, scrolled
// to the ingredients (a poster can't scroll, so the sections above step out)
type S = { sel: Sel; hover: string | null; deep: boolean; still?: boolean }

const REST = { wide: { x: 560, y: 470 }, compact: { x: 300, y: 250 } }

const initial: S = { sel: 'aqua', hover: null, deep: false }

async function script(a: Act<S>) {
  await a.wait(1700)
  a.mark('scroll')
  await a.scroll('page', 'ingredients', { duration: 1300 })
  await a.wait(350)
  a.mark('pick')
  await a.move({ at: 'inci-niac', x: 0.7, y: 0.75 })
  a.put({ hover: 'niac' })
  await a.wait(250)
  await a.click()
  a.mark('swap')
  await a.set({ sel: 'niac' })
  await a.wait(a.layout === 'compact' ? 600 : 900)
  if (a.layout === 'compact') {
    // In one column the card sits under the list: read on down to the paper
    // The research below the fold arrives as the page carries it up
    a.put({ hover: null, deep: true })
    await a.scroll('page', 'card-research', { offset: 215, duration: 900 })
    await a.move({ at: 'row-clashes', x: 0.9, y: 0.5 }, { duration: 500 })
  } else {
    a.put({ hover: null })
    await a.move('rest-low', { duration: 700 })
  }
  a.mark('payoff')
  await a.wait(2600)
  a.mark('back')
  await a.scroll('page', 0, { duration: 1300 })
  // Out of view: the card returns to the first ingredient, as on a fresh load
  await a.snap({ sel: 'aqua', deep: false })
  await a.move('rest', { duration: 600 })
  await a.wait(500)
}

function InciList({ sel, hover }: { sel: Sel; hover: string | null }) {
  return (
    <p className="bp-inci">
      {INCI.map((it, i) => (
        <span key={it.id}>
          <span
            className="bp-inci-item"
            data-target={`inci-${it.id}`}
            data-cursor="pointer"
            data-on={sel === it.id || undefined}
            data-hl={hover === it.id || undefined}
          >
            {it.name}
            {i < INCI.length - 1 && <span className="bp-comma">,</span>}
          </span>
          {i < INCI.length - 1 ? ' ' : null}
        </span>
      ))}
    </p>
  )
}

function Chip({ tone, children }: { tone: 'primary' | 'good' | 'neutral'; children: string }) {
  return (
    <span className="bp-chip" data-tone={tone}>
      {children}
    </span>
  )
}

function IngredientCard({ sel, held }: { sel: Sel; held: boolean }) {
  const n = sel === 'niac'
  return (
    <div className="bp-card" data-target="card">
      <div className="bp-card-head b-serif">
        <Swap id={sel}>{n ? 'Niacinamide' : 'Aqua'}</Swap>
      </div>
      <dl className="bp-rows">
        <div className="bp-row">
          <dt>Role</dt>
          <dd>
            <Swap id={sel}>{n ? <Chip tone="primary">Active</Chip> : <Chip tone="neutral">Solvent</Chip>}</Swap>
          </dd>
        </div>
        <div className="bp-row">
          <dt>Irritant</dt>
          <dd>
            <Swap id={sel}>{n ? <Chip tone="good">Low</Chip> : <Chip tone="neutral">Unrated</Chip>}</Swap>
          </dd>
        </div>
        <div className="bp-row" data-target="row-clashes">
          <dt>Clashes</dt>
          <dd>
            <Chip tone="neutral">None known</Chip>
          </dd>
        </div>
        <div className="bp-row">
          <dt>Benefits</dt>
          <dd>
            <Swap id={sel}>
              {n ? (
                <span className="bp-benefits">
                  {['Controls oil', 'Antioxidant'].map((b) => (
                    <span key={b} className="bp-benefit">
                      <span className="bp-badge">{b[0]}</span>
                      {b}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="bp-none">No graded claims yet</span>
              )}
            </Swap>
          </dd>
        </div>
      </dl>

      {/* The lower half crossfades in one cell: the card keeps its place */}
      <div className="bp-lower">
        <div className="bp-layer" data-on={!n || undefined}>
          <div className="b-caps bp-label">Description</div>
          <Bar w="92%" h={7} tone={2} />
          <Bar w="64%" h={7} tone={2} />
        </div>
        <div className="bp-layer" data-on={n || undefined} data-held={held || undefined} data-target="card-research">
          <div className="b-caps bp-label">From the research</div>
          <p className="bp-research">
            Several randomized trials measured a visible reduction in the look of uneven tone after eight to twelve weeks.
          </p>
          <div className="bp-paper">
            <FileSearch className="bp-paper-icon" size={22} strokeWidth={1.6} />
            <div className="bp-paper-body">
              <div className="bp-paper-title">Topical niacinamide and the appearance of uneven tone: a systematic review</div>
              <Bar w={180} h={6} tone={2} />
              <div className="bp-paper-facts">
                <span className="bp-n">N = 612</span>
                <Chip tone="good">Positive result</Chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BinuProduct() {
  return (
    <Stage
      width={720}
      height={590}
      compact={{ below: 600, width: 358, height: 580 }}
      initial={initial}
      poster={{ sel: 'niac', hover: null, deep: true, still: true }}
      script={script}
      cursor={{ at: REST }}
      className="binu bp"
    >
      {(s, _rect, layout) => (
        <>
          <Window url="binu.app/products/the-ordinary-niacinamide-10-zinc-1" layout={layout}>
            <Scroll name="page" className="bp-scroll" bar="overlay">
              <div className="bp-page" data-still={s.still || undefined}>
                <section className="bp-top">
                  <div className="bp-crumb">Products / Serums</div>
                  <div className="bp-identity">
                    <div className="bp-gallery">
                      <span className="b-thumb bp-photo">
                        <img src={ordinaryNiac} alt="" />
                      </span>
                      <div className="bp-thumbs">
                        <span className="b-thumb bp-mini" data-on>
                          <img src={ordinaryNiac} alt="" />
                        </span>
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="bp-mini bp-mini--empty" />
                        ))}
                      </div>
                    </div>
                    <div className="bp-facts">
                      <div className="b-caps bp-brand">The Ordinary · Canada</div>
                      <div className="b-serif bp-title">Niacinamide 10% + Zinc 1%</div>
                      <dl className="bp-stats">
                        <div>
                          <dt>Type of product</dt>
                          <dd>Serum</dd>
                        </div>
                        <div>
                          <dt>Benefits</dt>
                          <dd className="bp-pills">
                            <span className="bp-benefit-pill">Controls oil</span>
                            <span className="bp-benefit-pill">Minimizes pores</span>
                          </dd>
                        </div>
                        <div>
                          <dt>Irritancy</dt>
                          <dd>Unrated</dd>
                        </div>
                        <div>
                          <dt>Conflict</dt>
                          <dd>None in your routine</dd>
                        </div>
                      </dl>
                      <p className="bp-desc">A universal serum for blemish-prone skin that smooths, brightens, and supports.</p>
                    </div>
                  </div>
                  <div className="bp-actions">
                    <div className="b-caps bp-actions-label">Add to</div>
                    <div className="bp-tiles">
                      <span className="bp-tile"><CirclePlus size={18} strokeWidth={1.8} />Routines</span>
                      <span className="bp-tile"><ShoppingCart size={18} strokeWidth={1.8} />Wishlist</span>
                      <span className="bp-tile"><Bookmark size={18} strokeWidth={1.8} />Library</span>
                    </div>
                  </div>
                </section>

                <section className="bp-split" data-target="ingredients">
                  <aside className="bp-aside">
                    <div className="b-serif bp-h2">Ingredients ({INCI.length})</div>
                    <InciList sel={s.sel} hover={s.hover} />
                  </aside>
                  <IngredientCard sel={s.sel} held={layout === 'compact' && !s.deep} />
                </section>
              </div>
            </Scroll>
          </Window>
          <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          <span data-target="rest-low" style={{ position: 'absolute', left: 190, top: 565 }} />
        </>
      )}
    </Stage>
  )
}

function Window({ url, layout, children }: { url: string; layout: string; children: ReactNode }) {
  return (
    <KitWindow url={layout === 'wide' ? url : 'binu.app/products/…'} urlShape="pill" className="bp-win">
      <div className="bp-shell">
        <div className="b-nav">
          <span className="b-wordmark">Binu</span>
          {layout === 'wide' && (
            <>
              <span className="bp-nav-on">Products</span>
              <span>Ingredients</span>
              <span>For you</span>
            </>
          )}
          <Bar className="b-nav-avatar" w={26} h={26} r={13} tone={2} />
        </div>
        {children}
      </div>
    </KitWindow>
  )
}
