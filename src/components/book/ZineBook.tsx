import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { spreadLabel } from "./Book";
import { COVER_MATERIALS, type CoverMaterial, type CoverMaterialName } from "./coverMaterials";
import { paperGrain } from "./paperGrain";
import { type PageSource } from "./pages";
import {
  MAX_FRAME_DELTA,
  ShadowGround,
  StageLights,
  initialView,
  rectCorners,
  useNearViewport,
  usePrefersReducedMotion,
  useSiteTheme,
  useTiltControls,
  type Pose,
  type ViewState,
} from "./stage";

/* A thick book lying open on a table, filling the screen, seen from the
   front. It doesn't rotate: the only things to do are open it, turn the
   pages, and reach the back cover.

   A book this long can't be hundreds of turnable sheets with a texture
   each, so only the leaves around the open spread (WINDOW per side, plus
   the two covers) are real, hinged on the spine at x = 0 and turning
   0 → -π around Y. Everything further in is one solid page block per
   side, its edges drawn as fine page lines. A leaf joins or leaves a block
   only once it's at rest, at exactly the height the block's top reaches,
   so the swap doesn't show.

   Open, every leaf (and each block's top) is pinched toward the spine and
   rises out of the gutter to its height in the stack, so the pages curve
   down into the fold. Closed, there's no gutter and everything lies flat.

   The magazine binding is a paperback: thin card covers flush with the
   pages, a flat spine as wide as the book is thick, and each leaf glued
   along it at its own place, so a side's leaves leave the spine side by
   side instead of meeting in one point. It's seen from straight above. */

const PAGE_HEIGHT = 1;
const LEAF_T = 0.00012; // drawn thickness of a paper leaf
const PITCH = 0.0008; // how much each paper leaf adds to the stack
const FAN = 0.0003; // open, how much further each leaf reaches than the one above it
const GUTTER_LENGTH = 0.12; // how quickly a leaf flattens out after leaving the spine
const ARCH_AT = 0.12; // how far from the spine the swoop peaks
const ARCH_RAMP = 4; // paper leaves above a cover before the swoop is at full height
const SPINE_STRIP = 0.01; // width of the cover's spine showing at the head and tail of the gutter
const BEND = 1.3; // radians the free edge trails the spine at mid-flip
const SEGMENTS = 64; // strips across the page width; dense enough for the gutter curve
const WINDOW = 5; // real leaves kept on each side of the open spread
const FLIP_SPEED = 6;
const FIT_MARGIN = 1.01; // a hair of room past the furthest edge
/* A binding's `headroom` is spare canvas above the book, as a fraction of
   the framed height: seen from the front, a leaf standing up mid-turn rises
   about that far past the top of the book. The book keeps its size and
   place; this is only room to draw into. */
const deg = THREE.MathUtils.degToRad;

export interface Binding {
  coverT: number; // thickness of a cover
  overhang: number; // how far the covers reach past the pages at head, tail and fore-edge
  spineRatio: number; // open, how much of its pitch a paper leaf keeps where it meets the spine
  arch: number; // open, how high a page swoops up as it leaves the spine before settling
  /** How much of a paper leaf's curl a cover turns with: 0 for board, 1 for card as soft as the pages. */
  coverCurl: number;
  /** Leaves glued across a flat spine as wide as the book is thick, rather than sewn into one fold. */
  flatSpine: boolean;
  /** Strength of the shadow printed along each inner page's spine side, 1 = the hardcover's. */
  gutterShade: number;
  /** How far across the page that shadow reaches, as a fraction of its width. */
  gutterWidth: number;
  /** Strength of the dark crease printed right at the fold, 1 = the hardcover's sewn one. */
  crease: number;
  /** A hairline drawn where the open pages meet, in this color; none if unset. */
  foldLine?: string;
  pose: Pose;
  /** Spare canvas above the book; see `headroom` below. */
  headroom: number;
  aspect: number;
  coverColor: string;
}

export const BINDINGS = {
  hardcover: {
    coverT: 0.003,
    overhang: 0.012,
    spineRatio: 0.35,
    arch: 0.05,
    coverCurl: 0,
    flatSpine: false,
    gutterShade: 1,
    gutterWidth: 0.14,
    crease: 1,
    /* Squarely in front, leaned back enough to see the bottom edge's page
       lines, which is what gives the book its height. */
    pose: { x: deg(-16), y: 0, z: 0 },
    headroom: 0.5,
    aspect: 8 / 10, // 8×10in, wider than the booklets' half-letter
    coverColor: "#c4b59a",
  },
  magazine: {
    coverT: 0.0012,
    overhang: 0,
    spineRatio: 0.1,
    arch: 0.02,
    coverCurl: 0.6,
    flatSpine: true,
    // Glued, it opens flatter than a sewn book: a soft shadow hugging the
    // seam, the page bright past it, and no hard fold.
    gutterShade: 1,
    gutterWidth: 0.05,
    crease: 0.12,
    foldLine: "#3a3a3a",
    // Straight down from above: only the spread and the fanned fore-edges show.
    pose: { x: 0, y: 0, z: 0 },
    headroom: 0,
    aspect: 0.7,
    coverColor: "#3fd651",
  },
} satisfies Record<string, Binding>;
export type BindingName = keyof typeof BINDINGS;

const BACKDROPS = { dark: "#0b0b0b", light: "#e9e7e1" } as const;
/** Text and controls on each backdrop. */
export const BACKDROP_INK = { dark: "#e9e7e1", light: "#1d1c1a" } as const;
const PAGE_EDGE = "#ebe6da";
const TEXTURE_MAX = 2048; // longest side a page image is drawn at
const PLACEHOLDER_WIDTH = 1024;

/* ---------- curves ---------- */

/**
 * A leaf's centerline is traced by arc length s from the spine, with its
 * slope θ(s) = lift·e^(−s/GUTTER_LENGTH) − curl·s²: steep where it leaves
 * the spine, flat further out, plus the curl of a turn, which bends harder
 * toward the free edge the way paper does when it's turned from the corner.
 * Following arc length means the page never stretches.
 *
 * `arch` adds the swoop of a bound page: a rise of that height peaking
 * ARCH_AT from the spine, (s/a)·e^(1 − s/a), that falls back to nothing by
 * the fore-edge, so the page rolls up out of the fold and settles flat. Its
 * slope is added on. Every layer gets the same arch, so stacks still nest.
 */
function slope(s: number, lift: number, curl: number, arch = 0) {
  const u = s / ARCH_AT;
  const swoop = arch ? ((arch / ARCH_AT) * Math.exp(1 - u) * (1 - u)) : 0;
  return Math.min(1.5, lift * Math.exp(-s / GUTTER_LENGTH) + swoop) - curl * s * s;
}

/** Height a leaf reaches over `width` when it leaves the spine at slope `lift`. */
function riseFor(lift: number, width: number) {
  const ds = width / SEGMENTS;
  let z = 0;
  for (let i = 0; i < SEGMENTS; i++) z += Math.sin(slope((i + 0.5) * ds, lift, 0)) * ds;
  return z;
}

