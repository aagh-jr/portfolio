// PORTFOLIO PREVIEW: Binu chat quiz. Animated faux UI for the portfolio case
// study, rebuilt from apps/web; not app code and never imported by it.
// Exports: QuizPage (full width, 1440 × 757); QuizTile, QuizSectionTile, QuizNeedsTile, QuizSavedTile (480 × 322); QuizNeedsPhone, QuizSectionPhone (358 × 520).
// Status: DONE, wired into the case study. Workspace guide: design/portfolio-previews/HANDOFF.md

import { useLayoutEffect, useRef, useState } from 'react'
import { Stage } from '../../stageshow/kit/stage'
import { Window } from '../../stageshow/kit/window'
import { Phone } from '../../stageshow/kit/phone'
import { Collapse } from '../../stageshow/kit/motion/Collapse'
import { Swap } from '../../stageshow/kit/motion/Swap'
import type { Act } from '../../stageshow/kit/act'
import { Check } from './icons'
import scientistImg from './img/scientist.png'
import scientistTalkingImg from './img/scientist-talking.png'
import './binu.css'
import './chat-quiz.css'

// Binu's onboarding quiz, the chat version: rebuilt from skinsavior main
// (apps/web/src/components/quiz/ChatQuizView.tsx, ChatBubbles.tsx,
// ChatChoices.tsx, QuizProgress.tsx; the questions, answers and section
// intros from quiz-steps.ts; the frosted answer buttons from glass.ts; tokens
// from app/globals.css). The pixel scientist types one question per turn,
// the answer buttons rise in once he finishes, your tap lands as a reply
// bubble on the right and the question fades to a muted line. Each new turn
// scrolls the latest reply to the top, as the page's scrollIntoView does.
//
// Layouts, at the app's own sizes:
//   xl     the desktop page (viewport ≥ 1280): section stepper in the left
//          margin, the 640px chat column centred, the scientist hanging left.
//   md     the page below xl: the header carries the progress (section name
//          over a bar and dots), the chat column fills the width.
//   phone  the md layout on an iPhone, for narrow containers.
//
// QuizPage (full row): the whole desktop page at 1440 × 757. QuizTile,
// QuizSectionTile, QuizNeedsTile, QuizSavedTile (480 × 322): crops of the md
// page at real size. Every string is the product's own.

const SECTIONS = ['Your skin', 'Sun & safety', 'Your routine', 'Save profile']

type Line = { text: string; kind: 'say' | 'heading' | 'sub' }
type Turn = { lines: Line[]; choices: string[]; pick: number; section: number; compact?: boolean; multi?: boolean; reply?: string; final?: boolean }

const shortLabel = (l: string) => l.replace(/\s*\([^)]*\)$/, '') || l
const q = (text: string): Line => ({ kind: 'heading', text })

