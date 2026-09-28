export interface NavItem {
  title: string;
  href: string;
}

export const HOME_SECTION_ID = "home";

/*
 * Root-relative on purpose. A bare `#about` resolves against whatever route the
 * visitor is on, so from /now or /blog it would scroll nowhere instead of going
 * home.
 */
export const navItems: NavItem[] = [
  { title: "about", href: "/#about" },
  { title: "skills", href: "/#skills" },
  { title: "now", href: "/now" },
  { title: "uses", href: "/uses" },
  { title: "contact", href: "/#contact" },
];

export const isSectionLink = (href: string): boolean => href.includes("#");
