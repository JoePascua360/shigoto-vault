import { FaRegSun } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { MoonStar } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      <MoonStar className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 " />
      <FaRegSun className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