const T = {
  skinType: { section: 0, lines: [q('What kind of skin do you have?')], choices: ['Dry (tight or flaky)', 'Normal (comfortable, balanced)', 'Combo (oily T-zone, drier cheeks)', 'Oily (shiny all over)'], pick: 2 },
  breakouts: { section: 0, lines: [q('How often do you get breakouts?')], choices: ['Rarely or never', 'Now and then (stress, my cycle, travel)', 'Most weeks', 'Constantly, or deep and painful'], pick: 1 },
  pigment: { section: 0, lines: [q('Do you deal with dark spots or uneven tone?')], choices: ['No, my tone is pretty even', 'Occasional marks that fade after a breakout', 'Persistent dark spots, sun spots, or melasma'], pick: 1 },
  aging: { section: 0, lines: [q('How would you describe fine lines & firmness?')], choices: ['Smooth and tight, no real concerns', 'A few fine lines starting to show', 'Visible wrinkles or loss of firmness'], pick: 1 },
  sensitivity: { section: 0, lines: [q('When you try a new skincare product, what usually happens?')], choices: ['Nothing, I can use almost anything', 'Occasional redness, stinging, or breakouts', 'I react to most new products (redness, burning, itching)'], pick: 1 },
  sunReaction: {
    section: 1,
    lines: [
      { kind: 'say', text: 'Got it. Next, a few about sun and safety. These decide what we flag for you, and “prefer not to say” is always fine.' },
      q('What happens when your skin gets unprotected sun?'),
      { kind: 'sub', text: 'Helps calibrate SPF & active-ingredient recommendations.' },
    ],
    choices: ['Always burns, rarely or never tans', 'Burns first, then tans', 'Tans easily, rarely burns', 'Never burns, tans deeply'],
    pick: 1,
  },
  medications: { section: 1, lines: [q('Are you currently using any prescription skin treatments?')], choices: ['None of these'], pick: 0 },
  pregnancy: {
    section: 1,
    lines: [
      q('Are you currently pregnant or breastfeeding?'),
      { kind: 'sub', text: 'Some actives (retinoids, high-dose salicylic acid) carry specific guidance here. This only affects your safety flags.' },
    ],
    choices: ['Yes', 'No', 'Prefer not to say'],
    pick: 2,
    compact: true,
  },
  routine: {
    section: 2,
    lines: [
      { kind: 'say', text: 'Almost there. Let\u2019s talk about your routine.' },
      q('What\u2019s already in your routine?'),
      { kind: 'sub', text: 'Pick all that apply, so we don\u2019t recommend things you already use.' },
    ],
    // Multi-select with a long last answer, so a full-width stack with
    // checkboxes; the first four of its eight answers (the rest run off)
    choices: ['Cleanser', 'Toner', 'Serum', 'Moisturizer'],
    pick: -1,
    multi: true,
  },
  budget: { section: 2, lines: [q('What’s your usual price range per product?')], choices: ['Under $20', '$20 – $50', '$50 – $100', '$100+'], pick: 1, reply: '$20 – $50' },
  saved: {
    section: 4,
    final: true,
    lines: [
      q('Your skin profile is saved.'),
      { kind: 'sub', text: 'Next: your routine. I’ve started it with the steps you already use. Add the products you own and I’ll check them for clashes.' },
    ],
    choices: [],
    pick: -1,
  },
} satisfies Record<string, Turn>

const lengthOf = (t: Turn) => t.lines.reduce((n, l) => n + l.text.length, 0)
const replyOf = (t: Turn) => t.reply ?? (t.pick >= 0 ? shortLabel(t.choices[t.pick]) : null)

type S = {
  /** The turn being asked; earlier turns are the transcript. */
  live: number
  /** Characters of the live turn typed so far. */
  chars: number
  /** The live turn's answers have risen in. */
  choices: boolean
  /** The answer just tapped, held for a beat before it is sent. */
  picked: number | null
  /** The reply scrolled to the top of the page (-1: none yet). */
  scroll: number
  /** The page faded out for the restart. */
  off: boolean
}

const DONE = 9999

/** The real typewriter: 16ms a character, each turn 450 to 1600ms. */
async function typeOut(a: Act<S>, turn: Turn) {
  const total = lengthOf(turn)
  const duration = Math.min(1600, Math.max(450, total * 16))
  const frames = Math.ceil(duration / 32)
  for (let f = 1; f <= frames; f++) {
    a.put({ chars: Math.ceil((f / frames) * total) })
    await a.wait(32)
  }
  a.put({ chars: DONE })
  if (turn.choices.length) {
    await a.wait(120)
    a.put({ choices: true })
  }
}

async function answer(a: Act<S>, turns: Turn[], live: number, cursor = true) {
  const t = turns[live]
  if (cursor) {
    await a.move({ at: `opt-${live}-${t.pick}`, x: 0.62, y: 0.55 })
    await a.wait(140)
    await a.click()
  }
  await a.set({ picked: t.pick })
  await a.wait(cursor ? 260 : 320)
  // Sent: the answers fold away and the reply lands; the next turn opens
  await a.set({ live: live + 1, chars: 0, choices: false, picked: null })
  await a.wait(380)
  // Then the page scrolls that reply to the top, as scrollIntoView does
  a.put({ scroll: live })
  await a.wait(520)
}

