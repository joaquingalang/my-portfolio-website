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
        <div className="bg-dark w-full min-h-screen relative">

            {/* Navigation Bar */}
            <NavBar/>

            {/* Landing Section */}
            <HeroSection/>

            {/* Tech Tools (Logo Loop) */}
            <SkillSection/>

            {/* About Section */}
            <AboutSection/>

            {/* Project Section */}
            <ProjectSection/>
            

            {/* Involvement Section (Scroll Stack) */}
            <InvolvementSection/>

            {/* Awards Section */}
            <AwardSection/>

            {/* Contact Section (Icon Cloud) */}
            <ContactSection/>

            {/* Footer */}
            <Footer/>


        </div>
    );
}

export default HomePage;