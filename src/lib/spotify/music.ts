import {
  getAlbumColours,
  pickDisplayCover,
  pickThumbnail,
  toProxiedCover,
} from "./artwork";
import {
  hasScope,
  isSpotifyConfigured,
  spotifyFetch,
  type SpotifyArtist,
  type SpotifyTrack,
} from "./client";

/*
 * Long enough that a page view never costs a Spotify call, short enough that
 * the page is not stale by the next day. Top lists only move weekly anyway.
 */
const REVALIDATE_SECONDS = 21_600;

export const TIME_RANGES = [
  { id: "short_term", label: "4 weeks" },
  { id: "medium_term", label: "6 months" },
  { id: "long_term", label: "all time" },
] as const;

export type TimeRangeId = (typeof TIME_RANGES)[number]["id"];

export interface RankedTrack {
  rank: number;
  id: string;
  title: string;
  artist: string;
  url?: string;
  durationMs: number;
  releaseYear?: number;
  albumId?: string;
  albumName?: string;
  albumUrl?: string;
  /** 64px, for colour extraction only. */
  coverThumbUrl?: string;
  /** 300px, what the wall renders. */
  coverUrl?: string;
}

export interface RankedArtist {
  rank: number;
  id: string;
  name: string;
  url?: string;
  imageUrl?: string;
  /** Rank in the next-longer window, for movement. Absent means new. */
  previousRank?: number;
}

export interface AlbumSwatch {
  id: string;
  name: string;
  artist: string;
  year?: number;
  coverUrl?: string;
  coverThumbUrl?: string;
  url?: string;
  /** Dominant colour of the cover. Absent for a greyscale sleeve. */
  colour?: string;
  /** How many of the top tracks come from this album. */
  trackCount: number;
}

export interface LibraryTotals {
  playlists?: number;
  savedTracks?: number;
  savedAlbums?: number;
  followedArtists?: number;
}

export interface MusicInsights {
  topTracks: Record<TimeRangeId, RankedTrack[]>;
  topArtists: Record<TimeRangeId, RankedArtist[]>;
  albums: AlbumSwatch[];
  library: LibraryTotals;
  medianDurationMs?: number;
  distinctArtists?: number;
  modalYear?: { year: number; count: number };
}

/**
 * Everything the /music page draws, gathered in one pass.
 *
 * Sections settle independently: a scope the token was never granted yields an
 * absent stat, never a failed page. Spotify stripped `genres`, `popularity`,
 * and `audio-features` from apps created after November 2024, so every figure
 * here is derived from fields that still exist.
 */
export const getMusicInsights = async (): Promise<MusicInsights | undefined> => {
  if (!isSpotifyConfigured()) {
    return undefined;
  }

  const [shortTracks, mediumTracks, longTracks] = await Promise.all(
    TIME_RANGES.map(({ id }) => fetchTopTracks(id)),
  );
  const [shortArtists, mediumArtists, longArtists] = await Promise.all(
    TIME_RANGES.map(({ id }) => fetchTopArtists(id)),
  );

  const topTracks = {
    short_term: shortTracks ?? [],
    medium_term: mediumTracks ?? [],
    long_term: longTracks ?? [],
  };

  return {
    topTracks,
    topArtists: {
      short_term: withMovement(shortArtists ?? [], mediumArtists ?? []),
      medium_term: withMovement(mediumArtists ?? [], longArtists ?? []),
      long_term: longArtists ?? [],
    },
    albums: await toAlbumSwatches(longTracks ?? []),
    library: await fetchLibraryTotals(),
    medianDurationMs: medianDuration(topTracks.long_term),
    distinctArtists: countDistinctArtists(topTracks.long_term),
    modalYear: findModalYear(topTracks.long_term),
  };
};

const fetchTopTracks = async (
  timeRange: TimeRangeId,
): Promise<RankedTrack[] | undefined> => {
  const response = await spotifyFetch<{ items: SpotifyTrack[] }>(
    `/me/top/tracks?time_range=${timeRange}&limit=50`,
    REVALIDATE_SECONDS,
  );

  return response?.items.map((track, index) => ({
    rank: index + 1,
    id: track.id,
    title: track.name,
    artist: (track.artists ?? []).map((a) => a.name).join(", "),
    url: track.external_urls?.spotify,
    durationMs: track.duration_ms,
    releaseYear: toYear(track.album?.release_date),
    albumId: track.album?.id,
    albumName: track.album?.name,
    albumUrl: track.album?.external_urls?.spotify,
    coverThumbUrl: pickThumbnail(track.album?.images),
    coverUrl: toProxiedCover(pickDisplayCover(track.album?.images)),
  }));
};

