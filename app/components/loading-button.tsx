import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";
import { FaSpinner } from "react-icons/fa";

interface LoadingButtonProps {
  /**
   * Refers to the loading state of the button.
   * It will be disabled if value is true.
   */
  isLoading: boolean;
  /**
   * Access 'variants' and 'size' property of the button.
   * Use destructuring to modify the values.
   * @example
   * <LoadingButton
   *  buttonConfig={{ variant: "secondary", size: "sm" }}
   * />
   */
  buttonConfig?: VariantProps<typeof buttonVariants>;
  /**
   * Provide an Icon component if you need an icon with the button.
   */
  icon?: React.ReactElement;
  /**
   * Use 'submit' if inside a <form> component, otherwise use 'button'.
   * Selecting 'button' prevents the <form> element from being triggered.
   */
  type?: "submit" | "button";
  /**
   * Provide a text to provide description for the button or what action it does.
   */
  text?: string;
  /**
   * Modify the style of the button
   */
  className?: string;
  /**
   * A function that triggers when the button is clicked.
   */
  fn?: () => void;
  /**
   * Default is false.
   * Provide a value if you want the button to be disabled due to certain conditions.
   */
  isDisabled?: boolean;
}

/**
 * Reusable Loading button for forms.
 * Use this if the button has a loading/disabled state.
 */
export default function LoadingButton({
  isLoading,
  buttonConfig,
  type = "submit",
  text = "Submit",
  className = "",
  fn,
  icon,
  isDisabled = false,
}: LoadingButtonProps) {
  return (
    <>
      <Button
        type={type}
        disabled={isLoading || isDisabled}
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
