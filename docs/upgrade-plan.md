# Upgrade ck16.dev into a craft showcase

> **Status — 2026-09-27.** Phases 0-3 and 5 are complete. Phase 4 is built and structurally
> verified but **unproven against live credentials** — every provider is env-gated, and only
> GitHub and Letterboxd have been exercised against real data. Everything lives on
> `refactor/phase-0-migration-foundation` (11 commits **plus a large, verified, still
> uncommitted working tree**, unpushed, unmerged). `npm run lint`, `npm run typecheck`,
> `npm run check:contrast`, and `npm run build` are all clean as of 2026-09-27, and every route
> was smoke-tested against a running production server.
>
> **Immediate next action: commit the working tree** — the split is drafted in
> [handoff.md](./handoff.md). Spotify is verified against live data; `/now` and `/music` both
> render from it. Letterboxd and WakaTime were dropped on 2026-09-29.
>
> Added beyond the plan: **`/music`**, a Spotify insights page — see the handoff for what the
> API still permits for apps created after November 2024 (most of the interesting endpoints are
> deprecated). It needs the re-issued six-scope token for its library figures.
>
> Still deliberately dormant: **no case study** and **no blog post** ship, by decision, so the
> `Work` section renders nothing, `/blog` shows an empty state, and neither is linked from the
> nav, the command registry, or the sitemap. Per-phase notes are inline below; the plan text
> itself is unchanged from the version approved on 2026-08-15.

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
live sources are **GitHub, Spotify, and books**; plus a **vinyl record player** for Spotify.
(Letterboxd and WakaTime were dropped on 2026-09-29 — see the handoff.)

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

**Status: done.** `src/lib/commands/registry.ts`, the `cmdk`
palette, `Terminal.tsx`/`useTerminal.ts`, and a visible `CommandTrigger` are in. The registry carries
`help`, `ls`, `cat`, `whoami`, `history`, `clear`, `exit`, `sudo`, `open <target>`, `theme`,
`github`, `linkedin`, `resume`, and the nav entries (`about`, `skills`, `now`, `uses`, `contact`).
`work` and `blog` remain unregistered on purpose — both destinations are empty by decision.

Phase 5 also replaced `goToSection`, which set `window.location.hash` and so could not leave the
current route, with a router-backed `navigate(href)`. Nav hrefs became root-relative (`/#about`)
at the same time: bare anchors resolved against `/now` and `/blog` once those routes existed.

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

**Status: done, deliberately empty.** The skill ratings are gone (grouped lists now, sourced from
the resume) and the copy is rewritten. `src/config/work.ts`, `src/lib/work.ts`, the `@next/mdx`
pipeline, `/work/[slug]`, and the home-page `Work` listing are all in and verified end to end.
**No case study ships**: the KarmaSuite material is not cleared for publication, so the decision on
2026-09-11 was to write none for now rather than ship a hedged write-up. `Work` returns `null` with
no entries, and the `#work` nav item and `work` command stay unregistered so neither points at a
section that does not render. Reversing that is three small edits, listed in
[handoff.md](./handoff.md).

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

**Status: done, deliberately empty.** `/blog`, `/blog/[slug]`, and `/feed.xml` are in, with
`rehype-pretty-code` + Shiki highlighting at build time, `reading-time`, GFM tables, and per-post
`generateMetadata`. Frontmatter validation is shared with Phase 2 through
`src/lib/frontmatter.ts` — extracted rather than duplicated — and a malformed field fails the
build naming the file and the field.

**No post ships**, matching the Phase 2 decision: `/blog` renders an honest empty state, and the
route stays out of the nav, the command registry, and the sitemap until something is written.
Authoring starts from `content/blog/_template.mdx`.

Verified the same way Phase 2 was: a temporary fixture post exercised frontmatter, highlighting,
inline-vs-block code, and GFM; the RSS output was checked as valid RSS 2.0; deleting a required
field failed the build with `"publishedAt" must be a YYYY-MM-DD date`; then the fixture was
removed.

`@next/mdx` (16.3.1) + `gray-matter` for typed frontmatter, `rehype-pretty-code` + `shiki` for
highlighting, `remark-gfm`, `reading-time`. Routes: `/blog`, `/blog/[slug]`,
`/feed.xml` via `feed` (v6.0.0). Posts live in `content/blog/*.mdx` and use
`generateStaticParams` + `generateMetadata`, so each post gets its own real title and OG card.

---

## Phase 4 — The signals layer + record player

**Status: built, not yet proven against live credentials.** All five providers, `getSignals()`,
the record player, `/now`, `/uses`, `/api/spotify/now-playing`, and `scripts/spotify-auth.ts` are
in. Every provider is env-gated via `isConfigured()`, so an unset one is skipped rather than
failing — `.env.example` documents each.

**Verified:** every provider deliberately broken at once (bogus usernames, bad tokens) — each
failed independently, each logged by source, and `/now` still rendered. The RSS parsing path was
exercised against a real public feed before Letterboxd was dropped; Goodreads still uses it.

**Two defects found and fixed during that pass:**
- The Spotify token refresh used `cache: "no-store"`, which silently dragged `/now` out of static
  generation into per-request rendering — precisely the rate-limit trap this phase warns about.
  The refresh now lives in its own `unstable_cache` entry and `/now` is static again.
- RSS titles rendered as `Bill & Ted&#039;s Excellent Adventure`; the XML parser needed
  `htmlEntities: true`.

**Still unproven:** books has never run against real credentials. The
record player has never seen a live track, so the tonearm-tracks-progress behaviour and the
stops-on-pause behaviour are unverified in practice.

GitHub deserves a note: the public events API returns nothing for this account (GitHub keeps ~90
days, and the recent work is private), so the card falls back to recently-pushed repositories —
filtered to non-forks touched within 90 days, which currently means it stays empty rather than
resurfacing the tutorial clones Phase 2 buried.

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

**Status: done.** Per-route metadata and canonicals, dynamic OG cards (`src/app/_og/card.tsx`,
rendering in vendored Roboto Mono so the build never depends on the network), `sitemap.ts`,
`robots.ts`, JSON-LD `Person`, `@vercel/analytics`, `next-themes`, the README rewrite, and
GitHub Actions CI are all in.

A root-level `canonical: "/"` was briefly inherited by every route, making each page claim to be
the home page; canonicals are now set per route.

**The light theme is a real one, not a toggle over dark styling.** 71 hardcoded Tailwind shades
across 20 files became semantic tokens (`strong`, `muted`, `subtle`, `accent`, `accent-strong`,
`accent-dim`, `danger`) that re-point under `.light`, so no component knows the theme exists.

**Contrast is now enforced, not audited once.** `npm run check:contrast` parses the tokens
straight out of `globals.css` and fails if any drops below its floor in either theme; CI runs it.
It caught five genuine failures, including a pre-existing one: `text-green-700` scored **3.77:1**
on the dark surface and was in use at body size in `Work.tsx` and the blog routes — an AA
violation that shipped in Phase 0 and survived the Phase 2 review.

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
