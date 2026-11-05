import { useLayoutEffect, useRef, useState } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import './add-by-url.css'

// Binu's "Add a product by link", rebuilt from the product's own page
// (skinsavior apps/web/src/app/add/page.tsx), its ScientistAvatar and its
// tokens (apps/web/src/app/globals.css). The status strings are the page's
// own; the result labels map the ingest route's "created" / "existing"
// responses (apps/web/src/app/api/products/ingest/route.ts).
//
// 1x1 (AddLinkTile): the form. A link is pasted into the textarea, the
// "Analyze link(s)" button wakes from disabled, is pressed, and turns into
// "Analyzing…" while the scientist talks.
//
// 1x1 (AddResultsTile): the results list. Links are read one at a time, as
// the page does it (sequential on purpose): queued, reading page…, then
// "Created" or "Already known", each a link to the product page.

function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(initial)
  const [measured, setMeasured] = useState(false)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      if (node.clientWidth) {
        setWidth(Math.round(node.clientWidth))
        setMeasured(true)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width, measured] as const
}

/** The product's pixel-art scientist (components/ScientistAvatar.tsx): two frames stacked, swapped while talking. */
function Scientist({ talking }: { talking: boolean }) {
  return (
    <span className="ab-scientist" data-talking={talking || undefined} aria-hidden>
      <img src="/previews/binu/scientist.png" alt="" className="ab-frame ab-frame--closed" />
      <img src="/previews/binu/scientist-talking.png" alt="" className="ab-frame ab-frame--open" />
    </span>
  )
}

// ── 1x1: the form ────────────────────────────────────────────────────────

// Illustrative link, in the shape of the page's own placeholder.
const LINK = 'https://example.com/products/hydrating-facial-cleanser'

type Form = { text: string; focused: boolean; running: boolean }

async function formScript(a: Act<Form>) {
  await a.wait(400)
  await a.enter('field')
  await a.click()
  await a.set({ focused: true })
  await a.wait(200)
  await a.type('text', LINK, { interval: 22 })
  await a.wait(350)
  await a.move('analyze')
  await a.click()
  await a.set({ running: true, focused: false })
  await a.wait(250)
  const b = a.rect('analyze')
  await a.move({ x: b.x + b.width + 6, y: b.y + b.height + 14 }, { duration: 500 })
  await a.wait(2600)
}

export function AddLinkTile() {
  const [ref, width, measured] = useWidth(480)
  const narrow = width < 400
  return (
    <div ref={ref} className="ab-host" style={measured ? undefined : { visibility: 'hidden' }}>
      <Stage<Form>
        width={width}
        height={322}
        initial={{ text: '', focused: false, running: false }}
        poster={{ text: LINK, focused: false, running: true }}
        script={formScript}
        play="once"
        cursor={{ at: 'field' }}
        className="ab ab--form"
      >
        {(s) => (
          <div className="ab-page" data-narrow={narrow || undefined}>
            {!narrow && <div className="ab-crumb">Products / Add</div>}
            <h1 className="ab-title">Add a product by link</h1>
            <div className="ab-form">
              <div className="ab-field" data-target="field" data-cursor="ibeam" data-focused={s.focused || undefined}>
                {s.text ? (
                  <span className="ab-value">
                    {s.text}
                    {s.focused && <span className="ab-caret" />}
                  </span>
                ) : (
                  <span className="ab-placeholder">
                    {s.focused && <span className="ab-caret" />}
                    https://example.com/products/vitamin-c-serum
                    <br />
                    One URL per line for multiple products
                  </span>
                )}
              </div>
              <div className="ab-actions">
                <span
                  className="ab-button"
                  data-target="analyze"
                  data-disabled={s.running || !s.text.trim() || undefined}
                >
                  {s.running ? 'Analyzing…' : 'Analyze link(s)'}
                </span>
                <Scientist talking={s.running} />
                {!narrow && (
                  <span className="ab-working" data-on={s.running || undefined}>
                    reading the label, decoding ingredients…
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}

// ── 1x1: the results ─────────────────────────────────────────────────────

type Status = 'pending' | 'working' | 'created' | 'existing'

// Illustrative links, named after products in apps/web/src/fixtures/products.fixtures.ts.
const ROWS: { url: string; result: Status }[] = [
  { url: 'https://example.com/products/hydrating-facial-cleanser', result: 'existing' },
  { url: 'https://example.com/products/2-bha-liquid-exfoliant', result: 'created' },
  { url: 'https://example.com/products/uv-clear-spf-46', result: 'created' },
  { url: 'https://example.com/products/moisturizing-cream', result: 'existing' },
]

const LABEL: Record<Status, string> = {
  pending: 'queued',
  working: 'reading page…',
  created: 'Created — view page →',
  existing: 'Already known — view page →',
}

type List = { status: Status[] }

async function listScript(a: Act<List>) {
  const status: Status[] = ROWS.map(() => 'pending')
  await a.wait(500)
  for (let i = 0; i < ROWS.length; i++) {
    status[i] = 'working'
    await a.set({ status: [...status] })
    await a.wait(1100)
    status[i] = ROWS[i].result
    await a.set({ status: [...status] })
    await a.wait(250)
  }
  await a.wait(2000)
}

export function AddResultsTile() {
  const [ref, width, measured] = useWidth(480)
  const narrow = width < 400
  return (
    <div ref={ref} className="ab-host" style={measured ? undefined : { visibility: 'hidden' }}>
      <Stage<List>
        width={width}
        height={322}
        initial={{ status: ROWS.map(() => 'pending') }}
        poster={{ status: ROWS.map((r) => r.result) }}
        script={listScript}
        play="once"
        className="ab ab--list"
      >
        {(s) => (
          <div className="ab-page" data-narrow={narrow || undefined}>
            <ul className="ab-rows">
              {ROWS.map((row, i) => {
                const st = s.status[i]
                return (
                  <li key={row.url} className="ab-row">
                    <span className="ab-url">{row.url}</span>
                    {/* The row's three labels share one cell, so the link column keeps its width */}
                    <span className="ab-status">
                      {(['pending', 'working', row.result] as Status[]).map((k) => (
                        <span key={k} className="ab-label" data-state={k} data-on={k === st || undefined} aria-hidden={k !== st}>
                          {LABEL[k]}
                        </span>
                      ))}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="ab-note">
              Pages created this way are marked <strong>AI-extracted — not yet reviewed</strong>. Evidence grading and
              match scores run in a later pass.
            </p>
          </div>
        )}
      </Stage>
    </div>
  )
}
