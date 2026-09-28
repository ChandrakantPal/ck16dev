import { isSectionLink, navItems } from "@/config/nav";
import { site } from "@/config/site";
import { readableFiles, whoamiLines } from "./content";
import type { Command, CommandContext } from "./types";

const externalProfiles = [
  { name: "github", url: site.github, description: "Open my GitHub profile" },
  {
    name: "linkedin",
    url: site.linkedin,
    description: "Open my LinkedIn profile",
  },
  { name: "resume", url: site.resume, description: "Open my resume" },
];

const sectionCommands: Command[] = navItems.map(({ title, href }) => ({
  name: title,
  aliases: [`cd ${title}`, `cd ./${title}`],
  description: isSectionLink(href)
    ? `Go to the ${title} section`
    : `Open /${title}`,
  group: "navigation",
  inPalette: true,
  run: (_args, context) => {
    context.navigate(href);
    context.closeSurface();
  },
}));

/*
 * Pages that are reachable but deliberately not in the header nav — the nav is
 * already at the width the mono `cd ./name` items can carry.
 */
const pageCommands: Command[] = [
  {
    name: "music",
    aliases: ["spotify"],
    description: "Open /music",
    group: "navigation",
    inPalette: true,
    run: (_args, context) => {
      context.navigate("/music");
      context.closeSurface();
    },
  },
];

/** Every name `open` will accept, and where each one goes. */
const openTargets: Record<string, string> = {
  ...Object.fromEntries(navItems.map(({ title, href }) => [title, href])),
  music: "/music",
  ...Object.fromEntries(
    externalProfiles.map(({ name, url }) => [name, url]),
  ),
  home: "/",
};

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
    name: "open",
    aliases: ["go"],
    description: "Open a target, e.g. `open now`",
    group: "shell",
    inPalette: false,
    run: (args, context) => {
      const [target] = args;

      if (!target) {
        return [
          "usage: open <target>",
          `targets: ${Object.keys(openTargets).join("  ")}`,
        ];
      }

      const destination = openTargets[target.toLowerCase()];

      if (!destination) {
        return [`open: ${target}: No such target`];
      }

      if (destination.startsWith("http")) {
        context.openUrl(destination);
      } else {
        context.navigate(destination);
      }
      context.closeSurface();
    },
  },
  {
    name: "theme",
    aliases: [],
    description: "Switch between dark and light",
    group: "shell",
    inPalette: true,
    run: (_args, context) => {
      context.toggleTheme();
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
  ...pageCommands,
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
