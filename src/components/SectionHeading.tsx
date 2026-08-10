import { useState } from "react";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import { cn } from "../utils/cn";

export interface Props {
    /** Matches the `aria-labelledby` on the owning <section>. */
    id: string;
    eyebrow: string;
    activeIcon: string;
    inactiveIcon: string;
    title: string;
    lede?: string;
    className?: string;
    ledeClassName?: string;
}

/**
 * The eyebrow + heading + lede trio shared by every content section.
 *
 * Previously each section hand-rolled this with a `<p>` standing in for the
 * heading, which left the page with a single h1 and no other landmarks.
 */
function SectionHeading({
    id,
    eyebrow,
    activeIcon,
    inactiveIcon,
    title,
    lede,
    className,
    ledeClassName,
}: Props) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Reveal className={className}>
            <div
                onPointerEnter={() => setIsHovered(true)}
                onPointerLeave={() => setIsHovered(false)}
            >
                <SectionLabel
                    activeIcon={activeIcon}
                    inactiveIcon={inactiveIcon}
                    title={eyebrow}
                    active={isHovered}
                />

                <h2 id={id} className="font-chakra title text-light font-bold mt-3">
                    {title}
                </h2>

                {lede && (
                    <p
                        className={cn(
                            "font-poppins subtitle text-light/70 font-light mt-4 measure",
                            ledeClassName
                        )}
                    >
                        {lede}
                    </p>
                )}
            </div>
        </Reveal>
    );
}

export default SectionHeading;
