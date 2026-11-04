import { useLayoutEffect, useRef, useState } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/700.css'
import './skin-quiz.css'

// Binu's skin quiz, rebuilt from the product's own component
// (skinsavior apps/web/src/components/quiz/QuestionView.tsx), the page that
// runs it (apps/web/src/app/quiz/page.tsx: the STEPS list, the progress
// formula) and the Pages/Quiz story shell (a 4px progress bar over the
// question). Tokens from apps/web/src/app/globals.css: --primary #2F6FED,
// --secondary #EAF1FE, --border #DEE3E9, --muted-foreground #5B6472, --ink.
// Newsreader 500 for the question, Hanken Grotesk for everything else.
//
// QuizCard (1x1, "Skin quiz"): the breakouts question as the product lays it
// out below md (one column), pinned to the tile and running off its foot.
// Plays once in view: a tap picks "Now and then (stress, my cycle, travel)".
//
// QuizFlow (1x1, "quiz flow" screen): the whole quiz screen, progress bar to
// Continue, scaled to the tile. Plays once in view: "25 – 34" is picked,
// Continue moves the flow to the next question (the progress bar steps from
// 8/15 to 9/15, as page.tsx computes it), and two products already in the
// routine are ticked on the multi-select.
//
// Every string is the product's own (page.tsx STEPS).

type Choice = { value: string; label: string; hint?: string }
type Step = { key: string; kind: 'single' | 'multi'; title: string; sub?: string; choices: Choice[] }

// page.tsx STEPS[1], STEPS[7], STEPS[8], verbatim
const BREAKOUTS: Step = {
  key: 'breakouts',
  kind: 'single',
  title: 'How often do you get breakouts?',
  choices: [
    { value: 'rarely', label: 'Rarely or never' },
    { value: 'occasional', label: 'Now and then (stress, my cycle, travel)' },
    { value: 'frequent', label: 'Most weeks' },
    {
      value: 'persistent',
      label: 'Constantly, or deep and painful',
      hint: 'Worth seeing a dermatologist too: prescription options work for this.',
    },
  ],
}

const AGE: Step = {
  key: 'age_range',
  kind: 'single',
  title: "What's your age range?",
  choices: [
    { value: 'under_18', label: 'Under 18' },
    { value: '18_24', label: '18 – 24' },
    { value: '25_34', label: '25 – 34' },
    { value: '35_44', label: '35 – 44' },
    { value: '45_54', label: '45 – 54' },
    { value: '55_plus', label: '55+' },
  ],
}

const ROUTINE: Step = {
  key: 'current_routine',
  kind: 'multi',
  title: "What's already in your routine?",
  sub: 'Pick all that apply — helps us avoid recommending things you already use.',
  choices: [
    { value: 'cleanser', label: 'Cleanser' },
    { value: 'toner', label: 'Toner' },
    { value: 'serum', label: 'Serum' },
    { value: 'moisturizer', label: 'Moisturizer' },
    { value: 'spf', label: 'Sunscreen' },
    { value: 'retinoid', label: 'Retinol / retinoid' },
    { value: 'exfoliant', label: 'Exfoliant (AHA/BHA)' },
    { value: 'none', label: 'Nothing yet — starting fresh' },
  ],
}

// page.tsx: progress = ((stepIdx + 1) / (TOTAL + 1)) * 100, TOTAL = 14
const progressAt = (stepIdx: number) => ((stepIdx + 1) / 15) * 100

function useSize(initial: { w: number; h: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(initial)
  const [measured, setMeasured] = useState(false)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      const w = Math.round(node.clientWidth)
      const h = Math.round(node.clientHeight)
      if (w && h) {
        setSize((s) => (s.w === w && s.h === h ? s : { w, h }))
        setMeasured(true)
      }
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, size, measured] as const
}

/** One choice button, as QuestionView draws it: label (+ hint when active), check circle. */
function ChoiceButton({ choice, active, target }: { choice: Choice; active: boolean; target?: string }) {
  return (
    <span className="sq-choice" data-active={active || undefined} data-target={target} data-cursor={target ? 'pointer' : undefined}>
      <span className="sq-choice-text">
        <span className="sq-choice-label">{choice.label}</span>
        {choice.hint && active && <span className="sq-choice-hint">{choice.hint}</span>}
      </span>
      <span className="sq-check" aria-hidden>
        {active ? '✓' : ''}
      </span>
    </span>
  )
}