async function restart(a: Act<S>, initial: S) {
  a.mark('reset')
  await a.set({ off: true })
  await a.wait(340)
  await a.snap({ ...initial, off: true })
  await a.wait(60)
  await a.set({ off: false })
  await a.wait(400)
}

/** Text revealed up to `count` characters; the rest is laid out but invisible. */
function Typed({ text, count }: { text: string; count: number }) {
  if (count >= text.length) return <>{text}</>
  const n = Math.max(0, count)
  return (
    <>
      {text.slice(0, n)}
      <span className="cq-untyped">{text.slice(n)}</span>
    </>
  )
}

const src = (m: unknown) => (typeof m === 'string' ? m : (m as { src: string }).src)

function Scientist({ talking }: { talking: boolean }) {
  // Two frames stacked; the mouth flips every 350ms while he types
  const [open, setOpen] = useState(false)
  useLayoutEffect(() => {
    if (!talking) return void setOpen(false)
    const id = setInterval(() => setOpen(o => !o), 350)
    return () => clearInterval(id)
  }, [talking])
  return (
    <span className="cq-avatar" aria-hidden>
      <img src={src(scientistImg)} alt="" data-hidden={open || undefined} />
      <img src={src(scientistTalkingImg)} alt="" data-hidden={!open || undefined} />
    </span>
  )
}

function TurnView({ turn, i, s }: { turn: Turn; i: number; s: S }) {
  const state = i < s.live ? 'past' : 'live'
  const live = state === 'live'
  const total = lengthOf(turn)
  const shown = live ? s.chars : DONE
  const speaking = live && s.chars > 0 && s.chars < total
  let offset = 0
  const lines = turn.lines.map(l => {
    const count = shown - offset
    offset += l.text.length
    return { ...l, count }
  })
  const reply = replyOf(turn)
  return (
    <div className="cq-turn" data-state={state}>
      <div className="cq-guide">
        <span className="cq-avatar-slot" data-on={(live && s.chars > 0) || undefined}>
          <Scientist talking={speaking} />
        </span>
        <div className="cq-lines">
          {lines.map((l, k) =>
            l.kind === 'sub' ? (
              <Collapse key={k} open={!(state === 'past')}>
                <div className="cq-sub">
                  <Typed text={l.text} count={l.count} />
                </div>
              </Collapse>
            ) : (
              <Swap key={k} id={state} className="cq-swap">
                <span className="cq-line" data-kind={l.kind} data-past={state === 'past' || undefined}>
                  <Typed text={l.text} count={l.count} />
                </span>
              </Swap>
            ),
          )}
          {turn.choices.length ? (
            <Collapse open={live && s.choices}>
              <div className="cq-choices" data-compact={turn.compact || undefined} data-on={(live && s.choices) || undefined}>
                {turn.choices.map((c, j) => (
                  <span
                    key={c}
                    className="cq-choice"
                    data-target={live ? `opt-${i}-${j}` : undefined}
                    data-cursor="pointer"
                    data-active={(live && s.picked === j) || undefined}
                  >
                    <span>{c}</span>
                    {turn.multi ? <span className="cq-box" aria-hidden /> : null}
                  </span>
                ))}
              </div>
            </Collapse>
          ) : null}
        </div>
      </div>
      {reply ? (
        <Collapse open={state === 'past'} reveal="drop" from="below">
          <div className="cq-reply-row" data-reply={i}>
            <span className="cq-reply">{reply}</span>
          </div>
        </Collapse>
      ) : null}
    </div>
  )
}

/** The chat column: every turn up to the live one; the latest reply is
 * scrolled to the top (`anchor="reply"`), or the column is pinned to its
 * foot (`anchor="foot"`) for a transcript. */
