import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { BlogPost } from "@/config/blog";
import { isPublishableContentFile } from "@/config/content";
import { createFrontmatterReader } from "./frontmatter";

/*
 * Literal segments, for the same reason as content/work: Turbopack traces this
 * path statically, and a computed one makes it bundle the whole source tree
 * into the server output.
 */
const blogDirectory = join(process.cwd(), "content", "blog");

/** Published posts, newest first. */
export const getBlogPosts = (): BlogPost[] =>
  readPublishedSlugs()
    .map(readBlogPost)
    .sort(
      (first, second) =>
        second.publishedAt.getTime() - first.publishedAt.getTime(),
    );

export const findBlogPost = (slug: string): BlogPost | undefined =>
  getBlogPosts().find((post) => post.slug === slug);

const readPublishedSlugs = (): string[] => {
  if (!existsSync(blogDirectory)) {
    return [];
  }

  return readdirSync(blogDirectory)
    .filter(isPublishableContentFile)
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
};

const readBlogPost = (slug: string): BlogPost => {
  const source = readFileSync(join(blogDirectory, `${slug}.mdx`), "utf8");
  const { data, content } = matter(source);
  const frontmatter: Record<string, unknown> = data;
  const { requireString, requireDate, readStringList } =
    createFrontmatterReader(`content/blog/${slug}.mdx`);

  return {
    slug,
    title: requireString(frontmatter.title, "title"),
    summary: requireString(frontmatter.summary, "summary"),
    publishedAt: requireDate(frontmatter.publishedAt, "publishedAt"),
    tags: readStringList(frontmatter.tags, "tags"),
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
  };
};
