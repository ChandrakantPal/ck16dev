"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import CommandPalette from "./CommandPalette";
import Terminal from "./Terminal";

type Surface = "palette" | "terminal" | null;

interface CommandSurfaceApi {
  openPalette: () => void;
  openTerminal: () => void;
}

const CommandSurfaceContext = createContext<CommandSurfaceApi | null>(null);

export const useCommandSurface = (): CommandSurfaceApi => {
  const api = useContext(CommandSurfaceContext);
  if (!api) {
    throw new Error("useCommandSurface must be used within CommandProvider");
  }
  return api;
};

const CommandProvider = ({ children }: { children: ReactNode }) => {
  const [surface, setSurface] = useState<Surface>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  /* Focus belongs back where the visitor left it once a surface closes. */
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((next: Exclude<Surface, null>) => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setSurface(next);
  }, []);

  const close = useCallback(() => {
    setSurface(null);
    lastFocused.current?.focus();
  }, []);

  const api = useMemo<CommandSurfaceApi>(
    () => ({
      openPalette: () => open("palette"),
      openTerminal: () => open("terminal"),
    }),
    [open],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isPaletteShortcut =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);

      if (isPaletteShortcut) {
        event.preventDefault();
        if (surface === null) {
          open("palette");
        } else {
          close();
        }
        return;
      }

      if (event.key === "Escape" && surface !== null) {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [surface, open, close]);

  /* The page behind a modal surface must not scroll away under it. */
  useEffect(() => {
    if (!surface) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [surface]);

  /*
   * Through the router rather than window.location, so `/#about` works from
   * every route: a page change and an in-page anchor are the same call here.
   */
  const navigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  const openUrl = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <CommandSurfaceContext.Provider value={api}>
      {children}
      {surface === "palette" && (
        <CommandPalette
          onClose={close}
          onOpenTerminal={api.openTerminal}
          navigate={navigate}
          openUrl={openUrl}
          toggleTheme={toggleTheme}
        />
      )}
      {surface === "terminal" && (
        <Terminal
          onClose={close}
          navigate={navigate}
          openUrl={openUrl}
          toggleTheme={toggleTheme}
        />
      )}
    </CommandSurfaceContext.Provider>
  );
};

export default CommandProvider;
