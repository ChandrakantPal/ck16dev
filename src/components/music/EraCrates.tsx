import Image from "next/image";
import type { CSSProperties } from "react";
import type { AlbumSwatch } from "@/lib/spotify/music";

/*
 * The crate is drawn in oblique projection, turned side-on: depth runs mostly
 * to the right, so every record behind the front one shows a strip of its
 * cover down its right edge, and the right wall's outside face is in view.
 *
 * How far apart the records sit depends on the screen, so the geometry lives
 * in CSS: each crate sets `--slots` and a step for each breakpoint, and every
 * length below is a calc() over them. Lengths are rem; the sleeve's `size-36`
 * has to agree with SLEEVE.
 */
const SLEEVE = 9;
const STEP_X = 1.25;
/* How far each record sits above the one in front, per unit of STEP_X. */
const RISE_PER_STEP = 0.2;
const WALL_INSET = 0.375;
const BOX_WIDTH = SLEEVE + WALL_INSET * 2;
const FRONT_HEIGHT = 3.25;
/* Barely taller than the front, so the near wall never hides the strips. */
const BACK_HEIGHT = 3.75;
const FLOOR = 0.25;
const MIN_DEPTH_RECORDS = 3;
/*
 * A full crate packs its records tighter rather than growing past these. The
 * phone limit keeps the widest crate on screen; from `md` up there is room to
 * spread a crowded crate out, so every strip stays wide enough to reach.
 */
const MAX_DEPTH_COMPACT = 11;
const MAX_DEPTH_ROOMY = 24;

const STEP = "var(--step-x)";
const DEPTH_X = `calc(var(--slots) * ${STEP})`;
const DEPTH_Y = `calc(var(--slots) * ${STEP} * ${RISE_PER_STEP})`;
const CRATE_HEIGHT = `calc(${DEPTH_Y} + ${SLEEVE + FLOOR}rem)`;

interface Crate {
  decade: number;
  records: AlbumSwatch[];
}

/**
 * The albums I play most, filed into a wooden crate per decade they came out
 * in, most-played at the front.
 *
 * The records behind show a strip of their covers. Rest the pointer on one and
 * it rises from its place in the crate — still behind the records in front of
 * it — so you can see its cover; run the pointer along the crate and you flip
 * through it.
 */
const EraCrates = ({ albums }: { albums: AlbumSwatch[] }) => {
  const crates = fileByDecade(albums);

  if (crates.length === 0) {
    return null;
  }

  return (
    /* The headroom is where a raised record's caption rises into. */
    <figure className="mt-24">
      <ul className="flex flex-wrap items-end gap-x-8 gap-y-20">
        {crates.map((crate) => (
          <CrateBox key={crate.decade} crate={crate} />
        ))}
      </ul>
      <figcaption className="mt-8 text-muted">
        The records I play most, boxed by the decade they came out.
      </figcaption>
    </figure>
  );
};

/* Keeps the incoming order — most-played first — so that record faces front. */
const fileByDecade = (albums: AlbumSwatch[]): Crate[] => {
  const byDecade = new Map<number, AlbumSwatch[]>();

  for (const album of albums) {
    if (album.year === undefined) {
      continue;
    }

    const decade = Math.floor(album.year / 10) * 10;
    byDecade.set(decade, [...(byDecade.get(decade) ?? []), album]);
  }

  return [...byDecade.entries()]
    .sort(([first], [second]) => first - second)
    .map(([decade, records]) => ({ decade, records }));
};

const crateVariables = (recordCount: number): CSSProperties => {
  const slots = Math.max(recordCount, MIN_DEPTH_RECORDS) + 1;
  const stepWithin = (maxDepth: number) =>
    `${Math.min(STEP_X, maxDepth / slots)}rem`;

  return {
    "--slots": slots,
    "--step-compact": stepWithin(MAX_DEPTH_COMPACT),
    "--step-roomy": stepWithin(MAX_DEPTH_ROOMY),
  } as CSSProperties;
};

/*
 * `isolate` makes each crate paint as one unit, in page order. Inside it the
 * records keep their resting layers, so a raised record stays behind the ones
 * in front of it; and a later crate still paints over an earlier one, so a
 * caption rising into the row above is never hidden by it.
 */
