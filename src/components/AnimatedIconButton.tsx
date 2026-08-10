import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface Props {
  activeLogo: string;
  inactiveLogo: string;
  href: string;
  label: string;
  target?: string;
  className?: string;
}

/**
 * Social icon that swaps to its animated variant on hover or keyboard focus.
 *
 * The GIF frame is mounted on first activation and then kept, so the initial
 * page load never pays for it and repeat hovers cross-fade without the blank
 * frame the old `src` swap produced. The anchor is padded to a 44px hit area
 * even when the icon itself is smaller.
 */
function AnimatedIconButton({ activeLogo, inactiveLogo, href, label, target, className }: Props) {
  const prefersReduced = useReducedMotion();
  const [isActive, setIsActive] = useState(false);
  const [hasActivated, setHasActivated] = useState(false);

  const showAnimated = isActive && !prefersReduced;

  useEffect(() => {
    if (showAnimated) setHasActivated(true);
  }, [showAnimated]);

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg"
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={() => setIsActive(false)}
    >
      <span
        className={cn(
          "relative block transition-transform duration-300 ease-out-quart motion-reduce:transform-none",
          showAnimated && "-translate-y-1",
          className ?? "w-9 h-9"
        )}
      >
        <img
          src={inactiveLogo}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
        {hasActivated && (
          <img
            src={activeLogo}
            alt=""
            decoding="async"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full object-contain transition-opacity duration-200",
              showAnimated ? "opacity-100" : "opacity-0"
            )}
          />
        )}
      </span>
    </a>
  );
}

export default AnimatedIconButton;
