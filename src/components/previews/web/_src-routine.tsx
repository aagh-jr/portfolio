import { ChevronDown, GripVertical, Search, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Bar, Collapse, Count, Stage, Swap, Window, type Act } from '../../kit'
import anuaCleanser from '../binu-shared/img/anua-cleanser.jpg'
import arenciaRetinal from '../binu-shared/img/arencia-retinal.jpg'
import celimaxCream from '../binu-shared/img/celimax-cream.jpg'
import cosrxBha from '../binu-shared/img/cosrx-bha.jpg'
import '../binu-shared/binu.css'
import './routine.css'

// Editing a night routine in Binu. Beats: the cursor opens "+ Add to night",
// types "retinal" and adds Arencia's Retinal serum, which opens its own room
// in the serum slot and carries the moisturizer down. The clash check beside
// the routine answers: "Nothing here conflicts." becomes "1 thing worth
// changing", with the reason, what to do and the ingredients that caused it.
// Then the retinal is dragged below the moisturizer by its grip (buffering);
// the verdict holds, because order doesn't change what's used the same night.
// The loop resets with a seen cause: the retinal step's remove control, and
// the check clears again.
//
// Real strings: the routine name, the four products, the search, the clash
// check's verdict and its one finding (RoutineCompatibility copy). The nav
// is quiet filler.

type Id = 'c' | 'e' | 'm' | 'r'

const ITEMS: Record<Id, { img: string; name: string; brand: string; cat: string }> = {
  c: { img: anuaCleanser, name: '8 Hyaluronic Acid Hydrating Gentle Foaming Cleanser', brand: 'Anua', cat: 'Cleanser' },
  e: { img: cosrxBha, name: 'BHA Blackhead Power Liquid', brand: 'COSRX', cat: 'Exfoliant' },
  m: { img: celimaxCream, name: 'Oil Control Moisturizing Cream', brand: 'Celimax', cat: 'Moisturizer' },
  r: { img: arenciaRetinal, name: 'Retinal Booster Shot Serum', brand: 'Arencia', cat: 'Serum' },
}
const IDS: Id[] = ['c', 'e', 'm', 'r']

const QUERY = 'retinal'

type S = {
  order: Id[]
  // Where the retinal row sits while it isn't in the list: it fades in there
  // and fades out where it was removed
  rSlot: number
  lifted: Id | null
  dy: number
  picker: boolean
  q: string
  hits: boolean
  clash: boolean
}

const initial: S = { order: ['c', 'e', 'm'], rSlot: 2, lifted: null, dy: 0, picker: false, q: '', hits: false, clash: false }
const poster: S = { ...initial, order: ['c', 'e', 'r', 'm'], clash: true }

const REST = { wide: { x: 640, y: 520 }, compact: { x: 336, y: 426 } }

async function script(a: Act<S>) {
  const STEP = a.layout === 'wide' ? 72 : 70
  await a.wait(700)

  a.mark('open')
  await a.click({ at: 'add-night', x: 0.72, y: 0.55 })
  await a.set({ picker: true })
  await a.wait(350)

  a.mark('type')
  await a.type('q', QUERY, { interval: 75 })
  await a.wait(220)
  await a.set({ hits: true })
  await a.wait(500)

  a.mark('add')
  await a.click({ at: 'add-btn', x: 0.6, y: 0.6 })
  // The result leaves the search as the step opens its room in the list
  await a.set({ order: ['c', 'e', 'r', 'm'], picker: false, hits: false })
  await a.wait(380)

  a.mark('clash')
  // The deterministic check runs on the new list
  await a.set({ clash: true })
  // Off the list while the verdict reads
  await a.move('rest')
  await a.snap({ q: '' })
  await a.wait(2300)

  a.mark('drag')
  const grip = a.rect('grip-r')
  const from = { x: grip.x + grip.width / 2, y: grip.y + grip.height / 2 }
  await a.move(from)
  await a.wait(180)
  let order: Id[] = ['c', 'e', 'r', 'm']
  const start = 2
  await a.drag(
    { x: from.x + 4, y: from.y + STEP },
    (at) => {
      const dy = at.y - from.y
      const slot = Math.max(0, Math.min(3, Math.round((start * STEP + dy) / STEP)))
      const rest = (['c', 'e', 'm'] as Id[])
      order = [...rest.slice(0, slot), 'r', ...rest.slice(slot)]
      a.put({ lifted: 'r', dy, order })
    },
    { duration: 800 },
  )
  a.put({ lifted: null, dy: 0, order, rSlot: order.indexOf('r') })
  await a.wait(900)

  a.mark('remove')
  await a.click({ at: 'remove-r', x: 0.5, y: 0.5 })
  await a.set({ order: ['c', 'e', 'm'] })
  await a.wait(240)
  await a.set({ clash: false })
  await a.move('rest')
  // The removed row is invisible now: back to its serum slot for next time
  await a.snap({ rSlot: 2 })
  await a.wait(700)
}

// A surface whose height follows the active layer while the layers crossfade
function Morph({ value, layers }: { value: string; layers: Record<string, ReactNode> }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const [h, setH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = refs.current[value]
    if (!el) return
    const measure = () => setH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [value])
  return (
    <div className="rt-morph" style={{ height: h ?? undefined }}>
      {Object.entries(layers).map(([k, node]) => (
        <div key={k} ref={(el) => (refs.current[k] = el)} className="rt-layer" data-on={k === value || undefined}>
          {node}
        </div>
      ))}
    </div>
  )
}

function Select({ children }: { children: ReactNode }) {
  return (
    <span className="rt-select">
      {children}
      <ChevronDown size={12} strokeWidth={2} />
    </span>
  )
}

