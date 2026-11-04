import { useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/600.css'
import '@fontsource/hanken-grotesk/700.css'
import './skin-needs.css'

// Binu's skin profile, rebuilt from the product's own quiz components
// (skinsavior apps/web/src/components/quiz/QuestionView.tsx and DoneView.tsx,
// app/quiz/page.tsx for the questions and answer labels, lib/quiz-answers.ts
// for the four Baumann axes) and its tokens (apps/web/src/app/globals.css).
//
// NeedsTile ("Profiled as independent needs"): the four quiz questions that
// score the Baumann axes, each over its answer drawn as QuestionView's
// selected choice. Plays once in view: the four
// answers check in one at a time, because each question is asked and scored on
// its own.
//
// ProfileSavedTile ("completed skin profile"): the quiz's final screen, as
// the Pages/Quiz "Done" story assembles it: the full progress bar over
// DoneView (first-time copy). Plays once in view: the check lands, then the
// heading and next-step copy arrive.

function useSize(initial: { width: number; height: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(initial)
  // The tile stays hidden until it has its real size and the product fonts,
  // so nothing reflows in view between the server render and the client.
  const [measured, setMeasured] = useState(false)
  const [fonts, setFonts] = useState(false)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const width = Math.round(node.clientWidth)
      const height = Math.round(node.clientHeight)
      if (width && height) {
        setSize({ width, height })
        setMeasured(true)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    let live = true
    document.fonts.ready.then(() => live && setFonts(true))
    return () => {
      live = false
      observer.disconnect()
    }
  }, [])
  return [ref, size, measured && fonts] as const
}

// ── Independent needs ────────────────────────────────────────────────────

/**
 * Question titles and answer labels verbatim from the quiz STEPS in
 * app/quiz/page.tsx, in the quiz's own order. These four questions score the
 * four independent Baumann axes (lib/quiz-answers.ts). Which answer each gets
 * follows the completedProfile fixture (Maya: combination skin, uneven tone,
 * reacts to fragrance, no aging concern).
 */
const NEEDS = [
  { question: 'What kind of skin do you have?', answer: 'Combo (oily T-zone, drier cheeks)' },
  { question: 'Do you deal with dark spots or uneven tone?', answer: 'Occasional marks that fade after a breakout' },
  { question: 'How would you describe fine lines & firmness?', answer: 'Smooth and tight, no real concerns' },
  {
    question: 'When you try a new skincare product, what usually happens?',
    answer: 'Occasional redness, stinging, or breakouts',
  },
]

type Needs = { picked: number }

async function needsScript(a: Act<Needs>) {
  await a.wait(450)
  for (let i = 1; i <= NEEDS.length; i++) {
    a.set({ picked: i })
    await a.wait(420)
  }
  await a.wait(2000)
}

/** QuestionView's choice button, selected or not, with its check disc. */
function Choice({ label, active }: { label: string; active: boolean }) {
  return (
    <span className="sn-choice" data-active={active || undefined}>
      <span className="sn-choice-label">{label}</span>
      <span className="sn-check" aria-hidden>
        <span className="sn-check-mark">✓</span>
      </span>
    </span>
  )
}

/** Keeps only the needs that sit whole above the tile's foot (real answers
 *  never run off the crop): measured with every row shown, then trimmed. */
function useFit(host: RefObject<HTMLDivElement | null>, size: { width: number; height: number }, ready: boolean) {
  const [fit, setFit] = useState<number | null>(null)
  useLayoutEffect(() => setFit(null), [size.width, size.height, ready])
  useLayoutEffect(() => {
    if (fit !== null || !ready || !host.current) return
    const stage = host.current.querySelector('.ss-stage')
    const rows = host.current.querySelectorAll<HTMLElement>('.sn-need')
    if (!stage || !rows.length) return
    const top = stage.getBoundingClientRect().top
    const scale = stage.getBoundingClientRect().height / size.height || 1
    let n = 0
    rows.forEach((row) => {
      if ((row.getBoundingClientRect().bottom - top) / scale <= size.height - 24) n++
    })
    setFit(Math.max(1, n))
  })
  return fit
}

export function NeedsTile() {
  const [ref, size, ready] = useSize({ width: 480, height: 322 })
  const measuredFit = useFit(ref, size, ready)
  const fit = measuredFit ?? NEEDS.length
  const narrow = size.width < 400
  return (
    <div ref={ref} className="sn-host" data-ready={(ready && measuredFit !== null) || undefined}>
      <Stage<Needs>
        width={size.width}
        height={size.height}
        initial={{ picked: 0 }}
        poster={{ picked: NEEDS.length }}
        script={needsScript}
        play="once"
        className="sn sn--needs"
      >
        {(s) => (
          <ul className="sn-panel" data-narrow={narrow || undefined}>
            {NEEDS.map((need, i) =>
              i < fit ? (
                <li key={need.question} className="sn-need">
                  <span className="sn-question">{need.question}</span>
                  <Choice label={need.answer} active={i < s.picked} />
                </li>
              ) : (
                // The next question runs off the foot as filler, never as cut words
                <li key={need.question} className="sn-need" data-filler hidden={i > fit} aria-hidden>
                  <span className="sn-question-bar" />
                  <span className="sn-choice">
                    <span className="sn-choice-bar" />
                    <span className="sn-check" />
                  </span>
                </li>
              ),
            )}
          </ul>
        )}
      </Stage>
    </div>
  )
}

// ── Completed profile ────────────────────────────────────────────────────

type Saved = { done: number }

async function savedScript(a: Act<Saved>) {
  await a.wait(500)
  a.set({ done: 1 }) // the check lands, then the heading and copy arrive
  await a.wait(2400)
}

export function ProfileSavedTile() {
  const [ref, size, ready] = useSize({ width: 480, height: 322 })
  const narrow = size.width < 400
  return (
    <div ref={ref} className="sn-host" data-ready={ready || undefined}>
      <Stage<Saved>
        width={size.width}
        height={size.height}
        initial={{ done: 0 }}
        poster={{ done: 1 }}
        script={savedScript}
        play="once"
        className="sn sn--saved"
      >
        {(s) => (
          <div
            className="sn-page"
            data-narrow={narrow || undefined}
            data-squeeze={narrow || undefined}
            data-done={s.done >= 1 || undefined}
          >
            <div className="sn-progress" aria-hidden>
              <div className="sn-progress-fill" />
            </div>
            <div className="sn-done">
              <div className="sn-done-check" aria-hidden>
                ✓
              </div>
              <p className="sn-done-title">Your skin profile is saved.</p>
              <p className="sn-done-copy">
                Next: your routine. We've started it with the steps you told us you already use — add the products you
                own so we can check them for clashes.
              </p>
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}
