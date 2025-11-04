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
        <section id="projects-section">
            <div className="grid grid-cols-12">
                <div className="col-start-3 col-span-8">

                    <SectionLabel activeIcon={WorkLoop} inactiveIcon={WorkStatic} title="works selected"/>

                    <p className="font-chakra text-light text-5xl font-bold mt-2">My Projects</p>

                    <p className="font-poppins text-light text-lg font-light mt-3">Work sampling my approach to building meaningful and polished digital products.</p>

                    <div className="grid grid-cols-8 gap-[3rem] mt-10">

                        <ProjectCell imagePath={TrashTrackr} title="TrashTrackr" desc="Smart Waste-Disposal"/>
                        <ProjectCell imagePath={AiCon} title="2025 HAU AI-CON" desc="Digital Conference Platform"/>
                        <ProjectCell imagePath={PaperProof} title="PaperProof" desc="Legal Document Scanner"/>
                        <ProjectCell imagePath={GdscHau} title="GDSC-HAU" desc="Official Website of GDSC-HAU"/>
                        <ProjectCell imagePath={Pamagsalin} title="Pamagsalin" desc="Real-Time Kapampangan Translator"/>
                        <ProjectCell imagePath={Compass} title="AI Compass" desc="AI-Tool Dependency Scanner"/>

                    </div>

                </div>
            </div>
        </section>
    );
}

export default ProjectSection;