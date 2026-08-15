"use client";

import { useSyncExternalStore } from "react";
import { useCommandSurface } from "./CommandProvider";

interface NavigatorWithUserAgentData extends Navigator {
  userAgentData?: { platform?: string };
}

/* The platform cannot change mid-session, so there is nothing to subscribe to. */
const subscribe = () => () => {};

const getIsApplePlatform = () => {
  const client = navigator as NavigatorWithUserAgentData;
  /* navigator.platform is deprecated; userAgentData is preferred where present. */
  const platform =
    client.userAgentData?.platform ?? client.platform ?? client.userAgent;
  /* Case-insensitive on purpose: userAgentData reports "macOS", not "MacIntel". */
  return /mac|iphone|ipad|ipod/i.test(platform);
};

/* The server cannot know the platform; Ctrl is the safer default to render. */
const getServerSnapshot = () => false;

/**
 * A keyboard shortcut alone would strand mouse and touch visitors, so the
 * palette always has a visible way in. The hint names the real modifier key
 * rather than assuming a Mac.
 */
const CommandTrigger = () => {
  const { openPalette } = useCommandSurface();
  const isApplePlatform = useSyncExternalStore(
    subscribe,
    getIsApplePlatform,
    getServerSnapshot,
  );
  const shortcutHint = isApplePlatform ? "⌘ K" : "Ctrl K";

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label={`Open command palette (${shortcutHint})`}
      className="items-center hidden gap-2 px-3 py-1.5 text-sm border rounded-lg md:flex border-bunker-300 text-muted hover:text-white hover:border-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
    >
      <span aria-hidden="true">{">_"}</span>
      <span aria-hidden="true" className="text-xs text-muted">
        {shortcutHint}
      </span>
    </button>
  );
};

export default CommandTrigger;