function Thread({ turns, s, anchor }: { turns: Turn[]; s: S; anchor: 'reply' | 'foot' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [y, setY] = useState(0)
  useLayoutEffect(() => {
    if (anchor !== 'reply') return
    const el = ref.current
    const reply = el?.querySelector<HTMLElement>(`[data-reply="${s.scroll}"]`)
    if (!el || !reply) return void setY(0)
    const k = el.getBoundingClientRect().height / el.offsetHeight || 1
    const top = (reply.getBoundingClientRect().top - el.getBoundingClientRect().top) / k
    setY(Math.max(0, top - (el.closest('.cq--tile') ? 16 : 32)))
  }, [s.scroll, anchor])
  return (
    <div className="cq-scroll" data-anchor={anchor}>
      <div ref={ref} className="cq-thread" style={anchor === 'reply' ? { transform: `translateY(${-y}px)` } : undefined}>
        {turns.map((t, i) => (
          <Collapse key={i} open={i <= s.live} className="cq-turn-wrap">
            <TurnView turn={t} i={i} s={s} />
          </Collapse>
        ))}
      </div>
    </div>
  )
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="cq-stepper">
      <span className="cq-stepper-rule" aria-hidden />
      {SECTIONS.map((label, i) => (
        <li key={label} data-state={i < current ? 'done' : i === current ? 'active' : 'todo'}>
          <span className="cq-step-dot">
            <Check size={12} strokeWidth={3} />
            <span className="cq-step-pip" />
          </span>
          <span className="cq-step-label">{label}</span>
        </li>
      ))}
    </ol>
  )
}

/** The header's progress below xl: the section's name over a bar and dots. */
function ProgressBar({ current, fraction }: { current: number; fraction: number }) {
  const shown = Math.min(current, SECTIONS.length - 1)
  return (
    <div className="cq-progress">
      <span className="cq-progress-label">
        {SECTIONS.map((l, i) => (
          <span key={l} data-on={i === shown || undefined}>
            {l}
          </span>
        ))}
      </span>
      <span className="cq-progress-track">
        {SECTIONS.map((l, i) => (
          <span key={l} className="cq-seg" data-state={i < current ? 'done' : i === current ? 'active' : 'todo'}>
            <span style={{ width: `${Math.max(12, (i === current ? fraction : 0) * 100)}%` }} />
          </span>
        ))}
      </span>
    </div>
  )
}

type Layout = 'xl' | 'md' | 'phone'

/** Steps per section in quiz-steps.ts, for the header bar's fill. */
const SECTION_STEPS = [5, 6, 3]

function Page({ turns, s, layout, anchor, fractionOf }: { turns: Turn[]; s: S; layout: Layout; anchor: 'reply' | 'foot'; fractionOf: (live: number) => number }) {
  const section = turns[s.live].section
  return (
    <div className="cq-page" data-layout={layout}>
      <div className="cq-head">
        <span className="cq-wordmark">binu</span>
        {layout === 'xl' ? <span /> : (
          <span className="cq-fade" data-off={s.off || undefined}>
            <ProgressBar current={section} fraction={fractionOf(s.live)} />
          </span>
        )}
        <span />
      </div>
      <div className="cq-body cq-fade" data-off={s.off || undefined}>
        {layout === 'xl' ? (
          <aside className="cq-aside">
            <Stepper current={section} />
          </aside>
        ) : null}
        <Thread turns={turns} s={s} anchor={anchor} />
        {layout === 'xl' ? <span /> : null}
      </div>
    </div>
  )
}

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

type Spec = {
  turns: Turn[]
  initial: S
  poster: S
  script: (a: Act<S>) => Promise<void>
  anchor: 'reply' | 'foot'
  fractionOf: (live: number) => number
  size: 'row' | 'tile' | 'phone'
  rest: { wide: { x: number; y: number }; compact: { x: number; y: number } }
  cursor?: boolean
}

