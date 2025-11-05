import RotatingText from "../components/RotatingText";
import AnimatedIconButton from "../components/AnimatedIconButton";
import GitHubLoop from "../assets/images/github_loop.gif";
import GitHubStatic from "../assets/images/github_static.png";
import LinkedInLoop from "../assets/images/linkedin_loop.gif";
import LinkedInStatic from "../assets/images/linkedin_static.png";
import EmailLoop from "../assets/images/email_loop.gif";
import EmailStatic from "../assets/images/email_static.png";
import JoaquinProfile from "../assets/images/joaquin_profile.png";

function HeroSection() {
    return (
        <section id="landing-section" className="min-h-[80vh] z-10 flex justify-center items-center">
            <div className="mt-5 grid grid-cols-12 gap-5">
                <div className="col-start-3 col-span-8 grid grid-cols-8">

                    <div className="col-span-3 border border-transparent">

                        <img src={JoaquinProfile} className="p-10"/>

                    </div>

                    <div className="col-span-5 flex flex-col justify-center border border-transparent">

                        <p className="font-poppins text-light text-lg font-light mb-2">Hi, I'm Quin. </p>
                        <h1 className="font-sarpanch text-light text-5xl font-bold m-0">
                            A full-stack developer
                        </h1>
                        <h1 className="mt-2 font-sarpanch text-light text-5xl font-bold m-0">
                            building
                            <RotatingText
                                texts={['websites', 'mobile apps', 'experiences']}
                                mainClassName="ml-5 inline font-sarpanch text-light text-5xl font-bold px-2 sm:px-2 md:px-3 bg-primary overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                                staggerFrom={"last"}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.025}
                                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={2000}
                            />
                        </h1>

                        <div className="flex gap-[10px] mt-4 items-center">
                            <button className="bg-white/10 border-2 border-gray rounded-full px-[30px] py-[10px]">
                                <p className="font-poppins text-primary text-md whitespace-nowrap">Download CV</p>
                            </button>

                            <AnimatedIconButton 
                                activeLogo={GitHubLoop} 
                                inactiveLogo={GitHubStatic} 
                                href="https://github.com/joaquingalang"
                                target="_blank"
                            />
                            <AnimatedIconButton 
                                activeLogo={LinkedInLoop} 
                                inactiveLogo={LinkedInStatic} 
                                href="https://www.linkedin.com/in/joaquin-galang/"
                                target="_blank"
                            />
                            <AnimatedIconButton 
                                activeLogo={EmailLoop} 
                                inactiveLogo={EmailStatic} 
                                href="mailto:galang.joaquin.dev@email.com"
                            />

                            <hr className="border rounded-full border-light w-full overflow"/>

                        </div>
                        
                        
                        

                    </div>

                </div>
            </div>
        </section>
    );
}

export default HeroSection;