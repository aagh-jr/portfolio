import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Stage } from '../stageshow/kit/stage'
import type { Act } from '../stageshow/kit/act'
import '@fontsource/hanken-grotesk/400.css'
import '@fontsource/hanken-grotesk/500.css'
import './product-claim.css'

// Binu's product summary, rebuilt from the product's own component
// (skinsavior apps/web/src/components/products/ProductIdentityView.tsx) and its
// tokens (apps/web/src/app/globals.css): the brand and origin line, the
// Newsreader product name, and the "Type of product" / "Benefits" fields, where
// the brand's marketed claims sit as blue "Evens tone" pills.
//
// 1x1 (ClaimTile): step one of claim -> grade -> explanation -> research. The
// summary as the product stacks it on mobile, pinned to the tile and running
// off its foot. Plays once in view: the claims arrive in the Benefits field,
// one pill after the other. The still is the finished summary.
//
// Content is the product's own fixture (fixtures/products.fixtures.ts,
// niacinamideSerum / productIdentityFixture): The Ordinary, Canada,
// "Niacinamide 10% + Zinc 1%", Serum, badges "Controls oil" and "Minimizes pores".

const PRODUCT = {
  brand: 'The Ordinary',
  origin: 'Canada',
  name: 'Niacinamide 10% + Zinc 1%',
  category: 'Serum',
  benefits: ['Controls oil', 'Minimizes pores'],
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

type One = { shown: number }

async function oneScript(a: Act<One>) {
  await a.wait(500)
  for (let i = 1; i <= PRODUCT.benefits.length; i++) {
    a.set({ shown: i })
    await a.wait(380)
  }
  await a.wait(2000)
}

export function ClaimTile() {
  const [ref, width] = useWidth(480)
  return (
    <div ref={ref} className="pc-host">
      <Stage<One>
        width={width}
        height={322}
        initial={{ shown: 0 }}
        poster={{ shown: PRODUCT.benefits.length }}
        script={oneScript}
        play="once"
        className="pc pc--one"
      >
        {(s) => (
          <section className="pc-page" aria-label="Product summary" data-narrow={width < 400 || undefined}>
            <div className="pc-brand">
              <span>{PRODUCT.brand}</span>
              <span aria-hidden>•</span>
              <span>{PRODUCT.origin}</span>
            </div>
            <p className="pc-name">{PRODUCT.name}</p>
            <dl className="pc-fields">
              <div className="pc-field">
                <dt>Type of product</dt>
                <dd>{PRODUCT.category}</dd>
              </div>
              <div className="pc-field">
                <dt>Benefits</dt>
                <dd>
                  <span className="pc-pills">
                    {PRODUCT.benefits.map((benefit, i) => (
                      <span
                        key={benefit}
                        className="pc-pill"
                        data-in={i < s.shown || undefined}
                        style={{ '--i': i } as CSSProperties}
                      >
                        {benefit}
                      </span>
                    ))}
                  </span>
                </dd>
              </div>
            </dl>
            {/* The dl's next row running off the foot: real labels, values as
                filler. Same grid; the page's 20px gap stands in for gap-y-5. */}
            <dl className="pc-fields" aria-hidden>
              <div className="pc-field">
                <dt>Irritancy</dt>
                <dd>
                  <span className="pc-bar" style={{ width: 64 }} />
                </dd>
              </div>
              <div className="pc-field">
                <dt>Conflict</dt>
                <dd>
                  <span className="pc-bar" style={{ width: 132 }} />
                </dd>
              </div>
            </dl>
          </section>
        )}
      </Stage>
    </div>
  )
}
