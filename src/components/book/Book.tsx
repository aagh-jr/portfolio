import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";
import { BOOK_PAGES, PAGE_ASPECT, type PageSource } from "./pages";
import {
  IDLE_POSE,
  MAX_FRAME_DELTA,
  ShadowGround,
  StageLights,
  VIEWER_BUTTON,
  initialView,
  rectCorners,
  useNearViewport,
  usePageTextures,
  usePrefersReducedMotion,
  useTiltControls,
  type Pose,
  type ViewState,
} from "./stage";

/* 3D book. Pages are thin boxes hinged on the spine (x = 0) that rotate
   0 → -π around Y when turned, curling slightly mid-flip. Dragging the
   canvas rotates the whole book; a plain click turns the page. */

const PAGE_HEIGHT = 1;
const SHEET_THICKNESS = 0.005;
const STACK_GAP = 0.006; // z spacing between stacked sheets, avoids z-fighting
const ANGLED_VIEW = THREE.MathUtils.degToRad(60); // "Rotate 60°" toggle turn
const BEND = 0.6; // radians the free edge trails the spine at mid-flip
const BEND_SEGMENTS = 24; // strips across the page width so it can curve
const FLIP_SPEED = 7; // damping lambda: higher = snappier
const FIT_MARGIN = 1.06; // breathing room between the book and the canvas edge
/* Spare canvas above the stage, as a fraction of its height: a page
   standing up mid-turn rises about this far past the top of the frame. */
const HEADROOM = 0.5;
/* Once the book is opened it turns to face the reader, barely leaned back. */
const READING_POSE: Pose = { x: THREE.MathUtils.degToRad(-5), y: 0, z: 0 };
/* ---------- scene ---------- */

/**
 * Curl a page geometry along x with constant curvature k (radians per unit
 * length). A point at distance x from the spine moves onto a circular arc;
 * its thickness offset z0 follows the arc's normal so the paper keeps its
 * thickness. k = 0 restores the flat page.
 */
function bendGeometry(geometry: THREE.BufferGeometry, rest: Float32Array, k: number) {
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = rest[i * 3];
    const z0 = rest[i * 3 + 2];
    if (Math.abs(k) < 1e-6) {
      pos.setXYZ(i, x, rest[i * 3 + 1], z0);
      continue;
    }
    const a = k * x;
    const sin = Math.sin(a);
    const cos = Math.cos(a);
    pos.setXYZ(i, sin / k + z0 * sin, rest[i * 3 + 1], -(1 - cos) / k + z0 * cos);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

interface SheetProps {
  index: number;
  sheetCount: number;
  turned: boolean;
  front: THREE.Texture;
  back: THREE.Texture;
  aspect: number;
  reducedMotion: boolean;
  flipSpeed: number;
}

function Sheet({
  index,
  sheetCount,
  turned,
  front,
  back,
  aspect,
  reducedMotion,
  flipSpeed,
}: SheetProps) {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const width = PAGE_HEIGHT * aspect;

  // Right stack: sheet 0 on top. Left stack: most recently turned on top.
  const targetRot = turned ? -Math.PI : 0;
  const targetZ = (turned ? index - (sheetCount - 1) : -index) * STACK_GAP;

  const { geometry, rest } = useMemo(() => {
    const g = new THREE.BoxGeometry(width, PAGE_HEIGHT, SHEET_THICKNESS, BEND_SEGMENTS);
    g.translate(width / 2, 0, 0); // hinge on the left edge = spine
    const rest = Float32Array.from(g.attributes.position.array);
    return { geometry: g, rest };
  }, [width]);
  const curvature = useRef(0);

  const setCurvature = (k: number) => {
    if (Math.abs(k - curvature.current) < 1e-4) return;
    curvature.current = k;
    bendGeometry(geometry, rest, k);
  };

  // BoxGeometry material order: +x, -x, +y, -y, +z (front), -z (back).
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: "#f4f1ea", roughness: 0.9 });
    const face = (map: THREE.Texture) =>
      new THREE.MeshStandardMaterial({ map, roughness: 0.85 });
    return [edge, edge, edge, edge, face(front), face(back)];
  }, [front, back]);

  useEffect(
    () => () => {
      geometry.dispose();
      new Set(materials).forEach((m) => m.dispose());
    },
    [geometry, materials],
  );

  // Start at rest on mount. Pose isn't passed as props: R3F would snap to
  // new prop values on re-render instead of letting useFrame animate.
  useLayoutEffect(() => {
    ref.current?.rotation.set(0, targetRot, 0);
    ref.current?.position.set(0, 0, targetZ);
  }, []);

  // Kick the demand-driven render loop whenever the target changes.
  useEffect(() => invalidate(), [targetRot, targetZ, invalidate]);

  useFrame((_, frameDelta) => {
    const g = ref.current;
    if (!g) return;
    const delta = Math.min(frameDelta, MAX_FRAME_DELTA);
    if (reducedMotion) {
      g.rotation.y = targetRot;
      g.position.z = targetZ;
      setCurvature(0);
      return;
    }
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRot, flipSpeed, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, flipSpeed, delta);
    const flipping = Math.abs(g.rotation.y - targetRot) > 1e-3;
    // A page in mid-air shouldn't throw a shadow; resting pages still do.
    if (meshRef.current) meshRef.current.castShadow = !flipping;
    if (flipping) {
      // Free edge trails the motion, strongest when the page stands upright
      // (sin of the angle) and flat again at both rest positions.
      const trailing = Math.sign(g.rotation.y - targetRot);
      setCurvature((trailing * BEND * Math.sin(-g.rotation.y)) / width);
      invalidate();
    } else {
      g.rotation.y = targetRot;
      g.position.z = targetZ;
      setCurvature(0);
    }
  });

  return (
    <group ref={ref}>
      <mesh ref={meshRef} geometry={geometry} material={materials} castShadow receiveShadow />
    </group>
  );
}

