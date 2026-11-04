import { ArrowRight, ArrowUp, Barcode, MessageCircle, Search } from 'lucide-react'
import { Bar, Collapse, Stage, Text, Window, type Act } from '../../kit'
import anuaNiac from '../binu-shared/img/anua-niac.jpg'
import bojGlow from '../binu-shared/img/boj-glow.jpg'
import ordinaryNiac from '../binu-shared/img/ordinary-niac.jpg'
import '../binu-shared/binu.css'
import './search.css'

// Binu's home search. Beats: the cursor clicks into the bar; "niacinamide"
// is typed; results drop in under the bar as real catalogue products; the
// pointer runs down to The Ordinary's serum and presses it. Esc clears the
// bar for the next loop, a seen cause for the reset.
//
// Real strings: the query, the three result rows, the "see all" line. The
// site nav and the routine strip under the fold are context in quiet bars.

const QUERY = 'niacinamide'

const RESULTS = [
  { id: 'ordinary', img: ordinaryNiac, name: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', cat: 'Serum' },
  { id: 'anua', img: anuaNiac, name: 'Niacinamide 10 TXA 4 Serum', brand: 'Anua', cat: 'Serum' },
  { id: 'boj', img: bojGlow, name: 'Glow Serum Propolis + Niacinamide', brand: 'Beauty of Joseon', cat: 'Serum' },
]

type S = { focused: boolean; q: string; shown: number; hover: string | null; pressed: string | null }

const REST = { wide: { x: 692, y: 232 }, compact: { x: 290, y: 204 } }

const initial: S = { focused: false, q: '', shown: 0, hover: null, pressed: null }
const poster: S = { focused: true, q: QUERY, shown: 3, hover: 'ordinary', pressed: null }

async function script(a: Act<S>) {
  await a.wait(700)
  a.mark('focus')
  await a.click({ at: 'input', x: 0.35, y: 0.55 })
  await a.set({ focused: true })
  await a.wait(250)
  a.mark('type')
  await a.type('q', QUERY, { interval: 70 })
  await a.wait(180)
  a.mark('results')
  // Results land top to bottom, each opening its own room
  for (let i = 1; i <= RESULTS.length; i++) {
    a.put({ shown: i })
    await a.wait(90)
  }
  await a.wait(700)
  a.mark('hover')
  await a.move({ at: 'row-boj', x: 0.8, y: 0.6 })
  a.put({ hover: 'boj' })
  await a.wait(250)
  await a.move({ at: 'row-ordinary', x: 0.78, y: 0.6 }, { duration: 700 })
  a.put({ hover: 'ordinary' })
  await a.wait(500)
  a.mark('press')
  await a.click()
  a.put({ pressed: 'ordinary' })
  await a.wait(2200)
  a.mark('reset')
  // Esc closes the results and clears the bar: the reset has a cause
  await a.move('rest')
  await a.key('escape')
  await a.set({ shown: 0, hover: null, pressed: null })
  await a.wait(380)
  await a.set({ q: '', focused: false })
  await a.wait(700)
}

export default function BinuSearch() {
  return (
    <Stage
      width={720}
      height={490}
      compact={{ below: 600, width: 358, height: 356 }}
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: REST }}
      keys={{ wide: 'bottom', compact: 'top' }}
      className="binu bs"
    >
      {(s, _rect, layout) => (
        <>
          <Window url="binu.app/home" urlShape="pill" className="bs-win">
            <div className="bs-page">
              {layout === 'wide' && (<div className="b-nav">
                <span className="b-wordmark">Binu</span>
                {layout === 'wide' && (
                  <>
                    <span>Products</span>
                    <span>Ingredients</span>
                    <span>For you</span>
                  </>
                )}
                <Bar className="b-nav-avatar" w={26} h={26} r={13} tone={2} />
              </div>)}

              <div className="bs-main">
                <div className="bs-bar" data-focused={s.focused || undefined}>
                  {layout === 'wide' ? (
                    <div className="bs-modes">
                      <span className="bs-mode" data-on>
                        <Search size={15} strokeWidth={2} />
                        Search
                      </span>
                      <span className="bs-mode">
                        <MessageCircle size={15} strokeWidth={2} />
                        Chat
                      </span>
                      <span className="bs-mode">
                        <Barcode size={15} strokeWidth={2} />
                        Barcodes
                      </span>
                    </div>
                  ) : (
                    <span className="bs-mode bs-mode--solo" data-on>
                      <Search size={16} strokeWidth={2} />
                    </span>
                  )}
                  <div className="bs-input" data-target="input" data-cursor="ibeam">
                    {s.q ? (
                      <span className="bs-q">{s.q}</span>
                    ) : (
                      <span className="bs-placeholder">{layout === 'wide' ? 'Search products, brands, or ingredients' : 'Search products…'}</span>
                    )}
                    <span className="bs-caret" data-on={s.focused || undefined} />
                  </div>
                  <span className="bs-send" data-ready={s.q.length > 0 || undefined}>
                    <ArrowUp size={18} strokeWidth={2.4} />
                  </span>
                </div>

                <div className="bs-under">
                  <div className="bs-chips">
                    {['All', 'Skincare', 'Ingredients', 'Brands'].map((c, i) => (
                      <span key={c} className="bs-chip" data-on={i === 0 || undefined}>
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Under the bar: today's routine and picks, in quiet filler */}
                  <div className="bs-label b-caps">Your morning</div>
                  <div className="bs-strip">
                    {[64, 48, 72].map((w, i) => (
                      <div key={i} className="bs-strip-card">
                        <Bar w={40} h={40} r={10} tone={1} />
                        <div className="bs-strip-lines">
                          <Bar w={w} h={7} tone={3} />
                          <Bar w={w - 18} h={6} tone={2} />
                        </div>
                      </div>
                    ))}
                  </div>
                  {layout === 'wide' && (<>
                  <div className="bs-label b-caps">Picked for you</div>
                  <div className="bs-grid">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="bs-tile">
                        <Bar w="100%" h={96} r={10} tone={1} />
                      </div>
                    ))}
                  </div>
                  </>)}

                  <div className="bs-drop" data-open={s.shown > 0 || undefined}>
                    {RESULTS.map((r, i) => (
                      <Collapse key={r.id} open={s.shown > i}>
                        <div
                          className="bs-row"
                          data-target={`row-${r.id}`}
                          data-cursor="pointer"
                          data-hover={s.hover === r.id || undefined}
                          data-pressed={s.pressed === r.id || undefined}
                        >
                          <span className="b-thumb bs-thumb">
                            <img src={r.img} alt="" />
                          </span>
                          <span className="bs-row-text">
                            <Text className="bs-name">{r.name}</Text>
                            <span className="b-caps bs-meta">
                              {r.brand} · {r.cat}
                            </span>
                          </span>
                        </div>
                      </Collapse>
                    ))}
                    <Collapse open={layout === 'wide' && s.shown >= RESULTS.length}>
                      <div className="bs-all">
                        See all results for “{QUERY}” <ArrowRight size={13} strokeWidth={2.2} />
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>
          </Window>
          <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
        </>
      )}
    </Stage>
  )
}
