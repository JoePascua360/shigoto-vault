import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";
import { FaSpinner } from "react-icons/fa";

interface LoadingButtonProps {
  isLoading: boolean;
  size?: VariantProps<typeof buttonVariants>;
  variant?: VariantProps<typeof buttonVariants>;
  type?: "submit" | "button";
  text?: string;
  className?: string;
}

export default function LoadingButton({
  isLoading,
  size,
  variant,
  type = "submit",
  text = "Submit",
  className = "",
}: LoadingButtonProps) {
  return (
    <>
      <Button
        type={type}
        disabled={isLoading}
        className={`font-content ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
        size={size?.size}
        variant={variant?.variant}
      >
        {isLoading && (
          <FaSpinner className={`${isLoading ? "animate-spin" : ""}`} />
        )}
        {text}
      </Button>
    </>
  );
}
