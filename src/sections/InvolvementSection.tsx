import InvolvementLoop from "../assets/images/involvement_loop.gif";
import InvolvementStatic from "../assets/images/involvement_static.webp";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import InvolvementTile from "../components/InvolvementTile";
import { involvements } from "../data/involvement";

function InvolvementSection() {
    return (
        <section
            id="involvement-section"
            aria-labelledby="involvement-heading"
            className="flex items-center justify-center section-y"
        >
            <div className="section-shell grid grid-cols-10 gap-x-10">

                {/* Pins while the roles scroll past it — the heading stays as context
                    instead of leaving the left column empty for the rest of the section.
                    The lede used to be `md:hidden`, so desktop lost it entirely. */}
                <SectionHeading
                    className="col-span-10 mb-12 md:col-span-4 md:sticky md:top-[calc(var(--nav-offset)+1.5rem)] md:self-start md:mb-0"
                    id="involvement-heading"
                    eyebrow="leadership & service"
                    activeIcon={InvolvementLoop}
                    inactiveIcon={InvolvementStatic}
                    title="Community Involvement"
                    lede="Engaging with communities through leadership, collaboration, and initiatives that create lasting positive change."
                />

                <div className="col-span-10 md:col-span-6">
                    {involvements.map((inv, i) => (
                        <Reveal key={inv.organization} delay={i * 90}>
                            <InvolvementTile {...inv} />
                            {i < involvements.length - 1 && (
                                <hr className="my-7 border-0 border-t border-light/10" />
                            )}
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default InvolvementSection;
