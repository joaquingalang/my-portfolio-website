import { useState } from "react";

export interface Props {
    activeIcon: string;
    inactiveIcon: string;
    title: string;
}

function SectionLabel({ activeIcon, inactiveIcon, title }: Props) {

    const [isAnimated, setIsAnimated] = useState(false);

    const handleMouseEnter = () => {
        setIsAnimated(true);
    }

    const handleMouseLeave = () => {
        setIsAnimated(false);
    }

    return (
        <div onPointerEnter={handleMouseEnter} onPointerLeave={handleMouseLeave} className="flex gap-2 items-center">
            <img src={isAnimated ? activeIcon : inactiveIcon} className="w-[25px] h-[25px]"/>
            <p className="font-poppins text-primary text-lg font-extralight uppercase whitespace-nowrap">{title}</p>
        </div>
    );
}

export default SectionLabel;