function QuizStage({ spec, className }: { spec: Spec; className: string }) {
  const box = useRef<HTMLDivElement>(null)
  const row = spec.size === 'row'
  // 'phone' is the phone design at any width (the full-page phone size).
  const phone = spec.size === 'phone'
  const below = phone ? Number.MAX_SAFE_INTEGER : row ? 600 : 420
  const narrow = useNarrow(box, below)
  return (
    <div ref={box}>
      <Stage<S>
        width={row ? 1440 : 480}
        height={row ? 757 : 322}
        compact={{ below, width: 358, height: row || phone ? 520 : 330 }}
        initial={spec.initial}
        poster={spec.poster}
        script={spec.script}
        play="loop"
        cursor={spec.cursor === false ? undefined : { at: spec.rest, style: narrow ? 'touch' : undefined }}
        className={`binu cq ${className}${spec.anchor === 'foot' ? ' cq--foot' : ''}`}
      >
        {(s, _rect, layout) => (
          <>
            {layout === 'compact' ? (
              <Phone width={326} className="cq-phone">
                <Page turns={spec.turns} s={s} layout="phone" anchor={spec.anchor} fractionOf={spec.fractionOf} />
              </Phone>
            ) : (
              <Window url="binu.app/quiz" urlShape="pill" className="cq-win">
                <Page turns={spec.turns} s={s} layout={row ? 'xl' : 'md'} anchor={spec.anchor} fractionOf={spec.fractionOf} />
              </Window>
            )}
            <span data-target="rest" style={{ position: 'absolute', left: spec.rest[layout].x, top: spec.rest[layout].y }} />
          </>
        )}
      </Stage>
    </div>
  )
}

const typed = (live: number, scroll: number): S => ({ live, chars: DONE, choices: true, picked: null, scroll, off: false })
const opening = (live: number, scroll: number): S => ({ live, chars: 0, choices: false, picked: null, scroll, off: false })

// ── QuizPage: the whole desktop page, 1440 × 757 ───────────────────────────
// Beats: the last "Your skin" question types out and its answers rise in; a
// tap answers it, the stepper ticks "Your skin" and moves to "Sun & safety";
// the page scrolls the reply up and the scientist types the section intro,
// the sun question and its note; the answers rise in. Holds, then restarts.

const PAGE_TURNS: Turn[] = [T.pigment, T.aging, T.sensitivity, T.sunReaction]
const pageInitial = opening(2, 1)
const PAGE: Spec = {
  turns: PAGE_TURNS,
  initial: pageInitial,
  poster: typed(3, 2),
  anchor: 'reply',
  size: 'row',
  fractionOf: live => (live < 3 ? (live + 2) / SECTION_STEPS[0] : 0),
  rest: { wide: { x: 1180, y: 700 }, compact: { x: 250, y: 480 } },
  async script(a) {
    await a.wait(700)
    a.mark('type')
    await typeOut(a, PAGE_TURNS[2])
    await a.wait(800)
    a.mark('answer')
    await answer(a, PAGE_TURNS, 2)
    a.mark('section')
    await typeOut(a, PAGE_TURNS[3])
    await a.move({ at: 'opt-3-1', x: 0.5, y: 0.5 })
    a.mark('hold')
    await a.wait(1400)
    await a.move('rest')
    await a.wait(1800)
    await restart(a, pageInitial)
  },
}

export function QuizPage() {
  return <QuizStage spec={PAGE} className="cq--row" />
}

// ── QuizTile: one question at a time, 480 × 322 ────────────────────────────
// Beats: "How often do you get breakouts?" types out under your "Combo"
// reply; a tap picks "Now and then"; the reply lands and scrolls up; the dark
// spots question types out and its answers rise in.

const TILE_TURNS: Turn[] = [T.skinType, T.breakouts, T.pigment]
const tileInitial = opening(1, 0)
const TILE: Spec = {
  turns: TILE_TURNS,
  initial: tileInitial,
  poster: typed(2, 1),
  anchor: 'reply',
  size: 'tile',
  fractionOf: live => live / SECTION_STEPS[0],
  rest: { wide: { x: 430, y: 300 }, compact: { x: 300, y: 300 } },
  async script(a) {
    await a.wait(600)
    a.mark('type')
    await typeOut(a, TILE_TURNS[1])
    await a.wait(700)
    a.mark('answer')
    await answer(a, TILE_TURNS, 1)
    await typeOut(a, TILE_TURNS[2])
    await a.move('rest')
    a.mark('hold')
    await a.wait(2600)
    await restart(a, tileInitial)
  },
}

export function QuizTile() {
  return <QuizStage spec={TILE} className="cq--tile" />
}

