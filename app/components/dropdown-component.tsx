import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import type { ReactNode } from "react";

interface DropdownComponentProps {
  children?: React.ReactElement;
  icon?: ReactNode;
  className?: string;
  triggerText?: string;
  triggerSize?: "icon" | "default" | "sm" | "lg";
  contentAlignment: "center" | "start" | "end";
}

export default function DropdownMenuComponent({
  children,
  contentAlignment = "start",
  icon,
  className,
  triggerText = "",
  triggerSize = "default",
}: DropdownComponentProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size={triggerSize} variant="secondary">
            {icon}
            {triggerText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={contentAlignment} className={className}>
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
