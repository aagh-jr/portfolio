import { BookThumb } from "./Book";
import {
  FLOWER_HUNT_BOOKLET,
  OPEN_TOWER_BOOKLET,
  QUARTER_LETTER_ASPECT,
  WHALE_BOOKLET,
} from "./pages";

/* The three Cabrillo booklets in the home page's Lab box: one at each end,
   one in the middle. Posters are stills of the case study's viewers. */
const POSTERS = "/screenshots/cabrillo";

export default function LabBooklets() {
  return (
    <>
      <BookThumb
        pages={WHALE_BOOKLET}
        poster={`${POSTERS}/lab-book-whale.webp`}
        alt="Gray Whale Watching activity book"
      />
      <BookThumb
        pages={FLOWER_HUNT_BOOKLET}
        aspect={QUARTER_LETTER_ASPECT}
        poster={`${POSTERS}/lab-book-flower-hunt.webp`}
        alt="Junior Botanist Flower Hunt booklet"
      />
      <BookThumb
        pages={OPEN_TOWER_BOOKLET}
        poster={`${POSTERS}/lab-book-open-tower.webp`}
        alt="Open Tower Day activity book"
      />
    </>
  );
}
