import InvolvementLoop from "../assets/images/involvement_loop.gif";
import InvolvementStatic from "../assets/images/involvement_static.png";
import SectionLabel from "../components/SectionLabel";
import DevconLogo from "../assets/images/devcon_pampanga.png";
import GdgLogo from "../assets/images/gdg_hau.png";
import LoopLogo from "../assets/images/loop.jpg";
import InvolvementTile from "../components/InvolvementTile";

function InvolvementSection() {
    return (
        <section id="involvement-section" className="scroll-mt-24 flex justify-center items-center">
                <div className="pb-[5rem] mx-10 w-full md:max-w-[70vw] grid grid-cols-10">
                    <div className="col-span-10 md:col-span-4 mb-[3rem]">
                        <SectionLabel activeIcon={InvolvementLoop} inactiveIcon={InvolvementStatic} title="leadership & service"/>
                        <p className="font-chakra title text-light font-bold mt-2">Community Involvement</p>
                        <p className="flex md:hidden font-poppins subtitle text-light font-light mt-3">Engaging with communities through leadership, collaboration, and initiatives that create lasting positive change.</p>
                    </div>

                    
                    <div className="col-span-10 md:col-span-6">
                        <InvolvementTile imagePath={DevconLogo} position="Core Team" term="January 2025 — Present" desc="Actively organize, facilitate, and host tech events—including workshops, competitions, and seminars—to support the developer community in Pampanga."/>
                        <hr className="border border-light/10 rounded-full my-5"/>
                        <InvolvementTile imagePath={GdgLogo} position="Mobile Development Lead" term="July 2024 — April 2025" desc="Conducted Flutter training for student developers and assisted in organizing related technical workshops and events."/>
                        <hr className="border border-light/10 rounded-full my-5"/>
                        <InvolvementTile imagePath={LoopLogo} position="Vice President" term="July 2023 — June 2024" desc="Help cultivate a learning-driven environment at Holy Angel University through organizing and facilitating CS-focused workshops, seminars, and tutorials."/>
                    </div>                        
                </div>
        </section>
    );
}

export default InvolvementSection;