import { toProxiedCover } from "@/lib/spotify/artwork";
import {
  isSpotifyConfigured,
  spotifyFetch,
  type SpotifyTrack,
} from "@/lib/spotify/client";
import type { Signal, SignalProvider } from "./types";

/** What the record player needs to draw itself. */
export interface NowPlaying {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl?: string;
  trackUrl?: string;
  progressMs: number;
  durationMs: number;
}

export { isSpotifyConfigured };

/**
 * The current track, or the most recent one when nothing is playing — the
 * record player parks its tonearm rather than showing an empty turntable.
 * Returns undefined only when Spotify knows of no track at all.
 */
export const getNowPlaying = async (): Promise<NowPlaying | undefined> => {
  const current = await spotifyFetch<CurrentlyPlaying>(
    "/me/player/currently-playing",
    10,
  );

  if (current?.item) {
    return toNowPlaying(current.item, {
      isPlaying: current.is_playing,
      progressMs: current.progress_ms ?? 0,
    });
  }

  return getMostRecentTrack();
};

export const spotifyProvider: SignalProvider = {
  source: "spotify",
  label: "on repeat",
  revalidateSeconds: 3600,
  isConfigured: isSpotifyConfigured,
  fetchSignal: async (): Promise<Signal> => {
    const top = await spotifyFetch<{ items: SpotifyTrack[] }>(
      "/me/top/tracks?time_range=short_term&limit=5",
      spotifyProvider.revalidateSeconds,
    );

    return {
      source: "spotify",
      label: "on repeat",
      items: (top?.items ?? []).map((track) => ({
        title: track.name,
        subtitle: toArtistNames(track),
        url: track.external_urls?.spotify,
      })),
    };
  },
};

const getMostRecentTrack = async (): Promise<NowPlaying | undefined> => {
  const recent = await spotifyFetch<{ items: { track: SpotifyTrack }[] }>(
    "/me/player/recently-played?limit=1",
    300,
  );
  const track = recent?.items[0]?.track;

  return track
    ? toNowPlaying(track, { isPlaying: false, progressMs: 0 })
    : undefined;
};

const toNowPlaying = (
  track: SpotifyTrack,
  { isPlaying, progressMs }: { isPlaying: boolean; progressMs: number },
): NowPlaying => ({
  isPlaying,
  progressMs,
  title: track.name,
  artist: toArtistNames(track),
  album: track.album?.name ?? "",
  albumImageUrl: toProxiedCover(track.album?.images?.[0]?.url),
  trackUrl: track.external_urls?.spotify,
  durationMs: track.duration_ms,
});

const toArtistNames = (track: SpotifyTrack): string =>
  (track.artists ?? []).map((artist) => artist.name).join(", ");

interface CurrentlyPlaying {
  is_playing: boolean;
  progress_ms?: number;
  item?: SpotifyTrack;
}
