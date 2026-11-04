import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import '@fontsource/hanken-grotesk/600.css'
import './underlying-research.css'

// Binu's product-page research section, rebuilt from the product's own
// components (skinsavior apps/web/src/components/research/ProductResearch.tsx
// and IngredientResearch.tsx: the pill toggle, the loading state, the paper
// list) and its tokens (apps/web/src/app/globals.css). Papers are the
// Storybook fixtures (apps/web/src/fixtures/research.fixtures.ts).
//
// 1x1 (ResearchTile): Niacinamide's papers. Plays once in view: the scientist
// is "pulling up the research" over skeleton cards, then the papers resolve
// top to bottom and the loading line folds away. Below 400px wide the pill
// row is dropped (the product's SingleIngredient case) so the first paper
// still fits whole.

type Paper = {
  pmid: string
  title: string
  abstract: string | null
  journal: string
  year: number
  studyType: string
  doi: string | null
}

// research.fixtures.ts `papers`, in rank order; studyType = bestStudyType().
const PAPERS: Paper[] = [
  {
    pmid: '16766489',
    title: 'Topical niacinamide reduces sebum excretion rate in a controlled study',
    abstract:
      'A randomized, vehicle-controlled study of 2% niacinamide applied for four weeks reported a measurable reduction in sebum excretion rate versus vehicle.',
    journal: 'Journal of Cosmetic Dermatology',
    year: 2006,
    studyType: 'Randomized Controlled Trial',
    doi: '10.1111/j.1473-2165.2006.00269.x',
  },
  {
    pmid: '21128815',
    title: 'Niacinamide in cosmetic dermatology: a review',
    abstract:
      'A narrative review summarizing cosmetic applications of topical niacinamide, including oil control and the appearance of pores and uneven tone.',
    journal: 'Dermatologic Surgery',
    year: 2010,
    studyType: 'Review',
    doi: null,
  },
  {
    pmid: '16536414',
    title: 'Facial oiliness and topical niacinamide: a controlled clinical trial',
    abstract: null,
    journal: 'International Journal of Dermatology',
    year: 2006,
    studyType: 'Controlled Clinical Trial',
    doi: null,
  },
]

// ProductResearch.stories.tsx MultipleIngredients
const PILLS = ['Niacinamide', 'Vitamin C', 'Retinol']

/** IngredientResearch badgeTone(): trials green, reviews blue, else amber. */
function tone(type: string) {
  if (type === 'Review') return 'review'
  if (type === 'Journal Article') return 'other'
  return 'trial'
}

function useWidth(initial: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(initial)
  const [ready, setReady] = useState(false)
  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    const measure = () => {
      if (node.clientWidth) setWidth(Math.round(node.clientWidth))
      setReady(true)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return [ref, width, ready] as const
}

/** ScientistAvatar: closed and open mouth frames, swapped every 350ms while talking. */
function Scientist({ talking }: { talking: boolean }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!talking) {
      setOpen(false)
      return
    }
    const id = setInterval(() => setOpen((m) => !m), 350)
    return () => clearInterval(id)
  }, [talking])
  return (
    <span className="ur-avatar" aria-hidden>
      <img src="/previews/binu/scientist.png" alt="" style={{ visibility: open ? 'hidden' : 'visible' }} />
      <img src="/previews/binu/scientist-talking.png" alt="" style={{ visibility: open ? 'visible' : 'hidden' }} />
    </span>
  )
}

function Skeleton() {
  return (
    <div className="ur-skel" aria-hidden>
      <div className="ur-skel-a" />
      <div className="ur-skel-b" />
      <div className="ur-skel-c" />
      <div className="ur-skel-d" />
    </div>
  )
}

function PaperCard({ paper }: { paper: Paper }) {
  return (
    <article className="ur-paper">
      <div className="ur-meta">
        <span className="ur-badge" data-tone={tone(paper.studyType)}>
          {paper.studyType}
        </span>
        <span className="ur-journal">
          {paper.journal} · {paper.year}
        </span>
      </div>
      <h3 className="ur-title">{paper.title}</h3>
      {paper.abstract && <p className="ur-abstract">{paper.abstract}</p>}
      <span className="ur-link">
        {paper.doi ? 'Read full text' : 'View on PubMed'}
        <span aria-hidden className="ur-arrow">→</span>
      </span>
    </article>
  )
}

type S = { loaded: number }

async function script(a: Act<S>) {
  await a.wait(1400)
  for (let i = 1; i <= PAPERS.length; i++) {
    a.set({ loaded: i })
    await a.wait(260)
  }
  await a.wait(2000)
}

export function ResearchTile() {
  const [ref, width, ready] = useWidth(480)
  return (
    <div ref={ref} className="ur-host" data-ready={ready || undefined}>
      <Stage<S>
        width={width}
        height={322}
        initial={{ loaded: 0 }}
        poster={{ loaded: PAPERS.length }}
        script={script}
        play="once"
        className="ur"
      >
        {(s) => (
          <div className="ur-section" data-narrow={width < 400 || undefined}>
            {/* Narrow column: the single-ingredient story (no toggle row), so the
                first paper fits whole. */}
            {width >= 400 && (
              <div className="ur-pills">
                {PILLS.map((label, i) => (
                  <span key={label} className="ur-pill" data-active={i === 0 || undefined}>
                    {label}
                  </span>
                ))}
              </div>
            )}
            <div className="ur-loading" data-gone={s.loaded > 0 || undefined}>
              <div className="ur-loading-inner">
                <div className="ur-loading-row">
                  <Scientist talking={s.loaded === 0} />
                  <span>Pulling up the research…</span>
                </div>
              </div>
            </div>
            <div className="ur-list">
              {PAPERS.map((paper, i) => (
                <div key={paper.pmid} className="ur-slot" data-loaded={s.loaded > i || undefined}>
                  <div className="ur-cell ur-cell--paper">
                    <div>
                      <PaperCard paper={paper} />
                    </div>
                  </div>
                  <div className="ur-cell ur-cell--skel">
                    <div>
                      <Skeleton />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Stage>
    </div>
  )
}