/** The spine slope that lifts a leaf to `height`; bisection, since riseFor only grows. */
function liftFor(height: number, width: number) {
  if (height <= 1e-7) return 0;
  let lo = 0;
  let hi = 1.4;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (riseFor(mid, width) < height) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Where something resting at `height` in a stack meets the spine, and the
 * slope it leaves at. `open` runs 0 (closed: flat, at full height) to 1
 * (open: pinched down to `spine` there, the curve doing the lifting).
 */
function rest(height: number, spine: number, open: number, width: number) {
  const z = open * spine + (1 - open) * height;
  return { z, lift: liftFor(height - z, width) };
}

/** Traces a centerline into `x`, `z` and slope `a`, one sample per segment column. */
function trace(
  lift: number,
  curl: number,
  width: number,
  x: Float32Array,
  z: Float32Array,
  a: Float32Array,
  z0 = 0,
  arch = 0,
) {
  const ds = width / SEGMENTS;
  x[0] = 0;
  z[0] = z0;
  for (let i = 0; i < SEGMENTS; i++) {
    const m = slope((i + 0.5) * ds, lift, curl, arch);
    x[i + 1] = x[i] + Math.cos(m) * ds;
    z[i + 1] = z[i] + Math.sin(m) * ds;
  }
  for (let i = 0; i <= SEGMENTS; i++) a[i] = slope(i * ds, lift, curl, arch);
}

const scratchSlope = new Float32Array(SEGMENTS + 1);
const cx = new Float32Array(SEGMENTS + 1);
const cz = new Float32Array(SEGMENTS + 1);
const ca = new Float32Array(SEGMENTS + 1);

/** The resting surfaces a turning leaf can't pass through, one per side. */
interface Contact {
  rot: number; // the leaf's turn
  z: number; // its height at the spine
  right: { x: Float32Array; z: Float32Array };
  left: { x: Float32Array; z: Float32Array };
}

/** Height of a traced surface at distance `x` from the spine; −∞ past its edge. */
function surfaceAt(sx: Float32Array, sz: Float32Array, x: number) {
  if (x > sx[SEGMENTS]) return -Infinity;
  let i = 1;
  while (i < SEGMENTS && sx[i] < x) i++;
  const t = (x - sx[i - 1]) / (sx[i] - sx[i - 1] || 1);
  return sz[i - 1] + (sz[i] - sz[i - 1]) * Math.max(0, Math.min(1, t));
}

/**
 * Paper can't pass through paper: every point of the turning leaf that
 * would sink below where it rests on either side is held up on that
 * surface instead, so a curling edge slides over the stack rather than
 * through it. Works in book space (the leaf's turn undone), then puts the
 * curve back and re-derives its slope from the new shape.
 */
function holdAbove(c: Contact) {
  const cos = Math.cos(c.rot);
  const sin = Math.sin(c.rot);
  let moved = false;
  for (let i = 1; i <= SEGMENTS; i++) {
    const X = cx[i] * cos + cz[i] * sin;
    const Z = -cx[i] * sin + cz[i] * cos + c.z;
    const floor = X >= 0 ? surfaceAt(c.right.x, c.right.z, X) : surfaceAt(c.left.x, c.left.z, -X);
    if (Z >= floor) continue;
    const z = floor - c.z;
    cx[i] = X * cos - z * sin;
    cz[i] = X * sin + z * cos;
    moved = true;
  }
  if (!moved) return;
  for (let i = 0; i <= SEGMENTS; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(SEGMENTS, i + 1);
    ca[i] = Math.atan2(cz[b] - cz[a], cx[b] - cx[a]);
  }
}

/**
 * Lays a flat leaf geometry (rest positions in `restPos`, x from 0 to
 * width) onto its centerline, stretched to `reach` for the fanned edge and
 * held clear of the stacks by `contact` while it turns. Thickness follows
 * the curve's normal so the paper keeps its thickness.
 */
function shapeLeaf(
  geometry: THREE.BufferGeometry,
  restPos: Float32Array,
  width: number,
  lift: number,
  curl: number,
  reach: number,
  arch: number,
  contact?: Contact,
) {
  trace(lift, curl, reach, cx, cz, ca, 0, arch);
  if (contact) holdAbove(contact);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let v = 0; v < pos.count; v++) {
    // Box vertices sit exactly on the segment columns.
    const col = Math.round((restPos[v * 3] / width) * SEGMENTS);
    const z0 = restPos[v * 3 + 2];
    const a = ca[col];
    pos.setXYZ(v, cx[col] - z0 * Math.sin(a), restPos[v * 3 + 1], cz[col] + z0 * Math.cos(a));
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

/* ---------- stack ---------- */

/**
 * Height of leaf `i`'s centerline above the table, flat, in the stack it's
 * in: everything under it plus half of itself. Leaf 0 is the front cover
 * and leaf n − 1 the back cover; the rest are paper.
 */
function heightOf(i: number, n: number, turned: boolean, b: Binding) {
  return stacked(i, n, turned, PITCH, b);
}

/**
 * Where leaf `i`'s centerline meets the spine when the book is open. Paper
 * is squeezed to the binding's spineRatio of its pitch there, but a cover
 * keeps its full thickness, so every layer still clears the one under it
 * at the fold.
 */
function spineOf(i: number, n: number, turned: boolean, b: Binding) {
  return stacked(i, n, turned, PITCH * b.spineRatio, b);
}

/**
 * Open, where leaf `i` (fractional between leaves) is glued along a flat
 * spine: the front cover at its left edge, the back cover at its right, the
 * paper evenly between. Every leaf of a sewn binding meets at the fold, 0.
 *
 * Given its side, a leaf is pressed half a step toward it, so the two pages
 * of the open spread meet at one point instead of leaving a gap down the
 * fold; a turning leaf crosses that half step on the way over.
 */
function hingeX(i: number, n: number, b: Binding, turned?: boolean) {
  if (!b.flatSpine) return 0;
  const press = turned === undefined ? 0 : turned ? 0.5 : -0.5;
  return ((i + press) / (n - 1) - 0.5) * bookThickness(n, b);
}

/**
 * How much of the swoop leaf `i` gets in a stack. The covers are boards and
 * lie flat; paper builds up to the full swoop over its first few leaves
 * above the cover. Higher leaves never arch less than lower ones, so the
 * layers stay nested.
 */
function archOf(i: number, n: number, turned: boolean, b: Binding) {
  if (i === 0 || i === n - 1) return 0;
  const below = turned ? i - 1 : n - 2 - i; // paper leaves under it
  return b.arch * Math.min(1, (below + 1) / ARCH_RAMP);
}

function stacked(i: number, n: number, turned: boolean, paper: number, b: Binding) {
  const self = (i === 0 || i === n - 1 ? b.coverT : paper) / 2;
  // Right stack: everything after i is under it. Left: everything before.
  const covers = turned ? (i > 0 ? 1 : 0) : i < n - 1 ? 1 : 0;
  const papers = turned ? Math.max(0, i - 1) : Math.max(0, n - 2 - i);
  return covers * b.coverT + papers * paper + self;
}

/** The book's thickness, closed. */
const bookThickness = (n: number, b: Binding) => 2 * b.coverT + (n - 2) * PITCH;

/* ---------- textures ---------- */

const PLACEHOLDER_TEXT =
  "A moment to observe and report the organization of a page in ways less " +
  "quantifiable: the deconstruction of spaces into their temporal and physical " +
  "attributes, transposing the built environment into a resource for invention, " +
  "a collection of thoughts and images from the periphery preserved as rendered " +
  "memories, a dialogue between the reader and the page as a compendium of ideas " +
  "and forms. Reassembling landscapes to create new terrain, improvising.";

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** A cover finish's color map, tiled into the outside covers' canvases. */
interface CoverFace {
  image: HTMLImageElement;
  /** Tiles per page height. */
  repeat: number;
  tint?: string;
  ink: string;
}

/**
 * A stand-in page: the covers and their insides in the cover stock (both
 * sides in the cover finish, if there is one), and inner pages laid out
 * like the reference zines (a headline, a picture, or two text columns)
 * with a folio, or plain paper if `blank`. Margins are mirrored so the
 * inner one is always on the spine side.
 */
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  page: number,
  last: number,
  paper: string,
  cover: string,
  face: CoverFace | null,
  blank: boolean,
) {
  const spineLeft = page % 2 === 0; // fronts (even index) hinge on their left edge
  const inner = w * 0.1;
  const outer = w * 0.08;
  const left = spineLeft ? inner : outer;
  const right = w - (spineLeft ? outer : inner);
  const top = h * 0.06;
  const ink = "#1d1c1a";
  const sans = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  ctx.textBaseline = "top";

  if (page === 0 || page === 1 || page === last - 1 || page === last) {
    const outside = page === 0 || page === last;
    ctx.fillStyle = cover;
    ctx.fillRect(0, 0, w, h);
    if (face) {
      const pattern = ctx.createPattern(face.image, "repeat")!;
      pattern.setTransform(new DOMMatrix().scale(h / face.repeat / face.image.naturalHeight));
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
      if (face.tint) {
        ctx.globalCompositeOperation = "multiply";
        ctx.fillStyle = face.tint;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }
    }
    ctx.fillStyle = face && outside ? face.ink : ink;
    if (page === 0) {
      ctx.font = `${w * 0.026}px ${sans}`;
      ctx.fillText("Vol. 1", left, top);
      ctx.font = `${w * 0.11}px ${sans}`;
      ctx.fillText("About", left, top + w * 0.05);
    } else if (page === last) {
      ctx.font = `${w * 0.022}px ${sans}`;
      ctx.fillText("aagh.site", w - inner - ctx.measureText("aagh.site").width, h - h * 0.07);
    }
    return;
  }

  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, w, h);
  if (blank) return;
  ctx.fillStyle = ink;
  const kind = ["headline", "text", "picture", "text"][page % 4];
  if (kind === "headline") {
    ctx.font = `${w * 0.024}px ${sans}`;
    ctx.fillText(`Prompt ${page}—B`, left, top);
    ctx.font = `${w * 0.085}px ${sans}`;
    wrap(ctx, "How do we view and represent concepts of space?", right - left).forEach((l, i) =>
      ctx.fillText(l, left, top + w * 0.06 + i * w * 0.092),
    );
  } else if (kind === "picture") {
    ctx.fillStyle = "#b9b6ae";
    ctx.fillRect(left, top, right - left, (right - left) * 0.75);
    ctx.fillStyle = ink;
    ctx.font = `italic ${w * 0.022}px ${sans}`;
    ctx.fillText("(img. 29) Passages, risograph, 10.5×15 cm", left, top + (right - left) * 0.75 + w * 0.02);
  } else {
    const gap = w * 0.04;
    const colW = (right - left - gap) / 2;
    ctx.font = `${w * 0.028}px ${sans}`;
    const lines = wrap(ctx, `${PLACEHOLDER_TEXT} ${PLACEHOLDER_TEXT}`, colW);
    const lead = w * 0.038;
    const split = Math.ceil(lines.length / 2);
    lines.forEach((l, i) => {
      const col = i < split ? 0 : 1;
      ctx.fillText(l, left + col * (colW + gap), top + (col ? i - split : i) * lead);
    });
  }
  ctx.font = `${w * 0.02}px ${sans}`;
  ctx.textAlign = spineLeft ? "right" : "left";
  ctx.fillText(String(page + 1), spineLeft ? right : left, h - h * 0.05);
  ctx.textAlign = "left";
}

