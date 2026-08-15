export interface NavItem {
  title: string;
  href: string;
}

export const HOME_SECTION_ID = "home";

export const navItems: NavItem[] = [
  { title: "about", href: "#about" },
  { title: "skills", href: "#skills" },
  { title: "contact", href: "#contact" },
];
