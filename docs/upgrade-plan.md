# Upgrade ck16.dev into a craft showcase

> **Status — 2026-09-10.** Phase 0 is complete and Phase 1 is complete apart from the commands
> whose destinations later phases create. Everything lives on `refactor/phase-0-migration-foundation`
> (10 commits, unpushed, unmerged). Phases 2-5 have not started. Per-phase status notes are inline
> below; the plan text itself is unchanged from the version approved on 2026-08-15.

## Context

`ck16dev` (live at **ck16.dev** and ck16dev.vercel.app) is a single-page Next.js 12 portfolio last
touched **March 2023**. It has three kinds of problem:

**It shows no work.** The `<Work />` section is commented out in `src/pages/index.tsx:64`, along with
every `workRef` line feeding it. Visitors see Intro → About → Skills → Contact and zero projects. The
six projects sitting unused in `src/utils/project.config.ts` are all tutorial clones (Netflix, Hulu,
Airbnb, Twitter) — weaker than showing nothing for someone now working as an engineer.

**The stack is four majors behind.** Next 12 (EOL, no security patches) against Next 16.3.1;
Tailwind 3 against 4.3.3. `react-typist` and `aos` have both been untouched since June 2022. Every
`next/image` call uses `layout="fill"` + `objectFit`, an API removed in Next 13 — that alone blocks
the upgrade.

**It has real defects.** A leaking scroll listener, a keyboard-inoperable nav, body text under the
WCAG AA contrast floor, and no OG image / sitemap / structured data, so link shares render blank.

**The goal:** the site itself becomes the portfolio piece — interactive, memorable, and evidently
well-built — while keeping the existing dark mono identity rather than rewriting from scratch.

**Decisions already made:** incremental upgrade in place (keep design + component structure);
MDX blog; real case studies replacing the clones; ⌘K command palette **and** an opt-in terminal mode;
a `/now` page fed by live data; **Instagram is out** (Basic Display API shut down 2024-12-04; the
replacement needs a Professional account and a 60-day refresh cron — not worth the rot);
live sources are **GitHub, Spotify, Letterboxd, WakaTime, and books**; plus a **vinyl record player**
for Spotify.

---

## Guiding constraints

- **Keep the identity.** `#0D1117` background, Roboto Mono, lowercase section headers, the `>_` menu
  button. The terminal work should feel like the payoff of a design that was already pointing there.
- **Every interactive thing must work without a keyboard shortcut and without a mouse.** The terminal
  is additive; standard nav stays fully intact beneath it.
- **Respect `prefers-reduced-motion` everywhere.** Typewriter, scroll reveals, and the spinning record
  all need a static fallback. Today `aos` respects nothing.
- **One failing API must never break a page.** All live data degrades gracefully.

---

## Phase 0 — Migration foundation (blocks everything else)

**Status: done.** Next 12→16, React 19, Pages→App Router, Tailwind 3→4 (`tailwind.config.js`
deleted in favour of CSS-first `@theme`), `next/font/google`, `react-typist`→`useTypewriter`,
`aos`→`motion` via `Reveal`, every defect in the table above, `src/config/nav.ts`, and the
`lint`/`typecheck` scripts have all landed.

Nothing below Phase 0 can land on Next 12. Do this first, ship it, verify the site looks unchanged.

**Next 12 → 16, Pages Router → App Router.** `src/pages/{index,_app}.tsx` →
`src/app/{layout,page}.tsx`. Run `npx @next/codemod@latest upgrade` for the mechanical parts, then
hand-fix the five `next/image` usages (`About.tsx`, `Project.tsx`, `Contact.tsx` ×2, `Skill.tsx`):
`layout="fill" objectFit="contain"` → `fill` + `className="object-contain"`. Hand-fixing beats the
`next-image-experimental` codemod here — there are only five, and the codemod leaves a wrapper-span
mess.