/**
 * Grain multiplied over the page; on inner pages, a soft shadow along the
 * spine and a hairline of shade on the fore-edge. The grain doesn't tile,
 * so it's scaled to cover the page, shifted and mirrored by page number so
 * neighbouring pages don't match.
 */
function finishPage(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  page: number,
  last: number,
  grain: boolean,
  b: Binding,
) {
  const spineLeft = page % 2 === 0;
  const size = Math.max(w, h);
  if (grain) {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.55;
    if (page % 2) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(paperGrain(), ((page * 0.37) % 1) * (w - size), 0, size, size);
    ctx.restore();
  }

  // Spine-side x from the edge, mirrored on backs.
  const fromSpine = (d: number) => (spineLeft ? d : w - d);
  const band = (from: number, to: number, stops: [number, string][]) => {
    const x0 = fromSpine(from);
    const x1 = fromSpine(to);
    const gr = ctx.createLinearGradient(x0, 0, x1, 0);
    for (const [t, c] of stops) gr.addColorStop(t, c);
    ctx.fillStyle = gr;
    ctx.fillRect(Math.min(x0, x1), 0, Math.abs(x1 - x0), h);
  };

  // The cover's joint: the pressed groove a little in from the spine where
  // the board folds. A shadow on the spine side of the dip and a catch of
  // light on the far side read as an indentation; faint on the inside.
  if (page < 2 || page > last - 2) {
    const outside = page === 0 || page === last;
    const at = w * 0.045;
    const half = w * 0.006;
    const dark = outside ? 0.32 : 0.12;
    const light = outside ? 0.28 : 0.1;
    band(at - half, at, [
      [0, "rgba(30,20,8,0)"],
      [1, `rgba(30,20,8,${dark})`],
    ]);
    band(at, at + half, [
      [0, `rgba(255,248,232,${light})`],
      [1, "rgba(255,248,232,0)"],
    ]);
    if (outside) return;
  }

  const reach = w * b.gutterWidth;
  const g = ctx.createLinearGradient(spineLeft ? 0 : w, 0, spineLeft ? reach : w - reach, 0);
  g.addColorStop(0, `rgba(40,30,18,${0.28 * b.gutterShade})`);
  g.addColorStop(0.35, `rgba(40,30,18,${0.08 * b.gutterShade})`);
  g.addColorStop(1, "rgba(40,30,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const edge = w * 0.006;
  const e = ctx.createLinearGradient(spineLeft ? w : 0, 0, spineLeft ? w - edge : edge, 0);
  e.addColorStop(0, "rgba(30,22,12,0.22)");
  e.addColorStop(1, "rgba(30,22,12,0)");
  ctx.fillStyle = e;
  ctx.fillRect(spineLeft ? w - edge : 0, 0, edge, h);

  // Where the pages are sewn in: a hard, dark crease right at the fold.
  band(0, w * 0.022, [
    [0, `rgba(22,14,6,${0.55 * b.crease})`],
    [0.4, `rgba(22,14,6,${0.18 * b.crease})`],
    [1, "rgba(22,14,6,0)"],
  ]);
}

interface TextureOptions {
  sources: PageSource[];
  pageCount: number;
  aspect: number;
  paperColors: Record<number, string>;
  coverColor: string;
  coverFace: CoverFace | null;
  blank: boolean;
  binding: Binding;
  gl: THREE.WebGLRenderer;
  invalidate: () => void;
}

/** Freed page canvases held for reuse, and page images held decoded. */
const SPARE_CANVASES = 32;
const CACHED_IMAGES = 64;

/** Drops a canvas's pixels now rather than whenever it's collected. */
function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = canvas.height = 0;
}

/**
 * Page textures, made on demand: a book this long can't hold every page on
 * the GPU, so only pages near the open spread exist, and `keep` throws the
 * rest away. An image page is painted in when it arrives.
 *
 * Flipping fast makes and drops pages faster than the browser collects
 * canvases, and past its canvas memory cap new pages come out blank, so
 * dropped canvases are reused. Images keep loading after their page is
 * dropped, so a page flipped past and back finds its image ready.
 */
class PageTextures {
  private made = new Map<number, THREE.Texture>();
  private spare: HTMLCanvasElement[] = [];
  private images = new Map<string, HTMLImageElement>();
  private anisotropy: number;
  constructor(private o: TextureOptions) {
    this.anisotropy = o.gl.capabilities.getMaxAnisotropy();
  }

