import { fetchRssItems, readField, readNumericField, toStars } from "./rss";
import type { Signal, SignalProvider } from "./types";

/*
 * Goodreads stopped issuing API keys in 2020, but per-shelf RSS still works and
 * needs only the numeric user ID from your profile URL.
 */
const shelf = process.env.GOODREADS_SHELF ?? "currently-reading";

export const booksProvider: SignalProvider = {
  source: "books",
  label: "reading",
  revalidateSeconds: 21600,
  isConfigured: () => Boolean(process.env.GOODREADS_USER_ID),
  fetchSignal: async (): Promise<Signal> => {
    const items = await fetchRssItems(
      `https://www.goodreads.com/review/list_rss/${process.env.GOODREADS_USER_ID}?shelf=${shelf}`,
      booksProvider.revalidateSeconds,
    );

    return {
      source: "books",
      label: "reading",
      items: items.slice(0, 5).map((item) => {
        const rating = readNumericField(item, "user_rating");

        return {
          title: readField(item, "title") ?? "Untitled",
          subtitle: readField(item, "author_name"),
          /* Goodreads writes 0 for an unrated book, not an absent field. */
          detail: rating ? toStars(rating) : undefined,
          url: readField(item, "link"),
          timestamp: readField(item, "user_read_at"),
        };
      }),
    };
  },
};
