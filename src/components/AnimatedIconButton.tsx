import { useState } from "react";

export interface Props {
  activeLogo: string;
  inactiveLogo: string;
  href: string;
  alt?: string;
  className?: string;
}

function AnimatedIconButton({ activeLogo, inactiveLogo, href, className }: Props) {

    const [visibleLogo, setVisibleLogo] = useState(inactiveLogo);

    return (
    <a href={href} target="_blank" rel="noopener noreferrer">
        <div className="transform transition-transform duration-300 hover:-translate-y-1"
            onPointerEnter={() => setVisibleLogo(activeLogo)}
            onPointerLeave={() => setVisibleLogo(inactiveLogo)}>
            <img src={visibleLogo} className={`object-contain aspect-square transition-[filter] duration-200 hover:brightness-110 ${className ?? 'w-[5rem] h-[5rem]'}`} />
        </div>
    </a>

    );
}

export default AnimatedIconButton;
