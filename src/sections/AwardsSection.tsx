import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import AwardLoop from "../assets/images/awards_loop.gif";
import AwardStatic from "../assets/images/awards_static.webp";
import AwardCard from "../components/AwardCard";
import { awards } from "../data/awards";

function AwardSection() {
    return (
        <section
            id="awards-section"
            aria-labelledby="awards-heading"
            className="flex items-center justify-center section-y"
        >
            <div className="section-shell">

                <SectionHeading
                    id="awards-heading"
                    eyebrow="highlighted achievements"
                    activeIcon={AwardLoop}
                    inactiveIcon={AwardStatic}
                    title="Awards & Recognitions"
                    lede="Competitions and programmes where the work was put in front of judges."
                />

                {/* Was 1 column until lg, which left tablets with one enormous
                    column and a lot of dead space. */}
                <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {awards.map((award, i) => (
                        <Reveal key={award.title} delay={i * 90} className="h-full">
                            <AwardCard {...award} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AwardSection;
