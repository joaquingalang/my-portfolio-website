import LogoLoop from "../components/LogoLoop";
import { techLogos } from "../data/skills";

function SkillSection() {
    return (
        <section id="skill-section" className="flex justify-center items-center">
            <div className='mx-10 w-full md:max-w-[70vw] grid grid-cols-8'>
                <div className='col-span-8'>
                    <LogoLoop
                        logos={techLogos}
                        speed={50}
                        direction="left"
                        logoHeight={48}
                        gap={40}
                        pauseOnHover
                        scaleOnHover
                        fadeOut
                        fadeOutColor="#0B0B0D"
                        ariaLabel="Technology partners"
                    />
                </div>
            </div>
        </section>
    );
}

export default SkillSection;
