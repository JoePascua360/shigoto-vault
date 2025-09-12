import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";
import { FaSpinner } from "react-icons/fa";

interface LoadingButtonProps {
  isLoading: boolean;
  buttonConfig?: VariantProps<typeof buttonVariants>;
  icon?: React.ReactElement;
  type?: "submit" | "button";
  text?: string;
  className?: string;
  fn?: () => void;
}

export default function LoadingButton({
  isLoading,
  buttonConfig,
  type = "submit",
  text = "Submit",
  className = "",
  fn,
  icon,
}: LoadingButtonProps) {
  return (
    <>
      <Button
        type={type}
        disabled={isLoading}
        className={`font-content ${
          isLoading ? "cursor-not-allowed" : "cursor-pointer"
        } ${className}`}
        size={buttonConfig?.size}
        variant={buttonConfig?.variant}
        onClick={fn ? () => fn() : undefined}
      >
        {isLoading ? (
          <FaSpinner className={`${isLoading ? "animate-spin" : ""}`} />
        ) : (
          icon
        )}
        {text}
      </Button>
    </>
  );
}