/** QuestionView: title, optional sub, the choice grid, and (optionally) Back / Continue. */
function Question({
  step,
  value,
  footer,
  canBack,
}: {
  step: Step
  value: string | string[] | undefined
  footer?: boolean
  canBack?: boolean
}) {
  const isActive = (v: string) => (Array.isArray(value) ? value.includes(v) : value === v)
  const canContinue = Array.isArray(value) ? value.length > 0 : Boolean(value)
  return (
    <div className="sq-question">
      <h1 className="sq-title">{step.title}</h1>
      {step.sub && <p className="sq-sub">{step.sub}</p>}
      <div className="sq-grid">
        {step.choices.map((c) => (
          <ChoiceButton key={c.value} choice={c} active={isActive(c.value)} target={`${step.key}:${c.value}`} />
        ))}
      </div>
      {footer && (
        <div className="sq-footer">
          <span className="sq-back" data-disabled={!canBack || undefined}>
            ← Back
          </span>
          <span className="sq-continue" data-disabled={!canContinue || undefined} data-target={`${step.key}:continue`} data-cursor="pointer">
            Continue <span>→</span>
          </span>
        </div>
      )}
    </div>
  )
}

// ── QuizCard: 1x1, "Skin quiz" ───────────────────────────────────────────

type CardState = { value: string | undefined }

async function cardScript(a: Act<CardState>) {
  await a.wait(500)
  await a.move({ at: 'breakouts:occasional', x: 0.42, y: 0.55 })
  await a.click()
  a.set({ value: 'occasional' })
  await a.wait(500)
  await a.move({ at: 'breakouts:occasional', x: 0.62, y: 1.25 })
  await a.wait(2200)
}

export function QuizCard() {
  const [ref, size, measured] = useSize({ w: 480, h: 322 })
  const narrow = size.w < 400
  return (
    <div ref={ref} className="sq-host" data-measured={measured || undefined}>
      <Stage<CardState>
        width={size.w}
        height={322}
        initial={{ value: undefined }}
        poster={{ value: 'occasional' }}
        script={cardScript}
        play="once"
        cursor={{ at: { x: size.w - 40, y: 300 }, idle: false }}
        className="sq sq--card"
      >
        {(s) => (
          <div className="sq-page" data-narrow={narrow || undefined}>
            <div className="sq-progress" aria-hidden>
              <span style={{ width: `${progressAt(1)}%` }} />
            </div>
            <div className="sq-main">
              <Question step={BREAKOUTS} value={s.value} />
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}

// ── QuizFlow: 1x1, "quiz flow" screen ────────────────────────────────────

type FlowState = { step: 7 | 8; age: string | undefined; routine: string[]; fading: boolean }

const FLOW_START: FlowState = { step: 7, age: undefined, routine: [], fading: false }
const FLOW_END: FlowState = { step: 8, age: '25_34', routine: ['cleanser', 'moisturizer'], fading: false }

async function flowScript(a: Act<FlowState>) {
  await a.wait(500)
  await a.move({ at: 'age_range:25_34', x: 0.4, y: 0.55 })
  await a.click()
  a.set({ age: '25_34' })
  await a.wait(450)
  await a.move({ at: 'age_range:continue', x: 0.45, y: 0.55 })
  await a.click()
  a.set({ fading: true })
  await a.wait(160)
  a.set({ step: 8, fading: false })
  await a.wait(900)
  await a.move({ at: 'current_routine:cleanser', x: 0.45, y: 0.55 })
  await a.click()
  a.set((s) => ({ routine: [...s.routine, 'cleanser'] }))
  await a.wait(350)
  await a.move({ at: 'current_routine:moisturizer', x: 0.45, y: 0.55 })
  await a.click()
  a.set((s) => ({ routine: [...s.routine, 'moisturizer'] }))
  await a.wait(2400)
}

export function QuizFlow() {
  const [ref, size, measured] = useSize({ w: 480, h: 322 })
  const compact = size.w < 440
  // Design height fixed per layout; width follows the slot's shape, so the
  // screen always fills the tile and the product's 640px column centers in it.
  const designH = compact ? 372 : 376
  const designW = Math.round((size.w * designH) / size.h)
  return (
    <div ref={ref} className="sq-host" data-measured={measured || undefined}>
      <Stage<FlowState>
        width={designW}
        height={designH}
        initial={FLOW_START}
        poster={FLOW_END}
        script={flowScript}
        play="once"
        cursor={{ at: { x: designW - 48, y: designH - 40 }, idle: false }}
        className="sq sq--flow"
      >
        {(s) => (
          <div className="sq-screen" data-compact={compact || undefined} data-scroll={s.step === 8 || undefined}>
            <div className="sq-progress sq-progress--story" aria-hidden>
              <span style={{ width: `${progressAt(s.step)}%` }} />
            </div>
            <div className="sq-main" data-fading={s.fading || undefined}>
              {s.step === 7 ? (
                <Question step={AGE} value={s.age} footer canBack />
              ) : (
                <Question step={ROUTINE} value={s.routine} footer canBack />
              )}
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}