const fetchTopArtists = async (
  timeRange: TimeRangeId,
): Promise<RankedArtist[] | undefined> => {
  const response = await spotifyFetch<{ items: SpotifyArtist[] }>(
    `/me/top/artists?time_range=${timeRange}&limit=20`,
    REVALIDATE_SECONDS,
  );

  return response?.items.map((artist, index) => ({
    rank: index + 1,
    id: artist.id,
    name: artist.name,
    url: artist.external_urls?.spotify,
    imageUrl: toProxiedCover(artist.images?.[0]?.url),
  }));
};

/*
 * Each of these needs a scope the original three-scope token never had. The
 * scope is checked once against the token itself rather than discovered from
 * four 403s, so an un-widened token costs no requests at all — and the figures
 * appear on their own the moment a wider token is issued.
 */
const fetchLibraryTotals = async (): Promise<LibraryTotals> => {
  const [canReadPlaylists, canReadLibrary, canReadFollowing] =
    await Promise.all([
      hasScope("playlist-read-private"),
      hasScope("user-library-read"),
      hasScope("user-follow-read"),
    ]);

  const [playlists, savedTracks, savedAlbums, following] = await Promise.all([
    canReadPlaylists
      ? spotifyFetch<{ total: number }>(
          "/me/playlists?limit=1",
          REVALIDATE_SECONDS,
        )
      : undefined,
    canReadLibrary
      ? spotifyFetch<{ total: number }>("/me/tracks?limit=1", REVALIDATE_SECONDS)
      : undefined,
    canReadLibrary
      ? spotifyFetch<{ total: number }>("/me/albums?limit=1", REVALIDATE_SECONDS)
      : undefined,
    canReadFollowing
      ? spotifyFetch<{ artists: { total: number } }>(
          "/me/following?type=artist&limit=1",
          REVALIDATE_SECONDS,
        )
      : undefined,
  ]);

  return {
    playlists: playlists?.total,
    savedTracks: savedTracks?.total,
    savedAlbums: savedAlbums?.total,
    followedArtists: following?.artists.total,
  };
};

/** Where an artist sits now versus the next-longer window. */
const withMovement = (
  current: RankedArtist[],
  previous: RankedArtist[],
): RankedArtist[] => {
  const previousRanks = new Map(previous.map(({ id, rank }) => [id, rank]));

  return current.map((artist) => ({
    ...artist,
    previousRank: previousRanks.get(artist.id),
  }));
};

/*
 * One entry per album rather than per track, ordered by how much of the top 50
 * it accounts for — that ordering is what makes the wall read as taste rather
 * than as a list.
 */
const toAlbumSwatches = async (
  tracks: RankedTrack[],
): Promise<AlbumSwatch[]> => {
  const byAlbum = new Map<string, AlbumSwatch>();

  for (const track of tracks) {
    if (!track.albumId) {
      continue;
    }

    const existing = byAlbum.get(track.albumId);

    if (existing) {
      existing.trackCount += 1;
      continue;
    }

    byAlbum.set(track.albumId, {
      id: track.albumId,
      name: track.albumName ?? "",
      artist: track.artist,
      year: track.releaseYear,
      coverUrl: track.coverUrl,
      coverThumbUrl: track.coverThumbUrl,
      url: track.albumUrl,
      trackCount: 1,
    });
  }

  const albums = [...byAlbum.values()].sort(
    (first, second) =>
      second.trackCount - first.trackCount ||
      (first.year ?? 0) - (second.year ?? 0),
  );

  const colours = await getAlbumColours(
    albums
      .filter((album) => album.coverThumbUrl)
      .map((album) => ({
        id: album.id,
        imageUrl: album.coverThumbUrl as string,
      })),
  );
  const colourById = new Map(colours.map((c) => [c.albumId, c.colour]));

  return albums.map((album) => ({
    ...album,
    colour: colourById.get(album.id),
  }));
};

const medianDuration = (tracks: RankedTrack[]): number | undefined => {
  if (tracks.length === 0) {
    return undefined;
  }

  const sorted = tracks.map((t) => t.durationMs).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
    : sorted[middle];
};

const countDistinctArtists = (tracks: RankedTrack[]): number | undefined =>
  tracks.length === 0 ? undefined : new Set(tracks.map((t) => t.artist)).size;

const findModalYear = (
  tracks: RankedTrack[],
): { year: number; count: number } | undefined => {
  const counts = new Map<number, number>();

  for (const { releaseYear } of tracks) {
    if (releaseYear !== undefined) {
      counts.set(releaseYear, (counts.get(releaseYear) ?? 0) + 1);
    }
  }

  const ranked = [...counts.entries()].sort(
    ([, first], [, second]) => second - first,
  );
  const top = ranked[0];

  return top ? { year: top[0], count: top[1] } : undefined;
};

const toYear = (releaseDate?: string): number | undefined => {
  const year = Number(releaseDate?.slice(0, 4));
  return Number.isNaN(year) || year === 0 ? undefined : year;
};
