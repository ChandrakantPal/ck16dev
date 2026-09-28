"use client";

import { useEffect, useRef, useState } from "react";
import type { NowPlaying } from "@/lib/signals/spotify";

/** Matches the route's 10s server cache; polling faster only repeats answers. */
const POLL_INTERVAL_MS = 15_000;
const TICK_INTERVAL_MS = 1_000;

interface ProgressBaseline {
  syncedAt: number;
  progressMs: number;
}

/**
 * The current track, refreshed while the tab is visible.
 *
 * Between polls the elapsed time is advanced locally, so the tonearm creeps
 * continuously instead of jumping every fifteen seconds. A hidden tab polls
 * nothing at all — background tabs are the easy way to burn a rate limit.
 */
export const useNowPlaying = (): NowPlaying | undefined => {
  const [nowPlaying, setNowPlaying] = useState<NowPlaying>();
  /* Progress is always recomputed from this, never incremented in place. */
  const baseline = useRef<ProgressBaseline>({ syncedAt: 0, progressMs: 0 });

  useEffect(() => {
    let isCancelled = false;

    const sync = async () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      try {
        const response = await fetch("/api/spotify/now-playing");
        const track = (await response.json()) as NowPlaying | null;

        if (isCancelled) {
          return;
        }

        baseline.current = {
          syncedAt: Date.now(),
          progressMs: track?.progressMs ?? 0,
        };
        setNowPlaying(track ?? undefined);
      } catch {
        /* Offline or mid-deploy. Keep showing the last known track. */
      }
    };

    void sync();
    const pollTimer = setInterval(sync, POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", sync);

    return () => {
      isCancelled = true;
      clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const isPlaying = nowPlaying?.isPlaying ?? false;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const tickTimer = setInterval(() => {
      setNowPlaying((current) =>
        current ? withElapsedProgress(current, baseline.current) : current,
      );
    }, TICK_INTERVAL_MS);

    return () => clearInterval(tickTimer);
  }, [isPlaying, nowPlaying?.title]);

  return nowPlaying;
};

/*
 * Derived from the last synced position rather than the displayed one, so a
 * throttled timer in a backgrounded tab cannot accumulate drift.
 */
const withElapsedProgress = (
  track: NowPlaying,
  { syncedAt, progressMs }: ProgressBaseline,
): NowPlaying => {
  const elapsed = Date.now() - syncedAt;
  const advanced = Math.min(progressMs + elapsed, track.durationMs);

  return advanced === track.progressMs
    ? track
    : { ...track, progressMs: advanced };
};
