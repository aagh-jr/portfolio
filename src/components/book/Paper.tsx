import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import {
  IDLE_POSE,
  MAX_FRAME_DELTA,
  ARC_STEPS,
  ShadowGround,
  StageLights,
  VIEWER_BUTTON,
  initialView,
  rectCorners,
  useNearViewport,
  usePageTextures,
  usePrefersReducedMotion,
  useTiltControls,
  type ViewState,
} from "./stage";

/* A single printed sheet (flyer, handout, card) lying on a table. Click to
   turn it over, drag to rotate it. Sides without art show plain paper. */

const THICKNESS = 0.004; // default; small cards pass a thicker stock
const LANDSCAPE_WIDTH = 1.3; // world width of a landscape sheet; portrait sheets are 1 tall
const FLIP_SPEED = 6; // damping lambda: higher = snappier
const FIT_MARGIN = 1.1; // breathing room between the sheet and the canvas edge
const PAPER_COLOR = "#f7f5ef";

/** World size of a sheet: portrait and square are 1 tall, landscape 1.3 wide. */
function sheetSize(aspect: number) {
  const width = aspect <= 1 ? aspect : LANDSCAPE_WIDTH;
  return { width, height: width / aspect };
}

interface SheetProps {
  front: string;
  back: string | null;
  aspect: number;
  thickness: number;
  flipped: boolean;
  reducedMotion: boolean;
  view: RefObject<ViewState>;
  viewResets: number;
}

/**
 * What the camera keeps in frame: the sheet lying flat, plus the arc its
 * trailing edge sweeps while it flips over (it lifts as it turns, so that
 * edge reaches a full width off the table at the halfway point).
 */
function sheetFitPoints(width: number, height: number): THREE.Vector3[] {
  const points = rectCorners(width, height);
  for (const theta of ARC_STEPS) {
    for (const side of [-1, 1]) {
      const x = side * (width / 2) * Math.cos(theta);
      const z = (width / 2) * Math.sin(theta) * (1 + side);
      points.push(new THREE.Vector3(x, height / 2, z), new THREE.Vector3(x, -height / 2, z));
    }
  }
  return points;
}

function PaperScene({ front, back, aspect, thickness, flipped, reducedMotion, view, viewResets }: SheetProps) {
  const { width, height } = sheetSize(aspect);
  const sources = useMemo(() => (back ? [front, back] : [front]), [front, back]);
  const [frontTex, backTex] = usePageTextures(sources, aspect);
  const tiltRef = useRef<THREE.Group>(null);
  const sheetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const fitPoints = useMemo(() => sheetFitPoints(width, height), [width, height]);
  useTiltControls(tiltRef, view, { reducedMotion, fitPoints, fitMargin: FIT_MARGIN });
  useEffect(() => invalidate(), [viewResets, invalidate]);

  const targetRot = flipped ? Math.PI : 0;

  // BoxGeometry material order: +x, -x, +y, -y, +z (front), -z (back).
  const materials = useMemo(() => {
    const plain = new THREE.MeshStandardMaterial({ color: PAPER_COLOR, roughness: 0.9 });
    const face = (map: THREE.Texture) =>
      new THREE.MeshStandardMaterial({ map, roughness: 0.85 });
    return [plain, plain, plain, plain, face(frontTex), backTex ? face(backTex) : plain];
  }, [frontTex, backTex]);
  useEffect(() => () => new Set(materials).forEach((m) => m.dispose()), [materials]);

  useLayoutEffect(() => {
    sheetRef.current?.rotation.set(0, targetRot, 0);
  }, []);

  useEffect(() => invalidate(), [targetRot, invalidate]);

  useFrame((_, delta) => {
    const g = sheetRef.current;
    if (!g) return;
    g.rotation.y = reducedMotion
      ? targetRot
      : THREE.MathUtils.damp(g.rotation.y, targetRot, FLIP_SPEED, Math.min(delta, MAX_FRAME_DELTA));
    const flipping = Math.abs(g.rotation.y - targetRot) > 1e-3;
    if (!flipping) g.rotation.y = targetRot;
    // Lift by exactly what the turning half-width needs to clear the table.
    g.position.z = (width / 2) * Math.abs(Math.sin(g.rotation.y));
    // A sheet in mid-air shouldn't throw a shadow; a resting one does.
    if (meshRef.current) meshRef.current.castShadow = !flipping;
    if (flipping) invalidate();
  });

  return (
    <>
      <StageLights />
      <group ref={tiltRef} rotation-x={IDLE_POSE.x} rotation-y={IDLE_POSE.y} rotation-z={IDLE_POSE.z}>
        <ShadowGround z={-thickness / 2 - 0.002} />
        <group ref={sheetRef}>
          <mesh ref={meshRef} material={materials} castShadow receiveShadow>
            <boxGeometry args={[width, height, thickness]} />
          </mesh>
        </group>
      </group>
    </>
  );
}

/* ---------- public component ---------- */

export interface PaperProps {
  /** Image path for the printed front. */
  front: string;
  /** Image path for the back; omit for a one-sided print. */
  back?: string | null;
  /** Width / height of the sheet, e.g. 8.5 / 11 for portrait letter. */
  aspect: number;
  /** Accessible name, e.g. the handout's title. */
  title: string;
  /** Sheet thickness in world units (a portrait sheet is 1 tall). */
  thickness?: number;
}

export default function Paper({
  front,
  back = null,
  aspect,
  title,
  thickness = THICKNESS,
}: PaperProps) {
  const [flipped, setFlipped] = useState(false);
  const [viewResets, setViewResets] = useState(0);
  const view = useRef<ViewState>(initialView());
  const stageRef = useRef<HTMLDivElement>(null);
  const nearViewport = useNearViewport(stageRef);
  const reducedMotion = usePrefersReducedMotion();

  const flip = () => setFlipped((f) => !f);
  const resetView = () => {
    view.current.drag.identity();
    setFlipped(false);
    setViewResets((n) => n + 1);
  };

  return (
    <section aria-label={title} className="flex flex-col items-center gap-3">
      <h2 className="text-center text-base font-medium">{title}</h2>
      {/* Mouse/touch target: click to turn over, drag to rotate. Keyboard
          and screen-reader users get the buttons below instead. */}
      <div
        ref={stageRef}
        aria-hidden="true"
        onClick={() => {
          if (!view.current.moved) flip(); // a drag isn't a click
        }}
        className="w-full cursor-grab select-none active:cursor-grabbing"
        style={{ height: "min(60vh, 520px)", touchAction: "pan-y" }}
      >
        {nearViewport && (
          <Canvas
            frameloop="demand"
            shadows
            dpr={[1, 2]}
            camera={{ fov: 35, near: 0.1, far: 20, position: [0, 0, 3] }}
          >
            <PaperScene
              front={front}
              back={back}
              aspect={aspect}
              thickness={thickness}
              flipped={flipped}
              reducedMotion={reducedMotion}
              view={view}
              viewResets={viewResets}
            />
          </Canvas>
        )}
      </div>
      <p aria-live="polite" className="text-sm opacity-60">
        {flipped ? (back ? "Back" : "Back (blank)") : "Front"}
      </p>
      <div className="flex items-center gap-3">
        <button type="button" className={VIEWER_BUTTON} onClick={flip}>
          Flip over
        </button>
        <button type="button" className={VIEWER_BUTTON} onClick={resetView}>
          Reset view
        </button>
      </div>
    </section>
  );
}
