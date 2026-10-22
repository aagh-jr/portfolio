/**
 * Single-sheet Cabrillo prints for <Paper>. PDF handouts were rendered to
 * JPEG (150 dpi) under /screenshots/cabrillo/handouts/; the rest use the
 * existing PNGs. Near-identical alternate versions are left out (the whale
 * poster's first page, which matches the flyer's). The Flower Hunt is a
 * folded booklet (pages.ts) and the Eco Web cards are cut apart (ecoWeb.ts).
 */
export interface Handout {
  title: string;
  front: string;
  back?: string;
  /** Width / height of the sheet. */
  aspect: number;
}

const C = "/screenshots/cabrillo";
const LETTER_PORTRAIT = 8.5 / 11;
const HALF_LETTER = 5.5 / 8.5;

export const HANDOUTS: Handout[] = [
  {
    // Printed two-up on letter and cut in half; this is one of the halves.
    title: "Nature Journal",
    front: `${C}/handouts/nature-journal-front.png`,
    back: `${C}/handouts/nature-journal-back.png`,
    aspect: HALF_LETTER,
  },
  {
    title: "Guided Whale Watching Flyer",
    front: `${C}/handouts/whale-flyer-a.jpg`,
    aspect: LETTER_PORTRAIT,
  },
  {
    title: "Guided Whale Watching Flyer (dates)",
    front: `${C}/handouts/whale-flyer-b.jpg`,
    aspect: LETTER_PORTRAIT,
  },
  {
    title: "Guided Whale Watching Poster",
    front: `${C}/handouts/whale-poster.jpg`,
    aspect: LETTER_PORTRAIT,
  },
  {
    title: "Anniversary Birthday Card",
    front: `${C}/handouts/birthday-card.jpg`,
    aspect: LETTER_PORTRAIT,
  },
];
