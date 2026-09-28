import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { isPublishableContentFile } from "@/config/content";
import type { WorkEntry } from "@/config/work";
import { createFrontmatterReader } from "./frontmatter";

/*
 * Case studies live outside src/ so they read as content rather than code. The
 * segments stay literal: Turbopack traces this path statically, and a computed
 * one makes it bundle the entire project into the server output.
 */
const workDirectory = join(process.cwd(), "content", "work");

/** Published case studies, newest first. */
export const getWorkEntries = (): WorkEntry[] =>
  readPublishedSlugs()
    .map(readWorkEntry)
    .sort((first, second) => second.year - first.year);

export const findWorkEntry = (slug: string): WorkEntry | undefined =>
  getWorkEntries().find((entry) => entry.slug === slug);

const readPublishedSlugs = (): string[] => {
  if (!existsSync(workDirectory)) {
    return [];
  }

  return readdirSync(workDirectory)
    .filter(isPublishableContentFile)
    .map((fileName) => fileName.replace(/\.mdx$/, ""));
};

const readWorkEntry = (slug: string): WorkEntry => {
  const source = readFileSync(join(workDirectory, `${slug}.mdx`), "utf8");
  const frontmatter: Record<string, unknown> = matter(source).data;
  const { requireString, requireNumber, readStringList, readRecordList } =
    createFrontmatterReader(`content/work/${slug}.mdx`);

  return {
    slug,
    title: requireString(frontmatter.title, "title"),
    summary: requireString(frontmatter.summary, "summary"),
    role: requireString(frontmatter.role, "role"),
    year: requireNumber(frontmatter.year, "year"),
    stack: readStringList(frontmatter.stack, "stack"),
    links: readRecordList(frontmatter.links, "links").map((link) => ({
      label: requireString(link.label, "links[].label"),
      url: requireString(link.url, "links[].url"),
    })),
    metrics: readRecordList(frontmatter.metrics, "metrics").map((metric) => ({
      label: requireString(metric.label, "metrics[].label"),
      value: requireString(metric.value, "metrics[].value"),
    })),
  };
};
