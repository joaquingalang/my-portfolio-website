import { useEffect, useRef, useState } from "react";
import StarBorder from "./StarBorder";
import { Menu, X } from "lucide-react";
import { cn } from "../utils/cn";
import { navItems, navSectionIds } from "../data/navigation";
import { useActiveSection } from "../hooks/useActiveSection";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const activeId = useActiveSection(navSectionIds);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Dismiss the mobile menu the way users expect: Escape, or a tap anywhere
  // outside it. Escape also returns focus to the toggle it came from.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <nav ref={navRef} aria-label="Main" className="fixed z-50 mt-5 w-full flex justify-center">
      <StarBorder speed="5s" thickness={1} className="cursor-default w-[90%] max-w-[600px]">

        {/* Desktop Nav */}
        <div className="hidden sm:flex gap-5 md:gap-8 justify-center font-poppins text-light text-sm md:text-base font-light">
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.label}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group relative py-1 transition-colors duration-200",
                  isActive ? "text-primary" : "text-light hover:text-primary"
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-300 ease-out-expo",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </a>
            );
          })}
        </div>

        {/* Mobile Button */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          className="font-poppins text-light flex sm:hidden items-center gap-2 text-base min-h-[44px] w-full justify-center"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          {isOpen ? "Close" : "Menu"}
        </button>
      </StarBorder>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          id="mobile-nav"
          /* `top-full` tracks the pill's real height instead of the previous
             hardcoded 74px, which drifted out of sync with its padding. */
          className="absolute top-full mt-2 w-[90%] max-w-[600px] bg-surface/95 backdrop-blur-md border border-light/10 rounded-2xl p-2 sm:hidden animate-slideDown shadow-2xl shadow-black/50"
        >
          <div className="flex flex-col font-poppins text-base font-light">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.label}
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex min-h-[44px] items-center justify-center rounded-xl px-4 transition-colors duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-light hover:bg-light/5 active:bg-light/10"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
