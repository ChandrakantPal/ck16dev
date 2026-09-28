export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  publishedAt: Date;
  tags: string[];
  /** Estimated from the MDX body, never hand-written in frontmatter. */
  readingMinutes: number;
}

/** `27 Sep 2026` — stable across locales, unlike toLocaleDateString's default. */
export const formatPublishedDate = (date: Date): string =>
  date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
