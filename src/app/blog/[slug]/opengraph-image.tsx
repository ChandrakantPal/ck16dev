import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/app/_og/card";
import { findBlogPost, getBlogPosts } from "@/lib/blog";

export const alt = "Blog post";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const generateStaticParams = () =>
  getBlogPosts().map(({ slug }) => ({ slug }));

const BlogPostOgImage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const post = findBlogPost(slug);

  if (!post) {
    notFound();
  }

  return renderOgCard({
    eyebrow: "./blog",
    title: post.title,
    subtitle: post.summary,
  });
};

export default BlogPostOgImage;