interface SceneProps {
  pages: PageSource[];
  aspect: number;
  turnedCount: number;
  angled: boolean;
  reducedMotion: boolean;
  view: RefObject<ViewState>;
  viewResets: number;
  stageRef: RefObject<HTMLDivElement | null>;
  onReady: (ready: boolean) => void;
  fitMargin?: number;
  headroom?: number;
  flipSpeed?: number;
}

/**
 * What the camera keeps in frame: the open spread. A turning page that
 * stands up off the table may brush the canvas edge mid-turn; that is the
 * trade for showing the book at a readable size.
 */
function bookFitPoints(pageW: number): THREE.Vector3[] {
  return rectCorners(pageW * 2, PAGE_HEIGHT);
}

function BookScene({
  pages,
  aspect,
  turnedCount,
  angled,
  reducedMotion,
  view,
  viewResets,
  stageRef,
  onReady,
  fitMargin = FIT_MARGIN,
  headroom = HEADROOM,
  flipSpeed = FLIP_SPEED,
}: SceneProps) {
  const textures = usePageTextures(pages, aspect, onReady);
  const sheetCount = pages.length / 2;
  const bookRef = useRef<THREE.Group>(null);
  const tiltRef = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const pageW = PAGE_HEIGHT * aspect;
  const fitPoints = useMemo(() => bookFitPoints(pageW), [pageW]);
  useTiltControls(tiltRef, view, {
    extraYaw: angled ? ANGLED_VIEW : 0,
    reducedMotion,
    fitPoints,
    fitMargin,
    headroom,
    eventTarget: stageRef,
    pose: turnedCount === 0 ? IDLE_POSE : READING_POSE,
  });
  useEffect(() => invalidate(), [viewResets, invalidate]);

  // Center the closed book on screen; center the spine when open.
  const targetX =
    turnedCount === 0 ? -pageW / 2 : turnedCount === sheetCount ? pageW / 2 : 0;

  useLayoutEffect(() => {
    bookRef.current?.position.setX(targetX);
  }, []);

  useEffect(() => invalidate(), [targetX, invalidate]);

  useFrame((_, frameDelta) => {
    const g = bookRef.current;
    if (!g) return;
    const delta = Math.min(frameDelta, MAX_FRAME_DELTA);
    if (reducedMotion) {
      g.position.x = targetX;
      return;
    }
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, flipSpeed, delta);
    if (Math.abs(g.position.x - targetX) > 1e-4) invalidate();
  });

  // Table surface just behind the bottom sheet; only shows the shadows.
  const groundZ = -(sheetCount * STACK_GAP) - SHEET_THICKNESS;

  return (
    <>
      <StageLights />
      <group ref={tiltRef} rotation-x={IDLE_POSE.x} rotation-y={IDLE_POSE.y} rotation-z={IDLE_POSE.z}>
        <ShadowGround z={groundZ} />
        <group ref={bookRef}>
          {Array.from({ length: sheetCount }, (_, i) => (
            <Sheet
              key={i}
              index={i}
              sheetCount={sheetCount}
              turned={i < turnedCount}
              front={textures[i * 2]}
              back={textures[i * 2 + 1]}
              aspect={aspect}
              reducedMotion={reducedMotion}
              flipSpeed={flipSpeed}
            />
          ))}
        </group>
      </group>
    </>
  );
}

