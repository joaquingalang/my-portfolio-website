import AnimatedIconButton from "./AnimatedIconButton";
import GitHubLoop from "../assets/images/github_loop.gif";
import GitHubStatic from "../assets/images/github_static.png";
import LinkedInLoop from "../assets/images/linkedin_loop.gif";
import LinkedInStatic from "../assets/images/linkedin_static.png";
import EmailLoop from "../assets/images/email_loop.gif";
import EmailStatic from "../assets/images/email_static.png";

function Footer() {
    return (
        <div>
            <hr className="border border-light/10 rounded-full mt-[5rem]"/>
            <div className="w-full h-[5rem] flex justify-between items-center px-7">
                <p className="font-poppins text-light/50 text-center">Copyright © 2025 Joaquin Galang. All rights reserved.</p>
                <div className="flex gap-5">
                    <AnimatedIconButton 
                        activeLogo={GitHubLoop} 
                        inactiveLogo={GitHubStatic} 
                        href="https://github.com/joaquingalang"
                        alt="GitHub Profile"
                        className="w-[2.5rem] h-[2.5rem]"
                    />
                    <AnimatedIconButton 
                        activeLogo={LinkedInLoop} 
                        inactiveLogo={LinkedInStatic} 
                        href="https://www.linkedin.com/in/joaquin-galang/"
                        alt="LinkedIn Profile"
                        className="w-[2.5rem] h-[2.5rem]"
                    />
                    <AnimatedIconButton 
                        activeLogo={EmailLoop} 
                        inactiveLogo={EmailStatic} 
                        href=""
                        alt="Contact Email"
                        className="w-[2.5rem] h-[2.5rem]"
                    />
                </div>
            </div>
        </div>
    );
}

export default Footer;