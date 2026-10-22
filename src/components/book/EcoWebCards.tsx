import { useRef, useState } from "react";
import Paper from "./Paper";
import { CARD_GROUPS, FEATURED_CARD, FOOD_CHAIN, type EcoCard } from "./ecoWeb";

/** Card stock: twice the default paper thickness. */
const CARD_THICKNESS = 0.008;

/* Eco Web cards: one featured card up top, a three-card food chain under
   it, then a flat grid of every card. Picking a card in the grid shows it
   in the featured viewer. Only these four are 3D; the grid stays plain
   images so the page doesn't run out of WebGL contexts. */

export default function EcoWebCards() {
  const [featured, setFeatured] = useState<EcoCard>(FEATURED_CARD);
  const featuredRef = useRef<HTMLDivElement>(null);

  const feature = (card: EcoCard) => {
    setFeatured(card);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    featuredRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="flex flex-col gap-20">
      <div ref={featuredRef} className="mx-auto w-full max-w-xl">
        {/* key remounts the viewer so a new card starts face up */}
        <Paper key={featured.front} {...featured} thickness={CARD_THICKNESS} />
      </div>

      <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {FOOD_CHAIN.map((card) => (
          <Paper key={card.front} {...card} thickness={CARD_THICKNESS} />
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {CARD_GROUPS.map((group) => (
          <section key={group.name} aria-label={`${group.name} cards`}>
            <h3 className="mb-4 text-center text-sm font-medium opacity-60">{group.name}</h3>
            <ul className="flex flex-wrap justify-center gap-3">
              {group.cards.map((card) => (
                <li key={card.front}>
                  <button
                    type="button"
                    aria-pressed={card === featured}
                    onClick={() => feature(card)}
                    className="block outline-offset-4 transition-transform hover:-translate-y-1 aria-pressed:ring-2 aria-pressed:ring-current aria-pressed:ring-offset-2"
                  >
                    <img
                      src={card.front}
                      alt={card.title}
                      loading="lazy"
                      className={`block w-auto ${
                        card.aspect > 1 ? "h-20 sm:h-28" : "h-36 sm:h-44"
                      }`}
                      style={{ aspectRatio: card.aspect }}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
