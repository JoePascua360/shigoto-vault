import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

interface DropdownComponentProps {
  children?: React.ReactElement;
  icon?: ReactNode;
  className?: string;
  triggerText?: string;
  triggerConfig?: VariantProps<typeof buttonVariants>;
  triggerTitle?: string;
  contentAlignment: "center" | "start" | "end";
}

export default function DropdownMenuComponent({
  children,
  contentAlignment = "start",
  icon,
  className,
  triggerText = "",
  triggerConfig,
  triggerTitle = "",
}: DropdownComponentProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={triggerConfig?.size}
            variant={triggerConfig?.variant}
            aria-label={triggerTitle}
            title={triggerTitle}
          >
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
