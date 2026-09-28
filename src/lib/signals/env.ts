/**
 * An optional environment variable, with a default.
 *
 * `process.env.X ?? fallback` looks right but is not: `??` only falls back on
 * null and undefined, and an unset key in a .env file is an empty string. A
 * variable written as `GOODREADS_SHELF=` therefore resolves to "" rather than
 * the default — which is exactly what .env.example produces, and what an
 * environment variable cleared in a dashboard leaves behind.
 */
export const readEnv = (name: string, fallback: string): string => {
  const value = process.env[name];
  return value !== undefined && value.trim() !== "" ? value : fallback;
};
