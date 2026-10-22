import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

/* Shared pieces for the 3D print viewers (Book, Paper): the resting pose,
   drag-to-rotate, lights, camera fit and texture loading. */

export type Pose = { x: number; y: number; z: number };
const deg = THREE.MathUtils.degToRad;
/* Idle: leaned back and turned to face left, like it's propped on a shelf
   in a corner. */
export const IDLE_POSE: Pose = { x: deg(-10), y: deg(-20), z: deg(-5) };
const DRAG_SPEED = Math.PI; // radians per full canvas width/height dragged
const DRAG_THRESHOLD = 5; // px the pointer must move before a click becomes a drag
/* Longest step an animation takes in one frame. The loop renders on demand,
   so the first frame after a pause (or a stall) can report a delta of
   seconds; unclamped, easing would jump straight to its target. */
export const MAX_FRAME_DELTA = 1 / 30;
const PLACEHOLDER_COLORS = [
  "#e4572e", "#f3a712", "#29335c", "#669bbc",
  "#a8c686", "#c1121f", "#6a4c93", "#2a9d8f",
];

/* ---------- hooks ---------- */

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/**
 * True while the element is on or near the screen. Viewers mount their
 * canvas only then: browsers cap live WebGL contexts (~16), and a page of
 * handouts would blow past that.
 */
export function useNearViewport(ref: RefObject<HTMLElement | null>, margin = "300px") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

function makePlaceholder(pageNumber: number, aspect: number): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = Math.round(512 / aspect);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = PLACEHOLDER_COLORS[(pageNumber - 1) % PLACEHOLDER_COLORS.length];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 160px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(pageNumber), canvas.width / 2, canvas.height / 2);
  return new THREE.CanvasTexture(canvas);
}

/** One texture per page: the image if a path is given, else a numbered placeholder. */
/**
 * Loads the page images. Each one is uploaded to the GPU as soon as it
 * arrives, so the first time a page comes into view doesn't stall a frame
 * mid-animation. `onReady` reports whether every image has loaded.
 */
export function usePageTextures(
  pages: (string | null)[],
  aspect: number,
  onReady?: (ready: boolean) => void,
) {
  const { invalidate, gl } = useThree();
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    let pending = pages.filter(Boolean).length;
    const settle = () => {
      if (--pending === 0) onReadyRef.current?.(true);
      invalidate();
    };
    return pages.map((src, i) => {
      const tex = src
        ? loader.load(
            src,
            (t) => {
              gl.initTexture(t);
              settle();
            },
            undefined,
            settle, // a missing image shouldn't hold the book closed forever
          )
        : makePlaceholder(i + 1, aspect);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      return tex;
    });
  }, [pages, aspect, invalidate, gl]);
  useEffect(() => {
    if (!pages.some(Boolean)) onReadyRef.current?.(true);
    return () => {
      textures.forEach((t) => t.dispose());
      onReadyRef.current?.(false);
    };
  }, [textures, pages]);
  return textures;
}

/* ---------- orientation ---------- */

/** User-controlled orientation, shared between the scene and the click handler. */
export interface ViewState {
  drag: THREE.Quaternion; // free rotation from dragging, applied in screen space
  dragging: boolean;
  moved: boolean; // last press became a drag, so its click shouldn't act
}

export const initialView = (): ViewState => ({
  drag: new THREE.Quaternion(),
  dragging: false,
  moved: false,
});

const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

/**
 * Drives `tiltRef` from the view: eases to the resting `pose`, with any
 * drag rotation on top. `extraYaw` is a preset turn on top (e.g. the
 * "Rotate 60°" toggle). Returns nothing; it owns its listeners and frame.
 */
