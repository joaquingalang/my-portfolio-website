import SectionLabel from "../components/SectionLabel";
import ContactLoop from "../assets/images/contact_loop.gif";
import ContactStatic from "../assets/images/contact_static.png";
import { IconCloud } from "../components/IconCloud";
import ContactForm from "../components/ContactForm";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "react",
  "flutter",
  "android",
  "html5",
  "css",
  "nodedotjs",
  "firebase",
  "git",
  "python",
  "androidstudio",
  "figma",
  "supabase",
  "cloudflare",
  "google",
  "c#",
  "tailwindcss",
  "mongodb",
  "mysql",
  "unity",
  "datacamp",
  "roll20",
  "slack",
  "stackoverflow",
  "netlify",
]

function ContactSection() {

    const images = slugs.map(
        (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
    )

    return (
        <section id="contact-section" className="scroll-mt-24 flex justify-center items-center">
            <div className="mx-10 w-full md:max-w-[1000px] grid grid-cols-9">
                <div className="col-span-9">

                    <SectionLabel activeIcon={ContactLoop} inactiveIcon={ContactStatic} title="get in touch"/>

                    <p className="font-chakra title text-light font-bold mt-2">Contact Me</p>

                    <p className="font-poppins subtitle text-light text-lg font-light mt-3">Want to collaborate? Leave me a message. Let's build cool stuff together.</p>

                    <div className="grid grid-cols-8 mt-10">
                        
                        <div className="col-span-8 md:col-span-4 order-2 md:order-1">
                            <ContactForm/>
                        </div>

                        <div className="col-span-8 md:col-span-4 order-1 md:order-2">
                            <div className="relative flex size-full justify-center md:justify-end overflow-hidden pb-10">
                                <IconCloud images={images} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default ContactSection;