/* ---------- public component ---------- */

export interface BookProps {
  /** Image paths in reading order; `null` renders a placeholder. */
  pages?: PageSource[];
  /** Accessible name for the book, e.g. the booklet title. */
  title?: string;
  /** CSS height of the 3D stage. */
  height?: string;
  /** Width / height of a single page. */
  aspect?: number;
}


export function spreadLabel(turned: number, sheetCount: number, pageCount: number) {
  if (turned === 0) return `Front cover, page 1 of ${pageCount}`;
  if (turned === sheetCount) return `Back cover, page ${pageCount} of ${pageCount}`;
  return `Pages ${turned * 2}–${turned * 2 + 1} of ${pageCount}`;
}

/* With several books on a page, arrow keys drive only the one last hovered
   or focused (the first mounted one until then). */
let activeBook: symbol | null = null;

export default function Book({
  pages = BOOK_PAGES,
  title = "Booklet",
  aspect = PAGE_ASPECT,
  height = "min(75vh, 720px)",
}: BookProps) {
  // Pad odd lists so every sheet has a front and a back.
  const evenPages = useMemo(
    () => (pages.length % 2 ? [...pages, null] : pages),
    [pages],
  );
  const sheetCount = evenPages.length / 2;
  const [turned, setTurned] = useState(0);
  const [angled, setAngled] = useState(false);
  const [viewResets, setViewResets] = useState(0);
  const view = useRef<ViewState>(initialView());
  const stageRef = useRef<HTMLDivElement>(null);
  // Mount well before the book scrolls into view, so its pages are loaded
  // by the time someone reaches it.
  const nearViewport = useNearViewport(stageRef, "1000px");
  const [texturesReady, setTexturesReady] = useState(false);
  // Hold the pages shut until every image is in: turning onto a page that's
  // still loading is what made the first flips stutter or skip.
  const ready = nearViewport && texturesReady;
  const reducedMotion = usePrefersReducedMotion();
  const bookId = useRef(Symbol("book"));
  const activate = () => {
    activeBook = bookId.current;
  };

  const resetView = () => {
    view.current.drag.identity();
    setAngled(false);
    setViewResets((n) => n + 1);
  };

  const next = useCallback(() => {
    if (ready) setTurned((t) => Math.min(t + 1, sheetCount));
  }, [ready, sheetCount]);
  const prev = useCallback(() => {
    if (ready) setTurned((t) => Math.max(t - 1, 0));
  }, [ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeBook !== bookId.current) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else return;
      e.preventDefault();
    };
    activeBook ??= bookId.current;
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (activeBook === bookId.current) activeBook = null;
    };
  }, [next, prev]);

  const onStageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (view.current.moved) return; // that press was a drag, not a click
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX < rect.left + rect.width / 2) prev();
    else next();
  };

  const btn = VIEWER_BUTTON;

  return (
    <section
      aria-label={title}
      className="flex flex-col items-center gap-4"
      onPointerEnter={activate}
      onFocus={activate}
    >
      {/* Mouse/touch target: click to turn, drag to rotate. Keyboard and
          screen-reader users get the buttons and live label below, so the
          canvas itself is hidden. pan-y keeps vertical swipes scrolling
          the page on touch screens. The canvas reaches HEADROOM above the
          stage so a turning page isn't clipped; that spare strip lets
          pointer events through to whatever sits underneath. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        onClick={onStageClick}
        className="relative w-full cursor-grab select-none active:cursor-grabbing"
        style={{ height, touchAction: "pan-y" }}
      >
        {nearViewport && (
          <Canvas
            frameloop="demand"
            shadows
            dpr={[1, 2]}
            camera={{ fov: 35, near: 0.1, far: 20, position: [0, 0, 3] }}
            style={{
              position: "absolute",
              inset: `calc(-${HEADROOM} * (${height})) 0 0 0`,
              width: "auto",
              height: "auto",
              pointerEvents: "none",
            }}
          >
            <BookScene
              pages={evenPages}
              aspect={aspect}
              turnedCount={turned}
              angled={angled}
              reducedMotion={reducedMotion}
              view={view}
              viewResets={viewResets}
              stageRef={stageRef}
              onReady={setTexturesReady}
            />
          </Canvas>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className={btn} onClick={prev} disabled={!ready || turned === 0}>
          ← Previous
        </button>
        <p aria-live="polite" className="min-w-[14ch] text-center text-sm tabular-nums">
          {ready ? spreadLabel(turned, sheetCount, evenPages.length) : "Loading pages…"}
        </p>
        <button type="button" className={btn} onClick={next} disabled={!ready || turned === sheetCount}>
          Next →
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className={`${btn} aria-pressed:bg-current/10`}
          aria-pressed={angled}
          onClick={() => setAngled((a) => !a)}
        >
          Rotate 60°
        </button>
        <button type="button" className={btn} onClick={resetView}>
          Reset view
        </button>
      </div>
    </section>
  );
}

/* ---------- thumbnail ---------- */

const THUMB_TURN_MS = 1500;
/* 20% gentler page turns than the case study's viewers. */
const THUMB_FLIP_SPEED = FLIP_SPEED * 0.8;

/** Renders nothing if its children throw, e.g. when WebGL is unavailable. */
class NoWebGL extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export interface BookThumbProps {
  pages: PageSource[];
  aspect?: number;
  /** Still of the closed book, shown until its pages have loaded. */
  poster: string;
  alt: string;
}

/**
 * The book as a small, hands-off preview (the home page's Lab box): it
 * rests closed and, while hovered, opens at once and turns a page every 1.5 seconds,
 * starting over after the back cover. It takes no clicks or drags, so it
 * can sit inside a link.
 */
export function BookThumb({ pages, aspect = PAGE_ASPECT, poster, alt }: BookThumbProps) {
  const evenPages = useMemo(
    () => (pages.length % 2 ? [...pages, null] : pages),
    [pages],
  );
  const sheetCount = evenPages.length / 2;
  const [turned, setTurned] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [texturesReady, setTexturesReady] = useState(false);
  const view = useRef<ViewState>(initialView());
  const stageRef = useRef<HTMLDivElement>(null);
  // No pointer target: the canvas ignores the pointer, so nothing can drag it.
  const noTarget = useRef<HTMLDivElement>(null);
  const nearViewport = useNearViewport(stageRef);
  const reducedMotion = usePrefersReducedMotion();
  const playing = hovered && texturesReady && !reducedMotion;

  useEffect(() => {
    if (!playing) {
      setTurned(0);
      return;
    }
    setTurned(1);
    const id = setInterval(
      () => setTurned((t) => (t >= sheetCount ? 0 : t + 1)),
      THUMB_TURN_MS,
    );
    return () => clearInterval(id);
  }, [playing, sheetCount]);

  return (
    <div
      ref={stageRef}
      className="lab-book"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <img
        className="lab-book-poster"
        src={poster}
        alt={alt}
        decoding="async"
        style={{ opacity: texturesReady ? 0 : 1 }}
      />
      {/* Without WebGL the poster just stays. */}
      {nearViewport && (
        <NoWebGL>
          <Canvas
            frameloop="demand"
            shadows
            dpr={[1, 2]}
            camera={{ fov: 35, near: 0.1, far: 20, position: [0, 0, 3] }}
            // No tone mapping: the default filmic curve greys out white
            // paper, which reads dull against the light Lab box.
            flat
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: texturesReady ? 1 : 0,
            }}
          >
            <BookScene
              pages={evenPages}
              aspect={aspect}
              turnedCount={turned}
              angled={false}
              reducedMotion={reducedMotion}
              view={view}
              viewResets={0}
              stageRef={noTarget}
              onReady={setTexturesReady}
              fitMargin={1.15}
              headroom={0}
              flipSpeed={THUMB_FLIP_SPEED}
            />
          </Canvas>
        </NoWebGL>
      )}
    </div>
  );
}