  get(page: number) {
    let tex = this.made.get(page);
    if (!tex) {
      tex = this.make(page);
      this.made.set(page, tex);
    }
    return tex;
  }

  keep(wanted: (page: number) => boolean) {
    for (const [page, tex] of this.made) {
      if (wanted(page)) continue;
      tex.dispose();
      this.made.delete(page);
      const canvas = tex.image as HTMLCanvasElement;
      if (this.spare.length < SPARE_CANVASES) this.spare.push(canvas);
      else releaseCanvas(canvas);
    }
  }

  dispose() {
    this.keep(() => false);
    this.spare.forEach(releaseCanvas);
    this.spare = [];
    this.images.clear();
  }

  /** The image for a src, loading or loaded; the oldest are let go past CACHED_IMAGES. */
  private image(src: string) {
    let img = this.images.get(src);
    if (img) {
      this.images.delete(src); // re-added below as the newest
    } else {
      img = new Image();
      img.decoding = "async";
      img.src = src;
    }
    this.images.set(src, img);
    if (this.images.size > CACHED_IMAGES) this.images.delete(this.images.keys().next().value!);
    return img;
  }

  private make(page: number) {
    const {
      sources,
      pageCount,
      aspect,
      paperColors,
      coverColor,
      coverFace,
      blank,
      binding,
      gl,
      invalidate,
    } = this.o;
    const last = pageCount - 1;
    // The finish has its own surface: no paper grain on either side of a cover.
    const grain = !coverFace || (page > 1 && page < last - 1);
    const canvas = this.spare.pop() ?? document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.anisotropy;
    const paint = (w: number, h: number, draw: () => void) => {
      canvas.width = w;
      canvas.height = h;
      draw();
      finishPage(ctx, w, h, page, last, grain, binding);
      tex.needsUpdate = true;
      gl.initTexture(tex);
      invalidate();
    };
    const src = sources[page];
    const img = src ? this.image(src) : null;
    const paintImage = (img: HTMLImageElement) => {
      const scale = Math.min(1, TEXTURE_MAX / Math.max(img.naturalWidth, img.naturalHeight));
      const iw = Math.round(img.naturalWidth * scale);
      const ih = Math.round(img.naturalHeight * scale);
      paint(iw, ih, () => ctx.drawImage(img, 0, 0, iw, ih));
    };
    if (img?.complete && img.naturalWidth) {
      paintImage(img);
      return tex;
    }

    const w = PLACEHOLDER_WIDTH;
    const h = Math.round(w / aspect);
    paint(w, h, () =>
      drawPlaceholder(
        ctx,
        w,
        h,
        page,
        last,
        paperColors[page] ?? "#f6f4ee",
        coverColor,
        coverFace,
        blank,
      ),
    );

    img?.addEventListener(
      "load",
      () => {
        if (this.made.get(page) === tex) paintImage(img); // not thrown away while loading
      },
      { once: true },
    );
    return tex;
  }
}

/**
 * Page lines for the blocks' edges: two rows per leaf, a light one and a
 * slightly darker one. At a normal size a row is under a pixel, so a slow
 * drift in tone on top is what actually shows, the way the edge of a real
 * text block varies a little from signature to signature.
 */
