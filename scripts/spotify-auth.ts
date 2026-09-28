/**
 * One-time helper: walks Spotify's authorization-code flow locally and prints
 * the refresh token for .env.local. Refresh tokens do not expire, so this is
 * run once and then forgotten.
 *
 *   1. Create an app at https://developer.spotify.com/dashboard
 *   2. Add http://127.0.0.1:8888/callback as a Redirect URI
 *   3. SPOTIFY_CLIENT_ID=... SPOTIFY_CLIENT_SECRET=... npx tsx scripts/spotify-auth.ts
 */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const PORT = 8888;
const SCOPES = [
  /* The record player and the "on repeat" card. */
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
  /* The /music page: playlists, saved tracks, followed artists. */
  "playlist-read-private",
  "user-library-read",
  "user-follow-read",
].join(" ");

const clientId = requireEnv("SPOTIFY_CLIENT_ID");
const clientSecret = requireEnv("SPOTIFY_CLIENT_SECRET");
const expectedState = randomBytes(16).toString("hex");

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://127.0.0.1:${PORT}`);

  if (url.pathname !== "/callback") {
    response.writeHead(404).end();
    return;
  }

  void handleCallback(url, response);
});

server.listen(PORT, () => {
  console.log("\nOpen this URL, approve, and come back:\n");
  console.log(buildAuthorizeUrl(), "\n");
});

const handleCallback = async (
  url: URL,
  response: import("node:http").ServerResponse,
): Promise<void> => {
  const finish = (message: string) => {
    response.writeHead(200, { "Content-Type": "text/plain" }).end(message);
    server.close();
  };

  /* A mismatched state means the response is not the one we asked for. */
  if (url.searchParams.get("state") !== expectedState) {
    finish("State mismatch. Run the script again.");
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    finish(`Spotify returned: ${url.searchParams.get("error") ?? "no code"}`);
    return;
  }

  try {
    const refreshToken = await exchangeCodeForRefreshToken(code);
    console.log("\nAdd this to .env.local:\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${refreshToken}\n`);
    finish("Done. The refresh token is in your terminal.");
  } catch (error) {
    console.error(error);
    finish("Token exchange failed. See the terminal.");
  }
};

const buildAuthorizeUrl = (): string => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: expectedState,
  });

  return `https://accounts.spotify.com/authorize?${params}`;
};

const exchangeCodeForRefreshToken = async (code: string): Promise<string> => {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange responded ${response.status}`);
  }

  const token = (await response.json()) as { refresh_token?: string };

  if (!token.refresh_token) {
    throw new Error("Spotify did not return a refresh token");
  }

  return token.refresh_token;
};

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    console.error(`Missing ${name}. See the header of this file.`);
    process.exit(1);
  }

  return value;
}
