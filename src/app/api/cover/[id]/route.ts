const SPOTIFY_IMAGE_ROOT = "https://i.scdn.co/image";

/*
 * Spotify image ids are 40 hex characters. Validating against that is what
 * keeps this a cover proxy rather than an open redirect anyone can point at
 * an arbitrary host.
 */
const IMAGE_ID = /^[a-f0-9]{40}$/;

/** Covers are immutable — a Spotify image id never points at different art. */
const CACHE_CONTROL = "public, max-age=31536000, immutable";

/**
 * Serves album and artist art from this origin instead of i.scdn.co.
 *
 * Spotify's CDN sits on several tracker blocklists, so a visitor running an ad
 * blocker sees empty tiles where the covers should be. Proxying makes them
 * first-party, which no blocker touches, and lets the CDN in front of this site
 * cache them.
 */
export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> => {
  const { id } = await params;

  if (!IMAGE_ID.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const upstream = await fetch(`${SPOTIFY_IMAGE_ROOT}/${id}`, {
    next: { revalidate: 86_400 },
  });

  if (!upstream.ok) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": CACHE_CONTROL,
    },
  });
};