const EDGE_ROWS = 256;
const ROWS_PER_LEAF = 2;
function makeEdgeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = EDGE_ROWS;
  const ctx = canvas.getContext("2d")!;
  for (let y = 0; y < EDGE_ROWS; y++) {
    const drift = Math.sin((y / EDGE_ROWS) * Math.PI * 6) * 5 + Math.sin((y / EDGE_ROWS) * Math.PI * 22) * 3;
    const v = (y % ROWS_PER_LEAF === 0 ? 250 : 228) + drift + (Math.random() - 0.5) * 8;
    ctx.fillStyle = `rgb(${v},${v - 3},${v - 10})`;
    ctx.fillRect(0, y, 4, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** The grain again, as a bump map, so light catches the paper's tooth. */
function useGrainBump(aspect: number) {
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(paperGrain());
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(aspect, 1); // less than one grain across, so no seam
    return t;
  }, [aspect]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/** A cover finish, loaded: its color map for the page canvases, the rest for the material. */
interface CoverFinish {
  spec: CoverMaterial;
  face: CoverFace;
  normal: THREE.Texture;
  roughness: THREE.Texture;
  metalness: THREE.Texture | null;
  env: THREE.Texture;
}

/** Loads a cover finish's maps; null until they're in (the cover stays plain stock till then). */
function useCoverFinish(name: CoverMaterialName | undefined, aspect: number) {
  const gl = useThree((s) => s.gl);
  const [finish, setFinish] = useState<CoverFinish | null>(null);

  // A soft studio to reflect, for the cover only: metal reads as metal by
  // what it reflects, and the pages keep their plain lighting.
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);

  useEffect(() => {
    setFinish(null);
    if (!name) return;
    const spec = COVER_MATERIALS[name];
    const base = `/textures/covers/${spec.dir}/`;
    const loader = new THREE.TextureLoader();
    const map = (file: string) =>
      loader.loadAsync(base + file).then((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(spec.repeat * aspect, spec.repeat);
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
        return t;
      });
    let alive = true;
    let loaded: THREE.Texture[] = [];
    Promise.all([
      new THREE.ImageLoader().loadAsync(base + "color.jpg"),
      map("normal.jpg"),
      map("roughness.jpg"),
      spec.metalnessMap ? map("metalness.jpg") : null,
    ]).then(([image, normal, roughness, metalness]) => {
      loaded = [normal, roughness, ...(metalness ? [metalness] : [])];
      if (!alive) return loaded.forEach((t) => t.dispose());
      const face = { image, repeat: spec.repeat, tint: spec.tint, ink: spec.ink };
      setFinish({ spec, face, normal, roughness, metalness, env });
    });
    return () => {
      alive = false;
      loaded.forEach((t) => t.dispose());
    };
  }, [name, aspect, gl, env]);

  return finish;
}

/** A side of a cover: the page canvas (printing on the finish) with the finish's surface. */
function coverFaceMaterial(map: THREE.Texture, f: CoverFinish) {
  const s = f.spec;
  const n = s.normalScale ?? 1;
  return new THREE.MeshPhysicalMaterial({
    map,
    normalMap: f.normal,
    normalScale: new THREE.Vector2(n, n),
    roughness: s.roughness,
    roughnessMap: f.roughness,
    metalness: s.metalness ?? 0,
    metalnessMap: f.metalness,
    sheen: s.sheen ?? 0,
    sheenColor: s.sheenColor ?? "#ffffff",
    sheenRoughness: 0.8,
    anisotropy: s.anisotropy ?? 0,
    clearcoat: s.clearcoat ?? 0,
    clearcoatRoughness: s.clearcoatRoughness ?? 0,
    envMap: f.env,
    envMapIntensity: s.envIntensity ?? 0,
  });
}

/* ---------- scene ---------- */

interface LeafProps {
  index: number;
  leafCount: number;
  turned: boolean;
  /** Leaves above it in its stack. */
  depth: number;
  /** 1 while the book lies open, 0 closed; eased by the scene. */
  openness: RefObject<number>;
  front: THREE.Texture;
  back: THREE.Texture;
  bump: THREE.Texture;
  coverColor: string;
  finish: CoverFinish | null;
  width: number;
  binding: Binding;
  reducedMotion: boolean;
}

function Leaf({
  index,
  leafCount,
  turned,
  depth,
  openness,
  front,
  back,
  bump,
  coverColor,
  finish,
  width,
  binding: b,
  reducedMotion,
}: LeafProps) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const isCover = index === 0 || index === leafCount - 1;
  const target = {
    rot: turned ? -Math.PI : 0,
    height: heightOf(index, leafCount, turned, b),
    spine: spineOf(index, leafCount, turned, b),
    arch: archOf(index, leafCount, turned, b),
    hinge: hingeX(index, leafCount, b, turned),
    depth,
  };
  const anim = useRef({ ...target });
  // Where it rests on each side, for holding it clear while it turns.
  const contact = useMemo<Contact>(
    () => ({
      rot: 0,
      z: 0,
      right: { x: new Float32Array(SEGMENTS + 1), z: new Float32Array(SEGMENTS + 1) },
      left: { x: new Float32Array(SEGMENTS + 1), z: new Float32Array(SEGMENTS + 1) },
    }),
    [],
  );
  const shaped = useRef({ lift: NaN, curl: NaN, reach: NaN, arch: NaN });

  // Covers reach a little past the pages, framing the block.
  const leafW = isCover ? width + b.overhang : width;
  const { geometry, restPos } = useMemo(() => {
    const h = isCover ? PAGE_HEIGHT + 2 * b.overhang : PAGE_HEIGHT;
    const g = new THREE.BoxGeometry(leafW, h, isCover ? b.coverT : LEAF_T, SEGMENTS);
    g.translate(leafW / 2, 0, 0); // hinge on the left edge = spine
    return { geometry: g, restPos: Float32Array.from(g.attributes.position.array) };
  }, [leafW, isCover, b]);

  // BoxGeometry material order: +x, -x, +y, -y, +z (front), -z (back).
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({
      color: isCover ? (finish?.spec.edge ?? coverColor) : PAGE_EDGE,
      roughness: 0.95,
    });
    const face = (map: THREE.Texture) =>
      new THREE.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 0.6, roughness: 0.9 });
    // A finished cover is the finish on both sides, so it doesn't open onto bare board.
    const side = (map: THREE.Texture) =>
      finish && isCover ? coverFaceMaterial(map, finish) : face(map);
    return [edge, edge, edge, edge, side(front), side(back)];
  }, [front, back, bump, isCover, coverColor, finish, index]);

  // Separate cleanups: a cover's materials are rebuilt when its finish
  // loads, and that mustn't throw away the geometry it's still drawn with.
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => new Set(materials).forEach((m) => m.dispose()), [materials]);

  useLayoutEffect(() => {
    ref.current?.rotation.set(0, target.rot, 0);
  }, []);
  useEffect(() => invalidate(), [turned, invalidate]);

  useFrame((_, frameDelta) => {
    const g = ref.current;
    if (!g) return;
    const delta = Math.min(frameDelta, MAX_FRAME_DELTA);
    const a = anim.current;
    const damp = (from: number, to: number) =>
      reducedMotion ? to : THREE.MathUtils.damp(from, to, FLIP_SPEED, delta);
    a.rot = damp(a.rot, target.rot);
    a.height = damp(a.height, target.height);
    a.spine = damp(a.spine, target.spine);
    a.arch = damp(a.arch, target.arch);
    a.hinge = damp(a.hinge, target.hinge);
    a.depth = damp(a.depth, target.depth);
    const flipping = Math.abs(a.rot - target.rot) > 1e-3;
    if (!flipping) {
      a.rot = target.rot;
      a.height = target.height;
      a.spine = target.spine;
      a.arch = target.arch;
      a.hinge = target.hinge;
    }
    if (Math.abs(a.depth - target.depth) < 1e-3) a.depth = target.depth;
    else invalidate();
    g.rotation.y = a.rot;

    const open = openness.current;
    const r = rest(a.height, a.spine, open, leafW);
    const reach = leafW + open * a.depth * FAN;
    // Closed, a flat spine stands on edge and every leaf meets it at the fold.
    g.position.x = open * a.hinge;
    g.position.z = r.z;
    // Lift toward the viewer (+z) on either side: turned leaves face the
    // other way, so their lift flips sign through the turn.
    const lift = Math.cos(a.rot) * r.lift;
    // The swoop flips with the lift, and flattens out mid-turn.
    const arch = Math.cos(a.rot) * open * a.arch;
    const trailing = Math.sign(a.rot - target.rot);
    // A board cover turns stiff, without the paper's curl; card bends a little less than paper.
    const curl =
      flipping && !reducedMotion
        ? ((isCover ? b.coverCurl : 1) * trailing * BEND * Math.sin(-a.rot)) / (leafW * leafW)
        : 0;

    // Written as !(≤) so the first frame, when nothing's shaped yet (NaN),
    // counts as a change.
    const s = shaped.current;
    if (
      !(Math.abs(s.lift - lift) <= 1e-6) ||
      !(Math.abs(s.curl - curl) <= 1e-5) ||
      !(Math.abs(s.reach - reach) <= 1e-6) ||
      !(Math.abs(s.arch - arch) <= 1e-6)
    ) {
      let hold: Contact | undefined;
      if (flipping && !reducedMotion) {
        // Its resting surface on each side: on top of whatever's under it there.
        for (const [side, onLeft] of [
          [contact.right, false],
          [contact.left, true],
        ] as const) {
          const rs = rest(
            heightOf(index, leafCount, onLeft, b),
            spineOf(index, leafCount, onLeft, b),
            open,
            leafW,
          );
          trace(
            rs.lift,
            0,
            leafW,
            side.x,
            side.z,
            scratchSlope,
            rs.z,
            open * archOf(index, leafCount, onLeft, b),
          );
        }
        contact.rot = a.rot;
        contact.z = r.z;
        hold = contact;
      }
      shapeLeaf(geometry, restPos, leafW, lift, curl, reach, arch, hold);
      s.lift = lift;
      s.curl = curl;
      s.reach = reach;
      s.arch = arch;
      invalidate();
    }
    // The loop renders on demand: keep asking for frames until the turn lands.
    if (flipping) invalidate();
    // A page in mid-air shouldn't throw a shadow; resting pages still do.
    if (meshRef.current) meshRef.current.castShadow = !flipping;
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} geometry={geometry} material={materials} castShadow receiveShadow />
    </group>
  );
}

const bx = new Float32Array(SEGMENTS + 1);
const bz = new Float32Array(SEGMENTS + 1);
const tx = new Float32Array(SEGMENTS + 1);
const tz = new Float32Array(SEGMENTS + 1);

interface BlockProps {
  /** Paper leaves [from, to) that the block stands in for. */
  from: number;
  to: number;
  /** Leaves above its top and above its lowest leaf, for the fanned edge. */
  topDepth: number;
  bottomDepth: number;
  leafCount: number;
  side: "left" | "right";
  openness: RefObject<number>;
  edges: THREE.Texture;
  width: number;
  binding: Binding;
}

/**
 * The pages a side holds beyond the real leaves, as one solid: a slab
 * between the surface its lowest leaf rests on and the top of its highest,
 * each curving out of the gutter like a leaf would, from where that leaf
 * meets the spine. Its top is plain paper
 * (always under a real leaf); the head, tail and fore-edge show the page
 * lines, squeezed together toward the spine where the pages converge.
 */
