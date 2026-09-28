import type { Metadata } from "next";
import Link from "next/link";
import AlbumWall from "@/components/music/AlbumWall";
import CoverStrip from "@/components/music/CoverStrip";
import EraSpectrum from "@/components/music/EraSpectrum";
import TopLists, {
  type ListedArtist,
  type ListedTrack,
} from "@/components/music/TopLists";
import RecordPlayer from "@/components/spotify/RecordPlayer";
import {
  getMusicInsights,
  TIME_RANGES,
  type MusicInsights,
  type TimeRangeId,
} from "@/lib/spotify/music";

export const metadata: Metadata = {
  title: "Music — Chandrakant Pal",
  description: "What I listen to, pulled live from Spotify.",
  alternates: { canonical: "/music" },
};

export const revalidate = 21600;

const MusicPage = async () => {
  const insights = await getMusicInsights();

  if (!insights) {
    return (
      <Shell>
        <p className="mt-12 border-t border-subtle pt-10 text-muted md:text-lg">
          Spotify isn&apos;t connected right now. It comes back on its own.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <section className="mt-8">
        <CoverStrip albums={insights.albums} />
      </section>

      <section className="mt-16">
        <h2 className="text-lg text-accent md:text-xl">./rotation</h2>
        <div className="mt-6">
          <AlbumWall albums={insights.albums} />
        </div>
      </section>

      <section className="mt-16 border-t border-subtle pt-8">
        <h2 className="text-lg text-accent md:text-xl">./turntable</h2>
        <div className="mt-8">
          <RecordPlayer />
        </div>
      </section>

      <section className="mt-16 border-t border-subtle pt-8">
        <h2 className="text-lg text-accent md:text-xl">./eras</h2>
        <EraSpectrum
          tracks={insights.topTracks.long_term}
          albums={insights.albums}
        />
      </section>

      <section className="mt-16 border-t border-subtle pt-8">
        <h2 className="text-lg text-accent md:text-xl">./top</h2>
        <div className="mt-6">
          <TopLists
            artists={toListedArtists(insights)}
            tracks={toListedTracks(insights)}
          />
        </div>
      </section>

      <Footnote insights={insights} />
    </Shell>
  );
};

const ARTISTS_SHOWN = 9;
const TRACKS_SHOWN = 10;

const byRange = <T,>(
  build: (range: TimeRangeId) => T,
): Record<TimeRangeId, T> =>
  Object.fromEntries(
    TIME_RANGES.map(({ id }) => [id, build(id)]),
  ) as Record<TimeRangeId, T>;

const toListedArtists = (insights: MusicInsights) =>
  byRange<ListedArtist[]>((range) =>
    insights.topArtists[range]
      .slice(0, ARTISTS_SHOWN)
      .map(({ id, rank, name, url, imageUrl, previousRank }) => ({
        id,
        rank,
        name,
        url,
        imageUrl,
        previousRank,
      })),
  );

const toListedTracks = (insights: MusicInsights) =>
  byRange<ListedTrack[]>((range) =>
    insights.topTracks[range]
      .slice(0, TRACKS_SHOWN)
      .map(({ id, rank, title, artist, url }) => ({
        id,
        rank,
        title,
        artist,
        url,
      })),
  );

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="site-shell px-6 pt-32 pb-24 md:px-10">
    <Link
      href="/now"
      className="text-sm text-accent hover:text-accent-strong md:text-base"
    >
      ../now
    </Link>
    <h1 className="mt-6 text-3xl font-semibold text-strong md:text-5xl">
      music
    </h1>
    <p className="mt-4 text-muted md:text-xl">Pulled live from Spotify.</p>
    {children}
  </main>
);

/*
 * The counting lives down here on purpose. The page is about what the listening
 * looks like; this is a footnote to it, not the point of it.
 *
 * Figures a scope does not cover are simply absent — a visitor has no use for
 * which Spotify endpoint returned 403, and the server already logs it.
 */
const Footnote = ({ insights }: { insights: MusicInsights }) => {
  const { library, medianDurationMs, distinctArtists, modalYear } = insights;

  const facts = [
    distinctArtists !== undefined && `${distinctArtists} artists in the top 50`,
    modalYear && `${modalYear.count} of them from ${modalYear.year}`,
    medianDurationMs !== undefined &&
      `median track ${formatDuration(medianDurationMs)}`,
    library.playlists !== undefined && `${library.playlists} playlists`,
    library.savedTracks !== undefined &&
      `${library.savedTracks.toLocaleString("en-GB")} saved tracks`,
    library.followedArtists !== undefined &&
      `${library.followedArtists} artists followed`,
  ].filter((fact): fact is string => Boolean(fact));

  if (facts.length === 0) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-subtle pt-8 text-sm text-strong">
      <p>{facts.join(" · ")}</p>
    </footer>
  );
};

const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.round(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);

  return `${minutes}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

export default MusicPage;
