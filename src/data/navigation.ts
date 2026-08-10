export interface NavItem {
  label: string;
  /** Section element id, without the leading `#`. */
  id: string;
}

/** Single source of truth for the navbar links and the scroll-spy observer. */
export const navItems: NavItem[] = [
  { label: "About", id: "about-section" },
  { label: "Projects", id: "projects-section" },
  { label: "Involvement", id: "involvement-section" },
  { label: "Awards", id: "awards-section" },
  { label: "Contact", id: "contact-section" },
];

export const navSectionIds = navItems.map((item) => item.id);
