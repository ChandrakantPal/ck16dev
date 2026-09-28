"use client";

import Image from "next/image";
import { useState } from "react";
import { TIME_RANGES, type TimeRangeId } from "@/lib/spotify/music";

/*
 * Deliberately narrower than RankedArtist / RankedTrack. Everything in these
 * props crosses to the browser, so the lists carry only what they draw — the
 * full records keep album ids, cover URLs and durations on the server.
 */
export interface ListedArtist {
  id: string;
  rank: number;
  name: string;
  url?: string;
  imageUrl?: string;
  previousRank?: number;
}

export interface ListedTrack {
  id: string;
  rank: number;
  title: string;
  artist: string;
  url?: string;
}

interface TopListsProps {
  artists: Record<TimeRangeId, ListedArtist[]>;
  tracks: Record<TimeRangeId, ListedTrack[]>;
}

/**
 * One time-range control above both lists, so they always show the same slice
 * rather than each carrying its own filter.
 */
const TopLists = ({ artists, tracks }: TopListsProps) => {
  const [range, setRange] = useState<TimeRangeId>("short_term");

  return (
    <div>
      <div
        role="group"
        aria-label="Time range"
        className="flex flex-wrap gap-2"
      >
        {TIME_RANGES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={range === id}
            onClick={() => setRange(id)}
            className={`rounded border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              range === id
                ? "border-accent text-accent"
                : "border-subtle text-muted hover:text-strong"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <ArtistList artists={artists[range]} />
        <TrackList tracks={tracks[range]} />
      </div>
    </div>
  );
};

/* Faces rather than a numbered list — an artist is recognised, not counted. */
const ArtistList = ({ artists }: { artists: ListedArtist[] }) => (
  <section>
    <h3 className="text-lg text-accent md:text-xl">./artists</h3>
    {artists.length === 0 ? (
      <EmptyRange />
    ) : (
      <ol className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {artists.map((artist) => (
          <li key={artist.id}>
            <a
              href={artist.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <div className="relative aspect-square overflow-hidden rounded-full bg-bunker-400">
                {artist.imageUrl && (
                  <Image
                    src={artist.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 8rem, 40vw"
                    unoptimized
                    className="object-cover transition-opacity group-hover:opacity-80"
                  />
                )}
              </div>
              <p className="mt-2 truncate text-sm text-strong">{artist.name}</p>
              <Movement artist={artist} />
            </a>
          </li>
        ))}
      </ol>
    )}
  </section>
);

const TrackList = ({ tracks }: { tracks: ListedTrack[] }) => (
  <section>
    <h3 className="text-lg text-accent md:text-xl">./tracks</h3>
    {tracks.length === 0 ? (
      <EmptyRange />
    ) : (
      <ol className="mt-4 space-y-3">
        {tracks.map((track) => (
          <li key={track.id} className="flex items-baseline gap-3">
            <span className="w-6 shrink-0 text-sm text-muted tabular-nums">
              {track.rank}
            </span>
            <span className="min-w-0">
              <ExternalName name={track.title} url={track.url} />
              <span className="block text-sm text-muted">{track.artist}</span>
            </span>
          </li>
        ))}
      </ol>
    )}
  </section>
);

const ExternalName = ({ name, url }: { name: string; url?: string }) =>
  url ? (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-strong underline-offset-4 hover:text-accent hover:underline"
    >
      {name}
    </a>
  ) : (
    <span className="text-strong">{name}</span>
  );

/*
 * Movement against the next-longer window. The arrow is decorative — the words
 * beside it carry the meaning, so this never depends on the glyph alone.
 */
const Movement = ({ artist }: { artist: ListedArtist }) => {
  if (artist.previousRank === undefined) {
    return <span className="block text-xs text-accent-dim">new</span>;
  }

  const change = artist.previousRank - artist.rank;

  if (change === 0) {
    return null;
  }

  return (
    <span className="block text-xs text-muted tabular-nums">
      <span aria-hidden="true">{change > 0 ? "▲" : "▼"}</span>{" "}
      {Math.abs(change)}
      <span className="sr-only">
        {change > 0 ? " places up" : " places down"} on the longer window
      </span>
    </span>
  );
};

const EmptyRange = () => (
  <p className="mt-4 text-muted">Not enough listening history in this window.</p>
);

export default TopLists;
