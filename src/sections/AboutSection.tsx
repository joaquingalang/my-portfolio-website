import SectionLabel from "../components/SectionLabel";
import TextType from "../components/TextType";
import Reveal from "../components/Reveal";
import ProfileLoop from "../assets/images/profile_loop.gif";
import ProfileStatic from "../assets/images/profile_static.webp";

const ABOUT_TEXT =
    "I build mobile and web apps with Flutter, React, Firebase, and Node.js, along with automation workflows in N8N that connect systems and cut out manual work. I like taking an idea and turning it into something people actually use.";

function AboutSection() {
    return (
        <section
            id="about-section"
            aria-labelledby="about-heading"
            className="flex items-center justify-center section-y"
        >
            <div className="section-shell">
                <h2 id="about-heading" className="sr-only">
                    About me
                </h2>

                <Reveal className="flex flex-col items-center gap-5">

                    <SectionLabel activeIcon={ProfileLoop} inactiveIcon={ProfileStatic} title="about me" />

                    {/* A copy of the finished text holds the exact final height while
                        the typewriter runs, so the section never reflows mid-animation. */}
                    <div className="relative measure text-center">
                        <p
                            aria-hidden="true"
                            className="invisible font-poppins text-base tracking-tight text-light md:text-lg"
                        >
                            {ABOUT_TEXT}
                            <span className="ml-1">_</span>
                        </p>

                        <TextType
                            text={[ABOUT_TEXT]}
                            typingSpeed={12}
                            startOnVisible
                            loop={false}
                            showCursor
                            cursorCharacter="_"
                            className="absolute inset-0 font-poppins text-base text-light md:text-lg"
                        />
                    </div>

                </Reveal>
            </div>
        </section>
    );
}

export default AboutSection;
