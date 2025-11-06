import SectionLabel from "../components/SectionLabel";
import TextType from "../components/TextType";
import ProfileLoop from "../assets/images/profile_loop.gif";
import ProfileStatic from "../assets/images/profile_static.png";

function AboutSection() {
    return (
        <section id="about-section" className="min-h-[20rem] flex justify-center items-center">
            <div className="my-[5rem] sm:my-0 mx-10 w-full md:max-w-[1000px] grid grid-cols-8">

                <div className="col-span-8 flex flex-col gap-3 justify-center items-center">

                    <SectionLabel title="about me" activeIcon={ProfileLoop} inactiveIcon={ProfileStatic}/>

                    <TextType 
                    text={["Hi, I’m Joaquin — a developer passionate about crafting clean, intuitive, and impactful digital experiences. I build across mobile and web using Flutter, React, Firebase, and Node.js, and I love turning ideas into real products that solve problems and bring people joy."]}
                    typingSpeed={5}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="_"
                    className="font-poppins text-light text-md md:text-lg lg:text-xl text-center max-w-[60rem]"
                    />

                </div>

            </div>
            
        </section>        
    );
}

export default AboutSection;