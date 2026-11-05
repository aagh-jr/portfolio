import { useEffect, useState, type ReactNode } from "react";
import ZineBook, {
  BACKDROP_INK,
  BINDINGS,
  type BindingName,
  type ZineBookProps,
} from "./ZineBook";
import { COVER_MATERIALS, type CoverMaterialName } from "./coverMaterials";
import { useSiteTheme } from "./stage";

/* The zine book with every switch it has, for /zine-test and the Paper
   Craft Canvas editor (~/Developer/parchment, book.html). */

const NAMES = Object.keys(COVER_MATERIALS) as CoverMaterialName[];
const BACKDROPS = ["auto", "light", "dark"] as const;
const LENGTHS = [16, 64, 240] as const;
const BINDING_NAMES = Object.keys(BINDINGS) as BindingName[];
const MAX_LENGTH = 1000;
type Backdrop = (typeof BACKDROPS)[number];

/** ?cover=<name> picks the starting finish (?cover=card for none); bookcloth otherwise. */
function initialFinish(): CoverMaterialName | undefined {
  const q = new URLSearchParams(location.search).get("cover");
  if (q === "card") return undefined;
  return NAMES.find((n) => n === q) ?? "bookcloth";
}

/** ?binding=magazine starts on the paperback. */
function initialBinding(): BindingName {
  const q = new URLSearchParams(location.search).get("binding");
  return BINDING_NAMES.find((n) => n === q) ?? "hardcover";
}

/**
 * A number box that only commits on Enter or leaving it, so typing "240"
 * doesn't build a 2- and a 24-page book on the way.
 */
function NumberField({
  value,
  min,
  max,
  onCommit,
  label,
  color,
}: {
  value: number;
  min: number;
  max: number;
  onCommit: (n: number) => void;
  label: string;
  color: string;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const n = Math.round(Number(draft));
    if (Number.isFinite(n) && draft.trim())
      onCommit(Math.min(Math.max(n, min), max));
    else setDraft(String(value));
  };
  return (
    <input
      type="number"
      inputMode="numeric"
      aria-label={label}
      min={min}
      max={max}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className="w-16 rounded-full border bg-transparent px-3 py-1 text-xs tabular-nums"
      style={{ borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }}
    />
  );
}

export default function ZinePlayground(props: ZineBookProps) {
  const [binding, setBinding] = useState(initialBinding);
  const [finish, setFinish] = useState(initialFinish);
  const [backdrop, setBackdrop] = useState<Backdrop>("auto");
  const [blank, setBlank] = useState(props.blank ?? false);
  const [length, setLength] = useState(props.pageCount ?? 240);
  const [page, setPage] = useState(props.startPage || 1);

  // The panel matches the book's backdrop.
  const theme = useSiteTheme();
  const tone = backdrop === "auto" ? theme : backdrop;
  const ink = BACKDROP_INK[tone];
  const paper = BACKDROP_INK[tone === "dark" ? "light" : "dark"];
  const pill = (
    active: boolean,
    onClick: () => void,
    label: ReactNode,
    key?: string,
  ) => (
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
    <div
      role="group"
      aria-label={label}
      className="flex flex-wrap items-center gap-2"
    >
      <span className="w-14 text-xs opacity-60">{label}</span>
      {children}
    </div>
  );

  return (
    <div className="relative">
      {/* A new length or binding is a different book: build it over, open where it was. */}
      <ZineBook
        key={`${binding}-${length}`}
        {...props}
        binding={binding}
        pageCount={length}
        page={page}
        onPageChange={setPage}
        coverMaterial={finish}
        backdrop={backdrop}
        blank={blank}
      />
      <div
        className="absolute left-4 top-[72px] z-10 flex flex-col gap-2 rounded-2xl p-3"
        // Mostly opaque, so the switches stay readable over the cover.
        style={{
          color: ink,
          background: `color-mix(in srgb, ${paper} 85%, transparent)`,
          backdropFilter: "blur(8px)",
        }}
      >
        {row(
          "Binding",
          BINDING_NAMES.map((n) =>
            pill(
              binding === n,
              () => setBinding(n),
              n[0].toUpperCase() + n.slice(1),
              n,
            ),
          ),
        )}
        {binding === "hardcover" &&
          row(
            "Finish",
            <>
              {pill(!finish, () => setFinish(undefined), "Card")}
              {NAMES.map((n) =>
                pill(
                  finish === n,
                  () => setFinish(n),
                  COVER_MATERIALS[n].label,
                  n,
                ),
              )}
            </>,
          )}
        {row(
          "Table",
          BACKDROPS.map((b) =>
            pill(
              backdrop === b,
              () => setBackdrop(b),
              b[0].toUpperCase() + b.slice(1),
              b,
            ),
          ),
        )}
        {row(
          "Pages",
          <>
            {pill(!blank, () => setBlank(false), "Layout")}
            {pill(blank, () => setBlank(true), "Blank")}
          </>,
        )}
        {row(
          "Length",
          <>
            {LENGTHS.map((n) =>
              pill(length === n, () => setLength(n), n, String(n)),
            )}
            <NumberField
              label="Page count"
              value={length}
              min={4}
              max={MAX_LENGTH}
              // The book rounds up to whole leaves; show what it built.
              onCommit={(n) => setLength(Math.ceil(n / 2) * 2)}
              color={ink}
            />
          </>,
        )}
        {row(
          "Page",
          <>
            <input
              type="range"
              aria-label="Page"
              min={1}
              max={length}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="w-40"
              style={{ accentColor: ink }}
            />
            <NumberField
              label="Page number"
              value={page}
              min={1}
              max={length}
              onCommit={setPage}
              color={ink}
            />
          </>,
        )}
      </div>
    </div>
  );
}
