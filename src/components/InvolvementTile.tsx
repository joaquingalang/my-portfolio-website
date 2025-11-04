export interface Props {
    imagePath: string;
    position: string;
    term: string;
    desc: string;
}

function InvolvementTile({ imagePath, position, term, desc }: Props) {
    return (
        <div className="grid grid-cols-12 mb-5">
            <img src={imagePath} className="col-span-2 rounded-full"/>
            <div className="col-span-10 h-full flex flex-col justify-center ml-[2rem]">
                <p className="font-chakra text-light text-xl font-semibold">{position}</p>
                <p className="font-poppins text-light/50 text-sm font-light mb-1">{term}</p>
                <p className="font-poppins text-light text-sm max-w-[50rem]">{desc}</p>
            </div>
        </div>
    );
}

export default InvolvementTile;