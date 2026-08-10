import SocialLinks from "./SocialLinks";

function Footer() {
    return (
        <footer className="border-t border-light/10">
            <div className="section-shell flex flex-col items-center gap-6 py-8 md:flex-row md:justify-between">

                <p className="text-center font-poppins text-sm text-light/55 md:text-base">
                    Copyright © {new Date().getFullYear()} Joaquin Galang. All rights reserved.
                </p>

                {/* Desktop only. On mobile these live under the icon sphere in the
                    contact section, so the same three links don't appear twice
                    within a screen of each other. */}
                <div className="hidden items-center gap-4 md:flex">
                    <SocialLinks buttonClassName="w-8 h-8 md:w-10 md:h-10" />
                </div>

            </div>
        </footer>
    );
}

export default Footer;
