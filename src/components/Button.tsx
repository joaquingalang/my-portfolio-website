import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../utils/cn";

export type ButtonVariant = "primary" | "secondary";

const BASE =
    "inline-flex items-center justify-center gap-2 min-h-[44px] rounded-full px-6 font-poppins text-sm md:text-base whitespace-nowrap " +
    "transition-[background-color,border-color,color,transform] duration-200 ease-out-quart " +
    "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
    // Mint on near-black reads at ~11.5:1 — the one loud element per view.
    primary: "bg-primary text-dark font-medium hover:bg-primary/90 hover:-translate-y-0.5",
    secondary:
        "border border-light/15 bg-light/5 text-light hover:bg-light/10 hover:border-primary/50 hover:text-primary hover:-translate-y-0.5",
};

type Props<T extends ElementType> = {
    as?: T;
    variant?: ButtonVariant;
    className?: string;
    children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Shared CTA. Renders whatever element it is given (`a` for navigation,
 * `button` for actions) so hierarchy stays consistent without duplicating
 * class strings across sections.
 */
function Button<T extends ElementType = "button">({
    as,
    variant = "primary",
    className,
    children,
    ...rest
}: Props<T>) {
    const Component = (as || "button") as ElementType;

    return (
        <Component className={cn(BASE, VARIANTS[variant], className)} {...rest}>
            {children}
        </Component>
    );
}

export default Button;