const CrateBox = ({ crate }: { crate: Crate }) => {
  const frontLayer = crate.records.length + 1;

  return (
    <li
      className="relative isolate shrink-0 [--step-x:var(--step-compact)] md:[--step-x:var(--step-roomy)]"
      style={{
        ...crateVariables(crate.records.length),
        width: `calc(${DEPTH_X} + ${BOX_WIDTH}rem)`,
        height: CRATE_HEIGHT,
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-crate-inside"
        style={{ clipPath: INSIDE_POLYGON }}
      />

      <ol aria-label={`${crate.decade}s`}>
        {crate.records.map((record, depth) => (
          <CrateRecord
            key={record.id}
            record={record}
            depth={depth}
            layer={crate.records.length - depth}
          />
        ))}
      </ol>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-crate-side wood-grain"
        style={{ clipPath: SIDE_WALL_POLYGON, zIndex: frontLayer }}
      />
      <CrateFront crate={crate} layer={frontLayer} />
    </li>
  );
};

const polygon = (points: [string, string][]): string =>
  `polygon(${points.map(([x, y]) => `${x} ${y}`).join(", ")})`;

const fromBottom = (length: string): string => `calc(100% - ${length})`;

/* The back wall, the far wall's inside face and the floor, as one silhouette. */
const INSIDE_POLYGON = polygon([
  ["0", fromBottom(`${FRONT_HEIGHT}rem`)],
  [DEPTH_X, fromBottom(`${DEPTH_Y} - ${BACK_HEIGHT}rem`)],
  ["100%", fromBottom(`${DEPTH_Y} - ${BACK_HEIGHT}rem`)],
  ["100%", fromBottom(DEPTH_Y)],
  [`${BOX_WIDTH}rem`, "100%"],
  ["0", "100%"],
]);

/* The near wall, rising slightly from the front to the back. */
const SIDE_WALL_POLYGON = polygon([
  [`${BOX_WIDTH}rem`, "100%"],
  [`${BOX_WIDTH}rem`, fromBottom(`${FRONT_HEIGHT}rem`)],
  ["100%", fromBottom(`${DEPTH_Y} - ${BACK_HEIGHT}rem`)],
  ["100%", fromBottom(DEPTH_Y)],
]);

const CrateFront = ({ crate, layer }: { crate: Crate; layer: number }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute bottom-0 left-0 flex items-end justify-between rounded-[2px] bg-crate-front px-3 pb-2 text-crate-ink shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_16px_-8px_rgb(0_0_0/0.6)] wood-grain"
    style={{
      width: `${BOX_WIDTH}rem`,
      height: `${FRONT_HEIGHT}rem`,
      zIndex: layer + 1,
    }}
  >
    <span className="text-xl font-semibold tabular-nums">{crate.decade}s</span>
    <span className="text-xs tabular-nums">{crate.records.length}</span>
  </div>
);

interface CrateRecordProps {
  record: AlbumSwatch;
  depth: number;
  layer: number;
}

/*
 * The slot never moves; only the sleeve inside it rises, so the pointer is not
 * left behind the moment the record does. The slot is hit-tested wherever it
 * shows — the whole front record, and the strip of every other one — and the
 * raised sleeve takes the pointer too, so moving up onto it keeps it raised.
 */
const CrateRecord = ({ record, depth, layer }: CrateRecordProps) => {
  const offset = depth + 0.5;
  const label = `${record.name} by ${record.artist}, ${record.year}`;

  return (
    <li
      style={{
        left: `calc(${WALL_INSET}rem + ${offset} * ${STEP})`,
        top: `calc((var(--slots) - ${offset}) * ${STEP} * ${RISE_PER_STEP})`,
        zIndex: layer,
      }}
      className="group absolute size-36"
    >
      <a
        href={record.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="absolute inset-0 rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <RisingSleeve record={record} />
    </li>
  );
};

/* A second way into the same link, for a pointer that has followed it up. */
const RisingSleeve = ({ record }: { record: AlbumSwatch }) => (
  <a
    href={record.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-hidden
    tabIndex={-1}
    style={{ backgroundColor: record.colour }}
    className={`pointer-events-none absolute inset-0 block rounded-[3px] bg-bunker-200 shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_-2px_6px_rgb(0_0_0/0.35)] group-hover:pointer-events-auto ${RISE_MOTION}`}
  >
    {record.coverUrl && (
      <Image
        src={record.coverUrl}
        alt=""
        fill
        sizes={`${SLEEVE}rem`}
        unoptimized
        className="rounded-[3px] object-cover"
      />
    )}
    <span
      className={`absolute inset-x-0 bottom-full mb-2 block rounded bg-bunker/90 px-2 py-1 opacity-0 ${CAPTION_MOTION}`}
    >
      <span className="block truncate text-sm text-strong">{record.name}</span>
      <span className="block truncate text-xs text-muted">
        {record.artist} · {record.year}
      </span>
    </span>
  </a>
);

/*
 * Quick enough to keep up with a sweep along a crowded crate, eased so it
 * never snaps. The small delay before rising keeps records the pointer only
 * crosses from twitching.
 */
const RISE_MOTION = [
  "transition-[translate] will-change-transform",
  "duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]",
  "group-hover:-translate-y-20 group-hover:duration-[400ms]",
  "group-hover:delay-[40ms] group-hover:ease-[cubic-bezier(0.22,1,0.36,1)]",
  "group-focus-within:-translate-y-20 group-focus-within:duration-[400ms]",
  "group-focus-within:ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-reduce:transition-none",
].join(" ");

const CAPTION_MOTION = [
  "transition-opacity duration-150",
  "group-hover:opacity-100 group-hover:duration-200 group-hover:delay-150",
  "group-focus-within:opacity-100 group-focus-within:delay-150",
].join(" ");

export default EraCrates;
