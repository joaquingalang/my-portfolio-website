import CodeIcon from "../assets/images/code_icon.svg";
import NorthEastIcon from "../assets/images/arrow_north_east_icon.svg";
import { cn } from "../utils/cn";

const TILE_CLASS =
    "relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-light/10 " +
    "transition-[background-color,transform] duration-200 ease-out-quart " +
    "hover:-translate-y-0.5 hover:bg-primary hover:[&_img]:brightness-0 md:h-[52px] md:w-[52px]";

function ProjectLink({ href, icon, label }: { href: string; icon: string; label: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={TILE_CLASS}>
            <img src={icon} alt="" className="w-5 md:w-6" />
        </a>
    );
}

export interface Props {
    imagePath: string;
    title: string;
    desc: string;
    codeLink?: string;
    projLink?: string;
}

function ProjectCell({ imagePath, title, desc, codeLink, projLink }: Props) {
    // The card reads as one target: the title link is stretched across the whole
    // cell, with the icon buttons layered above it for their specific destinations.
    const primaryLink = projLink ?? codeLink;

    // Grid placement is owned by the wrapping <Reveal> in ProjectSection.
    return (
        <article className="group relative">

            <div className="overflow-hidden rounded-2xl bg-surface">
                <img
                    src={imagePath}
                    alt={`${title} — ${desc}`}
                    loading="lazy"
                    decoding="async"
                    width={1920}
                    height={1080}
                    /* Source art is 16:9, so the ratio is exact — the box is
                       reserved before decode and nothing is cropped. */
                    className="aspect-video w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-[1.04] motion-reduce:transform-none"
                />
            </div>

            <div className="mt-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="font-poppins text-xl font-medium text-light transition-colors duration-200 group-hover:text-primary md:text-2xl">
                        {primaryLink ? (
                            <a
                                href={primaryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                            >
                                {title}
                            </a>
                        ) : (
                            title
                        )}
                    </h3>
                    <p className="mt-1 font-chakra text-xs font-light text-light/60 md:text-sm lg:text-base">
                        {desc}
                    </p>
                </div>

                <div className={cn("flex shrink-0 gap-2 md:gap-3")}>
                    {codeLink && (
                        <ProjectLink
                            href={codeLink}
                            icon={CodeIcon}
                            label={`View source code for ${title}`}
                        />
                    )}
                    {projLink && (
                        <ProjectLink
                            href={projLink}
                            icon={NorthEastIcon}
                            label={`Open live demo for ${title}`}
                        />
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProjectCell;
