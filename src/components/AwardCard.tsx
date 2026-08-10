import { cn } from "../utils/cn";

export interface Props {
    imagePath: string;
    date: string;
    position: string;
    title: string;
    desc: string;
    orgImagePath: string;
    organizers: string;
    role?: string;
}

/**
 * Rank is encoded by badge intensity rather than by hue, so the three tiers
 * read at a glance without introducing colours outside the palette.
 */
function badgeClass(position: string): string {
    const rank = position.trim().toLowerCase();
    if (rank === "champion") return "bg-primary text-dark font-semibold";
    if (rank === "winner") return "bg-primary/20 text-primary border border-primary/30";
    return "bg-light/10 text-light/80 border border-light/15";
}

function AwardCard({
    imagePath,
    date,
    position,
    title,
    desc,
    orgImagePath,
    organizers,
    role,
}: Props) {
    return (
        <article className="group flex h-full flex-col">

            <div className="overflow-hidden rounded-xl bg-surface">
                <img
                    src={imagePath}
                    alt={`${title} — ${position}`}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-[1.04] motion-reduce:transform-none"
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <span
                    className={cn(
                        "rounded-full px-3 py-1 font-poppins text-xs md:text-sm",
                        badgeClass(position)
                    )}
                >
                    {position}
                </span>
                <span className="font-poppins text-xs font-light text-light/55 md:text-sm">
                    {date}
                </span>
            </div>

            <h3 className="mt-3 font-chakra text-lg font-semibold text-light md:text-xl">
                {title}
            </h3>

            <p className="mt-2 font-poppins text-xs text-light/70 md:text-sm">{desc}</p>

            {/* Pushed to the bottom so organiser rows line up across cards of
                differing description lengths. */}
            <div className="mt-auto flex items-center gap-4 pt-5">
                {/* object-contain on a tinted disc: some organiser marks are wide
                    wordmarks that object-cover was cropping into illegibility. */}
                <img
                    src={orgImagePath}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-11 w-11 shrink-0 rounded-full bg-light/5 object-contain p-1.5 ring-1 ring-light/10 md:h-12 md:w-12"
                />

                <div className="min-w-0">
                    <p className="font-poppins text-sm text-light md:text-base">{organizers}</p>
                    <p className="font-poppins text-xs text-light/55 md:text-sm">
                        {role ?? "Organizer"}
                    </p>
                </div>
            </div>
        </article>
    );
}

export default AwardCard;