function PageBlock({
  from,
  to,
  topDepth,
  bottomDepth,
  leafCount,
  side,
  openness,
  edges,
  width,
  binding: b,
}: BlockProps) {
  const invalidate = useThree((s) => s.invalidate);
  const count = to - from;
  const turned = side === "left";
  // Bottom: the top of whatever's under the block. Top: its highest leaf's top.
  const lowest = turned ? from : to - 1;
  const highest = turned ? to - 1 : from;
  const bottom = heightOf(lowest, leafCount, turned, b) - PITCH / 2;
  const top = heightOf(highest, leafCount, turned, b) + PITCH / 2;
  const bottomSpine = spineOf(lowest, leafCount, turned, b) - (PITCH * b.spineRatio) / 2;
  const topArch = archOf(highest, leafCount, turned, b);
  const topSpine = spineOf(highest, leafCount, turned, b) + (PITCH * b.spineRatio) / 2;
  // In the block's own space, which the left side mirrors.
  const mirror = turned ? -1 : 1;
  const bottomHinge = mirror * hingeX(lowest, leafCount, b, turned);
  const topHinge = mirror * hingeX(highest, leafCount, b, turned);

  const cols = SEGMENTS + 1;
  const geometry = useMemo(() => {
    // Vertices: top surface (2 rows), head and tail (bottom/top rows each),
    // fore-edge (4). Positions are filled in per frame.
    const g = new THREE.BufferGeometry();
    const verts = 6 * cols + 4;
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(verts * 3), 3));
    g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(verts * 2), 2));
    const idx: number[] = [];
    const strip = (o: number) => {
      for (let i = 0; i < SEGMENTS; i++) {
        const a = o + i;
        const b = o + i + 1;
        const c = o + cols + i + 1;
        const d = o + cols + i;
        idx.push(a, b, c, a, c, d);
      }
    };
    strip(0);
    const topCount = idx.length;
    strip(2 * cols);
    strip(4 * cols);
    const f = 6 * cols;
    idx.push(f, f + 1, f + 3, f, f + 3, f + 2);
    g.setIndex(idx);
    g.addGroup(0, topCount, 0);
    g.addGroup(topCount, idx.length - topCount, 1);
    return g;
  }, [cols]);

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: PAGE_EDGE, roughness: 0.9, side: THREE.DoubleSide }),
      // The edges mostly face away from the light; a little glow of their
      // own keeps them reading as cream paper rather than grey.
      new THREE.MeshStandardMaterial({
        map: edges,
        emissive: "#5a554c",
        emissiveMap: edges,
        roughness: 0.95,
        side: THREE.DoubleSide,
      }),
    ],
    [edges],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  const shaped = useRef({
    open: NaN,
    bottom: NaN,
    top: NaN,
    topDepth: NaN,
    bottomDepth: NaN,
    topArch: NaN,
  });

  useFrame(() => {
    const open = openness.current;
    const s = shaped.current;
    if (
      Math.abs(s.open - open) < 1e-5 &&
      s.bottom === bottom &&
      s.top === top &&
      s.topDepth === topDepth &&
      s.bottomDepth === bottomDepth &&
      s.topArch === topArch
    )
      return;
    s.open = open;
    s.bottom = bottom;
    s.top = top;
    s.topDepth = topDepth;
    s.bottomDepth = bottomDepth;
    s.topArch = topArch;

    // The lowest leaf reaches furthest, so the fore-edge leans out and
    // shows its page lines from above.
    const rb = rest(bottom, bottomSpine, open, width);
    const rt = rest(top, topSpine, open, width);
    // The bottom lies on the flat cover; the top arches like its highest leaf.
    trace(rb.lift, 0, width + open * bottomDepth * FAN, bx, bz, ca, rb.z);
    trace(rt.lift, 0, width + open * topDepth * FAN, tx, tz, ca, rt.z, open * topArch);
    for (let i = 0; i < cols; i++) {
      bx[i] += open * bottomHinge;
      tx[i] += open * topHinge;
    }
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const uv = geometry.attributes.uv as THREE.BufferAttribute;
    const lines = (count * ROWS_PER_LEAF) / EDGE_ROWS; // texture repeats over the block's height
    const h = PAGE_HEIGHT / 2;
    for (let i = 0; i < cols; i++) {
      const u = i / SEGMENTS;
      pos.setXYZ(i, tx[i], -h, tz[i]);
      pos.setXYZ(cols + i, tx[i], h, tz[i]);
      uv.setXY(i, u, 0);
      uv.setXY(cols + i, u, 1);
      for (const [o, y] of [
        [2 * cols, h],
        [4 * cols, -h],
      ]) {
        pos.setXYZ(o + i, bx[i], y, bz[i]);
        pos.setXYZ(o + cols + i, tx[i], y, tz[i]);
        uv.setXY(o + i, u, 0);
        uv.setXY(o + cols + i, u, lines);
      }
    }
    const f = 6 * cols;
    const e = SEGMENTS;
    pos.setXYZ(f, bx[e], -h, bz[e]);
    pos.setXYZ(f + 1, bx[e], h, bz[e]);
    pos.setXYZ(f + 2, tx[e], -h, tz[e]);
    pos.setXYZ(f + 3, tx[e], h, tz[e]);
    uv.setXY(f, 0, 0);
    uv.setXY(f + 1, 1, 0);
    uv.setXY(f + 2, 0, lines);
    uv.setXY(f + 3, 1, lines);
    pos.needsUpdate = true;
    uv.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    invalidate();
  });

  if (count <= 0) return null;
  // The left block is the right one mirrored across the spine.
  return (
    <mesh
      geometry={geometry}
      material={materials}
      scale-x={turned ? -1 : 1}
      castShadow
      receiveShadow
    />
  );
}

/**
 * How tall the spine strip stands: up to just under where the lowest top
 * leaf of the open spread meets the spine, so it only shows in the gaps at
 * the head and tail of the gutter.
 */
function spineStripHeight(turned: number, n: number, b: Binding) {
  if (turned <= 0 || turned >= n) return 0;
  return Math.min(spineOf(turned - 1, n, true, b), spineOf(turned, n, false, b)) - LEAF_T;
}

/**
 * The cover's spine, seen at the head and tail of the gutter when the book
 * is open: a narrow strip of the cover stock, darkened where it's turned in,
 * standing under the fold the pages are sewn into. It follows the book as
 * it slides and sinks away as the book closes.
 */
function SpineStrip({
  openness,
  height,
  coverColor,
  bookRef,
  binding: b,
}: {
  openness: RefObject<number>;
  height: number;
  coverColor: string;
  bookRef: RefObject<THREE.Group | null>;
  binding: Binding;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const color = useMemo(() => new THREE.Color(coverColor).multiplyScalar(0.55), [coverColor]);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const open = openness.current;
    const h = Math.max(1e-5, height * open);
    m.scale.set(1, 1, h);
    m.position.set(bookRef.current?.position.x ?? 0, 0, h / 2);
    m.visible = open > 0.01;
  });
  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[SPINE_STRIP, PAGE_HEIGHT + 2 * b.overhang, 1]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}

/**
 * A paperback's flat spine: a strip of the cover card as wide as the book
 * is thick. Closed, it stands on edge against the fold; open, it lies flat
 * under the gutter, the leaves glued across it (see hingeX).
 */
function FlatSpine({
  openness,
  thickness,
  coverColor,
  bookRef,
  binding: b,
}: {
  openness: RefObject<number>;
  thickness: number;
  coverColor: string;
  bookRef: RefObject<THREE.Group | null>;
  binding: Binding;
}) {
  const ref = useRef<THREE.Mesh>(null);
  // BoxGeometry material order: +x, -x, +y, -y, +z, -z. Down the gutter,
  // between the two pages of the spread, what shows is the top: the glued
  // back of the text block, deep in the fold's shadow, not the cover.
  const materials = useMemo(() => {
    const card = new THREE.MeshStandardMaterial({ color: coverColor, roughness: 0.9 });
    const glued = new THREE.MeshStandardMaterial({
      color: new THREE.Color(PAGE_EDGE).multiplyScalar(0.3),
      roughness: 0.95,
    });
    return [card, card, card, card, glued, card];
  }, [coverColor]);
  useEffect(() => () => new Set(materials).forEach((m) => m.dispose()), [materials]);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const open = openness.current;
    const w = THREE.MathUtils.lerp(b.coverT, thickness, open);
    const h = THREE.MathUtils.lerp(thickness, b.coverT, open);
    m.scale.set(w, 1, h);
    m.position.set((bookRef.current?.position.x ?? 0) - ((1 - open) * b.coverT) / 2, 0, h / 2);
  });
  return (
    <mesh ref={ref} material={materials} castShadow receiveShadow>
      <boxGeometry args={[1, PAGE_HEIGHT + 2 * b.overhang, 1]} />
    </mesh>
  );
}

