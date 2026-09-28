import type { MDXComponents } from "mdx/types";

/**
 * Case-study prose styling. Kept here rather than in a `prose` plugin so the
 * mono identity and the AA-safe `muted` token carry into MDX unchanged.
 */
export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 text-xl text-accent md:text-2xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-lg text-strong md:text-xl">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-relaxed text-muted md:text-lg">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-muted md:text-lg">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-muted md:text-lg">
      {children}
    </ol>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-accent underline underline-offset-4 hover:text-accent-strong"
      {...(href?.startsWith("http") && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {children}
    </a>
  ),
  /*
   * rehype-pretty-code stamps `data-language` on the code element it highlights
   * and leaves inline code untouched, which is how the two are told apart. The
   * highlighted markup is handed through unchanged — its per-token colours are
   * already inline styles, and re-skinning it here would fight them.
   */
  code: ({ children, ...props }) =>
    "data-language" in props ? (
      <code {...props}>{children}</code>
    ) : (
      <code className="rounded bg-bunker-400 px-1.5 py-0.5 text-sm text-strong">
        {children}
      </code>
    ),
  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className="my-6 overflow-x-auto rounded-lg border border-subtle bg-bunker-500 p-4 text-sm"
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-accent-dim pl-4 text-muted italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-subtle" />,
  /* GFM tables. Wrapped so a wide table scrolls rather than widening the page. */
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm md:text-base">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-subtle px-4 py-2 font-semibold text-accent">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-subtle px-4 py-2 text-muted">{children}</td>
  ),
  ...components,
});
