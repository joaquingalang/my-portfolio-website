import InvolvementLoop from "../assets/images/involvement_loop.gif";
import InvolvementStatic from "../assets/images/involvement_static.png";
import SectionLabel from "../components/SectionLabel";
import DevconLogo from "../assets/images/devcon_pampanga.png";
import GdgLogo from "../assets/images/gdg_hau.png";
import LoopLogo from "../assets/images/loop.jpg";
import InvolvementTile from "../components/InvolvementTile";

function InvolvementSection() {
    return (
        <section id="involvement-section" className="min-h-[40vh] mt-[8rem]">
                <div className="grid grid-cols-12">
                    <div className="col-start-3 col-span-8 grid grid-cols-10">

                        <div className="col-span-4">
                            <SectionLabel activeIcon={InvolvementLoop} inactiveIcon={InvolvementStatic} title="orgs & positions"/>
                            <p className="font-chakra text-light text-5xl font-bold mt-2">Community Involvement</p>
                        </div>

                        
                        <div className="col-span-6">
                            <InvolvementTile imagePath={DevconLogo} position="Core Team" term="January 2025 — Present" desc="Actively organize, facilitate, and host tech events—including workshops, competitions, and seminars—to support the developer community in Pampanga."/>
                            <hr className="border border-light/10 rounded-full my-5"/>
                            <InvolvementTile imagePath={GdgLogo} position="Mobile Development Lead" term="July 2024 — April 2025" desc="Conducted Flutter training for student developers and assisted in organizing related technical workshops and events."/>
                            <hr className="border border-light/10 rounded-full my-5"/>
                            <InvolvementTile imagePath={LoopLogo} position="Vice President" term="July 2023 — June 2024" desc="Help cultivate a learning-driven environment at Holy Angel University through organizing and facilitating CS-focused workshops, seminars, and tutorials."/>
                        </div>                        

                    </div>
                </div>
        </section>
    );
}

export default InvolvementSection;