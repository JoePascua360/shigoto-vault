import { ModeToggle } from "@/themes/mode-toggle";
import { LogIn, User2, UserRoundPen, Vault } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import NavbarLeftSection from "./navbar/navbar-left-section";
import NavbarRightSection from "./navbar/navbar-right-section";

export default function Navbar() {
  // Navigation links array to be used in both desktop and mobile menus
  const location = useLocation();

  const navigationLinks = [
    { href: "/", label: "Home", active: location.pathname === "/" },
    { href: "/about", label: "About", active: location.pathname === "/about" },
    {
      href: "/app-guide",
      label: "Guide",
      active: location.pathname === "/app-guide",
    },
  ];

  return (
    <nav className="flex flex-col gap-5 justify-between">
      <header className="border-b px-4 md:px-6 sticky top-0">
        <div className="flex h-16 justify-between gap-4">
          {/* Left side */}
          <NavbarLeftSection navigationLinks={navigationLinks} />
          {/* Right side */}
          <NavbarRightSection />
        </div>
      </header>
      <main className="h-[90dvh]">
        <Outlet />
      </main>
    </nav>
  );
}
