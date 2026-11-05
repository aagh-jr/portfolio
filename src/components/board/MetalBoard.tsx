import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  initialView,
  rectCorners,
  usePrefersReducedMotion,
  useTiltControls,
  type Pose,
} from "../book/stage";

/* A brushed-metal memo board: a bare steel slab hung a finger's width off
   the wall, for sticking prints to. Uses the aluminum scan from the book
   covers (ambientCG Metal009, /public/textures/covers/aluminum/).

   Units are meters. The reference is a DIY stainless board, about 30×60cm:
   an A5 print and a four-frame photo strip give the scale. */

export const BOARD = { width: 0.3, height: 0.6, thickness: 0.002, standoff: 0.01 };
/** Meters of board one tile of the texture covers. */
const TILE = 0.18;
const TEXTURE_DIR = "/textures/covers/aluminum/";
const deg = THREE.MathUtils.degToRad;
/* Turned a little to the left so the sheen rolls across the face as you drag. */
const POSE: Pose = { x: 0, y: deg(-14), z: 0 };

export interface MetalFinish {
  label: string;
  /** Multiplied over the color map: a metal's color is its reflection tint. */
  tint: string;
  roughness: number;
  anisotropy: number;
  envIntensity: number;
  /** The scan's roughness map: blotchy, like worn aluminum. Off, the sheen stays an even satin. */
  mottled?: boolean;
}

export const METAL_FINISHES = {
  stainless: {
    label: "Stainless",
    tint: "#e4e6e9",
    roughness: 0.32,
    anisotropy: 0.85,
    envIntensity: 1.1,
  },
  aluminum: {
    label: "Aluminum",
    tint: "#8f949b",
    roughness: 0.6,
    anisotropy: 0.7,
    envIntensity: 0.35,
    mottled: true,
  },
} satisfies Record<string, MetalFinish>;
export type MetalFinishName = keyof typeof METAL_FINISHES;

export type BrushDirection = "horizontal" | "vertical";

export const WALLS = { light: "#d6d5d1", dark: "#151515" } as const;
export const WALL_INK = { light: "#1d1c1a", dark: "#e9e7e1" } as const;

export interface MetalBoardProps {
  finish: MetalFinish;
  brush: BrushDirection;
  wall: keyof typeof WALLS;
  /** Placeholder prints, for judging scale. */
  prints?: boolean;
  height?: string;
}

/* ---------- materials ---------- */

interface BoardMaps {
  color: THREE.Texture;
  normal: THREE.Texture;
  roughness: THREE.Texture;
  metalness: THREE.Texture;
}

/** The scan's maps, tiled at true size; null until they're in. */
function useBoardMaps() {
  const gl = useThree((s) => s.gl);
  const [maps, setMaps] = useState<BoardMaps | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const load = (file: string) =>
      loader.loadAsync(TEXTURE_DIR + file).then((t) => {
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = gl.capabilities.getMaxAnisotropy();
        t.center.set(0.5, 0.5);
        return t;
      });
    let alive = true;
    let loaded: THREE.Texture[] = [];
    Promise.all(["color.jpg", "normal.jpg", "roughness.jpg", "metalness.jpg"].map(load)).then(
      (textures) => {
        loaded = textures;
        if (!alive) return textures.forEach((t) => t.dispose());
        const [color, normal, roughness, metalness] = textures;
        color.colorSpace = THREE.SRGBColorSpace;
        setMaps({ color, normal, roughness, metalness });
      },
    );
    return () => {
      alive = false;
      loaded.forEach((t) => t.dispose());
    };
  }, [gl]);
  return maps;
}

/** A soft studio for the metal to reflect: bare metal is only what it reflects. */
function useStudioEnv() {
  const gl = useThree((s) => s.gl);
  const env = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return tex;
  }, [gl]);
  useEffect(() => () => env.dispose(), [env]);
  return env;
}

/* ---------- prints ---------- */

/** A print with a white border, drawn flat; `frames` splits it into a photo-booth strip. */
function printTexture(w: number, h: number, fill: string, frames = 1) {
  const px = 600; // per meter-ish; the prints are small
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * px * 10);
  canvas.height = Math.round(h * px * 10);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f6f4ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const border = canvas.width * 0.07;
  const gap = border * 0.6;
  const frameH = (canvas.height - border * 2 - gap * (frames - 1)) / frames;
  ctx.fillStyle = fill;
  for (let i = 0; i < frames; i++)
    ctx.fillRect(border, border + i * (frameH + gap), canvas.width - border * 2, frameH);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* Laid out like the reference's left board: an A5 print low left, a photo
   strip and a small square beside it. Positions are print centers from the
   board's center. */
const PRINTS = [
  { w: 0.148, h: 0.21, x: -0.055, y: -0.16, fill: "#e9a3ad" },
  { w: 0.051, h: 0.203, x: 0.105, y: -0.17, fill: "#7d7d7d", frames: 4 },
  { w: 0.064, h: 0.064, x: 0.06, y: -0.235, fill: "#5a5a5a" },
];

