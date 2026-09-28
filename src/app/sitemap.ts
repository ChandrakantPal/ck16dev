import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getBlogPosts } from "@/lib/blog";
import { getWorkEntries } from "@/lib/work";

/*
 * Empty collections contribute nothing — /blog stays out of the sitemap until
 * a post exists, the same rule that keeps it out of the nav.
 */
const sitemap = (): MetadataRoute.Sitemap => {
  const posts = getBlogPosts();
  const work = getWorkEntries();

  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/now"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/music"), changeFrequency: "daily", priority: 0.6 },
    { url: absoluteUrl("/uses"), changeFrequency: "monthly", priority: 0.5 },
    ...(posts.length > 0
      ? [
          {
            url: absoluteUrl("/blog"),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...work.map((entry) => ({
      url: absoluteUrl(`/work/${entry.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
};

export default sitemap;
