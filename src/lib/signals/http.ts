/**
 * Every provider fetches through here so caching and failure behave the same
 * everywhere: one shared server-side cache entry per URL, and a thrown error
 * naming the source rather than a silent empty card.
 */
export const fetchJson = async <T>(
  url: string,
  { revalidateSeconds, headers }: FetchOptions,
): Promise<T> => {
  const response = await fetchOrThrow(url, revalidateSeconds, headers);
  return (await response.json()) as T;
};

export const fetchText = async (
  url: string,
  { revalidateSeconds, headers }: FetchOptions,
): Promise<string> => {
  const response = await fetchOrThrow(url, revalidateSeconds, headers);
  return response.text();
};

interface FetchOptions {
  revalidateSeconds: number;
  headers?: Record<string, string>;
}

const fetchOrThrow = async (
  url: string,
  revalidateSeconds: number,
  headers: Record<string, string> = {},
): Promise<Response> => {
  const response = await fetch(url, {
    headers,
    next: { revalidate: revalidateSeconds },
  });

  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`);
  }

  return response;
};
