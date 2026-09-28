# Handoff — updated 2026-09-27

Where [the upgrade plan](./upgrade-plan.md) stands, and what to pick up next.

**Branch:** `refactor/phase-0-migration-foundation`, unpushed. **Everything below is
uncommitted** and sitting in the working tree — the commit split in
[Next steps](#next-steps-in-order) is drafted but not yet approved.

Phases 0-3 and 5 are complete. Phase 4 is built and structurally verified, but **no provider
that needs a secret has ever run against real credentials.**

Verified clean on 2026-09-27: `npm run lint`, `npm run typecheck`, `npm run check:contrast`,
`npm run build`, plus a smoke test of every route against a running production server (all 200
with correct content types; unknown slugs 404).

---

## What shipped this session

### Phase 3 — blog

`/blog`, `/blog/[slug]`, `/feed.xml`. Build-time Shiki highlighting via `rehype-pretty-code`,
`reading-time`, GFM tables, per-post `generateMetadata` and OG cards.

Frontmatter validation was **extracted, not duplicated**: `src/lib/frontmatter.ts` now serves
both collections, and `src/lib/work.ts` dropped from 118 lines to 55. `isPublishableContentFile`
moved to `src/config/content.ts` for the same reason.

**No post ships**, per your decision. `/blog` renders an honest empty state; the route stays out
of the nav, the command registry, and the sitemap until something is written.

### Phase 4 — signals + record player

Providers behind one `SignalProvider` interface, settled with `Promise.allSettled`. Each is
env-gated by `isConfigured()`, so an unset provider is skipped rather than failed.

**Letterboxd and WakaTime were removed on 2026-09-29.** Letterboxd was wired and correct — the
feed for `ck_16` parses, it simply had no diary entries — and WakaTime was never set up; both were
dropped by choice rather than because anything failed. `src/lib/signals/rss.ts` stays: Goodreads
still uses it, along with `fast-xml-parser`. Re-adding either is a single provider file plus one
line in `src/lib/signals/index.ts`; the git history has both.

Remaining providers: **GitHub** (no credentials), **Spotify** (live and verified), **books**
(Goodreads RSS, needs a numeric user ID).
`scripts/spotify-auth.ts` walks the OAuth flow and prints the refresh token.

The record player turns at a real 33⅓ RPM, pauses its animation when playback pauses, and uses
the tonearm angle as the progress bar. Reduced motion gets a static record and a conventional bar.

### Beyond the plan — `/music`

A dedicated Spotify page, added after the plan was written. `/now` keeps its compact "on repeat"
card and links through.

**What Spotify allows an app created after November 2024** — verified by inspecting the actual
response objects, not assumed:

| Gone | Evidence |
|---|---|
| `audio-features` (energy, valence, danceability, tempo) | 403 |
| `recommendations` | 404 |
| artist `genres` | not a key on the artist object |
| track/artist `popularity` | not a key on either object |
| `preview_url` | null on every track |

So no genre pie, no energy radar, and no in-page audio. What remains, and what the page is built
from: top tracks and artists across three time ranges, `album.release_date`, `duration_ms`, and
`recently-played`.

**What it renders.** The first pass was a decade histogram and stat tiles, which counted rather
than characterised — so it was replaced. The page is now built on **album artwork**, the most
musical material the API still returns:

| Section | What it is |
|---|---|
| `./` (hero) | **Palette strip** — every album in the top 50 as a band of its cover's dominant colour, as wide as it is played |
| `./rotation` | **Album wall** — the covers themselves, most-played first |
| `./eras` | **Era spectrum** — one mark per track on its release year, tinted by its album's colour |
| `./turntable` | The record player |
| `./top` | Artists as faces, tracks as a list, with rank movement, behind one shared time-range control |
| footer | The counting, demoted to a single line — it is a footnote, not the point |

**Colour extraction** (`src/lib/spotify/artwork.ts`) decodes Spotify's 64px cover thumbnails with
`jpeg-js` — pure JS, chosen over `sharp` to avoid a native binary in the Vercel build. Pixels are
bucketed by hue and weighted towards saturated mid-tones, because a flat average of album art is
reliably a muddy brown. ~110KB per refresh for fifty covers, cached 24h.

Nothing uses a charting library; the marks are the site's own tokens. Note that the colour here
is the artwork's own, not an assigned categorical encoding, so it carries no legend — and
identity never rests on it: every band is a focusable link with an accessible name, the era plot
ships an `sr-only` year/count distribution, and the wall names every album in text.

**Watch the client payload.** `TopLists` is the only client component, and passing it the full
`RankedTrack` records put 150 tracks with cover URLs and album ids into the HTML — 223KB. It now
takes deliberately narrower `ListedArtist`/`ListedTrack` props, sliced to what it draws: 144KB.
Keep those types slim.

**Requires the re-issued six-scope token.** Until then `/me/playlists`, `/me/tracks`,
`/me/albums`, and `/me/following` return 403; `spotifyFetch` treats 403 as an absent value with a
named warning, so the three library tiles simply do not render and the page says why.

### Phase 5 — discoverability + polish

Per-route metadata and canonicals, dynamic OG cards, `sitemap.ts`, `robots.ts`, JSON-LD `Person`,
`@vercel/analytics`, `next-themes`, README, and GitHub Actions CI.

Also completed the Phase 1 command set now that its destinations exist: `open <target>`, `theme`,
`resume`, and nav entries for `now` and `uses`.

---

## Defects found and fixed along the way

Worth reading before trusting any of it — several were pre-existing.

| Where | Defect |
|---|---|
| `package.json` | Next 16.3.1 sat inside a **critical RCE advisory** (16.0.0–16.3.2). Patched to 16.3.6; `npm audit` is clean. |
| `globals.css` / everywhere | `text-green-700` scored **3.77:1** on the dark surface and was used at body size in `Work.tsx` and the blog routes — an **AA violation shipped in Phase 0** that survived the Phase 2 review. |
| `spotify.ts` | The token refresh used `cache: "no-store"`, silently dragging `/now` out of static generation into per-request rendering — the exact rate-limit trap the plan warns about. Now isolated in `unstable_cache`. |
| `rss.ts` | Titles rendered as `Bill & Ted&#039;s Excellent Adventure`; the parser needed `htmlEntities: true`. |
| `layout.tsx` | A root-level `canonical: "/"` was inherited by every route, so every page claimed to be the home page. |
| `CommandProvider.tsx` | `goToSection` set `window.location.hash`, so from `/now` it produced `/now#about` and could not get home. Now router-backed `navigate(href)`. |
| `config/nav.ts` | Bare `#about` anchors resolved against whatever route the visitor was on. Now root-relative `/#about`. |
| `useNowPlaying.ts` | The first draft added elapsed-since-sync to an already-advanced value, double-counting progress. Now recomputed from a stored baseline. |

**Contrast is now enforced rather than audited once.** `npm run check:contrast` parses the tokens
straight out of `globals.css` and fails if any falls below its floor in either theme; CI runs it.
It found five real failures, including two the ad-hoc check missed.

---

## Gotchas that will bite otherwise

- **`content/*/_template.mdx` is compiled into the bundle** even though it never publishes — the
  dynamic-import glob in each route picks it up. Break its MDX syntax and the build fails.
- **`remark-frontmatter` needs `"yaml"` as its option**, not `{}`. Plugins are named as strings
  because Turbopack resolves them in its own loader.
- **Content paths must stay literal.** `join(process.cwd(), "content", "blog")` is statically
  traceable; building it from an imported constant makes Turbopack bundle the whole source tree
  into the server output. This is why `work.ts` and `blog.ts` each keep their own `readdirSync`
  rather than sharing one — only the validators are shared.
- **The light theme wins on source order, not specificity.** `:root` (from `@theme`) and `.light`
  both score 0,1,0; `.light` is emitted later. Moving it earlier in `globals.css` silently breaks
  the light theme.
- **`text-subtle` is borders-only** and is deliberately under the text floor. Use `text-muted`.
- **OG card fonts are read from disk**, not fetched, so the build never depends on the network.
  `src/app/_og/*.ttf` must stay in the repo.

---

## Next steps, in order

1. **Re-run the Spotify auth script** for the six-scope token (`playlist-read-private`,
   `user-library-read`, `user-follow-read` were added), then replace `SPOTIFY_REFRESH_TOKEN` in
   `.env.local`. This lights up the three library stat tiles on `/music`. Everything else already
   works on the original token.

2. **Supply the remaining Phase 4 credentials.** Copy `.env.example` to `.env.local` and fill in what you
   have. For Spotify: create an app, add `http://127.0.0.1:8888/callback` as a Redirect URI, then
   `SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... npx tsx scripts/spotify-auth.ts`.

   Then verify what has never been exercised:
   - Play, pause, and skip in a real Spotify client — confirm the disc stops on pause and the
     tonearm position matches actual track progress.
   - `/now` with books configured.
   - Break one provider deliberately and confirm only its card disappears.

3. **Commit the working tree.** See the split below.

4. **Remaining audits** that need a browser: keyboard-only pass over every surface, a
   reduced-motion pass with the DevTools rendering panel, and Lighthouse on `/`, `/now`, `/uses`.
   The contrast pass is automated and already green.

5. **Content, when you are ready** — the first case study and the first post. Each is a small,
   well-marked change; see [When the first entry is written](#when-the-first-entry-is-written).

### Commit split

File-by-file would leave broken intermediates, so these are grouped by what builds:

| # | Message | Roughly |
|---|---|---|
| 1 | `chore: patch next past the rce advisory` | `package.json`, `package-lock.json` |
| 2 | `refactor: replace skill ratings with grouped lists` | `src/config/skills.ts`, `src/components/Skills.tsx`, deleted `Skill.tsx`, deleted logo PNGs |
| 3 | `feat: add the mdx case-study pipeline` | `next.config.ts`, `src/config/work.ts`, `src/lib/work.ts`, `src/mdx-components.tsx`, `src/app/work/[slug]/`, `src/components/Work.tsx`, `src/app/page.tsx`, `content/work/`, `tsconfig.json`, `src/types/` |
| 4 | `content: reposition the intro and about copy` | `src/components/About.tsx`, `src/components/Introduction.tsx` |
| 5 | `feat: add the blog and rss feed` | `src/config/blog.ts`, `src/config/content.ts`, `src/lib/{blog,frontmatter}.ts`, `src/app/blog/`, `src/app/feed.xml/`, `content/blog/` |
| 6 | `feat: add the signals layer and record player` | `src/lib/signals/`, `src/components/{signals,spotify}/`, `src/app/{now,uses}/`, `src/app/api/`, `src/config/uses.ts`, `scripts/spotify-auth.ts`, `.env.example` |
| 6b | `feat: add the /music spotify insights page` | `src/lib/spotify/`, `src/components/music/`, `src/app/music/` |
| 7 | `feat: add semantic colour tokens and a light theme` | `src/styles/globals.css`, the 20 renamed component files, `scripts/check-contrast.mjs` |
| 8 | `feat: complete the command registry and fix cross-route nav` | `src/config/nav.ts`, `src/lib/commands/`, `src/components/command/` |
| 9 | `feat: add metadata, og cards, sitemap and analytics` | `src/config/site.ts`, `src/app/_og/`, `opengraph-image.tsx` ×3, `sitemap.ts`, `robots.ts`, `StructuredData.tsx`, `layout.tsx` |
| 10 | `chore: add ci and rewrite the readme` | `.github/workflows/ci.yml`, `README.md` |
| 11 | `docs: record the phase 3-5 outcome` | `docs/` |

Commits 3, 5, 6 and 7 must each stay whole — splitting them leaves a build that does not compile.

---

## Decided

**No case studies ship** (2026-09-11). The KarmaSuite material is not cleared, and a thin or
hedged write-up is worse than none.

**No blog posts ship** (2026-09-27). Same reasoning, your call: the pipeline is the deliverable.

**Attribution, when case studies are written: unnamed employer.** The role field reads "Senior
engineer, grant-management platform" rather than naming KarmaSuite, matching `About.tsx`.

**GitHub's card falls back to repositories, filtered.** Public events return nothing for this
account (GitHub keeps ~90 days; recent work is private). The fallback excludes forks and anything
untouched for 90 days, so it currently stays **empty rather than resurfacing the tutorial clones**
Phase 2 buried. It will populate on the next public push — including this branch.

---

## When the first entry is written

**A case study** — three edits in one change:
1. `content/work/<slug>.mdx`, from `_template.mdx`.
2. `{ title: "work", href: "/#work" }` appended to `src/config/nav.ts`.
3. Nothing else: the `work` command and the sitemap entry both derive from the entries.

**A post** — two edits:
1. `content/blog/<slug>.mdx`, from `_template.mdx`.
2. `{ title: "blog", href: "/blog" }` appended to `src/config/nav.ts`.

Both are held back deliberately: `Work.tsx` returns `null` and `/blog` shows an empty state, so
linking them early would point visitors at nothing.

---

## Still open

**The `$100M+` claim contradicts itself and should be fixed at the source.**
`scripts/data.ts` says *"Prevented $100M+ in annual funding leakage."* `resume_contributions.md`'s
own recommended bullet says *"Prevented $1M+"*, and separately describes the platform as
*processing* $100M+ in grant funds. Fix it on the resume before any of it reaches the site.

**Whether the KarmaSuite engineering stories are publishable at all.** The three with the clearest
public story are Funds Remaining, Expense Planned, and Grant Reconciliation. Each can be told as an
engineering problem naming no internal files, migrations, or customer figures — but that is a call
for you and KarmaSuite.

**`resume_contributions.md` is employer-internal.** Treat as unpublishable until cleared.

**`/uses` content is a starting point, not gospel** — `src/config/uses.ts` was written from the
skills config and this repo's own stack. Correct anything that is not actually true.
