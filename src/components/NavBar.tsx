import StarBorder from "./StarBorder";

function NavBar() {
    return (
        <div className="fixed z-50 mt-5 w-full flex justify-center">
            <StarBorder speed="5s" thickness={1} className="cursor-default ">

                <div className="flex gap-[5rem] font-poppins text-light text-base font-light">
                    <a href="#about-section" className="">About</a>
                    <a href="#projects-section">Projects</a>
                    <a href="#involvement-section">Involvement</a>
                    <a href="#awards-section">Awards</a>
                    <a href="#contact-contact">Contact</a>
                </div>

            </StarBorder>
        </div>
    );
}

export default NavBar;