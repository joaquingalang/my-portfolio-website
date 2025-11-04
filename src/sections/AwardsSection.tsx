import SectionLabel from "../components/SectionLabel";
import AwardLoop from "../assets/images/awards_loop.gif";
import AwardStatic from "../assets/images/awards_static.png";
import BuildWithAiPhoto from "../assets/images/build_with_ai.jpg";
import SolchaPhoto from "../assets/images/solcha.jpg";
import AppconPhoto from "../assets/images/appcon.jpg";
import AwardCard from "../components/AwardCard";
import GdgUpmLogo from "../assets/images/gdg_upm_logo.jpg";
import GoogleLogo from "../assets/images/google_logo.png";
import AppconLogo from "../assets/images/appcon_logo.jpg";

function AwardSection() {
    return (
        <section id="awards-section">
            <div className="min-h-[40rem] grid grid-cols-12 mt-[8rem]">
                <div className="col-start-3 col-span-8">
                    <div className="w-full flex flex-col items-center">

                        <SectionLabel activeIcon={AwardLoop} inactiveIcon={AwardStatic} title="highlighted achievements"/>
                        <p className="font-chakra text-light text-5xl font-bold mt-2">Awards & Recognitions</p>

                        <div className="mt-10 grid grid-cols-3 gap-6">


                            <AwardCard
                                imagePath={BuildWithAiPhoto} 
                                date="May 2025" 
                                position="Champion" 
                                title="GanAIus Hackathon" 
                                desc="The GenAIus Hackathon: Build with Google AI 2025 challenged teams to build solutions for underserved communities; our team created a legal document assistant and secured first place."
                                orgImagePath={GdgUpmLogo}
                                organizers="GDG-UPM"
                                role="Organizer & Partner"
                            />

                            <AwardCard
                                imagePath={SolchaPhoto}
                                date="June 2025"
                                position="Winner"
                                title="Google Solutions Challenge"
                                desc="The APAC Google Solution Challenge 2025 invited top student innovators across the region to build with Google AI; our team developed TrashTrackr, winning regional honors after Demo Day in Manila."
                                orgImagePath={GoogleLogo}
                                organizers="Google"
                            />

                            <AwardCard
                                imagePath={AppconPhoto}
                                date="June 2025"
                                position="Finalist"
                                title="AppCon 2024"
                                desc="AppCon 2024 brought together leading student developers from across the Philippines; our team built Emberwatch, an AI fire-hazard detection app, and placed in the Top 20 nationwide."
                                orgImagePath={AppconLogo}
                                organizers="AppCon"
                            />

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default AwardSection;