function Prints() {
  const textures = useMemo(
    () => PRINTS.map((p) => printTexture(p.w, p.h, p.fill, p.frames)),
    [],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  return (
    <>
      {PRINTS.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y, BOARD.thickness / 2 + 0.0004 + i * 0.0002]}
          castShadow
        >
          <planeGeometry args={[p.w, p.h]} />
          <meshStandardMaterial map={textures[i]} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

/* ---------- scene ---------- */

/* A key light high on the left, for the soft shadow on the wall. The board
   stands only a centimeter off it, so the shadow camera hugs the board (the
   light is 4m out): bias is a fraction of near–far depth, and over the
   default 500m a centimeter vanishes. The metal itself mostly shows the
   studio it reflects. */
function BoardLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[-1.2, 2.4, 3]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.001}
        shadow-radius={6}
        shadow-camera-left={-0.5}
        shadow-camera-right={0.5}
        shadow-camera-top={0.5}
        shadow-camera-bottom={-0.5}
        shadow-camera-near={3}
        shadow-camera-far={5}
      />
    </>
  );
}

function BoardScene({ finish, brush, prints, reducedMotion }: {
  finish: MetalFinish;
  brush: BrushDirection;
  prints: boolean;
  reducedMotion: boolean;
}) {
  const tilt = useRef<THREE.Group>(null);
  const view = useRef(initialView());
  const invalidate = useThree((s) => s.invalidate);
  const maps = useBoardMaps();
  const env = useStudioEnv();
  const { width: w, height: h, thickness: t } = BOARD;

  const fitPoints = useMemo(
    () => [...rectCorners(w, h, t / 2), ...rectCorners(w, h, -t / 2)],
    [w, h, t],
  );
  useTiltControls(tilt, view, { fitPoints, fitMargin: 1.4, pose: POSE, reducedMotion });

  // The scan's streaks run along its x. Turning the maps a quarter turn
  // brushes the board top to bottom; the repeat keeps a tile square in meters.
  const vertical = brush === "vertical";
  useEffect(() => {
    if (!maps) return;
    for (const tex of Object.values(maps)) {
      tex.repeat.set(w / TILE, h / TILE);
      tex.rotation = vertical ? Math.PI / 2 : 0;
    }
    invalidate();
  }, [maps, vertical, w, h, invalidate]);

  const face = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        metalness: 1,
        normalScale: new THREE.Vector2(0.15, 0.15),
        envMap: env,
      }),
    [env],
  );
  // The cut edges: a dull, darker gray. Smooth and bright, they caught the
  // studio and ringed the board in white, like a painted panel.
  const edge = useMemo(
    () => new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.7, envMap: env }),
    [env],
  );
  useEffect(
    () => () => {
      face.dispose();
      edge.dispose();
    },
    [face, edge],
  );

  useEffect(() => {
    face.map = maps?.color ?? null;
    face.normalMap = maps?.normal ?? null;
    face.roughnessMap = (finish.mottled && maps?.roughness) || null;
    face.metalnessMap = maps?.metalness ?? null;
    face.color.set(finish.tint);
    face.roughness = finish.roughness;
    face.anisotropy = finish.anisotropy;
    // Grooves along one axis scatter light across them, so the highlight
    // stretches perpendicular to the brushing. three stretches it along
    // the UV tangent turned by this angle.
    face.anisotropyRotation = vertical ? 0 : Math.PI / 2;
    face.envMapIntensity = finish.envIntensity;
    face.needsUpdate = true;
    edge.color.set(finish.tint).multiplyScalar(0.45);
    edge.envMapIntensity = finish.envIntensity * 0.6;
    invalidate();
  }, [face, edge, maps, finish, vertical, invalidate]);

  // The loop renders on demand, and taking the prints down doesn't ask for a frame.
  useEffect(() => invalidate(), [prints, invalidate]);

  // BoxGeometry's groups: +x, −x, +y, −y, front, back.
  const materials = useMemo(() => [edge, edge, edge, edge, face, edge], [edge, face]);

  return (
    <>
      <BoardLights />
      <group ref={tilt}>
        <mesh material={materials} castShadow>
          <boxGeometry args={[w, h, t]} />
        </mesh>
        {prints && <Prints />}
        <mesh position-z={-t / 2 - BOARD.standoff} receiveShadow>
          <planeGeometry args={[3, 3]} />
          <shadowMaterial opacity={0.25} />
        </mesh>
      </group>
    </>
  );
}

export default function MetalBoard({
  finish,
  brush,
  wall,
  prints = false,
  height = "100svh",
}: MetalBoardProps) {
  const reducedMotion = usePrefersReducedMotion();
  return (
    <section
      aria-label="Brushed metal memo board, 3D"
      className="relative w-full select-none"
      style={{ height, background: WALLS[wall] }}
    >
      <Canvas
        frameloop="demand"
        shadows
        // Filmic, not flat: bare metal throws highlights past white, and these roll them off.
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}
        dpr={[1, 2]}
        camera={{ fov: 18, near: 0.05, far: 20, position: [0, 0, 3] }}
        className="cursor-grab active:cursor-grabbing"
      >
        <BoardScene
          finish={finish}
          brush={brush}
          prints={prints}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </section>
  );
}
