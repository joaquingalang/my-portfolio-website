import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import ContactLoop from "../assets/images/contact_loop.gif";
import ContactStatic from "../assets/images/contact_static.webp";
import { IconCloud } from "../components/IconCloud";
import ContactForm from "../components/ContactForm";
import SocialLinks from "../components/SocialLinks";
import { CONTACT_EMAIL, iconCloudSlugs } from "../data/contact";

function ContactSection() {
    const images = iconCloudSlugs.map(
        (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`
    );

    return (
        <section
            id="contact-section"
            aria-labelledby="contact-heading"
            className="flex items-center justify-center section-y"
        >
            <div className="section-shell">

                <SectionHeading
                    id="contact-heading"
                    eyebrow="get in touch"
                    activeIcon={ContactLoop}
                    inactiveIcon={ContactStatic}
                    title="Contact Me"
                    lede="Want to collaborate? Leave me a message. Let's build cool stuff together."
                />

                <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">

                    {/* Form leads on every breakpoint. It previously sat below the
                        decorative canvas on mobile, pushing the actual conversion
                        point off the first screen. */}
                    <Reveal>
                        <ContactForm />
                    </Reveal>

                    <Reveal delay={120} className="flex flex-col items-center gap-8 md:items-end">
                        <IconCloud images={images} size={440} />

                        {/* Mobile only. The footer hides its social row below md,
                            so these are the sole copy on small screens rather than
                            a duplicate. Desktop keeps this column to the sphere
                            alone and lets the footer carry the links. */}
                        <div className="w-full text-center md:hidden">
                            <p className="font-chakra text-sm font-medium uppercase tracking-[0.18em] text-light/55">
                                Prefer email?
                            </p>

                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="mt-2 inline-block break-all font-poppins text-base text-light underline decoration-primary/40 underline-offset-4 transition-colors duration-200 hover:text-primary hover:decoration-primary"
                            >
                                {CONTACT_EMAIL}
                            </a>

                            <div className="mt-5 flex justify-center gap-3">
                                <SocialLinks />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

export default ContactSection;
