import { XMLParser } from "fast-xml-parser";
import { fetchText } from "./http";

export type RssItem = Record<string, unknown>;

/**
 * Goodreads publishes plain RSS with no auth and no API key, which is why the
 * books provider needs nothing but a numeric user ID.
 */
export const fetchRssItems = async (
  url: string,
  revalidateSeconds: number,
): Promise<RssItem[]> => {
  const xml = await fetchText(url, { revalidateSeconds });
  /*
   * htmlEntities decodes the numeric references these feeds carry — without it
   * a title renders as `Bill & Ted&#039;s Excellent Adventure`.
   */
  const parsed: unknown = new XMLParser({
    ignoreAttributes: true,
    htmlEntities: true,
  }).parse(xml);
  const items = readPath(parsed, ["rss", "channel", "item"]);

  if (items === undefined) {
    return [];
  }

  /* A single-entry channel parses to one object rather than a list of one. */
  const list = Array.isArray(items) ? items : [items];
  return list.filter(isRecord);
};

/** RSS values arrive as strings or numbers depending on their content. */
export const readField = (item: RssItem, key: string): string | undefined => {
  const value = item[key];

  if (typeof value === "string") {
    return value.trim() || undefined;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return undefined;
};

export const readNumericField = (
  item: RssItem,
  key: string,
): number | undefined => {
  const value = readField(item, key);
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

/** `★★★★` from `4`, `★★★★½` from `4.5`. */
export const toStars = (rating: number): string =>
  "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "");

const readPath = (value: unknown, path: string[]): unknown =>
  path.reduce<unknown>(
    (current, key) => (isRecord(current) ? current[key] : undefined),
    value,
  );

const isRecord = (value: unknown): value is RssItem =>
  typeof value === "object" && value !== null && !Array.isArray(value);
