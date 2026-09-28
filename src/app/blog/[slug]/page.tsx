import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type BlogPost, formatPublishedDate } from "@/config/blog";
import { findBlogPost, getBlogPosts } from "@/lib/blog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  getBlogPosts().map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = findBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} — Chandrakant Pal`,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt.toISOString(),
      tags: post.tags,
    },
  };
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const post = findBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { default: PostBody } = await import(`@content/blog/${slug}.mdx`);

  return (
    <main className="site-shell px-6 pt-32 pb-24 md:px-10">
      <Link
        href="/blog"
        className="text-sm text-accent hover:text-accent-strong md:text-base"
      >
        ../writing
      </Link>
      <PostHeader post={post} />
      <article>
        <PostBody />
      </article>
    </main>
  );
};

const PostHeader = ({ post }: { post: BlogPost }) => (
  <header className="mt-6 mb-12 border-b border-subtle pb-8">
    <h1 className="text-3xl font-semibold text-strong md:text-5xl">
      {post.title}
    </h1>
    <p className="mt-4 text-muted md:text-xl">{post.summary}</p>
    <p className="mt-6 text-sm text-accent-dim md:text-base">
      <time dateTime={post.publishedAt.toISOString()}>
        {formatPublishedDate(post.publishedAt)}
      </time>
      {` · ${post.readingMinutes} min read`}
      {post.tags.length > 0 && ` · ${post.tags.join(" · ")}`}
    </p>
  </header>
);

export default BlogPostPage;
