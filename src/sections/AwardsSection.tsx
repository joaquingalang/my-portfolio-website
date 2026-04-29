import SectionLabel from "../components/SectionLabel";
import AwardLoop from "../assets/images/awards_loop.gif";
import AwardStatic from "../assets/images/awards_static.png";
import AwardCard from "../components/AwardCard";
import { awards } from "../data/awards";

function AwardSection() {
    return (
        <section id="awards-section" className="scroll-mt-24 flex justify-center items-center">
            <div className="pb-[5rem] md:pb-[10rem] mx-10 w-full md:max-w-[1000px] flex flex-col items-center">
                <SectionLabel activeIcon={AwardLoop} inactiveIcon={AwardStatic} title="highlighted achievements"/>
                <p className="font-chakra title text-light font-bold text-center mt-2">Awards & Recognitions</p>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-[3rem]">
                    {awards.map((award, i) => (
                        <AwardCard key={i} {...award} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default AwardSection;
