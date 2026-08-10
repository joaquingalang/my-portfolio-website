import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { useReducedMotion } from "../hooks/useReducedMotion";

export interface Props {
  children: ReactNode;
  /** Stagger offset in milliseconds, for revealing siblings in sequence. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/**
 * Fades and lifts its children into place the first time they scroll into view.
 *
 * Renders plainly — no hidden state, no observer — when the user prefers
 * reduced motion, so content is never gated behind an animation they opted out of.
 */
function Reveal({ children, delay = 0, className, as: Component = "div" }: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;

    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReduced]);

  if (prefersReduced) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out-expo will-change-[opacity,transform]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  );
}

export default Reveal;
