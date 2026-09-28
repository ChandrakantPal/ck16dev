import { booksProvider } from "./books";
import { githubProvider } from "./github";
import { spotifyProvider } from "./spotify";
import type { Signal, SignalProvider } from "./types";

const providers: SignalProvider[] = [
  githubProvider,
  spotifyProvider,
  booksProvider,
];

/**
 * Every configured provider, settled independently. A provider that is down,
 * rate-limited, or holding a stale token costs its own card and nothing else —
 * `/now` renders whatever came back.
 */
export const getSignals = async (): Promise<Signal[]> => {
  const active = providers.filter((provider) => provider.isConfigured());

  const settled = await Promise.allSettled(
    active.map((provider) => fetchOrExplain(provider)),
  );

  return settled
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((signal) => signal.items.length > 0);
};

/*
 * A rejection here is genuinely unexpected — an unconfigured provider never
 * runs — so it is worth a server log rather than silent absence.
 */
const fetchOrExplain = async (provider: SignalProvider): Promise<Signal> => {
  try {
    return await provider.fetchSignal();
  } catch (cause) {
    console.error(`signals: "${provider.source}" failed`, cause);
    throw cause;
  }
};

export type { Signal, SignalItem, SignalProvider } from "./types";
