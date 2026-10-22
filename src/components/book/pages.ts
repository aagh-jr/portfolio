/**
 * Page list for the 3D book, in reading order: front cover first, back
 * cover last. Each entry is one single page. Two consecutive pages share a
 * sheet (front + back), so an even count gives a closed book.
 *
 * To add real art, drop images into /public (e.g. /public/books/<name>/)
 * and replace a `null` with its site-relative path:
 *   '/books/my-booklet/01.jpg'
 * Any `null` renders as a numbered placeholder.
 */
export type PageSource = string | null;

const CABRILLO = "/screenshots/cabrillo";

/* Cabrillo "Gray Whale Watching Activity Book", in folded reading order
   (from the printer imposition in whale-booklet.pdf): Map is page 3 and
   Anatomy page 6, with the drawing spread across the center (4–5). */
export const WHALE_BOOKLET: PageSource[] = [
  `${CABRILLO}/wb-1-cover.png`, // 1 — front cover
  `${CABRILLO}/wb-2-instructions.png`, // 2
  `${CABRILLO}/wb-4-map.png`, // 3
  `${CABRILLO}/wb-5a-draw-l.png`, // 4 — center spread, left
  `${CABRILLO}/wb-5b-draw-r.png`, // 5 — center spread, right
  `${CABRILLO}/wb-3-anatomy.png`, // 6
  `${CABRILLO}/wb-6-final-report.png`, // 7
  `${CABRILLO}/wb-7-thanks.png`, // 8 — back cover
];

/* Cabrillo "Open Tower Day" activity book, printed as a one-sheet folded
   zine (open-tower-day-activity-book.pdf). Order follows the otd-* files. */
export const OPEN_TOWER_BOOKLET: PageSource[] = [
  `${CABRILLO}/otd-1-cover.png`, // 1 — front cover
  `${CABRILLO}/otd-2-how-to-play.png`, // 2
  `${CABRILLO}/otd-3-word-hunt.png`, // 3
  `${CABRILLO}/otd-4-park-fact.png`, // 4
  `${CABRILLO}/otd-5-draw.png`, // 5
  `${CABRILLO}/otd-6-bingo.png`, // 6
  `${CABRILLO}/otd-7-stamps.png`, // 7
  `${CABRILLO}/otd-8-events.png`, // 8 — back cover
];

/* Cabrillo "Junior Botanist Flower Hunt": one letter sheet folded in half
   (flower-hunt.png). The top half, printed upside down, is the outside
   (cover + instructions); the bottom half is the inside trail spread,
   with the middle column straddling the crease. */
export const FLOWER_HUNT_BOOKLET: PageSource[] = [
  `${CABRILLO}/fh-1-cover.png`, // 1 — front cover
  `${CABRILLO}/fh-2-inside-l.png`, // 2 — inside spread, left
  `${CABRILLO}/fh-3-inside-r.png`, // 3 — inside spread, right
  `${CABRILLO}/fh-4-back.png`, // 4 — back cover (instructions)
];

/** Quarter-letter page (4.25×5.5in), for a letter sheet folded in half twice
    or a half sheet folded once, like the Flower Hunt. */
export const QUARTER_LETTER_ASPECT = 4.25 / 5.5;

/** Default pages when <Book> gets none. */
export const BOOK_PAGES = WHALE_BOOKLET;

/** Width / height of a single page. 0.647 ≈ 5.5×8.5in half-letter booklet. */
export const PAGE_ASPECT = 5.5 / 8.5;
