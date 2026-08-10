import RotatingText from "../components/RotatingText";
import SocialLinks from "../components/SocialLinks";
import Button from "../components/Button";
import JoaquinProfile from "../assets/images/joaquin_profile.webp";

const CV_URL =
    "https://drive.google.com/file/d/1EwVW_YXibQH2VvfNaptXbqtXi5SQX04_/view?usp=sharing";

function HeroSection() {
    return (
        <section
            id="landing-section"
            aria-labelledby="hero-heading"
            /* Top padding clears the navbar, which also shifts the flex centring
               down by the same amount — so the content is optically centred in
               the space *below* the navbar rather than in the whole viewport,
               which is what made it sit high before. `svh` keeps mobile stable
               when the browser chrome collapses. */
            className="flex min-h-[88svh] items-center justify-center pt-[calc(var(--nav-offset)+1rem)] pb-[var(--section-pad)]"
        >
            <div className="section-shell grid grid-cols-8 items-center gap-y-6">

                <div className="col-span-8 flex justify-center sm:col-span-3 sm:justify-end">
                    {/* Intrinsic size declared so the tallest above-the-fold image
                        reserves its box before decode (no CLS), and prioritised
                        because it is the LCP candidate. */}
                    <img
                        src={JoaquinProfile}
                        alt="Portrait of Joaquin Galang"
                        width={1200}
                        height={1628}
                        fetchPriority="high"
                        decoding="async"
                        className="max-h-[420px] w-auto object-contain px-4 sm:px-2 md:px-6"
                    />
                </div>

                <div className="col-span-8 flex flex-col justify-center sm:col-span-5">

                    <p className="mb-2 text-center font-poppins text-base font-light text-light/70 sm:text-start md:text-lg">
                        Hi, I&rsquo;m Quin.
                    </p>

                    <h1
                        id="hero-heading"
                        className="m-0 text-center font-sarpanch title font-bold text-light sm:text-start"
                    >
                        <span className="mr-3">A software developer building</span>
                        <RotatingText
                            /* Leads on "automations" — the differentiator, and also
                               what the reduced-motion render pins to, so the static
                               sentence is the strongest one. First and last entries
                               are both 11 characters, keeping the chip's width
                               travel symmetric across the loop. */
                            texts={["automations", "frontend", "backend", "experiences"]}
                            /* text-dark on mint: ~11.5:1. The previous text-light
                               on mint measured ~1.6:1 and was effectively unreadable. */
                            mainClassName="inline-block font-sarpanch title font-bold text-dark px-2 md:px-3 bg-primary my-1 py-1 lg:py-2 justify-center rounded-lg overflow-hidden"
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

                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start md:mt-8">

                        <Button as="a" href="#projects-section" variant="primary">
                            View my work
                        </Button>

                        <Button
                            as="a"
                            href={CV_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="secondary"
                        >
                            Download CV
                        </Button>

                    </div>

                    <div className="mt-5 flex items-center justify-center gap-3 sm:justify-start">
                        <SocialLinks />
                        <hr
                            aria-hidden="true"
                            className="ml-2 hidden flex-grow border-0 border-t border-light/15 sm:block"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
