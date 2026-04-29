import InvolvementLoop from "../assets/images/involvement_loop.gif";
import InvolvementStatic from "../assets/images/involvement_static.png";
import SectionLabel from "../components/SectionLabel";
import InvolvementTile from "../components/InvolvementTile";
import { involvements } from "../data/involvement";

function InvolvementSection() {
    return (
        <section id="involvement-section" className="scroll-mt-24 flex justify-center items-center">
                <div className="pb-[5rem] md:pb-[10rem] mx-10 w-full md:max-w-[1000px] grid grid-cols-10">
                    <div className="col-span-10 md:col-span-4 mb-[3rem]">
                        <SectionLabel activeIcon={InvolvementLoop} inactiveIcon={InvolvementStatic} title="leadership & service"/>
                        <p className="font-chakra title text-light font-bold mt-2">Community Involvement</p>
                        <p className="flex md:hidden font-poppins subtitle text-light font-light mt-3">Engaging with communities through leadership, collaboration, and initiatives that create lasting positive change.</p>
                    </div>

                    <div className="col-span-10 md:col-span-6">
                        {involvements.map((inv, i) => (
                            <div key={i}>
                                <InvolvementTile {...inv} />
                                {i < involvements.length - 1 && (
                                    <hr className="border border-light/10 rounded-full my-5"/>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
        </section>
    );
}

export default InvolvementSection;
