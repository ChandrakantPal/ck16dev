"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { AlbumSwatch } from "@/lib/spotify/music";
import { PRELOADED_COVERS } from "./eagerCovers";

const MAX_ALBUMS = 18;

/** How long one album takes to slide past while you hold the edge. */
const STEP_INTERVAL_MS = 650;

/**
 * A crate of records you flip through.
 *
 * The crate is still until you reach an end of it. Hold the pointer on the last
 * record and it walks forward an album at a time, the leftmost sliding out of
 * view as a new one arrives; hold the first and it walks back. Anywhere in the
 * middle it simply sits there, so a record is never moving while you are trying
 * to look at it.
 *
 * The list is rendered twice and the offset wraps silently at the seam, so the
 * crate has no end in either direction.
 */
const CoverStrip = ({ albums }: { albums: AlbumSwatch[] }) => {
  const crate = albums.filter((album) => album.coverUrl).slice(0, MAX_ALBUMS);
  const total = crate.length;

  const [offset, setOffset] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [slot, setSlot] = useState(0);
  const [capacity, setCapacity] = useState(1);
  /* Dropped for the single frame the wrap happens in, so it is not seen. */
  const [isAnimated, setIsAnimated] = useState(true);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  /* A record's slot width drives both the travel and how many are on screen. */
  useEffect(() => {
    const viewport = viewportRef.current;
    const firstRecord = trackRef.current?.firstElementChild;

    if (!viewport || !firstRecord) {
      return;
    }

    const measure = () => {
      const width = firstRecord.getBoundingClientRect().width;

      if (width > 0) {
        setSlot(width);
        setCapacity(Math.max(1, Math.floor(viewport.clientWidth / width)));
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  /*
   * Re-runs on every step, which is what makes holding the edge repeat: the
   * track shifts, the record under the pointer changes, and the new one is
   * still an edge — so another interval is armed. Stop hovering an edge and
   * the cleanup ends it.
   */
  useEffect(() => {
    if (hovered === null) {
      return;
    }

    const direction = hovered >= offset + capacity - 1 ? 1 : hovered <= offset ? -1 : 0;

    if (direction === 0) {
      return;
    }

    const timer = setInterval(
      () => setOffset((current) => current + direction),
      STEP_INTERVAL_MS,
    );
    return () => clearInterval(timer);
  }, [hovered, offset, capacity]);

  /* Restore the transition the frame after a wrap has been applied. */
  useEffect(() => {
    if (isAnimated) {
      return;
    }

    const frame = requestAnimationFrame(() => setIsAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, [isAnimated]);

  const wrapAtSeam = useCallback(() => {
    if (offset >= total) {
      setIsAnimated(false);
      setOffset((current) => current - total);
    } else if (offset < 0) {
      setIsAnimated(false);
      setOffset((current) => current + total);
    }
  }, [offset, total]);

  if (total < 3) {
    return null;
  }

  return (
    <div
      ref={viewportRef}
      onMouseLeave={() => setHovered(null)}
      className="-mx-6 overflow-x-clip px-6 py-12 [perspective:1400px] md:mx-0 md:px-0"
    >
      <ul
        ref={trackRef}
        onTransitionEnd={wrapAtSeam}
        style={{ transform: `translate3d(${-offset * slot}px, 0, 0)` }}
        className={`flex w-max ${
          isAnimated
            ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            : ""
        } motion-reduce:transition-none`}
      >
        {[...crate, ...crate].map((album, position) => (
          <Record
            key={`${album.id}-${position}`}
            album={album}
            position={position}
            total={total}
            onEnter={() => setHovered(position)}
          />
        ))}
      </ul>
    </div>
  );
};

interface RecordProps {
  album: AlbumSwatch;
  position: number;
  total: number;
  onEnter: () => void;
}

const Record = ({ album, position, total, onEnter }: RecordProps) => {
  const isDuplicate = position >= total;
  const index = position % total;

  return (
    <li
      aria-hidden={isDuplicate || undefined}
      onMouseEnter={onEnter}
      /*
       * Only the resting depth is inline. The lift depth is left undefined so a
       * hover rule can set it — an inline custom property outranks a class.
       */
      style={{ "--rest-depth": total - index } as CSSProperties}
      className="group relative z-[var(--lift-depth,var(--rest-depth))] h-40 w-16 shrink-0 hover:[--lift-depth:50] focus-within:[--lift-depth:50] md:h-56 md:w-24"
    >
      <div
        style={{ backgroundColor: album.colour ?? "transparent" }}
        /* Square sleeve, wider than its slot — the overlap, without margins. */
        className="pointer-events-none absolute top-0 left-0 size-40 origin-left rounded-[3px] shadow-xl transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [backface-visibility:hidden] [transform:rotateY(34deg)] group-hover:shadow-2xl group-hover:[transform:rotateY(0deg)_translateZ(80px)_translateY(-1rem)] group-focus-within:shadow-2xl group-focus-within:[transform:rotateY(0deg)_translateZ(80px)_translateY(-1rem)] motion-reduce:transition-none md:size-56"
      >
        <Image
          src={album.coverUrl as string}
          alt=""
          fill
          sizes="(min-width: 768px) 14rem, 10rem"
          unoptimized
          /*
           * priority and loading are mutually exclusive in next/image, so the
           * first few preload and the rest of the real crate is merely eager —
           * the LCP can land on any visible sleeve, not just the first four.
           */
          {...(!isDuplicate && index < PRELOADED_COVERS
            ? { priority: true }
            : { loading: isDuplicate ? "lazy" : "eager" })}
          className="rounded-[3px] object-cover"
        />
      </div>

      {/* Static target: the visible slot plus the space the sleeve rises into. */}
      <a
        href={album.url}
        target="_blank"
        rel="noopener noreferrer"
        title={`${album.name} — ${album.artist}`}
        tabIndex={isDuplicate ? -1 : undefined}
        className="absolute inset-x-0 -top-6 bottom-0 rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span className="sr-only">
          {`${album.name} by ${album.artist} — ${album.trackCount} track${
            album.trackCount === 1 ? "" : "s"
          }`}
        </span>
      </a>
    </li>
  );
};

export default CoverStrip;
