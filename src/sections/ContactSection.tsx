import SectionLabel from "../components/SectionLabel";
import ContactLoop from "../assets/images/contact_loop.gif";
import ContactStatic from "../assets/images/contact_static.png";
import { IconCloud } from "../components/IconCloud";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "firebase",
  "java",
  "git",
  "python",
  "visualstudiocode",
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
  "roll20"
]

function ContactSection() {

    const images = slugs.map(
        (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
    )

    return (
        <section id="contact-section" className="min-h-[40vh] mt-[8rem]">
            <div className="grid grid-cols-12">
                <div className="col-start-3 col-span-9">

                    <SectionLabel activeIcon={ContactLoop} inactiveIcon={ContactStatic} title="get in touch"/>

                    <p className="font-chakra text-light text-5xl font-bold mt-2">Contact Me</p>

                    <p className="font-poppins text-light text-lg font-light mt-3">Want to collaborate? Leave me a message. Let's build cool stuff together.</p>

                    <div className="grid grid-cols-9 mt-10">
                        
                        <div className="col-span-4">
                            <form>
                                <p className="font-chakra text-light text-lg font-medium mb-1">Full Name</p>
                                <input type="text" placeholder="John Doe" className="w-full font-poppins text-light bg-gray px-3 pb-1 pt-2 outline-none placeholder-light/10 mb-3"/>

                                <p className="font-chakra text-light text-lg font-medium mb-1">Email Address</p>
                                <input type="email" placeholder="johndoe@gmail.com" className="w-full font-poppins text-light bg-gray px-3 pb-1 pt-2 outline-none placeholder-light/10 mb-3"/>

                                <p className="font-chakra text-light text-lg font-medium mb-1">Message</p>
                                <textarea placeholder="Leave your message here..." className="w-full min-h-[15rem] font-poppins text-light bg-gray px-3 pb-1 pt-2 outline-none placeholder-light/10 mb-3"/>
                                
                                <div className="w-full flex justify-end">
                                    <input type="submit" className="bg-white/10 border-2 border-gray rounded-lg px-5 py-2 font-poppins text-primary text-md whitespace-nowrap"/>
                                </div>
                            </form>
                        </div>

                        <div className="col-span-5">
                            <div className="relative flex size-full justify-center overflow-hidden pb-10">
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