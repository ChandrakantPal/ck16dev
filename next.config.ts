import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

/*
 * Turbopack resolves these in its own loader, so plugins are named rather than
 * imported. remark-frontmatter only teaches the parser to recognise the `---`
 * block so it stops rendering as a thematic break; gray-matter is what actually
 * reads the values out of it.
 *
 * rehype-pretty-code highlights at build time via Shiki, so no highlighter
 * ships to the browser. keepBackground: false drops Shiki's own background so
 * the `pre` styling in src/mdx-components.tsx keeps the bunker palette.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-frontmatter", "yaml"], ["remark-gfm", {}]],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        { theme: "github-dark-default", keepBackground: false },
      ],
    ],
  },
});

export default withMDX(nextConfig);
