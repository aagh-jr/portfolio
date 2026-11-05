import { useState, type ReactNode } from "react";
import MetalBoard, {
  METAL_FINISHES,
  WALLS,
  WALL_INK,
  type BrushDirection,
  type MetalFinish,
  type MetalFinishName,
} from "./MetalBoard";

/* The metal memo board with its switches, for /board-test. Drag the board
   to watch the sheen move. */

const NAMES = Object.keys(METAL_FINISHES) as MetalFinishName[];
const BRUSHES: BrushDirection[] = ["horizontal", "vertical"];
const WALL_NAMES = Object.keys(WALLS) as (keyof typeof WALLS)[];
const SLIDERS = [
  { key: "roughness", label: "Rough", min: 0.05, max: 1 },
  { key: "anisotropy", label: "Brush", min: 0, max: 1 },
  { key: "envIntensity", label: "Shine", min: 0, max: 2 },
] as const;

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function BoardPlayground() {
  const [preset, setPreset] = useState<MetalFinishName | null>("stainless");
  const [finish, setFinish] = useState<MetalFinish>(METAL_FINISHES.stainless);
  const [brush, setBrush] = useState<BrushDirection>("vertical");
  const [wall, setWall] = useState<keyof typeof WALLS>("light");
  const [prints, setPrints] = useState(true);

  const ink = WALL_INK[wall];
  const paper = WALLS[wall];
  const pill = (active: boolean, onClick: () => void, label: ReactNode, key?: string) => (
    <button
      key={key}
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-xs"
      style={
        active
          ? { borderColor: ink, background: ink, color: paper }
          : { borderColor: `color-mix(in srgb, ${ink} 40%, transparent)` }
      }
    >
      {label}
    </button>
  );
  const row = (label: string, children: ReactNode) => (
    <div key={label} role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="w-14 text-xs opacity-60">{label}</span>
      {children}
    </div>
  );

  return (
    <div className="relative">
      <MetalBoard finish={finish} brush={brush} wall={wall} prints={prints} />
      <div
        className="absolute left-4 top-[72px] z-10 flex flex-col gap-2 rounded-2xl p-3"
        style={{
          color: ink,
          background: `color-mix(in srgb, ${paper} 85%, transparent)`,
          backdropFilter: "blur(8px)",
        }}
      >
        {row(
          "Metal",
          NAMES.map((n) =>
            pill(
              preset === n,
              () => {
                setPreset(n);
                setFinish(METAL_FINISHES[n]);
              },
              METAL_FINISHES[n].label,
              n,
            ),
          ),
        )}
        {row("Grain", BRUSHES.map((b) => pill(brush === b, () => setBrush(b), cap(b), b)))}
        {SLIDERS.map(({ key, label, min, max }) =>
          row(
            label,
            <>
              <input
                type="range"
                aria-label={label}
                min={min}
                max={max}
                step={0.01}
                value={finish[key]}
                onChange={(e) => {
                  // Tuning by hand leaves the preset.
                  setPreset(null);
                  setFinish({ ...finish, [key]: Number(e.target.value) });
                }}
                className="w-40"
                style={{ accentColor: ink }}
              />
              <span className="w-8 text-xs tabular-nums opacity-60">
                {finish[key].toFixed(2)}
              </span>
            </>,
          ),
        )}
        {row("Wall", WALL_NAMES.map((n) => pill(wall === n, () => setWall(n), cap(n), n)))}
        {row(
          "Prints",
          <>
            {pill(prints, () => setPrints(true), "Show")}
            {pill(!prints, () => setPrints(false), "Hide")}
          </>,
        )}
      </div>
    </div>
  );
}
