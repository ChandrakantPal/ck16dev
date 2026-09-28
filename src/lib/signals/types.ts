/** One line in a signal card. Optional fields simply don't render. */
export interface SignalItem {
  title: string;
  subtitle?: string;
  detail?: string;
  url?: string;
  /** ISO 8601. Rendered as a `<time>` element when present. */
  timestamp?: string;
}

export interface Signal {
  source: string;
  label: string;
  items: SignalItem[];
}

/**
 * One live data source. Every provider implements this and nothing more, which
 * is what lets `getSignals` treat them uniformly and lets a dead one drop out
 * without the others noticing.
 */
export interface SignalProvider {
  source: string;
  label: string;
  /**
   * Server-side, shared across every visitor. Spotify allows roughly 180
   * requests per rolling 30 seconds, so per-visitor polling is not an option.
   */
  revalidateSeconds: number;
  /** False when the provider's credentials are absent; it is then skipped. */
  isConfigured: () => boolean;
  fetchSignal: () => Promise<Signal>;
}
