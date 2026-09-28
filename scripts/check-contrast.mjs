/**
 * Fails if any semantic colour token drops below its WCAG floor, in either
 * theme. Tokens are read out of globals.css rather than duplicated here, so
 * the check cannot drift from what the site actually ships.
 *
 *   node scripts/check-contrast.mjs
 */
import { readFileSync } from "node:fs";

const AA_TEXT = 4.5;
/* Borders and other non-text UI have a lower floor than body copy. */
const AA_NON_TEXT = 3;

const TEXT_TOKENS = [
  "strong",
  "muted",
  "accent",
  "accent-strong",
  "accent-dim",
  "danger",
];
const SURFACES = { surface: "bunker", raised: "bunker-400" };

const css = readFileSync(new URL("../src/styles/globals.css", import.meta.url), "utf8");

const readTokens = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(
      ([, name, value]) => [name, value],
    ),
  );

const darkTokens = readTokens(css.slice(css.indexOf("@theme"), css.indexOf(".light")));
const lightTokens = { ...darkTokens, ...readTokens(css.slice(css.indexOf(".light"))) };

const channel = (value) => {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const [r, g, b] = hex.slice(1).match(/../g).map((part) => parseInt(part, 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const contrast = (foreground, background) => {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const failures = [];

for (const [theme, tokens] of Object.entries({ dark: darkTokens, light: lightTokens })) {
  for (const [surfaceName, surfaceToken] of Object.entries(SURFACES)) {
    const background = tokens[surfaceToken];

    for (const token of TEXT_TOKENS) {
      assertFloor(theme, token, surfaceName, contrast(tokens[token], background), AA_TEXT);
    }
    assertFloor(theme, "subtle", surfaceName, contrast(tokens.subtle, background), AA_NON_TEXT);
  }
}

function assertFloor(theme, token, surface, ratio, floor) {
  const line = `${theme}/${surface}: ${token} ${ratio.toFixed(2)}:1 (floor ${floor})`;
  if (ratio < floor) {
    failures.push(line);
  }
  console.log(`  ${ratio >= floor ? "pass" : "FAIL"}  ${line}`);
}

if (failures.length > 0) {
  console.error(`\n${failures.length} contrast failure(s):`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("\nAll colour tokens clear their contrast floor in both themes.");