/**
 * One pixel of line down the middle of the gutter, where the two open
 * pages meet: a WebGL line stays a pixel wide at any distance. Just above
 * the pages there, so they don't hide it; it fades out as the book closes.
 */
function FoldLine({
  openness,
  x,
  z,
  color,
}: {
  openness: RefObject<number>;
  x: number;
  z: number;
  color: string;
}) {
  const ref = useRef<THREE.LineSegments>(null);
  const geometry = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -PAGE_HEIGHT / 2, 0),
        new THREE.Vector3(0, PAGE_HEIGHT / 2, 0),
      ]),
    [],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    const l = ref.current;
    if (!l) return;
    const open = openness.current;
    l.position.set(x, 0, z * open);
    (l.material as THREE.LineBasicMaterial).opacity = open;
    l.visible = open > 0.01;
  });
  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color={color} transparent />
    </lineSegments>
  );
}

interface SceneProps {
  sources: PageSource[];
  pageCount: number;
  aspect: number;
  turnedCount: number;
  paperColors: Record<number, string>;
  coverColor: string;
  coverMaterial?: CoverMaterialName;
  blank: boolean;
  binding: Binding;
  reducedMotion: boolean;
}

function ZineScene({
  sources,
  pageCount,
  aspect,
  turnedCount,
  paperColors,
  coverColor,
  coverMaterial,
  blank,
  binding: b,
  reducedMotion,
}: SceneProps) {
  const { gl, invalidate } = useThree();
  const leafCount = pageCount / 2;
  const width = PAGE_HEIGHT * aspect;
  const isOpen = turnedCount > 0 && turnedCount < leafCount;
  const bookRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const openness = useRef(isOpen ? 1 : 0);
  const bump = useGrainBump(aspect);
  const edges = useMemo(makeEdgeTexture, []);
  useEffect(() => () => edges.dispose(), [edges]);

  const finish = useCoverFinish(coverMaterial, aspect);
  const coverFace = finish?.face ?? null;
  const textures = useMemo(
    () =>
      new PageTextures({
        sources,
        pageCount,
        aspect,
        paperColors,
        coverColor,
        coverFace,
        blank,
        binding: b,
        gl,
        invalidate,
      }),
    [sources, pageCount, aspect, paperColors, coverColor, coverFace, blank, b, gl, invalidate],
  );
  useEffect(() => () => textures.dispose(), [textures]);

  // Real leaves: the covers, and paper leaves within WINDOW of the spread.
  const lo = Math.max(1, turnedCount - WINDOW);
  const hi = Math.min(leafCount - 1, turnedCount + WINDOW);
  const real = [0];
  for (let i = lo; i < hi; i++) real.push(i);
  if (leafCount > 1) real.push(leafCount - 1);

  // Once the spread moves on, drop textures well outside the window.
  useEffect(() => {
    const keepFrom = 2 * (lo - 2);
    const keepTo = 2 * (hi + 2);
    textures.keep((p) => p < 2 || p >= pageCount - 2 || (p >= keepFrom && p < keepTo));
  }, [textures, lo, hi, pageCount]);

  // No dragging: the canvas takes no pointer, so this only eases to the pose
  // and keeps the camera fitted to the open spread.
  const view = useRef<ViewState>(initialView());
  const noTarget = useRef<HTMLDivElement>(null);
  // Open, the lowest leaves fan out furthest: the cover under a whole side
  // reaches FAN per leaf above it past the page width (see Leaf's `reach`).
  // A flat spine also spreads the leaves up to half the book's thickness
  // either way, and the gutter can sit anywhere along it.
  const fitPoints = useMemo(() => {
    const t = bookThickness(leafCount, b);
    const reach = width + b.overhang + (leafCount - 1) * FAN + (b.flatSpine ? t : 0);
    return [
      ...rectCorners(reach * 2, PAGE_HEIGHT + 2 * b.overhang),
      ...rectCorners(reach * 2, PAGE_HEIGHT + 2 * b.overhang, t),
    ];
  }, [width, leafCount, b]);
  useTiltControls(tiltRef, view, {
    reducedMotion,
    fitPoints,
    fitMargin: FIT_MARGIN,
    eventTarget: noTarget,
    pose: b.pose,
    headroom: b.headroom,
  });
  useEffect(() => invalidate(), [turnedCount, invalidate]);

  // Center the closed book on screen; center the gutter when open.
  const targetX =
    turnedCount === 0
      ? -width / 2
      : turnedCount === leafCount
        ? width / 2
        : -hingeX(turnedCount - 0.5, leafCount, b);
  useLayoutEffect(() => {
    bookRef.current?.position.setX(targetX);
  }, []);

  useFrame((_, frameDelta) => {
    const g = bookRef.current;
    if (!g) return;
    const delta = Math.min(frameDelta, MAX_FRAME_DELTA);
    const to = isOpen ? 1 : 0;
    if (reducedMotion) {
      g.position.x = targetX;
      openness.current = to;
      return;
    }
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, FLIP_SPEED, delta);
    openness.current = THREE.MathUtils.damp(openness.current, to, FLIP_SPEED, delta);
    if (Math.abs(g.position.x - targetX) > 1e-4 || Math.abs(openness.current - to) > 1e-4) invalidate();
  });

  return (
    <>
      <StageLights />
      <group ref={tiltRef} rotation-x={b.pose.x}>
        <ShadowGround z={-0.001} />
        {b.flatSpine ? (
          <FlatSpine
            openness={openness}
            thickness={bookThickness(leafCount, b)}
            coverColor={coverColor}
            bookRef={bookRef}
            binding={b}
          />
        ) : (
          <SpineStrip
            openness={openness}
            height={spineStripHeight(turnedCount, leafCount, b)}
            coverColor={finish?.spec.edge ?? coverColor}
            bookRef={bookRef}
            binding={b}
          />
        )}
        <group ref={bookRef}>
          <PageBlock
            from={1}
            to={lo}
            topDepth={turnedCount - lo}
            bottomDepth={turnedCount - 2}
            leafCount={leafCount}
            side="left"
            openness={openness}
            edges={edges}
            width={width}
            binding={b}
          />
          <PageBlock
            from={hi}
            to={leafCount - 1}
            topDepth={hi - turnedCount}
            bottomDepth={leafCount - 2 - turnedCount}
            leafCount={leafCount}
            side="right"
            openness={openness}
            edges={edges}
            width={width}
            binding={b}
          />
          {b.foldLine && isOpen && (
            <FoldLine
              openness={openness}
              x={hingeX(turnedCount - 0.5, leafCount, b)}
              z={
                Math.max(
                  spineOf(turnedCount - 1, leafCount, true, b),
                  spineOf(turnedCount, leafCount, false, b),
                ) + LEAF_T
              }
              color={b.foldLine}
            />
          )}
          {real.map((i) => (
            <Leaf
              key={i}
              index={i}
              leafCount={leafCount}
              turned={i < turnedCount}
              depth={i < turnedCount ? turnedCount - 1 - i : i - turnedCount}
              openness={openness}
              front={textures.get(i * 2)}
              back={textures.get(i * 2 + 1)}
              bump={bump}
              coverColor={coverColor}
              finish={finish}
              width={width}
              binding={b}
              reducedMotion={reducedMotion}
            />
          ))}
        </group>
      </group>
    </>
  );
}

