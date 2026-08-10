import LogoLoop from "../components/LogoLoop";
import { techLogos } from "../data/skills";

function SkillSection() {
    return (
        <section
            id="skill-section"
            aria-labelledby="skills-heading"
            /* Deliberately tighter than a content section — this band reads as a
               divider between the hero and the page proper, not as a section. */
            className="flex items-center justify-center border-y border-light/[0.06] py-8 md:py-10"
        >
            <h2 id="skills-heading" className="sr-only">
                Technologies I work with
            </h2>

            {/* Edge to edge below md, so the marquee reads as a full-bleed band
                instead of a narrow strip. The component's own fade masks land on
                the screen edges there, which is where they belong. Desktop keeps
                the 70vw measure so the logos stay grouped near the centre. */}
            <div className="w-full md:max-w-[70vw]">
                <LogoLoop
                    logos={techLogos}
                    speed={50}
                    direction="left"
                    logoHeight={44}
                    gap={48}
                    pauseOnHover
                    scaleOnHover
                    fadeOut
                    fadeOutColor="#0B0B0D"
                    ariaLabel="Technologies I work with"
                />
            </div>
        </section>
    );
}

export default SkillSection;
