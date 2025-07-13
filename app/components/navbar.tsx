import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ModeToggle } from "@/themes/mode-toggle";
import { LogIn, User2, UserRoundPen, Vault } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import DynamicDialog from "./dynamic-dialog";
import { useDialog } from "@/hooks/use-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { DialogClose } from "./ui/dialog";
import { authClient } from "@/config/auth-client";

export default function Navbar() {
  // Navigation links array to be used in both desktop and mobile menus

  const location = useLocation();

  const { data: session } = authClient.useSession();

  const navigationLinks = [
    { href: "/", label: "Home", active: location.pathname === "/" },
    { href: "/about", label: "About", active: location.pathname === "/about" },
    {
      href: "/app-guide",
      label: "Guide",
      active: location.pathname === "/app-guide",
    },
  ];

  const signInDialog = useDialog();

  return (
    <nav className="flex flex-col gap-5 justify-between">
      <header className="border-b px-4 md:px-6 sticky top-0">
        <div className="flex h-16 justify-between gap-4">
          {/* Left side */}
          <section className="flex gap-2">
            <div className="flex items-center md:hidden">
              {/* Mobile menu trigger */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="group size-8" variant="ghost" size="icon">
                    <svg
                      className="pointer-events-none"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12L20 12"
                        className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                      />
                      <path
                        d="M4 12H20"
                        className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                      />
                      <path
                        d="M4 12H20"
                        className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                      />
                    </svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-36 p-1 md:hidden ">
                  <NavigationMenu className="max-w-none *:w-full">
                    <NavigationMenuList className="flex-col items-start gap-0 md:gap-2 font-content">
                      {navigationLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <NavigationMenuLink
                            href={link.href}
                            className="py-1.5"
                            active={link.active}
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            </div>
            {/* Main nav */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-primary hover:text-primary/90">
                <Vault className="w-10 h-10" color="#8191df" />
              </Link>
              {/* Navigation menu */}
              <NavigationMenu className="h-full *:h-full max-md:hidden">
                <NavigationMenuList className="h-full gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem
                      key={index}
                      className="h-full font-content"
                    >
                      <NavigationMenuLink
                        active={link.active}
                        className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 font-medium hover:bg-transparent data-[active]:bg-transparent!"
                        asChild
                      >
                        <Link to={link.href}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </section>
          {/* Right side */}
          <section className="flex items-center gap-2">
            <>
              {!session?.user.isAnonymous ? (
                <Button variant="secondary" size="lg" className="text-sm">
                  <User2 />
                  Hello, {session?.user.email}
                </Button>
              ) : (
                <DynamicDialog
                  dialog={signInDialog}
                  title="Account Sign In"
                  description="Log in to your account to access more features!"
                  triggerElement={
                    <Button
                      variant="secondary"
                      size="lg"
                      className="text-sm cursor-pointer"
                    >
                      Sign In
                    </Button>
                  }
                >
                  <main className="grid gap-3 mt-3">
                    <aside>
                      <Label className="mb-2">Email Address</Label>
                      <Input />
                    </aside>

                    <aside>
                      <Label className="mb-2">Password</Label>
                      <Input type="password" />
                    </aside>

                    <aside>
                      Don't have an account yet? Create one{" "}
                      <DialogClose asChild>
                        <Link
                          to="/signup"
                          className="underline text-vault-purple"
                        >
                          here
                        </Link>
                      </DialogClose>
                      .
                    </aside>
                  </main>
                </DynamicDialog>
              )}
            </>

            <ModeToggle />
          </section>
        </div>
      </header>
      <main className="h-[90dvh]">
        <Outlet />
      </main>
    </nav>
  );
}
