import { navItems } from "@/config/nav";
import { readableFiles, whoamiLines } from "./content";
import type { Command, CommandContext } from "./types";

const externalProfiles = [
  {
    name: "github",
    url: "https://github.com/ChandrakantPal",
    description: "Open my GitHub profile",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/chandrakant-pal",
    description: "Open my LinkedIn profile",
  },
];

const sectionCommands: Command[] = navItems.map(({ title, href }) => ({
  name: title,
  aliases: [`cd ${title}`, `cd ./${title}`],
  description: `Go to the ${title} section`,
  group: "navigation",
  inPalette: true,
  run: (_args, context) => {
    context.goToSection(href);
    context.closeSurface();
  },
}));

const linkCommands: Command[] = externalProfiles.map(
  ({ name, url, description }) => ({
    name,
    aliases: [],
    description,
    group: "links",
    inPalette: true,
    run: (_args, context) => {
      context.openUrl(url);
      context.closeSurface();
    },
  }),
);

const shellCommands: Command[] = [
  {
    name: "help",
    aliases: ["?", "man"],
    description: "List everything you can run",
    group: "shell",
    inPalette: false,
    run: () => [
      "Available commands:",
      "",
      ...commands.map(
        (command) => `  ${command.name.padEnd(12)}${command.description}`,
      ),
      "",
      "Tip: Tab completes, up/down walks history, Esc closes.",
    ],
  },
  {
    name: "ls",
    aliases: ["dir"],
    description: "List readable files",
    group: "shell",
    inPalette: false,
    run: () => Object.keys(readableFiles),
  },
  {
    name: "cat",
    aliases: [],
    description: "Print a file, e.g. `cat about.txt`",
    group: "shell",
    inPalette: false,
    run: (args) => {
      const [fileName] = args;

      if (!fileName) {
        return ["usage: cat <file>", ...Object.keys(readableFiles)];
      }

      const contents = readableFiles[fileName] ?? readableFiles[`${fileName}.txt`];
      return contents ?? [`cat: ${fileName}: No such file`];
    },
  },
  {
    name: "whoami",
    aliases: [],
    description: "A short bio",
    group: "shell",
    inPalette: false,
    run: () => whoamiLines,
  },
  {
    name: "history",
    aliases: [],
    description: "Show commands run this session",
    group: "shell",
    inPalette: false,
    run: (_args, context) =>
      context.history.length
        ? context.history.map((entry, index) => `  ${index + 1}  ${entry}`)
        : ["No history yet."],
  },
  {
    name: "clear",
    aliases: ["cls"],
    description: "Clear the screen",
    group: "shell",
    inPalette: false,
    run: (_args, context) => {
      context.clearOutput();
    },
  },
  {
    name: "exit",
    aliases: ["quit", "close"],
    description: "Close the terminal",
    group: "shell",
    inPalette: false,
    run: (_args, context) => {
      context.closeSurface();
    },
  },
  {
    name: "sudo",
    aliases: [],
    description: "Elevate privileges",
    group: "shell",
    inPalette: false,
    run: () => ["Nice try. You already have everything you need here."],
  },
];

export const commands: Command[] = [
  ...sectionCommands,
  ...linkCommands,
  ...shellCommands,
];

export const paletteCommands = commands.filter((command) => command.inPalette);

export const findCommand = (name: string): Command | undefined => {
  const needle = name.toLowerCase();
  return commands.find(
    (command) =>
      command.name === needle ||
      command.aliases.some((alias) => alias === needle),
  );
};

/** Names a partially-typed word could still become, for Tab completion. */
export const completionsFor = (partial: string): string[] => {
  if (!partial) {
    return commands.map((command) => command.name);
  }
  return commands
    .map((command) => command.name)
    .filter((name) => name.startsWith(partial.toLowerCase()));
};

export type { Command, CommandContext };
