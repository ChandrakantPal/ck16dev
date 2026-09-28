/**
 * Canonical identity for this site. Anything that needs an absolute URL — the
 * RSS feed, metadata, the sitemap, JSON-LD — reads it from here so the domain
 * is stated once.
 */
export const site = {
  url: "https://ck16.dev",
  name: "Chandrakant Pal",
  title: "Chandrakant Pal — Software Engineer",
  description:
    "Senior software engineer based in India. I work end to end — interfaces, APIs, and the data underneath.",
  locale: "en",
  github: "https://github.com/ChandrakantPal",
  linkedin: "https://www.linkedin.com/in/chandrakant-pal",
  resume: "https://resume.i3dly.dev",
} as const;

/** `https://ck16.dev/blog/some-post` from `/blog/some-post`. */
export const absoluteUrl = (path: string): string =>
  new URL(path, site.url).toString();
