import type { Metadata } from "next";
import Link from "next/link";
import { formatPublishedDate } from "@/config/blog";
import { getBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Writing — Chandrakant Pal",
  description: "Notes on building things for the web.",
  alternates: { canonical: "/blog" },
};

const BlogIndexPage = () => {
  const posts = getBlogPosts();

  return (
    <main className="site-shell px-6 pt-32 pb-24 md:px-10">
      <Link
        href="/"
        className="text-sm text-accent hover:text-accent-strong md:text-base"
      >
        ../home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-strong md:text-5xl">
        writing
      </h1>
      <p className="mt-4 text-muted md:text-xl">
        Notes on building things for the web.
      </p>

      {posts.length === 0 ? <EmptyState /> : <PostList posts={posts} />}
    </main>
  );
};

const PostList = ({ posts }: { posts: ReturnType<typeof getBlogPosts> }) => (
  <ul className="mt-12 space-y-10 border-t border-subtle pt-10">
    {posts.map(({ slug, title, summary, publishedAt, readingMinutes }) => (
      <li key={slug}>
        <article>
          <Link
            href={`/blog/${slug}`}
            className="text-xl text-strong underline-offset-4 hover:text-accent hover:underline md:text-2xl"
          >
            {title}
          </Link>
          <p className="mt-2 text-muted md:text-lg">{summary}</p>
          <p className="mt-3 text-sm text-accent-dim md:text-base">
            <time dateTime={publishedAt.toISOString()}>
              {formatPublishedDate(publishedAt)}
            </time>
            {` · ${readingMinutes} min read`}
          </p>
        </article>
      </li>
    ))}
  </ul>
);

/*
 * An honest empty state beats a 404: the route is real and the feed is live,
 * there is simply nothing in it yet.
 */
const EmptyState = () => (
  <p className="mt-12 border-t border-subtle pt-10 text-muted md:text-lg">
    Nothing published yet. The pipeline is built and the{" "}
    <Link
      href="/feed.xml"
      className="text-accent underline underline-offset-4 hover:text-accent-strong"
    >
      feed
    </Link>{" "}
    is live — first post is being written.
  </p>
);

export default BlogIndexPage;
