import SectionLabel from "../components/SectionLabel";
import WorkLoop from "../assets/images/work_loop.gif";
import WorkStatic from "../assets/images/work_static.png";
import ProjectCell from "../components/ProjectCell";
import { projects } from "../data/projects";

function ProjectSection() {
    return (
        <section id="projects-section" className="scroll-mt-24 flex justify-center items-center">
            <div className="pb-[5rem] md:pb-[10rem] mx-10 w-full md:max-w-[1000px] grid grid-cols-8 gap-[3rem]">
                <div className="col-span-8">
                    <SectionLabel activeIcon={WorkLoop} inactiveIcon={WorkStatic} title="works selected"/>
                    <p className="font-chakra title text-light font-bold mt-2">My Projects</p>
                    <p className="font-poppins subtitle text-light font-light mt-3">Work sampling my approach to building meaningful and polished digital products.</p>
                </div>
                {projects.map((project, i) => (
                    <ProjectCell key={i} {...project} />
                ))}
            </div>
        </section>
    );
}

export default ProjectSection;
