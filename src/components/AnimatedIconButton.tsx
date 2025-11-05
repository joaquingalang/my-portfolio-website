import { useState } from "react";

export interface Props {
  activeLogo: string;
  inactiveLogo: string;
  href: string;
  target?: string;
  className?: string;
}

function AnimatedIconButton({ activeLogo, inactiveLogo, href, target, className }: Props) {

    const [visibleLogo, setVisibleLogo] = useState(inactiveLogo);

    return (
    <a href={href} target={target ?? ""} rel="noopener noreferrer">
        <div className="transform transition-transform duration-300 hover:-translate-y-1"
            onPointerEnter={() => setVisibleLogo(activeLogo)}
            onPointerLeave={() => setVisibleLogo(inactiveLogo)}>
            <img src={visibleLogo} className={`object-contain aspect-square transition-[filter] duration-200 hover:brightness-110 ${className ?? 'w-[36px] h-[36px]'}`} />
        </div>
    </a>

    );
}

export default AnimatedIconButton;
