"use client";

import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { NowPlaying } from "@/lib/signals/spotify";
import { useNowPlaying } from "./useNowPlaying";

/*
 * Tonearm travel, in degrees of rotation about its pivot. Parked clear of the
 * record when idle; between the outer and inner groove while a track plays.
 */
const ARM_PARKED_DEGREES = -14;
const ARM_OUTER_GROOVE_DEGREES = 16;
const ARM_INNER_GROOVE_DEGREES = 32;

/**
 * A turntable that reflects real playback: it turns at 33 1/3 RPM while the
 * music plays, stops dead when it is paused, and tracks progress with the
 * tonearm rather than a progress bar.
 */
const RecordPlayer = () => {
  const nowPlaying = useNowPlaying();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!nowPlaying) {
    return null;
  }

  return (
    <figure className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <Turntable
        nowPlaying={nowPlaying}
        prefersReducedMotion={prefersReducedMotion}
      />
      <TrackDetails
        nowPlaying={nowPlaying}
        prefersReducedMotion={prefersReducedMotion}
      />
    </figure>
  );
};

interface TurntableProps {
  nowPlaying: NowPlaying;
  prefersReducedMotion: boolean;
}

const Turntable = ({ nowPlaying, prefersReducedMotion }: TurntableProps) => {
  const { isPlaying, albumImageUrl, album } = nowPlaying;
  const isSpinning = isPlaying && !prefersReducedMotion;

  return (
    <div
      className="relative aspect-square w-56 shrink-0 md:w-64"
      aria-hidden="true"
    >
      <div className="absolute inset-0 rounded-full bg-bunker-400 shadow-lg" />

      <div
        className="absolute inset-[5%] rounded-full vinyl-grooves animate-record"
        style={{
          animationPlayState: isSpinning ? "running" : "paused",
          /* Reduced motion gets no animation at all, not a paused one. */
          animationName: prefersReducedMotion ? "none" : undefined,
        }}
      >
        <div className="absolute inset-[33%] overflow-hidden rounded-full bg-bunker-300">
          {albumImageUrl && (
            <Image
              src={albumImageUrl}
              alt={album}
              fill
              sizes="6rem"
              className="object-cover"
              unoptimized
            />
          )}
        </div>
        <div className="absolute top-1/2 left-1/2 size-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bunker-600" />
      </div>

      <div className="pointer-events-none absolute inset-[5%] rounded-full vinyl-sheen" />

      <Tonearm nowPlaying={nowPlaying} />
    </div>
  );
};

/** The arm *is* the progress bar: its angle is the track position. */
const Tonearm = ({ nowPlaying }: { nowPlaying: NowPlaying }) => (
  <div
    className="absolute top-[6%] right-[6%] h-[6%] w-[6%] origin-center transition-transform duration-1000 ease-linear"
    style={{ transform: `rotate(${armAngle(nowPlaying)}deg)` }}
  >
    <div className="absolute inset-0 rounded-full border border-subtle bg-bunker-300" />
    <div className="absolute top-1/2 right-1/2 h-[12%] w-[230%] origin-right -translate-y-1/2 rotate-[125deg] rounded-full bg-gray-400">
      <div className="absolute top-1/2 left-0 h-[300%] w-[12%] -translate-y-1/2 rounded-sm bg-gray-300" />
    </div>
  </div>
);

const armAngle = ({ isPlaying, progressMs, durationMs }: NowPlaying): number => {
  if (!isPlaying || durationMs <= 0) {
    return ARM_PARKED_DEGREES;
  }

  const played = Math.min(progressMs / durationMs, 1);
  const travel = ARM_INNER_GROOVE_DEGREES - ARM_OUTER_GROOVE_DEGREES;

  return ARM_OUTER_GROOVE_DEGREES + travel * played;
};

const TrackDetails = ({ nowPlaying, prefersReducedMotion }: TurntableProps) => {
  const { isPlaying, title, artist, trackUrl, progressMs, durationMs } =
    nowPlaying;

  return (
    <figcaption className="min-w-0 text-center sm:text-left">
      <p className="text-sm text-accent-dim">
        {isPlaying ? "now playing" : "last played"}
      </p>
      <p className="mt-2 truncate text-lg text-strong md:text-xl">
        {trackUrl ? (
          <a
            href={trackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-accent hover:underline"
          >
            {title}
          </a>
        ) : (
          title
        )}
      </p>
      <p className="mt-1 truncate text-muted">{artist}</p>

      {/* The tonearm carries progress for everyone else; this is its stand-in. */}
      {prefersReducedMotion && isPlaying && durationMs > 0 && (
        <ProgressBar progressMs={progressMs} durationMs={durationMs} />
      )}
    </figcaption>
  );
};

const ProgressBar = ({
  progressMs,
  durationMs,
}: {
  progressMs: number;
  durationMs: number;
}) => {
  const percent = Math.round((progressMs / durationMs) * 100);

  return (
    <div
      className="mt-4 h-1 w-full max-w-56 overflow-hidden rounded-full bg-bunker-300"
      role="progressbar"
      aria-label="Track progress"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default RecordPlayer;
