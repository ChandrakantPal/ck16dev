import { readEnv } from "./env";
import { fetchJson } from "./http";
import type { Signal, SignalItem, SignalProvider } from "./types";

/*
 * Public events need no credentials. A token only raises the rate limit from
 * 60 to 5000 requests an hour, which the shared cache makes academic — so this
 * provider is always configured.
 */
const username = readEnv("GITHUB_USERNAME", "ChandrakantPal");

const REVALIDATE_SECONDS = 900;
const MAX_ITEMS = 5;

/*
 * GitHub keeps only about 90 days of public events, and nothing at all for
 * private work. Repositories are the fallback, held to the same window so a
 * quiet card stays empty rather than filling with things last touched years
 * ago.
 */
const RECENT_ACTIVITY_DAYS = 90;

export const githubProvider: SignalProvider = {
  source: "github",
  label: "shipping",
  revalidateSeconds: REVALIDATE_SECONDS,
  isConfigured: () => true,
  fetchSignal: async (): Promise<Signal> => {
    const commits = await fetchRecentCommits();
    const items = commits.length > 0 ? commits : await fetchRecentRepos();

    return { source: "github", label: "shipping", items };
  },
};

const fetchRecentCommits = async (): Promise<SignalItem[]> => {
  const events = await fetchGitHub<GitHubPushEvent[]>(
    `/users/${username}/events/public?per_page=30`,
  );

  return events
    .filter((event) => event.type === "PushEvent")
    .flatMap((event) =>
      (event.payload.commits ?? []).map((commit) => ({
        /* Commit bodies are noise in a one-line card. */
        title: commit.message.split("\n", 1)[0] ?? commit.message,
        subtitle: event.repo.name,
        url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
        timestamp: event.created_at,
      })),
    )
    .slice(0, MAX_ITEMS);
};

const fetchRecentRepos = async (): Promise<SignalItem[]> => {
  const repos = await fetchGitHub<GitHubRepo[]>(
    `/users/${username}/repos?sort=pushed&direction=desc&per_page=10&type=owner`,
  );

  return repos
    .filter((repo) => !repo.fork && !repo.archived && isRecent(repo.pushed_at))
    .slice(0, MAX_ITEMS)
    .map((repo) => ({
      title: repo.name,
      subtitle: repo.description ?? undefined,
      detail: repo.language ?? undefined,
      url: repo.html_url,
      timestamp: repo.pushed_at,
    }));
};

const isRecent = (timestamp: string): boolean => {
  const pushedAt = new Date(timestamp).getTime();
  const cutoff = Date.now() - RECENT_ACTIVITY_DAYS * 24 * 60 * 60 * 1000;

  return !Number.isNaN(pushedAt) && pushedAt >= cutoff;
};

const fetchGitHub = <T>(path: string): Promise<T> =>
  fetchJson<T>(`https://api.github.com${path}`, {
    revalidateSeconds: REVALIDATE_SECONDS,
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
  });

interface GitHubPushEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { commits?: { message: string; sha: string }[] };
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  pushed_at: string;
  fork: boolean;
  archived: boolean;
}
