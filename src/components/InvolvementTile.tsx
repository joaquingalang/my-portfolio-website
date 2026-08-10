export interface Props {
    imagePath: string;
    organization: string;
    position: string;
    term: string;
    desc: string;
}

function InvolvementTile({ imagePath, organization, position, term, desc }: Props) {
    return (
        <article className="group flex gap-4 sm:gap-6">
            {/* Fixed square box: the source marks are not all the same ratio, so
                object-cover on a locked aspect keeps the circle from squashing them. */}
            <img
                src={imagePath}
                alt={`${organization} logo`}
                loading="lazy"
                decoding="async"
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-light/10 transition-[transform,box-shadow] duration-300 ease-out-quart group-hover:-translate-y-0.5 group-hover:ring-primary/40 sm:h-16 sm:w-16"
            />

            <div className="min-w-0">
                <h3 className="font-chakra text-lg font-semibold text-light sm:text-xl">
                    {position}
                </h3>
                <p className="font-poppins text-xs font-medium text-primary sm:text-sm">
                    {organization}
                </p>
                <p className="mb-2 font-poppins text-xs font-light text-light/55 sm:text-sm">
                    {term}
                </p>
                <p className="font-poppins text-xs text-light/80 sm:text-sm measure">
                    {desc}
                </p>
            </div>
        </article>
    );
}

export default InvolvementTile;
