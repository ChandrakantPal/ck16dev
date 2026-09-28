import { unstable_cache } from "next/cache";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const API_ROOT = "https://api.spotify.com/v1";

export const isSpotifyConfigured = (): boolean =>
  Boolean(
    process.env.SPOTIFY_CLIENT_ID &&
      process.env.SPOTIFY_CLIENT_SECRET &&
      process.env.SPOTIFY_REFRESH_TOKEN,
  );

/**
 * One request to the Web API.
 *
 * Returns undefined rather than throwing on the three statuses that are states
 * rather than failures: 204 (nothing playing), 404 (no active device), and 403
 * (a scope the current refresh token was never granted). Everything else
 * throws, so a real outage is still loud.
 */
export const spotifyFetch = async <T>(
  path: string,
  revalidateSeconds: number,
): Promise<T | undefined> => {
  const { value: accessToken } = await fetchAccessToken();
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: revalidateSeconds },
  });

  if (response.status === 204 || response.status === 404) {
    return undefined;
  }

  if (response.status === 403) {
    console.warn(
      `spotify: ${path} needs a scope this token lacks — re-run scripts/spotify-auth.ts`,
    );
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`Spotify ${path} responded ${response.status}`);
  }

  return (await response.json()) as T;
};

/*
 * Access tokens last an hour. The refresh is a POST, which Next never puts in
 * the fetch cache, and an uncached fetch during render would force every page
 * that touches Spotify to render dynamically. unstable_cache gives the token
 * its own cache entry instead: shared across instances, and isolated so the
 * POST cannot drag a static route out of static generation.
 */
const TOKEN_TTL_SECONDS = 3000;

interface AccessToken {
  value: string;
  /** Exactly what this refresh token was minted with. */
  scopes: string[];
}

const fetchAccessToken = unstable_cache(
  async (): Promise<AccessToken> => {
    const credentials = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString("base64");

    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: process.env.SPOTIFY_REFRESH_TOKEN ?? "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Spotify token refresh responded ${response.status}`);
    }

    const token = (await response.json()) as {
      access_token: string;
      scope?: string;
    };

    return {
      value: token.access_token,
      scopes: (token.scope ?? "").split(" ").filter(Boolean),
    };
  },
  ["spotify-access-token"],
  /* Ten minutes short of the hour, so a token never dies mid-request. */
  { revalidate: TOKEN_TTL_SECONDS, tags: ["spotify-access-token"] },
);

/**
 * Whether the current refresh token carries a scope.
 *
 * A refresh token is minted with a fixed scope set — adding scopes to the auth
 * script does not widen a token already issued. Checking first turns four
 * guaranteed 403s per build into no request at all, and starts working on its
 * own once a wider token is issued.
 */
export const hasScope = async (scope: string): Promise<boolean> => {
  const { scopes } = await fetchAccessToken();
  return scopes.includes(scope);
};

/** Shapes shared by every Spotify-backed feature. */
export interface SpotifyArtist {
  id: string;
  name: string;
  images?: { url: string }[];
  external_urls?: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit?: boolean;
  artists?: { name: string }[];
  album?: {
    id: string;
    name: string;
    release_date?: string;
    images?: { url: string }[];
    external_urls?: { spotify: string };
  };
  external_urls?: { spotify: string };
}
