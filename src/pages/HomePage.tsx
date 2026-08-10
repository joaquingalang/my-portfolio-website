import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import AboutSection from "../sections/AboutSection";
import AwardSection from "../sections/AwardsSection";
import ContactSection from "../sections/ContactSection";
import HeroSection from "../sections/HeroSection";
import InvolvementSection from "../sections/InvolvementSection";
import ProjectSection from "../sections/ProjectSection";
import SkillSection from "../sections/SkillSection";

function HomePage() {
    return (
        <div className="bg-dark">

            {/* Visible only once focused — lets keyboard users jump the navbar. */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:font-poppins focus:text-sm focus:font-medium focus:text-dark"
            >
                Skip to content
            </a>

            {/* Navigation Bar */}
            <NavBar/>

            <main id="main-content">

                {/* Landing Section */}
                <HeroSection/>

                {/* Tech Tools (Logo Loop) */}
                <SkillSection/>

                {/* About Section */}
                <AboutSection/>

                {/* Project Section */}
                <ProjectSection/>

                {/* Involvement Section */}
                <InvolvementSection/>

                {/* Awards Section */}
                <AwardSection/>

                {/* Contact Section (Icon Cloud) */}
                <ContactSection/>

            </main>

            {/* Footer */}
            <Footer/>

        </div>
    );
}

export default HomePage;
