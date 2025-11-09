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
        <section id="landing-section" className="pt-5 min-h-[80vh] flex justify-center items-center">
            
            <div className="my-[5rem] sm:my-0 mx-10 w-full md:max-w-[1000px] grid grid-cols-8">

                <div className="col-span-8 sm:col-span-3 border border-transparent flex justify-center md:justify-end">

                    <img src={JoaquinProfile} className="p-10 max-h-[475px] object-contain"/>

                </div>

                <div className="col-span-8 sm:col-span-5 flex flex-col justify-center border border-transparent">

                    <p className="font-poppins text-light text-md md:text-lg font-light mb-2 text-center sm:text-start">Hi, I'm Quin. </p>
                    <h1 className="font-sarpanch text-light text-3xl md:text-4xl lg:text-5xl font-bold m-0 text-center sm:text-start">
                        <span className="mr-3">A full-stack developer building</span>
                        <RotatingText
                            texts={['frontend', 'backend', 'mobile', 'experiences']}
                            mainClassName="inline-block font-sarpanch text-light text-3xl md:text-4xl lg:text-5xl font-bold px-2 md:px-3 bg-primary my-1 py-1 lg:py-2 justify-center rounded-lg overflow-hidden"
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

                    <div className="flex gap-[10px] mt-2 md:mt-4 justify-center md:justify-start items-center">
                        
                        <a 
                            href="https://drive.google.com/file/d/1QJs2J3E_GQbluEaUjI8rZ3NQgVDkHxXg/view?usp=sharing"
                            target="_blank"
                            className="bg-white/10 border-2 border-gray rounded-full px-6 py-2 md:px-[30px] md:py-[10px]"
                        >
                            <p className="font-poppins text-primary text-sm md:text-base whitespace-nowrap">Download CV</p>
                        </a>

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

                        <hr className="hidden md:flex border rounded-full border-light flex-grow overflow"/>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;