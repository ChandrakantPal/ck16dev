"use client";

import { useCallback, useState } from "react";
import { completionsFor, findCommand } from "@/lib/commands/registry";
import type { CommandContext } from "@/lib/commands/types";

export const PROMPT = "ck16 ~ $";

export type TerminalLineKind = "input" | "output" | "error";

export interface TerminalLine {
  id: number;
  kind: TerminalLineKind;
  text: string;
}

const WELCOME: string[] = [
  "ck16.dev — interactive shell",
  "Type `help` to see what's here, or `exit` to leave.",
];

/*
 * Module scope rather than a ref: a ref would have to be read during render to
 * seed the welcome lines, and ids only need to be unique, not per-instance.
 */
let lastLineId = 0;
const nextLineId = () => {
  lastLineId += 1;
  return lastLineId;
};

const toLines = (texts: string[], kind: TerminalLineKind): TerminalLine[] =>
  texts.map((text) => ({ id: nextLineId(), kind, text }));

interface UseTerminalOptions {
  onClose: () => void;
  navigate: (href: string) => void;
  openUrl: (url: string) => void;
  toggleTheme: () => void;
}

export function useTerminal({
  onClose,
  navigate,
  openUrl,
  toggleTheme,
}: UseTerminalOptions) {
  const [lines, setLines] = useState<TerminalLine[]>(() =>
    toLines(WELCOME, "output"),
  );
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  /** null means "editing a fresh line", otherwise an index into history. */
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);

  const append = useCallback((texts: string[], kind: TerminalLineKind) => {
    if (!texts.length) return;
    setLines((previous) => [...previous, ...toLines(texts, kind)]);
  }, []);

  const execute = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      append([`${PROMPT} ${trimmed}`], "input");
      setDraft("");
      setHistoryCursor(null);

      if (!trimmed) return;

      const nextHistory = [...history, trimmed];
      setHistory(nextHistory);

      const [name = "", ...args] = trimmed.split(/\s+/);
      const command = findCommand(name);

      if (!command) {
        append([`command not found: ${name} — try \`help\``], "error");
        return;
      }

      const context: CommandContext = {
        navigate,
        openUrl,
        toggleTheme,
        clearOutput: () => setLines([]),
        closeSurface: onClose,
        history: nextHistory,
      };

      const output = command.run(args, context);
      if (output?.length) {
        append(output, "output");
      }
    },
    [append, navigate, history, onClose, openUrl, toggleTheme],
  );

  /** Completes the current word, or lists the candidates when ambiguous. */
  const complete = useCallback(() => {
    const candidates = completionsFor(draft.trim());

    if (candidates.length === 1 && candidates[0]) {
      setDraft(candidates[0]);
      return;
    }
    if (candidates.length > 1) {
      append([candidates.join("  ")], "output");
    }
  }, [append, draft]);

  const recallHistory = useCallback(
    (direction: "older" | "newer") => {
      if (!history.length) return;

      if (direction === "older") {
        const nextCursor =
          historyCursor === null
            ? history.length - 1
            : Math.max(0, historyCursor - 1);
        setHistoryCursor(nextCursor);
        setDraft(history[nextCursor] ?? "");
        return;
      }

      if (historyCursor === null) return;

      const nextCursor = historyCursor + 1;
      if (nextCursor >= history.length) {
        setHistoryCursor(null);
        setDraft("");
        return;
      }
      setHistoryCursor(nextCursor);
      setDraft(history[nextCursor] ?? "");
    },
    [history, historyCursor],
  );

  return { lines, draft, setDraft, execute, complete, recallHistory };
}
