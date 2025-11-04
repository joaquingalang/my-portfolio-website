
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

function AwardCard({ imagePath, date, position, title, desc, orgImagePath, organizers, role }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <img src={imagePath} className="max-h-[15rem] min-w-full rounded-xl object-cover mb-2"/>
            <div className="flex gap-5 items-center">
                <p className="font-poppins text-light/50 text-sm font-light">{date}</p>
                <p className="font-poppins text-light text-sm font-medium bg-primary/20 rounded-full px-3 py-1">{position}</p>
            </div>
            <p className="font-chakra text-light text-xl font-semibold">{title}</p>
            <p className="font-poppins text-light/50 text-md max-w-[50rem]">{desc}</p>
            <div className="mt-3 flex gap-5">

                <img src={orgImagePath} className="w-[3rem] h-[3rem] rounded-full object-cover"/>

                <div>
                    <p className="font-poppins text-light text-md max-w-[50rem]">{organizers}</p>
                    <p className="font-poppins text-light/50 text-sm max-w-[50rem]">{role ?? "Organizer"}</p>
                </div>

            </div>
        </div>
    );
}

export default AwardCard;