"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;

/* There is no media query on the server; hydration corrects this immediately. */
const getServerSnapshot = () => false;

/**
 * Single source of truth for the visitor's motion preference. Also reacts to the
 * preference changing mid-session, which a one-time read would miss.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
