"use client";

import { Command as CommandMenu } from "cmdk";
import { paletteCommands } from "@/lib/commands/registry";
import type { CommandContext, CommandGroup } from "@/lib/commands/types";

const GROUP_LABELS: Record<CommandGroup, string> = {
  navigation: "Go to",
  links: "Elsewhere",
  shell: "Shell",
};

interface CommandPaletteProps {
  onClose: () => void;
  onOpenTerminal: () => void;
  goToSection: (hash: string) => void;
  openUrl: (url: string) => void;
}

const CommandPalette = ({
  onClose,
  onOpenTerminal,
  goToSection,
  openUrl,
}: CommandPaletteProps) => {
  const context: CommandContext = {
    goToSection,
    openUrl,
    clearOutput: () => {},
    closeSurface: onClose,
    history: [],
  };

  const groups = Object.keys(GROUP_LABELS) as CommandGroup[];

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center p-4 pt-[15vh]">
      <button
        type="button"
        aria-label="Close command palette"
        tabIndex={-1}
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <CommandMenu
        label="Command palette"
        loop
        className="relative w-full max-w-lg overflow-hidden border rounded-lg border-bunker-300 bg-bunker shadow-2xl"
      >
        <CommandMenu.Input
          autoFocus
          placeholder="Type a command or search…"
          className="w-full px-4 py-3 text-sm bg-transparent border-b outline-none border-bunker-300 text-white placeholder:text-muted"
        />
        <CommandMenu.List className="max-h-80 overflow-y-auto p-2">
          <CommandMenu.Empty className="px-2 py-4 text-sm text-center text-muted">
            Nothing matches that.
          </CommandMenu.Empty>

          {groups.map((group) => {
            const groupCommands = paletteCommands.filter(
              (command) => command.group === group,
            );
            if (!groupCommands.length) return null;

            return (
              <CommandMenu.Group
                key={group}
                heading={GROUP_LABELS[group]}
                className="px-2 py-1 text-xs text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1"
              >
                {groupCommands.map((command) => (
                  <CommandMenu.Item
                    key={command.name}
                    value={`${command.name} ${command.description}`}
                    onSelect={() => command.run([], context)}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded cursor-pointer text-white data-[selected=true]:bg-bunker-400"
                  >
                    <span>{command.name}</span>
                    <span className="text-xs text-muted">
                      {command.description}
                    </span>
                  </CommandMenu.Item>
                ))}
              </CommandMenu.Group>
            );
          })}

          <CommandMenu.Group
            heading={GROUP_LABELS.shell}
            className="px-2 py-1 text-xs text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1"
          >
            <CommandMenu.Item
              value="terminal shell open interactive"
              onSelect={() => {
                onClose();
                onOpenTerminal();
              }}
              className="flex items-center justify-between px-3 py-2 text-sm rounded cursor-pointer text-white data-[selected=true]:bg-bunker-400"
            >
              <span>terminal</span>
              <span className="text-xs text-muted">
                Open the interactive shell
              </span>
            </CommandMenu.Item>
          </CommandMenu.Group>
        </CommandMenu.List>
      </CommandMenu>
    </div>
  );
};

export default CommandPalette;
