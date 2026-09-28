export interface SkillGroup {
  title: string;
  items: string[];
}

/*
 * Mirrors the skills block in the resume, trimmed to what a reader will
 * actually take in. Keep the two in sync when the resume changes.
 */
export const skillGroups: SkillGroup[] = [
  { title: "languages", items: ["TypeScript", "JavaScript"] },
  {
    title: "frontend",
    items: [
      "React",
      "Next.js",
      "Tailwind CSS",
      "Radix",
      "shadcn/ui",
      "Framer Motion",
      "D3",
      "Storybook",
    ],
  },
  {
    title: "backend",
    items: [
      "Node.js",
      "tRPC",
      "GraphQL",
      "PostgreSQL",
      "Drizzle",
      "Redis",
      "Express",
    ],
  },
  {
    title: "tooling",
    items: [
      "Vercel",
      "AWS",
      "Docker",
      "Turborepo",
      "GitHub Actions",
      "Sentry",
      "Vitest",
      "Figma",
    ],
  },
  {
    title: "concepts",
    items: [
      "SSR / SSG / PPR",
      "Accessibility",
      "SEO",
      "i18n",
      "Monorepos",
      "Caching",
      "Rate limiting",
    ],
  },
];
