"use client";

import { useEffect, useState } from "react";
import { HOME_SECTION_ID, navItems } from "@/config/nav";
import HeaderItem from "./HeaderItem";
import Logo from "./Logo";
import SideDrawer from "./SideDrawer";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    /*
     * The previous implementation stored the return of addEventListener — which
     * is undefined — and passed that to removeEventListener, so the listener was
     * never detached. A named handler makes the cleanup actually work.
     */
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      setIsPinned(isScrollingUp && currentScrollY > 0);
      lastScrollY = Math.max(currentScrollY, 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`z-50 w-full p-4 shadow-2xl bg-bunker/80 ${
          isPinned ? "sticky top-0 animate-slide" : ""
        }`}
      >
        <nav className="flex items-center justify-between">
          <a href={`#${HOME_SECTION_ID}`} aria-label="Back to top">
            <Logo />
          </a>
          <div className="items-center justify-center flex-grow-0 hidden my-2 md:flex md:m-0">
            {navItems.map(({ title, href }) => (
              <a
                key={title}
                href={href}
                className="rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <HeaderItem title={title} />
              </a>
            ))}
          </div>
          <button
            type="button"
            className="px-4 py-2 text-lg text-center border border-white rounded-lg w-14 md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((wasOpen) => !wasOpen)}
          >
            <span aria-hidden="true">{isMenuOpen ? "x" : ">_"}</span>
          </button>
        </nav>
      </header>
      {isMenuOpen && <SideDrawer onClose={closeMenu} />}
    </>
  );
};

export default Header;
