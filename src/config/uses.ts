export interface UsesGroup {
  title: string;
  items: { name: string; note: string }[];
}

/*
 * Deliberately short. A uses page is only interesting where it says why, so an
 * entry without a reason to be there does not earn its line.
 */
export const usesGroups: UsesGroup[] = [
  {
    title: "editor",
    items: [
      { name: "VS Code", note: "Vim keybindings, and little else changed" },
      { name: "Roboto Mono", note: "the same face this site is set in" },
    ],
  },
  {
    title: "building",
    items: [
      { name: "TypeScript", note: "strict, with noUncheckedIndexedAccess on" },
      { name: "Next.js", note: "App Router; this site runs on it" },
      { name: "Tailwind CSS", note: "v4, configured in CSS rather than JS" },
      { name: "PostgreSQL", note: "the default until something forces otherwise" },
    ],
  },
  {
    title: "shipping",
    items: [
      { name: "Vercel", note: "preview deploys are most of the review" },
      { name: "GitHub Actions", note: "lint, typecheck, build on every push" },
      { name: "Sentry", note: "for the errors nobody reports" },
    ],
  },
];