**Tailwind 3 → 4.** Run `npx @tailwindcss/upgrade`, add `@tailwindcss/postcss` to
`postcss.config.js`. `tailwind.config.js` dissolves into CSS-first `@theme` in `globals.css`: the
`bunker` palette, the `slide` keyframes, the `spacing.200` entry, and the hand-rolled `.container`
component plugin (Tailwind 4's own container handles this — delete the plugin).

**Fonts.** Delete the `@import url('...fonts.googleapis.com...')` at the top of
`src/styles/globals.css` — it is render-blocking and third-party. Replace with `next/font/google`'s
`Roboto_Mono` in `layout.tsx`, which self-hosts and eliminates the layout shift.

**Drop both animation libraries.**
- `react-typist` (used in `Introduction.tsx`) → a local `useTypewriter` hook in `src/hooks/`.
  Returns the full string immediately under reduced-motion.
- `aos` (`data-aos` attributes across `About`, `Skills`, `Skill`, `Work`, `Project`; `init()` in
  `index.tsx` and again per-instance in `Project.tsx:12`) → `motion` (v13.1.0) with `whileInView`,
  which honours reduced-motion natively.

**Fix the defects:**

| Where | Defect | Fix |
|---|---|---|
| `Header.tsx:32` | `window.addEventListener` returns `undefined`; that gets stored in `scrollCallBack` and passed to `removeEventListener`, so **the scroll listener is never removed** | Named handler const, `{ passive: true }`, real cleanup |
| `Header.tsx:36-46` | Imperative `classList.add/remove` fighting React | Drive an `isHidden` state → `className` |
| `index.tsx:20` | `ref.current.scrollIntoView` unguarded — throws if the ref is null | Deleted entirely (see below) |
| `Project.tsx:29` | `target="_blank"` with no `rel` | `rel="noopener noreferrer"` |
| `Header.tsx` / `SideDrawer.tsx` | Nav items are `<div onClick>` — **not tabbable, not keyboard-operable, no semantics** | Real `<a href="#about">` |
| everywhere | Body copy is `text-gray-500` (#6b7280) on `#0d1117` ≈ **4.0:1, under the 4.5:1 AA floor** | Semantic `@theme` tokens; muted copy to ~#9ca3af (≈6.6:1) |
| `package.json` | ESLint installed, no `lint` script | Add `lint` + `typecheck` scripts |

**Delete the whole ref-scrolling apparatus.** Replacing nav with anchor links removes
`scrollToRef`, all four `useRef`s, the `forwardRef` wrappers on `Introduction`/`About`/`Skills`/
`Contact`, and the ref props threaded through `Header` and `SideDrawer` — roughly 40 lines of
plumbing replaced by `href="#about"`, `scroll-margin-top`, and `html { scroll-behavior: smooth }`
(guarded by reduced-motion). It also fixes the keyboard bug and the null-ref bug at once.

**Also de-duplicate** the nav item array, which is currently copy-pasted in `Header.tsx:63-67` and
`SideDrawer.tsx:26-30` — hoist to `src/config/nav.ts`.

---

## Phase 1 — Terminal + command palette

**Status: architecture done, command set partial.** `src/lib/commands/registry.ts`, the `cmdk`
palette, `Terminal.tsx`/`useTerminal.ts`, and a visible `CommandTrigger` are in. The registry
currently carries `help`, `ls`, `cat`, `whoami`, `history`, `clear`, `exit`, `sudo`, `github`,
`linkedin`, and the three nav sections. Still to add — each blocked on the phase that creates its
destination: `work`, `blog`, `now`, `uses`, `theme`, `resume`, and a generic `open <target>`.

The identity piece. Both surfaces read **one shared command registry** — that shared source of truth
is the point, and it's what makes this read as engineering rather than as a gimmick.

```
src/lib/commands/registry.ts   // Command { id, name, aliases, description, group, run(args, ctx) }
src/components/palette/        // cmdk (v1.1.1) — ⌘K / Ctrl+K
src/components/terminal/       // Terminal.tsx, useTerminal.ts (history, cursor, tab-complete)
```

Commands: `help`, `ls`, `cat <file>`, `whoami`, `work`, `blog`, `now`, `uses`, `open <target>`,
`theme`, `contact`, `resume`, `clear`, `history`, plus an easter egg or two.

Accessibility, non-negotiable: output region is `role="log"` `aria-live="polite"`; a real `<input>`
(never a contenteditable div); Escape closes; a **visible trigger button** so mouse and touch users
can reach both — `cmdk` gives us focus trapping and listbox semantics for free.

---

## Phase 2 — Content overhaul

**Status: not started.** Note that the Work section was deleted rather than left commented out
(`8e9ae4f`), taking `src/utils/project.config.ts` with it — so `src/config/work.ts`,
`content/work/*.mdx`, and `/work/[slug]` are a rebuild, not an edit. The copy in `About.tsx` still
reads "self-taught software developer" and "Learn.Build.Repeat.", and `src/config/skills.ts` still
holds `proficiency` scores that `Skill.tsx` renders as `[****......] 8/10 and learning`.

**Re-enable Work and replace the clones.** Widen `src/utils/project.config.ts` (rename to
`src/config/work.ts`) from `{ link, title, stack }` to `{ slug, title, summary, role, stack[], year,
links, metrics }`, with long-form write-ups as MDX in `content/work/*.mdx` rendering at
`/work/[slug]`. Two or three real case studies — problem, approach, tradeoffs, outcome — beat six
clones. `Project.tsx` also currently renders the *same* `project.png` placeholder for every project;
give each a real screenshot or a generated card.

**Rewrite the copy.** `Introduction.tsx` and `About.tsx` still say "self-taught software developer"
and "Learn.Build.Repeat." — reposition to what you do now.

**Kill the skill ratings.** `Skill.tsx` renders `[****......] 8/10 and learning` from hardcoded
self-scores in `Skills.tsx:14-52`. Self-assigned numbers invite doubt and mean nothing to a reader.
Replace with grouped lists (Languages / Frameworks / Data / Tooling) — and move the data out of the
component body into `src/config/skills.ts`.

---

## Phase 3 — Blog

**Status: not started.** No `content/` directory, no MDX dependencies, no `/blog` or `/feed.xml`.

`@next/mdx` (16.3.1) + `gray-matter` for typed frontmatter, `rehype-pretty-code` + `shiki` for
highlighting, `remark-gfm`, `reading-time`. Routes: `/blog`, `/blog/[slug]`,
`/feed.xml` via `feed` (v6.0.0). Posts live in `content/blog/*.mdx` and use
`generateStaticParams` + `generateMetadata`, so each post gets its own real title and OG card.

---

## Phase 4 — The signals layer + record player

**Status: not started.** No `src/lib/signals/`, no `/now`, no `/uses`, no `scripts/spotify-auth.ts`.
Blocked on the credentials listed under "What I need from you".

**One provider abstraction, not five bolted-on API routes.** This is the architectural core:

```ts
// src/lib/signals/types.ts
export interface SignalProvider {
  source: string
  revalidateSeconds: number
  fetchSignal(): Promise<Signal>
}
```

`src/lib/signals/{github,spotify,letterboxd,wakatime,books}.ts` each implement it;
`getSignals()` runs them through **`Promise.allSettled`** so a dead provider yields an absent card
instead of a broken page. Per-provider TTLs via `fetch(..., { next: { revalidate: n } })`, which
means caching happens **server-side and shared across visitors** — essential, because Spotify allows
only ~180 requests per rolling 30s window and naive per-visitor polling would blow through it.

| Source | Auth | Notes |
|---|---|---|
| GitHub | none (or a token for higher limits) | Recent commits + repos |
| Spotify | OAuth refresh token (doesn't expire) | `currently-playing`, `recently-played`, `top-read` |
| Letterboxd | **none** — plain RSS at `/{user}/rss/` | `fast-xml-parser`; carries rating + watched date |
| WakaTime | single API key | Languages, editors, weekly hours |
| Books | Goodreads shelf RSS, or Hardcover GraphQL | Goodreads stopped issuing API keys in 2020 |

**The record player** — `src/components/spotify/RecordPlayer.tsx`:

- Vinyl disc with grooves via `repeating-radial-gradient`; album art clipped circular as the centre label.
- Spins at a real **33⅓ RPM = 1.8s per rotation**. `animation-play-state: paused` when playback is
  paused — so the record genuinely stops when your music does.
- **Tonearm tracks actual progress**: arm angle interpolated from `progressMs / durationMs`, so it
  creeps inward across the track. The arm *is* the progress bar.
- Idle state: arm parked on its rest, record still, showing the most recently played track.
- Reduced-motion: no spin, static record, conventional progress bar instead.
- Client component polling `/api/spotify/now-playing`, gated on `document.visibilityState` so hidden
  tabs stop polling.

Then `/now` composes the signal cards, and `/uses` is static content.

**Deliverable:** `scripts/spotify-auth.ts`, a one-time local script to walk the authorization-code
flow and print the refresh token — the fiddliest part of Spotify setup, worth automating once.

---

## Phase 5 — Discoverability + polish

**Status: not started.** The root `metadata` block in `layout.tsx` is the only piece in place.
Still missing: per-route `generateMetadata`, `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`,
JSON-LD, `@vercel/analytics`, `next-themes`, the README rewrite, and GitHub Actions CI.

- `generateMetadata` per route (the current title is literally `ck16dev`); **dynamic OG cards** via
  `opengraph-image.tsx` + `ImageResponse` — itself a nice craft flex, and it fixes blank link shares.
- `src/app/sitemap.ts`, `src/app/robots.ts`, JSON-LD `Person` schema.
- `@vercel/analytics`; `next-themes` for the light/dark toggle the palette exposes.
- Final audit: keyboard-only pass over every interactive surface, contrast pass, Lighthouse.
- Rewrite `README.md` — still verbatim `create-next-app` boilerplate.
- GitHub Actions CI: `lint` + `typecheck` + `build`.

---

## What I need from you

1. **Spotify** — a Spotify Developer app (client ID + secret). I'll script the refresh-token step.
2. **Usernames** — Letterboxd, WakaTime API key, and whether books come from Goodreads RSS (needs
   your numeric user ID) or Hardcover.
3. **Case study material** — which 2-3 projects, and what you can say publicly about KarmaSuite work.
4. **A resume PDF**, if you want `/resume` and the palette's `resume` command to resolve.

Phases 0-3 need none of this and can proceed immediately.

---

## Verification

Per phase, not just at the end:

- **Phase 0 is a no-visual-change refactor** — the strongest signal is that the site looks identical.
  `yarn build` clean, no console warnings, then diff screenshots at 375/768/1440px against the
  current live site. Confirm in DevTools that the scroll listener count doesn't grow on navigation
  (proving the `Header.tsx:32` leak is gone).
- **Keyboard-only pass**: unplug the mouse. Tab through nav, open/close the palette, drive the
  terminal, reach every link. This is the check the current site fails outright.
- **Reduced-motion pass**: `prefers-reduced-motion: reduce` in DevTools rendering panel — typewriter
  shows full text, no scroll reveals, record doesn't spin.
- **Contrast**: axe DevTools on every route, zero AA violations.
- **Signals resilience**: deliberately break each provider (bad token, bogus username) and confirm
  `/now` still renders with that one card absent.
- **Record player**: play, pause, and skip in a real Spotify client; confirm the disc stops on pause
  and the tonearm position matches actual track progress.
- **Lighthouse** ≥95 on Performance/Accessibility/SEO for `/`, `/blog/[slug]`, `/now`.
- **Social cards**: validate `/`, a post, and `/work/[slug]` in a card debugger.

## Out of scope

Instagram (API shut down; would need an account conversion and a refresh cron). No from-scratch
rewrite. No CMS — content stays as MDX in the repo. No comments system.
