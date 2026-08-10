import DevconLogo from '../assets/images/devcon_pampanga.webp';
import GdgLogo from '../assets/images/gdg_hau.webp';
import LoopLogo from '../assets/images/loop.jpg';

export interface InvolvementData {
  imagePath: string;
  /**
   * Organisation behind the role. Previously only implied by the logo, which
   * left the org invisible to screen readers and to anyone who doesn't
   * recognise the mark. VERIFY these names are how you want them written.
   */
  organization: string;
  position: string;
  term: string;
  desc: string;
}

export const involvements: InvolvementData[] = [
  {
    imagePath: DevconLogo,
    organization: "DEVCON Pampanga",
    position: "Core Team",
    term: "January 2025 — Present",
    desc: "Actively organize, facilitate, and host tech events—including workshops, competitions, and seminars—to support the developer community in Pampanga.",
  },
  {
    imagePath: GdgLogo,
    organization: "GDG on Campus — Holy Angel University",
    position: "Mobile Development Lead",
    term: "July 2024 — April 2025",
    desc: "Conducted Flutter training for student developers and assisted in organizing related technical workshops and events.",
  },
  {
    imagePath: LoopLogo,
    organization: "LOOP — Holy Angel University",
    position: "Vice President",
    term: "July 2023 — June 2024",
    desc: "Help cultivate a learning-driven environment at Holy Angel University through organizing and facilitating CS-focused workshops, seminars, and tutorials.",
  },
];
