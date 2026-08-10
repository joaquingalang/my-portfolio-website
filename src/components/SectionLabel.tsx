import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface Props {
    activeIcon: string;
    inactiveIcon: string;
    title: string;
    className?: string;
    /**
     * Hover state supplied by a parent, so pointing anywhere at the heading —
     * not just the 22px icon — plays the animation. Left undefined, the label
     * manages its own hover.
     */
    active?: boolean;
}

/** Small uppercase eyebrow above a section heading. */
function SectionLabel({ activeIcon, inactiveIcon, title, className, active }: Props) {
    const prefersReduced = useReducedMotion();
    const [selfActive, setSelfActive] = useState(false);
    const [hasActivated, setHasActivated] = useState(false);

    const isControlled = active !== undefined;
    const isActive = (isControlled ? active : selfActive) && !prefersReduced;

    // The animated frames are several hundred KB each. Mount one only after its
    // first hover, then keep it mounted so repeat hovers cross-fade instantly
    // instead of blanking while the GIF is fetched.
    useEffect(() => {
        if (isActive) setHasActivated(true);
    }, [isActive]);

    return (
        <div
            className={cn("flex gap-2 items-center", className)}
            onPointerEnter={isControlled ? undefined : () => setSelfActive(true)}
            onPointerLeave={isControlled ? undefined : () => setSelfActive(false)}
        >
            <span className="relative block w-[18px] md:w-[22px] h-[18px] md:h-[22px] shrink-0">
                <img
                    src={inactiveIcon}
                    alt=""
                    width={22}
                    height={22}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain"
                />
                {hasActivated && (
                    <img
                        src={activeIcon}
                        alt=""
                        width={22}
                        height={22}
                        decoding="async"
                        aria-hidden="true"
                        className={cn(
                            "absolute inset-0 h-full w-full object-contain transition-opacity duration-200",
                            isActive ? "opacity-100" : "opacity-0"
                        )}
                    />
                )}
            </span>
            <p className="font-poppins text-primary text-xs md:text-sm font-light uppercase tracking-[0.18em] whitespace-nowrap">
                {title}
            </p>
        </div>
    );
}

export default SectionLabel;
