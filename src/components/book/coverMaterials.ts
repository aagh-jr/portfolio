/* Hardcover finishes for the zine book: scanned PBR sets (CC0) in
   /public/textures/covers/<dir>/, each a color, normal (OpenGL) and
   roughness map, plus metalness for the metal. The color map is tiled into
   the cover's page canvas, so the cover's printing sits on the material; the
   other maps go straight on the material with the same tiling.

   Sources: bookcloth = Poly Haven "book_pattern", pebbled leather = Poly
   Haven "leather_red_02", linen = ambientCG Fabric082A, smooth leather =
   ambientCG Leather037, aluminum = ambientCG Metal009. */

export interface CoverMaterial {
  label: string;
  dir: string;
  /** Tiles of the texture per page height. */
  repeat: number;
  /** Multiplied over the color map, to recolor it. */
  tint?: string;
  /** Board edges and the spine strip, roughly the material's average color. */
  edge: string;
  /** Title and folio, e.g. foil stamped into leather. */
  ink: string;
  roughness: number;
  metalness?: number;
  normalScale?: number;
  /** Cloth's soft glow at grazing angles. */
  sheen?: number;
  sheenColor?: string;
  /** Brushed metal's stretched highlight, along the texture's x. */
  anisotropy?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  /** Reflections from a studio environment; metals need them to read as metal. */
  envIntensity?: number;
  metalnessMap?: boolean;
}

export const COVER_MATERIALS = {
  bookcloth: {
    label: "Bookcloth",
    dir: "bookcloth",
    repeat: 1.5,
    edge: "#4a4518",
    ink: "#d9c88f",
    roughness: 1,
    normalScale: 1,
    sheen: 0.6,
    sheenColor: "#b8b07a",
    envIntensity: 0.25,
  },
  linen: {
    label: "Linen",
    dir: "linen",
    repeat: 2,
    tint: "#efe4cf",
    edge: "#b2aa9b",
    ink: "#2a2722",
    roughness: 1,
    normalScale: 2,
    sheen: 0.5,
    sheenColor: "#ffffff",
    envIntensity: 0.25,
  },
  leatherSmooth: {
    label: "Leather",
    dir: "leather-smooth",
    repeat: 2,
    edge: "#4e2a1c",
    ink: "#d8b56a",
    roughness: 0.8,
    normalScale: 1,
    clearcoat: 0.08,
    clearcoatRoughness: 0.5,
    envIntensity: 0.12,
  },
  leatherPebbled: {
    label: "Pebbled leather",
    dir: "leather-pebbled",
    repeat: 1.5,
    edge: "#4a2a18",
    ink: "#d8b56a",
    roughness: 0.85,
    normalScale: 1,
    clearcoat: 0.08,
    clearcoatRoughness: 0.55,
    envIntensity: 0.12,
  },
  aluminum: {
    label: "Aluminum",
    dir: "aluminum",
    repeat: 1,
    tint: "#8f949b",
    edge: "#8a8d93",
    ink: "#1d1c1a",
    roughness: 0.6,
    metalness: 1,
    metalnessMap: true,
    normalScale: 0.4,
    anisotropy: 0.7,
    envIntensity: 0.35,
  },
} satisfies Record<string, CoverMaterial>;

export type CoverMaterialName = keyof typeof COVER_MATERIALS;
