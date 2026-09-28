import { Feed } from "feed";
import { absoluteUrl, site } from "@/config/site";
import { getBlogPosts } from "@/lib/blog";

/*
 * Prerendered at build time — the route reads the filesystem and nothing per
 * request, so subscribers are served a static file from the CDN.
 */
export const dynamic = "force-static";

export const GET = () => {
  const posts = getBlogPosts();
  const feed = buildFeed(posts);

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};

const buildFeed = (posts: ReturnType<typeof getBlogPosts>): Feed => {
  const feed = new Feed({
    title: `${site.name} — Writing`,
    description: "Notes on building things for the web.",
    id: site.url,
    link: site.url,
    language: site.locale,
    copyright: `© ${new Date().getFullYear()} ${site.name}`,
    updated: posts[0]?.publishedAt,
    feedLinks: { rss: absoluteUrl("/feed.xml") },
    author: { name: site.name, link: site.url },
  });

  for (const post of posts) {
    const url = absoluteUrl(`/blog/${post.slug}`);

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.summary,
      date: post.publishedAt,
      category: post.tags.map((name) => ({ name })),
    });
  }

  return feed;
};
