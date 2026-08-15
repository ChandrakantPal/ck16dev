"use client";

import { useEffect } from "react";
import { navItems } from "@/config/nav";
import { useCommandSurface } from "./command/CommandProvider";
import HeaderItem from "./HeaderItem";

interface SideDrawerProps {
  onClose: () => void;
}

const SideDrawer = ({ onClose }: SideDrawerProps) => {
  const { openTerminal } = useCommandSurface();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <nav
        id="mobile-nav"
        className="fixed right-0 z-20 w-40 h-screen md:hidden"
      >
        <div className="flex flex-col items-center justify-around w-full h-full py-20 ml-auto border-l border-gray-900 shadow-inner bg-bunker">
          {navItems.map(({ title, href }) => (
            <a
              key={title}
              href={href}
              onClick={onClose}
              className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            >
              <HeaderItem title={title} />
            </a>
          ))}
          {/* The ⌘K trigger is desktop-only, so touch visitors get in here. */}
          <button
            type="button"
            onClick={() => {
              onClose();
              openTerminal();
            }}
            className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
          >
            <HeaderItem title="terminal" />
          </button>
        </div>
      </nav>
      {/* Click-away target. Escape closes the drawer for keyboard users. */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-10 bg-black/80 md:hidden"
        onClick={onClose}
      />
    </>
  );
};

export default SideDrawer;
