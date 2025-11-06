import CodeIcon from "../assets/images/code_icon.svg";
import NorthEastIcon from "../assets/images/arrow_north_east_icon.svg";

export interface Props {
    imagePath: string;
    title: string;
    desc: string;
    codeLink?: string;
    projLink?: string;
}

function ProjectCell({ imagePath, title, desc, codeLink, projLink }: Props) {
    return (
        <div className="col-span-8 sm:col-span-4">
            <img
                src={imagePath}
                className="object-cover rounded-2xl w-full h-[12.5rem] lg:h-[20rem] flex justify-between mt-2"
            />

            <div className="flex justify-between mt-5">
                <div>
                    <p className="font-poppins text-light text-xl lg:text-3xl font-medium">
                        {title}
                    </p>
                    <p className="font-chakra text-light/50 text-xs md:text-sm lg:text-base font-extralight">
                        {desc}
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 md:gap-3">
                    {/* Code Button */}
                    <a
                        href={codeLink}
                        target="_blank"
                        className="bg-light/10 rounded-md sm:rounded-lg md:rounded-xl flex justify-center items-center
                                   w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px]"
                    >
                        <img
                            src={CodeIcon}
                            className={`w-[1.25rem] sm:w-[1.75rem] md:w-[2rem] ${codeLink ?? "opacity-10"}`}
                        />
                    </a>

                    {/* Project Button */}
                    <a
                        href={projLink}
                        target="_blank"
                        className="bg-light/10 rounded-md sm:rounded-lg md:rounded-xl flex justify-center items-center
                                   w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] md:w-[60px] md:h-[60px]"
                    >
                        <img
                            src={NorthEastIcon}
                            className={`w-[1.25rem] sm:w-[1.75rem] md:w-[2rem] ${projLink ?? "opacity-10"}`}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ProjectCell;