export default function BinuRoutine() {
  return (
    <Stage
      width={720}
      height={570}
      compact={{ below: 600, width: 358, height: 704 }}
      initial={initial}
      poster={poster}
      script={script}
      cursor={{ at: REST }}
      className="binu rt"
    >
      {(s, _rect, layout) => {
        const wide = layout === 'wide'
        const STEP = wide ? 72 : 70
        return (
          <>
            <Window url="binu.app/routines/night" urlShape="pill" className="rt-win">
              <div className="rt-page">
                {wide && (
                  <div className="b-nav">
                    <span className="b-wordmark">Binu</span>
                    <span>Products</span>
                    <span>Ingredients</span>
                    <span>My shelf</span>
                    <Bar className="b-nav-avatar" w={26} h={26} r={13} tone={2} />
                  </div>
                )}

                <div className="rt-main">
                  {wide && (
                    <>
                      <div className="rt-head">
                        <div className="b-serif rt-title">Night routine</div>
                      </div>
                      <div className="rt-sub">
                        <Count value={s.order.length} duration={500} /> products · drag the handle to reorder each list.
                      </div>
                    </>
                  )}

                  <div className="rt-section">
                    <span className="b-serif rt-section-title">Night</span>
                    <span className="rt-section-count">
                      <Count value={s.order.length} duration={500} /> steps
                    </span>
                  </div>

                  <div className="rt-list" style={{ height: s.order.length * STEP - 8 }}>
                    {IDS.map((id) => {
                      const item = ITEMS[id]
                      const slot = s.order.indexOf(id)
                      const present = slot !== -1
                      const lifted = s.lifted === id
                      const y = lifted ? 2 * STEP + s.dy : present ? slot * STEP : s.rSlot * STEP
                      return (
                        <div
                          key={id}
                          className="rt-slot"
                          data-lifted={lifted || undefined}
                          data-present={present || undefined}
                          style={{ transform: `translateY(${y}px)` }}
                        >
                          <div className="rt-row">
                            <span className="b-thumb rt-thumb">
                              <img src={item.img} alt="" />
                            </span>
                            <span className="rt-row-text">
                              <span className="b-serif rt-name">{item.name}</span>
                              <span className="rt-controls">
                                <Select>Daily</Select>
                                <Select>{item.cat}</Select>
                              </span>
                            </span>
                            <span className="rt-actions">
                              <span className="rt-icon" data-target={`grip-${id}`} data-cursor="grab">
                                <GripVertical size={16} strokeWidth={2} />
                              </span>
                              <span className="rt-icon rt-remove" data-target={`remove-${id}`}>
                                <X size={14} strokeWidth={2} />
                              </span>
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="rt-below">
                    <Collapse open={!s.picker}>
                      <div className="rt-add" data-target="add-night">
                        + Add to night
                      </div>
                    </Collapse>
                    <Collapse open={s.picker}>
                      <div className="rt-picker">
                        <div className="rt-search" data-cursor="ibeam">
                          <Search size={15} strokeWidth={2} className="rt-search-icon" />
                          <span className="rt-input">
                            {s.q ? (
                              <span className="rt-q">{s.q}</span>
                            ) : (
                              <span className="rt-placeholder">
                                {wide ? 'Search the catalog — try a product, brand, or ingredient' : 'Search the catalog…'}
                              </span>
                            )}
                            <span className="rt-caret" data-on={s.picker || undefined} />
                          </span>
                          <X size={14} strokeWidth={2} className="rt-close" />
                        </div>
                        <Collapse open={s.hits}>
                          <div className="rt-hit">
                            <span className="b-thumb rt-hit-thumb">
                              <img src={arenciaRetinal} alt="" />
                            </span>
                            <span className="rt-row-text">
                              <span className="rt-hit-name">Retinal Booster Shot Serum</span>
                              <span className="b-caps rt-brand">Arencia · Serum</span>
                            </span>
                            <span className="rt-add-btn" data-target="add-btn" data-cursor="pointer">
                              Add
                            </span>
                          </div>
                        </Collapse>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </Window>

            {/* The clash check, present from the first frame: its verdict and
                its finding are what the edit changes */}
            <div className="rt-check" data-clash={s.clash || undefined}>
              <div className="rt-check-head">
                <span className="b-serif rt-check-title">Clash check</span>
                <span className="rt-verdict">
                  <Swap id={s.clash ? 'clash' : 'ok'}>{s.clash ? '1 thing worth changing' : 'Nothing here conflicts.'}</Swap>
                </span>
              </div>
              <Morph
                value={s.clash ? 'clash' : 'ok'}
                layers={{
                  ok: (
                    <div className="rt-ok">
                      Your routine's actives don't conflict, nothing is scheduled at a time that works against it, and anything
                      sun-sensitising is covered by an SPF.
                    </div>
                  ),
                  clash: (
                    <div className="rt-finding">
                      <div className="rt-finding-meta">
                        <span className="rt-tag">Worth changing</span>
                        <span className="rt-tier">Evidence B · Limited human evidence</span>
                      </div>
                      <div className="b-serif rt-finding-title">Retinoid + BHA on the same night</div>
                      <div className="rt-finding-body">
                        Using a retinoid and a salicylic-acid (BHA) exfoliant together can over-exfoliate and irritate the barrier for
                        many people.
                      </div>
                      <div className="rt-finding-do">
                        <b>What to do:</b> Alternate nights, or move the BHA to your morning routine.
                      </div>
                      <div className="rt-because">Because of: Retinal, Salicylic Acid</div>
                    </div>
                  ),
                }}
              />
            </div>

            <span data-target="rest" style={{ position: 'absolute', left: REST[layout].x, top: REST[layout].y }} />
          </>
        )
      }}
    </Stage>
  )
}
