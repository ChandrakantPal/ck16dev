import type { Metadata } from "next";
import Link from "next/link";
import RecordPlayer from "@/components/spotify/RecordPlayer";
import SignalCard from "@/components/signals/SignalCard";
import { getSignals } from "@/lib/signals";

export const metadata: Metadata = {
  title: "Now — Chandrakant Pal",
  description: "What I'm building, listening to, watching, and reading.",
  alternates: { canonical: "/now" },
};

/*
 * Each provider carries its own TTL through the fetch cache, so the page is
 * rebuilt on demand rather than pinned to one revalidation window.
 */
export const revalidate = 900;

const NowPage = async () => {
  const signals = await getSignals();

  return (
    <main className="site-shell px-6 pt-32 pb-24 md:px-10">
      <Link
        href="/"
        className="text-sm text-accent hover:text-accent-strong md:text-base"
      >
        ../home
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-strong md:text-5xl">
        now
      </h1>
      <p className="mt-4 text-muted md:text-xl">
        Pulled live from the places I actually leave a trace.
      </p>

      <div className="mt-12">
        <RecordPlayer />
      </div>

      <p className="mt-6">
        <Link
          href="/music"
          className="text-accent underline underline-offset-4 hover:text-accent-strong"
        >
          The full listening breakdown →
        </Link>
      </p>

      {signals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-12 space-y-12">
          {signals.map((signal) => (
            <SignalCard key={signal.source} signal={signal} />
          ))}
        </div>
      )}
    </main>
  );
};

/*
 * Reached when every provider is unconfigured or every one failed at once. The
 * page still renders, which is the point of settling them independently.
 */
const EmptyState = () => (
  <p className="mt-12 border-t border-subtle pt-10 text-muted md:text-lg">
    No signals are reporting right now. They come back on their own.
  </p>
);

export default NowPage;
