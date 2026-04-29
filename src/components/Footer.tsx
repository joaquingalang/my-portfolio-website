import SocialLinks from "./SocialLinks";

function Footer() {
    return (
        <div>
            <hr className="border border-light/10 rounded-full mt-[5rem]"/>
            <div className="w-full flex flex-col md:flex-row gap-5 justify-between items-center p-7">
                <p className="font-poppins text-light/50 text-sm md:text-base text-center">Copyright © 2025 Joaquin Galang. All rights reserved.</p>
                <div className="flex gap-5">
                    <SocialLinks buttonClassName="w-[2rem] md:w-[2.5rem] h-[2rem] md:h-[2.5rem]" />
                </div>
            </div>
        </div>
    );
}

export default Footer;
