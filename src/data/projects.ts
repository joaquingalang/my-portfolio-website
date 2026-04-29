import TrashTrackr from '../assets/images/trashtrackr.png';
import PaperProof from '../assets/images/paperproof.png';
import Pamagsalin from '../assets/images/pamagsalin.png';
import AiCon from '../assets/images/aicon.png';
import Compass from '../assets/images/compass.png';
import GdscHau from '../assets/images/gdsc_hau.png';

export interface ProjectData {
  imagePath: string;
  title: string;
  desc: string;
  codeLink?: string;
  projLink?: string;
}

export const projects: ProjectData[] = [
  {
    imagePath: TrashTrackr,
    title: "TrashTrackr",
    desc: "Smart Waste-Disposal",
    projLink: "https://youtu.be/8yRDYbZ9exw?si=OrDDnr8gFXhz6CKh",
  },
  {
    imagePath: AiCon,
    title: "2025 HAU AI-CON",
    desc: "Digital Conference Platform",
    projLink: "https://aiconhau.vercel.app/",
  },
  {
    imagePath: PaperProof,
    title: "PaperProof",
    desc: "Legal Document Scanner",
    codeLink: "https://github.com/team-gdg-hau/paper_proof",
    projLink: "https://www.linkedin.com/posts/arron-parejas-6711b6289_paperproof-aiforthepeople-techjustice-activity-7337360995918499842-JBuF?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAD6fPvQBpXb6fP0V7433y2NLxDrzR9hVSZc",
  },
  {
    imagePath: GdscHau,
    title: "GDSC-HAU",
    desc: "Official Website of GDSC-HAU",
    projLink: "https://gdsc-hau.pages.dev/",
  },
  {
    imagePath: Pamagsalin,
    title: "Pamagsalin",
    desc: "Real-Time Kapampangan Translator",
    codeLink: "https://github.com/joaquingalang/pamagsalin",
    projLink: "https://github.com/joaquingalang/pamagsalin/releases/tag/v1.0.5",
  },
  {
    imagePath: Compass,
    title: "AI Compass",
    desc: "AI-Tool Dependency Scanner",
    codeLink: "https://github.com/joaquingalang/ai-compass",
    projLink: "https://ai-compass-iota.vercel.app/",
  },
];
