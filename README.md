# ck16.dev

My personal site, and the portfolio piece itself — a dark mono terminal-flavoured
Next.js app with a command palette, an interactive shell, MDX content, and a
live "now" page fed by the services I actually use.

**Live:** [ck16.dev](https://ck16.dev)

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) ·
Tailwind CSS 4 (CSS-first `@theme`) · MDX · Motion · cmdk

## Running it

```bash
npm install
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Layout

```
content/          MDX — case studies (work/) and posts (blog/)
src/app/          Routes, metadata, OG cards, sitemap, feed
src/components/   UI, including the command surfaces and the record player
src/config/       Typed content: nav, skills, uses, site identity
src/lib/          Content loaders, the command registry, the signal providers
```

## Content

Both collections are MDX with typed frontmatter, validated at build time — a
missing or malformed field fails the build naming the file and the field rather
than rendering `undefined`.

Start from the templates: `content/work/_template.mdx` and
`content/blog/_template.mdx`. A leading underscore marks a file as unpublished,
so drafts can live alongside published entries.

## The command surfaces

`⌘K` (or `Ctrl+K`) opens the palette; `terminal` opens the shell. Both read the
same registry in `src/lib/commands/registry.ts`, so a command defined once
appears in both. Everything is reachable without a keyboard shortcut — there is
a visible trigger in the header and in the mobile drawer.

## Live data

`/now` composes signal providers in `src/lib/signals/`. Each one implements
`SignalProvider`, and `getSignals()` settles them with `Promise.allSettled`, so
a provider that is down, rate-limited, or unconfigured costs its own card and
nothing else.

Every provider is optional — copy `.env.example` to `.env.local` and fill in
only what you want. GitHub needs no credentials at all.

For Spotify, `npx tsx scripts/spotify-auth.ts` walks the authorization-code flow
locally and prints the refresh token.

## Accessibility

Non-negotiable, and checked per change:

- Every interactive surface is keyboard-operable; nav is real anchors.
- `prefers-reduced-motion` is honoured everywhere — the typewriter, the scroll
  reveals, and the record player all have static fallbacks.
- Text colours are semantic tokens with contrast verified in both themes; the
  `subtle` token is borders-only and never used for text.
