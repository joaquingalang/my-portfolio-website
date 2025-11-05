import { useState } from "react";
import StarBorder from "./StarBorder";
import { Menu, X } from "lucide-react"; 

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "About", href: "#about-section" },
    { label: "Projects", href: "#projects-section" },
    { label: "Involvement", href: "#involvement-section" },
    { label: "Awards", href: "#awards-section" },
    { label: "Contact", href: "#contact-section" },
  ];

  return (
    <div className="fixed z-50 mt-5 w-full flex justify-center">
      <StarBorder speed="5s" thickness={1} className="cursor-default w-[90%] max-w-[600px]">

        {/* Desktop Nav */}
        <div className="hidden sm:flex gap-[3rem] font-poppins text-light text-base font-light">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="hover:opacity-80 transition">
              {item.label}
            </a>
          ))}
        </div>

        {/* Mobile Button */}
        <button
          className="font-poppins text-light flex sm:hidden items-center gap-2 font-poppins text-base"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
          Menu
        </button>
      </StarBorder>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-[70px] w-[90%] max-w-[600px] bg-black border border-gray-800 rounded-xl p-4 md:hidden animate-slideDown">
          <div className="flex flex-col gap-4 font-poppins text-light text-base font-light text-center">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="py-2 hover:opacity-80 transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
