import jpeg from "jpeg-js";
import { unstable_cache } from "next/cache";

/*
 * Spotify serves each cover at 640, 300 and 64px. 64 is plenty to find a
 * dominant colour and costs about 2KB, so fifty albums is ~110KB per refresh.
 */
const THUMBNAIL_INDEX = -1;

/** Pixels this dark, this pale, or this grey say nothing about a cover's colour. */
const MIN_LIGHTNESS = 0.12;
const MAX_LIGHTNESS = 0.93;
const MIN_SATURATION = 0.18;
const HUE_BUCKET_DEGREES = 15;

export interface AlbumColour {
  albumId: string;
  /** Hex, or undefined when the cover is essentially greyscale. */
  colour?: string;
}

/**
 * The dominant colour of each cover, extracted server-side.
 *
 * Pixels are bucketed by hue and weighted towards saturated mid-tones, because
 * a flat average of album art is reliably a muddy brown — the mean of a cover
 * is not what anyone perceives as its colour.
 */
export const getAlbumColours = unstable_cache(
  async (albums: { id: string; imageUrl: string }[]): Promise<AlbumColour[]> =>
    Promise.all(
      albums.map(async ({ id, imageUrl }) => ({
        albumId: id,
        colour: await extractDominantColour(imageUrl),
      })),
    ),
  ["spotify-album-colours"],
  { revalidate: 86_400, tags: ["spotify-album-colours"] },
);

/**
 * Rewrites a Spotify CDN url to this site's own cover route. Blockers filter
 * i.scdn.co as a third party; they do not filter our own origin.
 */
export const toProxiedCover = (url: string | undefined): string | undefined => {
  const id = url?.split("/image/")[1];
  return id ? `/api/cover/${id}` : undefined;
};

/** Smallest cover — cheap, and plenty to find a dominant colour. */
export const pickThumbnail = (
  images: { url: string }[] | undefined,
): string | undefined => images?.at(THUMBNAIL_INDEX)?.url;

/** Middle cover (300px) — what the album wall actually shows. */
export const pickDisplayCover = (
  images: { url: string }[] | undefined,
): string | undefined =>
  images && images.length > 1 ? images[1]?.url : images?.[0]?.url;

const extractDominantColour = async (
  imageUrl: string,
): Promise<string | undefined> => {
  try {
    const response = await fetch(imageUrl, { next: { revalidate: 86_400 } });

    if (!response.ok) {
      return undefined;
    }

    const { data } = jpeg.decode(Buffer.from(await response.arrayBuffer()), {
      useTArray: true,
    });

    return dominantOf(data);
  } catch {
    /* A cover that will not decode simply has no colour; the wall still draws. */
    return undefined;
  }
};

interface HueBucket {
  weight: number;
  red: number;
  green: number;
  blue: number;
}

const dominantOf = (pixels: Uint8Array): string | undefined => {
  const buckets = new Map<number, HueBucket>();

  for (let offset = 0; offset < pixels.length; offset += 4) {
    const red = pixels[offset] ?? 0;
    const green = pixels[offset + 1] ?? 0;
    const blue = pixels[offset + 2] ?? 0;
    const { hue, saturation, lightness } = toHsl(red, green, blue);

    if (
      lightness < MIN_LIGHTNESS ||
      lightness > MAX_LIGHTNESS ||
      saturation < MIN_SATURATION
    ) {
      continue;
    }

    const key = Math.floor(hue / HUE_BUCKET_DEGREES);
    const bucket = buckets.get(key) ?? { weight: 0, red: 0, green: 0, blue: 0 };
    /* Mid-tones carry a cover's identity; near-black and near-white do not. */
    const weight = saturation * (1 - Math.abs(lightness - 0.5));

    buckets.set(key, {
      weight: bucket.weight + weight,
      red: bucket.red + red * weight,
      green: bucket.green + green * weight,
      blue: bucket.blue + blue * weight,
    });
  }

  const strongest = [...buckets.values()].sort(
    (first, second) => second.weight - first.weight,
  )[0];

  if (!strongest) {
    return undefined;
  }

  return toHex(strongest);
};

const toHex = ({ weight, red, green, blue }: HueBucket): string => {
  const channel = (total: number) =>
    Math.round(total / weight)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(red)}${channel(green)}${channel(blue)}`;
};

const toHsl = (red: number, green: number, blue: number) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) {
    return { hue: 0, saturation: 0, lightness };
  }

  const delta = max - min;
  const saturation =
    lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  const hue =
    max === r
      ? ((g - b) / delta + (g < b ? 6 : 0)) * 60
      : max === g
        ? ((b - r) / delta + 2) * 60
        : ((r - g) / delta + 4) * 60;

  return { hue, saturation, lightness };
};
