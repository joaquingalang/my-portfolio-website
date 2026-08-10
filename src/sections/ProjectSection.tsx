import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import WorkLoop from "../assets/images/work_loop.gif";
import WorkStatic from "../assets/images/work_static.webp";
import ProjectCell from "../components/ProjectCell";
import { projects } from "../data/projects";

function ProjectSection() {
    return (
        <section
            id="projects-section"
            aria-labelledby="projects-heading"
            className="flex items-center justify-center section-y"
        >
            <div className="section-shell grid grid-cols-8 gap-x-8 gap-y-12">

                <SectionHeading
                    className="col-span-8"
                    id="projects-heading"
                    eyebrow="works selected"
                    activeIcon={WorkLoop}
                    inactiveIcon={WorkStatic}
                    title="My Projects"
                    lede="Work sampling my approach to building meaningful and polished digital products."
                />

                {projects.map((project, i) => (
                    /* Stagger caps at the second row so later cards are already
                       in place by the time they scroll into view. */
                    <Reveal
                        key={project.title}
                        className="col-span-8 sm:col-span-4"
                        delay={(i % 2) * 90}
                    >
                        <ProjectCell {...project} />
                    </Reveal>
                ))}
            </div>
        </section>
    );
}

export default ProjectSection;
