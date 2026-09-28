import { readEnv } from "./env";
import { fetchRssItems, readField, readNumericField, toStars } from "./rss";
import type { Signal, SignalItem, SignalProvider } from "./types";

/*
 * Goodreads stopped issuing API keys in 2020, but per-shelf RSS still works and
 * needs only the numeric user ID from your profile URL.
 */
const CURRENT_SHELF = readEnv("GOODREADS_SHELF", "currently-reading");
const FINISHED_SHELF = "read";

export const booksProvider: SignalProvider = {
  source: "books",
  label: "reading",
  revalidateSeconds: 21600,
  isConfigured: () => Boolean(process.env.GOODREADS_USER_ID),
  fetchSignal: async (): Promise<Signal> => {
    const current = await readShelf(CURRENT_SHELF);

    /*
     * Between books the current shelf is empty, which would drop the card
     * entirely. What was last finished is still worth showing, so it stands in
     * — under a label that does not claim it is being read now.
     */
    if (current.length > 0) {
      return { source: "books", label: "reading", items: current };
    }

    return {
      source: "books",
      label: "last read",
      items: await readShelf(FINISHED_SHELF),
    };
  },
};

const readShelf = async (shelf: string): Promise<SignalItem[]> => {
  const items = await fetchRssItems(
    `https://www.goodreads.com/review/list_rss/${process.env.GOODREADS_USER_ID}?shelf=${shelf}`,
    booksProvider.revalidateSeconds,
  );

  return items.slice(0, 5).map((item) => {
    const rating = readNumericField(item, "user_rating");

    return {
      title: readField(item, "title") ?? "Untitled",
      subtitle: readField(item, "author_name"),
      /* Goodreads writes 0 for an unrated book, not an absent field. */
      detail: rating ? toStars(rating) : undefined,
      url: readField(item, "link"),
      timestamp: readField(item, "user_read_at"),
    };
  });
};
