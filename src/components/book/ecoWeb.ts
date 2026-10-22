/**
 * Cabrillo "Eco Web" game cards, cut from the printed sheets
 * (eco-web-card-*.png). Species cards were printed duplex with the NPS
 * back; the event and resource cards are one-sided.
 */
export interface EcoCard {
  title: string;
  front: string;
  back?: string;
  /** Width / height of the card. */
  aspect: number;
}

const C = "/screenshots/cabrillo";
const BACK = `${C}/eco-web/card-back.png`;
const SPECIES_ASPECT = 513 / 839;
const EVENT_ASPECT = 1000 / 511;

const species = (slug: string, title: string): EcoCard => ({
  title,
  front: `${C}/card-${slug}.png`,
  back: BACK,
  aspect: SPECIES_ASPECT,
});

const event = (slug: string, title: string): EcoCard => ({
  title,
  front: `${C}/eco-web/event-${slug}.png`,
  aspect: EVENT_ASPECT,
});

export const SPECIES_CARDS: EcoCard[] = [
  species("prickly-pear", "Coastal Prickly Pear"),
  species("brown-algae", "Brown Algae"),
  species("bumble-bee", "California Bumble Bee"),
  species("desert-cottontail", "Desert Cottontail"),
  species("grey-shrew", "Crawford's Grey Shrew"),
  species("gopher-snake", "Gopher Snake"),
  species("black-phoebe", "Black Phoebe"),
  species("grey-fox", "Grey Fox"),
  species("coopers-hawk", "Cooper's Hawk"),
  species("red-tailed-hawk", "Red-tailed Hawk"),
  species("bat-star", "Bat Star"),
  species("blueband-hermit", "Blueband Hermit Crab"),
  species("garibaldi", "Garibaldi"),
  species("osprey", "Osprey"),
  species("common-dolphin", "Common Dolphin"),
];

export const EVENT_CARDS: EcoCard[] = [
  event("land-disease", "Event: New Disease"),
  event("land-drought", "Event: Drought"),
  event("land-predator", "Event: New Predator"),
  event("land-chemical-spill", "Event: Chemical Spill"),
  event("land-invasive-plant", "Event: Invasive Plant"),
  event("marine-disease", "Marine Event: New Disease"),
  event("marine-acidification", "Marine Event: Ocean Acidification"),
  event("marine-predator", "Marine Event: New Predator"),
  event("marine-chemical-spill", "Marine Event: Chemical Spill"),
  event("marine-invasive-fish", "Marine Event: Invasive Fish"),
  event("marine-invasive-plant", "Marine Event: Invasive Plant"),
];

export const RESOURCE_CARDS: EcoCard[] = [
  { title: "Sunlight", front: `${C}/eco-web/resource-sunlight.png`, aspect: 519 / 738 },
  { title: "Water", front: `${C}/eco-web/resource-water.png`, aspect: 518 / 738 },
  { title: "Nutrients", front: `${C}/eco-web/resource-nutrients.png`, aspect: 852 / 515 },
];

export const CARD_GROUPS = [
  { name: "Species", cards: SPECIES_CARDS },
  { name: "Events", cards: EVENT_CARDS },
  { name: "Resources", cards: RESOURCE_CARDS },
];

const byTitle = (title: string) => SPECIES_CARDS.find((c) => c.title === title)!;

/** A three-step food chain shown side by side: producer → prey → predator. */
export const FOOD_CHAIN: EcoCard[] = [
  byTitle("Coastal Prickly Pear"),
  byTitle("Desert Cottontail"),
  byTitle("Red-tailed Hawk"),
];

/** Card shown in the large viewer before the visitor picks one. */
export const FEATURED_CARD = byTitle("Cooper's Hawk");
