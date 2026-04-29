import DevconLogo from '../assets/images/devcon_pampanga.png';
import GdgLogo from '../assets/images/gdg_hau.png';
import LoopLogo from '../assets/images/loop.jpg';

export interface InvolvementData {
  imagePath: string;
  position: string;
  term: string;
  desc: string;
}

export const involvements: InvolvementData[] = [
  {
    imagePath: DevconLogo,
    position: "Core Team",
    term: "January 2025 — Present",
    desc: "Actively organize, facilitate, and host tech events—including workshops, competitions, and seminars—to support the developer community in Pampanga.",
  },
  {
    imagePath: GdgLogo,
    position: "Mobile Development Lead",
    term: "July 2024 — April 2025",
    desc: "Conducted Flutter training for student developers and assisted in organizing related technical workshops and events.",
  },
  {
    imagePath: LoopLogo,
    position: "Vice President",
    term: "July 2023 — June 2024",
    desc: "Help cultivate a learning-driven environment at Holy Angel University through organizing and facilitating CS-focused workshops, seminars, and tutorials.",
  },
];
