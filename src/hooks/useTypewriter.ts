"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const DEFAULT_CHARACTER_DELAY_MS = 45;

interface TypewriterOptions {
  text: string;
  startDelayMs?: number;
  characterDelayMs?: number;
}

/**
 * Reveals `text` one character at a time, or returns it whole when the visitor
 * has asked for reduced motion.
 */
export function useTypewriter({
  text,
  startDelayMs = 0,
  characterDelayMs = DEFAULT_CHARACTER_DELAY_MS,
}: TypewriterOptions): string {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    let typingIntervalId: ReturnType<typeof setInterval> | undefined;

    const startTimeoutId = setTimeout(() => {
      typingIntervalId = setInterval(() => {
        setVisibleCharacters((count) => {
          if (count >= text.length) {
            clearInterval(typingIntervalId);
            return count;
          }
          return count + 1;
        });
      }, characterDelayMs);
    }, startDelayMs);

    return () => {
      clearTimeout(startTimeoutId);
      clearInterval(typingIntervalId);
    };
  }, [text, startDelayMs, characterDelayMs, prefersReducedMotion]);

  return prefersReducedMotion ? text : text.slice(0, visibleCharacters);
}
