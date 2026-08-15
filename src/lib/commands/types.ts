export type CommandGroup = "navigation" | "links" | "shell";

/**
 * Everything a command is allowed to touch. Both the palette and the terminal
 * supply one of these, which is what lets a single command definition serve
 * both surfaces.
 */
export interface CommandContext {
  goToSection: (hash: string) => void;
  openUrl: (url: string) => void;
  clearOutput: () => void;
  closeSurface: () => void;
  history: readonly string[];
}

/** Lines to print. Terminal renders them; the palette ignores them. */
export type CommandOutput = string[] | void;

export interface Command {
  name: string;
  aliases: readonly string[];
  description: string;
  group: CommandGroup;
  /** Shell verbs such as `ls` and `clear` are noise in a palette. */
  inPalette: boolean;
  run: (args: readonly string[], context: CommandContext) => CommandOutput;
}
