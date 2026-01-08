import SectionLabel from "../components/SectionLabel";
import WorkLoop from "../assets/images/work_loop.gif";
import WorkStatic from "../assets/images/work_static.png";
import ProjectCell from "../components/ProjectCell";
import TrashTrackr from "../assets/images/trashtrackr.png";
import PaperProof from "../assets/images/paperproof.png";
import Pamagsalin from "../assets/images/pamagsalin.png";
import AiCon from "../assets/images/aicon.png";
import Compass from "../assets/images/compass.png";
import GdscHau from "../assets/images/gdsc_hau.png";

function ProjectSection() {
    return (
        <section id="projects-section" className="scroll-mt-24 flex justify-center items-center">
            <div className="pb-[5rem] md:pb-[10rem] mx-10 w-full md:max-w-[1000px] grid grid-cols-8 gap-[3rem]">
                <div className="col-span-8">
                    <SectionLabel activeIcon={WorkLoop} inactiveIcon={WorkStatic} title="works selected"/>
                    <p className="font-chakra title text-light font-bold mt-2">My Projects</p>
                    <p className="font-poppins subtitle text-light font-light mt-3">Work sampling my approach to building meaningful and polished digital products.</p>
                </div>
                <ProjectCell imagePath={TrashTrackr} title="TrashTrackr" desc="Smart Waste-Disposal" projLink="https://youtu.be/8yRDYbZ9exw?si=OrDDnr8gFXhz6CKh"/>
                <ProjectCell imagePath={AiCon} title="2025 HAU AI-CON" desc="Digital Conference Platform" projLink="https://www.linkedin.com/posts/arron-parejas-6711b6289_paperproof-aiforthepeople-techjustice-activity-7337360995918499842-JBuF?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAD6fPvQBpXb6fP0V7433y2NLxDrzR9hVSZc"/>
                <ProjectCell imagePath={PaperProof} title="PaperProof" desc="Legal Document Scanner" codeLink="https://github.com/team-gdg-hau/paper_proof" projLink="https://www.linkedin.com/posts/arron-parejas-6711b6289_paperproof-aiforthepeople-techjustice-activity-7337360995918499842-JBuF?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAD6fPvQBpXb6fP0V7433y2NLxDrzR9hVSZc"/>
                <ProjectCell imagePath={GdscHau} title="GDSC-HAU" desc="Official Website of GDSC-HAU" projLink="https://gdsc-hau.pages.dev/"/>
                <ProjectCell imagePath={Pamagsalin} title="Pamagsalin" desc="Real-Time Kapampangan Translator" codeLink="https://github.com/joaquingalang/pamagsalin" projLink="https://github.com/joaquingalang/pamagsalin/releases/tag/v1.0.5"/>
                <ProjectCell imagePath={Compass} title="AI Compass" desc="AI-Tool Dependency Scanner" codeLink="https://github.com/joaquingalang/ai-compass" projLink="https://ai-compass-iota.vercel.app/"/>
            </div>
        </section>
    );
}

export default ProjectSection;