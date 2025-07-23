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
  triggerSize?: VariantProps<typeof buttonVariants>;
  triggerVariant?: VariantProps<typeof buttonVariants>;
  contentAlignment: "center" | "start" | "end";
}

export default function DropdownMenuComponent({
  children,
  contentAlignment = "start",
  icon,
  className,
  triggerText = "",
  triggerSize,
  triggerVariant,
}: DropdownComponentProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={triggerSize?.size} variant={triggerVariant?.variant}>
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