/* ---------- public component ---------- */

/* A jump across the book can't take a cover through the pages: the pages
   between land on the far side at once, while a cover is still in the air.
   So a cover turns on its own, onto a side holding no pages, and the pages
   jump only once it's down (or go first, when closing). */
const COVER_LANDS_MS = 650; // a turn at FLIP_SPEED is all but down by then

/** The next spread on the way from `from` leaves turned to `to`, of `n`. */
function stepToward(from: number, to: number, n: number) {
  if ((from === 0 && to > 1) || (from > 1 && to === 0)) return 1;
  if ((from === n && to < n - 1) || (from < n - 1 && to === n)) return n - 1;
  return to;
}

function flipsCover(from: number, to: number, n: number) {
  return (from === 0) !== (to === 0) || (from === n) !== (to === n);
}

export interface ZineBookProps {
  /** Total pages, covers included (rounded up to even, at least 4). */
  pageCount?: number;
  /** Page images (e.g. PNGs exported from Figma) by page index, 0 = front cover. Missing or `null` draws a stand-in page. */
  pages?: PageSource[];
  /** Accessible name for the book. */
  title?: string;
  /** Hardcover zine, or a paperback magazine seen from straight above. */
  binding?: BindingName;
  /** Width / height of a single page; the binding's if unset. */
  aspect?: number;
  /** CSS height of the stage; the book fills it. */
  height?: string;
  /** Table the book lies on; "auto" follows the site's light / dark theme, "none" shows the page behind. */
  backdrop?: keyof typeof BACKDROPS | "auto" | "none";
  /** Space kept clear above the book, e.g. for a fixed site header (px). */
  insetTop?: number;
  /** Cover stock, for the covers' edges and their stand-in pages; the binding's if unset. */
  coverColor?: string;
  /** Hardcover finish over the outside covers; plain cover stock if unset. Ignored by the magazine. */
  coverMaterial?: CoverMaterialName;
  /** Paper color for stand-in pages, by page index. */
  placeholderColors?: Record<number, string>;
  /** Stand-in pages left as plain paper instead of the mock zine layouts. */
  blank?: boolean;
  /** Page the book starts open at (0 = closed on the front cover). */
  startPage?: number;
  /** Page to turn to, numbered as printed (1 = front cover); the book turns there whenever it changes. */
  page?: number;
  /** The open spread's first page, numbered like `page`, each time the book turns. */
  onPageChange?: (page: number) => void;
}

const NO_PAGES: PageSource[] = [];
const NO_COLORS: Record<number, string> = {};

export default function ZineBook({
  pageCount = 240,
  pages = NO_PAGES,
  title = "Book",
  binding = "hardcover",
  aspect: aspectProp,
  height = "100svh",
  backdrop = "auto",
  insetTop = 60,
  coverColor: coverColorProp,
  coverMaterial,
  placeholderColors = NO_COLORS,
  blank = false,
  startPage = 0,
  page,
  onPageChange,
}: ZineBookProps) {
  const spec: Binding = BINDINGS[binding];
  const aspect = aspectProp ?? spec.aspect;
  const coverColor = coverColorProp ?? spec.coverColor;
  // A paperback is plain card.
  const finish = spec.flatSpine ? undefined : coverMaterial;
  const total = Math.max(4, Math.ceil(pageCount / 2) * 2);
  const leafCount = total / 2;
  // Opening at page n turns the leaf it's printed on the back of.
  const [turned, setTurned] = useState(() =>
    Math.min(Math.max(Math.floor((page ?? startPage) / 2), 0), leafCount),
  );
  useEffect(() => {
    if (page !== undefined) setTurned(Math.min(Math.max(Math.floor(page / 2), 0), leafCount));
  }, [page, leafCount]);
  const onPageChangeRef = useRef(onPageChange);
  onPageChangeRef.current = onPageChange;
  // Only turns made here are reported: echoing a turn to the `page` prop
  // back would race a fast-moving prop, the two trading stale pages forever.
  const reportTurn = useRef(true);
  useEffect(() => {
    if (!reportTurn.current) return;
    reportTurn.current = false;
    onPageChangeRef.current?.(turned === 0 ? 1 : turned === leafCount ? total : turned * 2);
  }, [turned, leafCount, total]);

  // What the scene shows chases `turned`, routing around the covers.
  const [shown, setShown] = useState(turned);
  const coverDownAt = useRef(0);
  useEffect(() => {
    if (shown === turned) return;
    const step = stepToward(shown, turned, leafCount);
    // A single leaf follows behind a turning cover on its own; a jump waits.
    const wait =
      Math.abs(step - shown) > 1 ? Math.max(0, coverDownAt.current - performance.now()) : 0;
    const id = setTimeout(() => {
      if (flipsCover(shown, step, leafCount)) coverDownAt.current = performance.now() + COVER_LANDS_MS;
      setShown(step);
    }, wait);
    return () => clearTimeout(id);
  }, [shown, turned, leafCount]);
  const stageRef = useRef<HTMLDivElement>(null);
  const ready = useNearViewport(stageRef, "1000px");
  // The arrow keys turn pages only while the book is actually on screen.
  const onScreen = useNearViewport(stageRef, "0px");
  const reducedMotion = usePrefersReducedMotion();
  const theme = useSiteTheme();
  const tone = backdrop === "auto" || backdrop === "none" ? theme : backdrop;

  const next = useCallback(() => {
    if (!ready) return;
    reportTurn.current = true;
    setTurned((t) => Math.min(t + 1, leafCount));
  }, [ready, leafCount]);
  const prev = useCallback(() => {
    if (!ready) return;
    reportTurn.current = true;
    setTurned((t) => Math.max(t - 1, 0));
  }, [ready]);

  useEffect(() => {
    if (!onScreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onScreen]);

  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) prev();
    else next();
  };

  const ink = BACKDROP_INK[tone];
  const btn =
    "rounded-full border border-current px-3 py-1 text-xs disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <section
      aria-label={title}
      className="relative w-full"
      style={{ height, background: backdrop === "none" ? undefined : BACKDROPS[tone] }}
    >
      {/* Click either half to turn. Keyboard and screen-reader users get
          the controls below, so the canvas itself is hidden. The canvas
          reaches the binding's headroom above the stage, past the header, so a turning
          leaf isn't clipped; it takes no pointer, so the header still works. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        onClick={onStageClick}
        className="absolute inset-x-0 cursor-pointer select-none"
        style={{ top: insetTop, bottom: 40 }}
      >
        {ready && (
          <Canvas
            frameloop="demand"
            shadows
            flat
            dpr={[1, 2]}
            camera={{ fov: 18, near: 0.1, far: 20, position: [0, 0, 3] }}
            style={{
              position: "absolute",
              inset: `-${spec.headroom * 100}% 0 0 0`,
              width: "auto",
              height: "auto",
              pointerEvents: "none",
            }}
          >
            <ZineScene
              sources={pages}
              pageCount={total}
              aspect={aspect}
              turnedCount={shown}
              paperColors={placeholderColors}
              coverColor={coverColor}
              coverMaterial={finish}
              blank={blank}
              binding={spec}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        )}
      </div>

      <div
        className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-3 opacity-70"
        style={{ color: ink }}
      >
        <button type="button" className={btn} onClick={prev} disabled={!ready || turned === 0}>
          ←
        </button>
        <p aria-live="polite" className="min-w-[16ch] text-center text-xs tabular-nums">
          {spreadLabel(turned, leafCount, total)}
        </p>
        <button type="button" className={btn} onClick={next} disabled={!ready || turned === leafCount}>
          →
        </button>
      </div>
    </section>
  );
}
