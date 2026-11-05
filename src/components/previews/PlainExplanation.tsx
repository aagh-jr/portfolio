import { useLayoutEffect, useRef, useState } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import './plain-explanation.css'

// Binu's plain-language explanation, rebuilt from the product's own
// EvidenceClaimCard (skinsavior apps/web/src/components/research/
// EvidenceClaimCard.tsx) as EvidenceExplainer lists it: badge pill, serif
// claim, the four-bar EvidenceMeter, then the "Why this rating" accordion
// holding the explainer paragraph and the grading reasons (arrow up = raised
// the grade, arrow down = held it back). Copy is the `moderateClaim` fixture
// (apps/web/src/fixtures/claims.fixtures.ts); the next card is the
// `longExplainerClaim` fixture, which follows it in the same tier.
//
// 1x1 (ExplanationTile). Plays once in view: "Why this rating" opens, the
// list scrolls up so that row sits at the top and the explanation fills the
// tile. The still is the opened card.

type S = { open: boolean; scrolled: boolean }

const CARD = {
  badgeLabel: 'Antioxidant',
  claimText: 'Provides antioxidant support against environmental stress',
  label: 'Moderate evidence',
  notches: 3,
  explainer:
    'A randomized trial supports the antioxidant framing, but several endpoints were laboratory markers rather than a visible change in the skin, which holds the certainty at moderate.',
  reasons: [
    { direction: 'up' as const, text: 'Supported by a randomized trial.' },
    { direction: 'down' as const, text: 'Some outcomes were lab markers, not visible skin changes.' },
  ],
  studyCount: 2,
}

const NEXT = {
  badgeLabel: 'Smooths wrinkles',
  claimText: 'Helps soften the look of fine lines and wrinkles',
  label: 'Moderate evidence',
  notches: 3,
  studyCount: 3,
}

// lucide-react 0.575 paths, as the product imports them
const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const Atom = () => (
  <svg {...svg} className="pe-badge-icon" aria-hidden>
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z" />
    <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z" />
  </svg>
)
// Waves (smooths-wrinkles)
const Waves = () => (
  <svg {...svg} className="pe-badge-icon" aria-hidden>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
)
const Chevron = () => (
  <svg {...svg} className="pe-chevron" aria-hidden>
    <path d="m6 9 6 6 6-6" />
  </svg>
)
const ArrowUp = () => (
  <svg {...svg} className="pe-reason-icon" data-dir="up" aria-hidden>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
)
const ArrowDown = () => (
  <svg {...svg} className="pe-reason-icon" data-dir="down" aria-hidden>
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
)

function Meter({ label, notches }: { label: string; notches: number }) {
  return (
    <div className="pe-meter">
      <div className="pe-bars" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="pe-bar" data-lit={i < notches || undefined} />
        ))}
      </div>
      <span className="pe-meter-label">{label}</span>
    </div>
  )
}

function Trigger({ children, open }: { children: string; open?: boolean }) {
  return (
    <h3 className="pe-trigger" data-open={open || undefined}>
      <span>{children}</span>
      <Chevron />
    </h3>
  )
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

const TOP = 24

/**
 * How far the list scrolls once the card is open: the "Why this rating" row
 * lands at the top (the badge, claim and meter scroll out whole, under the
 * top fade), so the explanation and its reasons fill the tile at any width.
 * Measured, since the claim and the paragraph wrap differently per width.
 */
function useShift(width: number) {
  const card = useRef<HTMLElement>(null)
  const [shift, setShift] = useState(137)
  useLayoutEffect(() => {
    const why = card.current?.querySelector<HTMLElement>('.pe-trigger')
    if (why) setShift(TOP + why.offsetTop - 6)
  }, [width])
  return [card, shift] as const
}

async function script(a: Act<S>) {
  await a.wait(700)
  a.set({ open: true })
  await a.wait(220)
  a.set({ scrolled: true })
  await a.wait(2400)
}

export function ExplanationTile() {
  const [ref, width] = useWidth(480)
  const [card, shift] = useShift(width)
  return (
    <div ref={ref} className="pe-host">
      <Stage<S>
        width={width}
        height={322}
        initial={{ open: false, scrolled: false }}
        poster={{ open: true, scrolled: true }}
        script={script}
        play="once"
        className="pe"
      >
        {(s) => (
          <div className="pe-view" data-narrow={width < 400 || undefined}>
            <div className="pe-list" style={{ transform: `translateY(${s.scrolled ? -shift : 0}px)` }}>
              <article className="pe-card" ref={card}>
                <div className="pe-badge">
                  <Atom />
                  {CARD.badgeLabel}
                </div>
                <h3 className="pe-claim">{CARD.claimText}</h3>
                <Meter label={CARD.label} notches={CARD.notches} />
                <div className="pe-accordion">
                  <div className="pe-item pe-item--why">
                    <Trigger open={s.open}>Why this rating</Trigger>
                    <div className="pe-panel" data-open={s.open || undefined}>
                      <div className="pe-panel-inner">
                        <div className="pe-content">
                          <p className="pe-explainer">{CARD.explainer}</p>
                          <ul className="pe-reasons">
                            {CARD.reasons.map((r) => (
                              <li key={r.text} className="pe-reason">
                                {r.direction === 'up' ? <ArrowUp /> : <ArrowDown />}
                                <span>{r.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pe-item">
                    <Trigger>{`Source studies (${CARD.studyCount})`}</Trigger>
                  </div>
                </div>
              </article>
              <article className="pe-card" aria-hidden>
                <div className="pe-badge">
                  <Waves />
                  {NEXT.badgeLabel}
                </div>
                <h3 className="pe-claim">{NEXT.claimText}</h3>
                <Meter label={NEXT.label} notches={NEXT.notches} />
              </article>
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}