export function useTiltControls(
  tiltRef: RefObject<THREE.Group | null>,
  view: RefObject<ViewState>,
  {
    extraYaw = 0,
    reducedMotion = false,
    fitPoints,
    fitMargin = 1.08,
    headroom = 0,
    eventTarget,
    pose = IDLE_POSE,
  }: {
    extraYaw?: number;
    reducedMotion?: boolean;
    /** Points (in the tilt group's space) that must stay on screen; see fitCamera. */
    fitPoints: THREE.Vector3[];
    fitMargin?: number;
    /** Extra canvas above the framed area, as a fraction of its height; see fitCamera. */
    headroom?: number;
    /** Element that takes the pointer, when the canvas itself doesn't. */
    eventTarget?: RefObject<HTMLElement | null>;
    /** Resting rotation in radians. */
    pose?: Pose;
  },
) {
  const { invalidate, gl } = useThree();

  useEffect(() => {
    const el = eventTarget?.current ?? gl.domElement;
    const v = view.current;
    let press: { id: number; startX: number; startY: number; x: number; y: number } | null =
      null;

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      press = { id: e.pointerId, startX: e.clientX, startY: e.clientY, x: e.clientX, y: e.clientY };
      v.moved = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!press || e.pointerId !== press.id) return;
      if (!v.moved) {
        const dist = Math.hypot(e.clientX - press.startX, e.clientY - press.startY);
        if (dist < DRAG_THRESHOLD) return;
        v.moved = true;
        v.dragging = true;
        el.setPointerCapture(e.pointerId);
      }
      // Trackball: turn about the screen's axes so any orientation is
      // reachable. Grab the right side and pull left → the object turns left.
      const r = el.getBoundingClientRect();
      const yaw = ((e.clientX - press.x) / r.width) * DRAG_SPEED;
      const pitch = ((e.clientY - press.y) / r.height) * DRAG_SPEED;
      v.drag
        .premultiply(new THREE.Quaternion().setFromAxisAngle(Y_AXIS, yaw))
        .premultiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, pitch))
        .normalize();
      press.x = e.clientX;
      press.y = e.clientY;
      invalidate();
    };
    const onUp = (e: PointerEvent) => {
      if (!press || e.pointerId !== press.id) return;
      press = null;
      v.dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      invalidate();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      v.dragging = false;
    };
  }, [gl, eventTarget, invalidate, view]);

  useEffect(() => invalidate(), [extraYaw, pose, invalidate]);

  const target = useMemo(() => ({ euler: new THREE.Euler(), quat: new THREE.Quaternion() }), []);

  useFrame((state, delta) => {
    const t = tiltRef.current;
    if (!t) return;
    turn(t, Math.min(delta, MAX_FRAME_DELTA));
    fitCamera(state.camera as THREE.PerspectiveCamera, state.size, t, fitPoints, fitMargin, headroom);
  });

  function turn(t: THREE.Group, delta: number) {
    const v = view.current;
    // Resting pose, then the drag rotation on top in screen space.
    target.euler.set(pose.x, pose.y + extraYaw, pose.z);
    target.quat.setFromEuler(target.euler).premultiply(v.drag);
    if (reducedMotion) {
      t.quaternion.copy(target.quat);
      return;
    }
    // Follow the hand closely while dragging, ease gently otherwise.
    const speed = v.dragging ? 16 : 4;
    t.quaternion.slerp(target.quat, 1 - Math.exp(-speed * delta));
    if (t.quaternion.angleTo(target.quat) > 1e-4) invalidate();
  }
}

const fitScratch = new THREE.Vector3();

/**
 * Moves the camera along Z to the closest distance that keeps every fit
 * point inside the frustum at the object's current orientation. The object
 * fills the canvas at rest and the camera backs off only as far as a turn
 * actually needs, so nothing is ever cut off. Runs every frame right after
 * the rotation update, so it can't lag a frame behind a drag.
 *
 * With `headroom`, the canvas is that fraction taller than the area the
 * object is framed in, all of it above: the object sits centered in the
 * bottom part, and the top is spare room for anything that rises out of
 * frame (a page standing up mid-turn) instead of being clipped.
 */
function fitCamera(
  cam: THREE.PerspectiveCamera,
  size: { width: number; height: number },
  object: THREE.Object3D,
  points: THREE.Vector3[],
  margin: number,
  headroom = 0,
) {
  object.updateWorldMatrix(true, false);
  const baseFov: number = (cam.userData.baseFov ??= cam.fov);
  const tanBase = Math.tan(THREE.MathUtils.degToRad(baseFov / 2));
  const framedHeight = size.height / (1 + headroom);
  const tanV = tanBase / margin;
  const tanH = tanV * (size.width / framedHeight);
  let dist = 0;
  for (const p of points) {
    const w = fitScratch.copy(p).applyMatrix4(object.matrixWorld);
    // A point at depth z sits inside the frustum when |x| ≤ (dist − z)·tan.
    dist = Math.max(dist, w.z + Math.abs(w.x) / tanH, w.z + Math.abs(w.y) / tanV);
  }
  cam.position.set(0, 0, dist);
  cam.lookAt(0, 0, 0);
  if (headroom > 0) {
    // A frustum mirrored below the canvas puts the origin at the middle of
    // the framed area; the view offset renders only its top part.
    const fullHeight = 2 * size.height - framedHeight;
    cam.fov = 2 * THREE.MathUtils.radToDeg(Math.atan((tanBase * fullHeight) / framedHeight));
    cam.aspect = size.width / fullHeight;
    cam.setViewOffset(size.width, fullHeight, 0, 0, size.width, size.height);
    cam.updateProjectionMatrix();
  }
}

/** The four corners of a `width` × `height` rectangle centered on the origin. */
export function rectCorners(width: number, height: number, z = 0): THREE.Vector3[] {
  const x = width / 2;
  const y = height / 2;
  return [
    new THREE.Vector3(-x, -y, z),
    new THREE.Vector3(x, -y, z),
    new THREE.Vector3(-x, y, z),
    new THREE.Vector3(x, y, z),
  ];
}

/** Samples θ evenly over [0, π], for tracing the arc a turning page sweeps. */
export const ARC_STEPS = Array.from({ length: 9 }, (_, i) => (i / 8) * Math.PI);

/* ---------- scene pieces ---------- */

export function StageLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#ffffff", "#b9b3a8", 0.6]} />
      <directionalLight
        position={[-1.2, 2.4, 3]}
        intensity={2.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={1.6}
        shadow-camera-bottom={-1.6}
      />
    </>
  );
}

/** Tabletop just behind the object at `z`; only shows the shadows. */
export function ShadowGround({ z }: { z: number }) {
  return (
    <mesh position-z={z} receiveShadow>
      <planeGeometry args={[4, 3]} />
      <shadowMaterial opacity={0.22} />
    </mesh>
  );
}

export const VIEWER_BUTTON =
  "rounded-full border border-current px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed";
