import { getNowPlaying, isSpotifyConfigured } from "@/lib/signals/spotify";

/*
 * The route itself is never cached — the record player polls it. The Spotify
 * call underneath is cached server-side for 10 seconds and shared across every
 * visitor, which is what keeps a busy page inside Spotify's rate limit.
 */
export const dynamic = "force-dynamic";

/**
 * Always 200. The record player is decoration on a page that must render
 * without it, so a Spotify outage returns `null` rather than an error status
 * the client would have to reason about.
 */
export const GET = async (): Promise<Response> => {
  if (!isSpotifyConfigured()) {
    return Response.json(null);
  }

  try {
    return Response.json((await getNowPlaying()) ?? null);
  } catch (error) {
    console.error("spotify: now-playing failed", error);
    return Response.json(null);
  }
};
