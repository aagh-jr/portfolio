import { lazy, Suspense, useEffect, useState } from "react";
import {
  FLOWER_HUNT_BOOKLET,
  OPEN_TOWER_BOOKLET,
  QUARTER_LETTER_ASPECT,
  WHALE_BOOKLET,
  type PageSource,
} from "./pages";

/* The three Cabrillo booklets in the home page's Lab box: one at each end,
   one in the middle. Posters are stills of the case study's viewers.

   The posters are plain images, rendered on the server, so the box is
   filled before any JavaScript runs. The 3D viewer (three.js and React
   Three Fiber, the site's heaviest bundle) is only fetched once this
   island hydrates, which index.astro holds off until the Lab is near the
   screen (client:visible). */
const BookThumb = lazy(() => import("./Book").then((m) => ({ default: m.BookThumb })));

const POSTERS = "/screenshots/cabrillo";

const BOOKLETS: { pages: PageSource[]; aspect?: number; poster: string; alt: string }[] = [
  {
    pages: WHALE_BOOKLET,
    poster: `${POSTERS}/lab-book-whale.webp`,
    alt: "Gray Whale Watching activity book",
  },
  {
    pages: FLOWER_HUNT_BOOKLET,
    aspect: QUARTER_LETTER_ASPECT,
    poster: `${POSTERS}/lab-book-flower-hunt.webp`,
    alt: "Junior Botanist Flower Hunt booklet",
  },
  {
    pages: OPEN_TOWER_BOOKLET,
    poster: `${POSTERS}/lab-book-open-tower.webp`,
    alt: "Open Tower Day activity book",
  },
];

/** The same markup BookThumb shows before its pages load. */
function Poster({ poster, alt }: { poster: string; alt: string }) {
  return (
    <div className="lab-book">
      <img className="lab-book-poster" src={poster} alt={alt} decoding="async" loading="lazy" />
    </div>
  );
}

export default function LabBooklets() {
  // Server render and first client render match (posters only); the 3D
  // viewers swap in after hydration.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <>
      {BOOKLETS.map((b) =>
        hydrated ? (
          <Suspense key={b.poster} fallback={<Poster poster={b.poster} alt={b.alt} />}>
            <BookThumb pages={b.pages} aspect={b.aspect} poster={b.poster} alt={b.alt} />
          </Suspense>
        ) : (
          <Poster key={b.poster} poster={b.poster} alt={b.alt} />
        ),
      )}
    </>
  );
}