// ── QuizSectionTile: a new section, 480 × 322 ──────────────────────────────
// Beats: the last "Sun & safety" question is answered "Prefer not to say"
// (always a valid answer); the header's progress moves on to "Your
// routine" (the bar becomes a dot, the next dot a bar); the scientist
// introduces the section and asks what's already in your routine. Its
// answers (Cleanser, Toner, Serum, Moisturizer, ...) run off the foot.

const SECTION_TURNS: Turn[] = [T.medications, T.pregnancy, T.routine]
const sectionInitial = typed(1, 0)
const SECTION: Spec = {
  turns: SECTION_TURNS,
  initial: { ...sectionInitial, chars: DONE, choices: true },
  poster: typed(2, 1),
  anchor: 'reply',
  size: 'tile',
  fractionOf: live => (live < 2 ? 5 / SECTION_STEPS[1] : 0),
  rest: { wide: { x: 430, y: 300 }, compact: { x: 300, y: 300 } },
  async script(a) {
    await a.wait(900)
    a.mark('answer')
    await answer(a, SECTION_TURNS, 1)
    a.mark('section')
    await typeOut(a, SECTION_TURNS[2])
    await a.move('rest')
    a.mark('hold')
    await a.wait(2800)
    await restart(a, sectionInitial)
  },
}

export function QuizSectionTile() {
  return <QuizStage spec={SECTION} className="cq--tile" />
}

// ── QuizNeedsTile: your skin, one need at a time, 480 × 322 ────────────────
// The four questions that score the Baumann axes, answered one after
// another: each lands as its own reply, so skin is profiled as separate
// needs rather than one type. A transcript pinned to its foot; no cursor.

const NEEDS_TURNS: Turn[] = [T.skinType, T.breakouts, T.pigment, T.aging, T.sensitivity]
const needsInitial = typed(1, -1)
const NEEDS: Spec = {
  turns: NEEDS_TURNS,
  initial: { ...needsInitial, choices: false },
  poster: { ...typed(4, -1), choices: false },
  anchor: 'foot',
  size: 'tile',
  cursor: false,
  fractionOf: live => live / SECTION_STEPS[0],
  rest: { wide: { x: 0, y: 0 }, compact: { x: 0, y: 0 } },
  async script(a) {
    for (let live = 1; live < 4; live++) {
      await a.wait(900)
      a.mark(`need-${live}`)
      await a.set({ live: live + 1, chars: 0, picked: null })
      await typeOut(a, { ...NEEDS_TURNS[live + 1], choices: [] })
    }
    a.mark('hold')
    await a.wait(2600)
    await restart(a, { ...needsInitial, choices: false })
  },
}

export function QuizNeedsTile() {
  return <QuizStage spec={NEEDS} className="cq--tile" />
}

// ── QuizSavedTile: the last turn, 480 × 322 ────────────────────────────────
// After the last question (price range) the profile saves: the progress
// fills its last dot and the scientist says what happens next.

const SAVED_TURNS: Turn[] = [T.budget, T.saved]
const savedInitial = opening(1, 0)
const SAVED: Spec = {
  turns: SAVED_TURNS,
  initial: savedInitial,
  poster: typed(1, 0),
  anchor: 'reply',
  size: 'tile',
  cursor: false,
  fractionOf: () => 1,
  rest: { wide: { x: 0, y: 0 }, compact: { x: 0, y: 0 } },
  async script(a) {
    await a.wait(900)
    a.mark('type')
    await typeOut(a, SAVED_TURNS[1])
    a.mark('hold')
    await a.wait(3200)
    await restart(a, savedInitial)
  },
}

export function QuizSavedTile() {
  return <QuizStage spec={SAVED} className="cq--tile" />
}

// ── Phones: the same moments on the phone design, 358 × 520 ────────────────
// QuizNeedsPhone: skin profiled one need at a time (the NEEDS beats).
// QuizSectionPhone: "Prefer not to say", then on to "Your routine" (SECTION).

export function QuizNeedsPhone() {
  return <QuizStage spec={{ ...NEEDS, size: 'phone' }} className="cq--phone cq--foot" />
}

export function QuizSectionPhone() {
  return <QuizStage spec={{ ...SECTION, size: 'phone' }} className="cq--phone" />
}
