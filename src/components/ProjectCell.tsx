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
        <div className="col-span-8 md:col-span-4">
            <img src={imagePath} className="object-cover rounded-2xl w-full h-[20rem] flex justify-between mt-2"/>
            <div className="flex justify-between mt-5">
                <div>
                    <p className="font-poppins text-light text-3xl font-medium">{title}</p>
                    <p className="font-chakra text-light/50 text-md font-extralight">{desc}</p>
                </div>

                <div className="flex gap-3">
                    
                    <a href={codeLink} target="_blank" className="bg-light/10 rounded-xl w-[60px] h-[60px] flex justify-center items-center">
                        <img src={CodeIcon} className={`w-[2rem] ${codeLink ?? "opacity-10"}`}/>
                    </a>
                
                    <a href={projLink} target="_blank" className="bg-light/10 rounded-xl w-[60px] h-[60px] flex justify-center items-center">
                        <img src={NorthEastIcon} className={`w-[2rem] ${projLink ?? "opacity-10"}`}/>
                    </a>
                    
                </div>
            </div>
        </div>
    );
}

export default ProjectCell;