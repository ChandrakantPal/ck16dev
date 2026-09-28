"use client";

import { useEffect, useRef } from "react";
import { PROMPT, useTerminal } from "./useTerminal";

const LINE_COLOURS = {
  input: "text-accent",
  output: "text-muted",
  error: "text-danger",
} as const;

interface TerminalProps {
  onClose: () => void;
  navigate: (href: string) => void;
  openUrl: (url: string) => void;
  toggleTheme: () => void;
}

const Terminal = ({ onClose, navigate, openUrl, toggleTheme }: TerminalProps) => {
  const { lines, draft, setDraft, execute, complete, recallHistory } =
    useTerminal({ onClose, navigate, openUrl, toggleTheme });

  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      execute(draft);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      complete();
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      recallHistory("older");
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      recallHistory("newer");
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Terminal"
      className="fixed inset-0 z-100 flex items-end justify-center p-0 sm:items-center sm:p-6"
    >
      <button
        type="button"
        aria-label="Close terminal"
        tabIndex={-1}
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div
        className="relative flex flex-col w-full h-[70vh] max-w-3xl overflow-hidden border rounded-t-lg sm:rounded-lg border-bunker-300 bg-bunker shadow-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-bunker-300">
          <span className="text-sm text-accent">ck16 {">"}_</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terminal"
            className="px-2 text-sm rounded text-muted hover:text-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            esc
          </button>
        </div>

        {/*
          Assistive tech needs to hear command results as they land, but polite
          so it never interrupts what the visitor is already typing.
        */}
        <div
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          className="flex-1 px-4 py-3 overflow-y-auto text-sm leading-relaxed"
        >
          {lines.map(({ id, kind, text }) => (
            <p key={id} className={`whitespace-pre-wrap ${LINE_COLOURS[kind]}`}>
              {text}
            </p>
          ))}
          <div ref={outputEndRef} />
        </div>

        <div className="flex items-center gap-2 px-4 py-3 border-t border-bunker-300">
          <label htmlFor="terminal-input" className="text-sm text-accent">
            {PROMPT}
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-transparent outline-none text-strong caret-green-400"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-describedby="terminal-hint"
          />
        </div>
        <p id="terminal-hint" className="sr-only">
          Press Enter to run, Tab to complete, up and down arrows for history,
          Escape to close.
        </p>
      </div>
    </div>
  );
};

export default Terminal;
