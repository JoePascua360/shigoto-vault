import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@hookform/error-message";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function PasswordInput<T extends FieldValues>({
  form,
  text,
  name,
}: {
  text: string;
  form: UseFormReturn<T>;
  name: Path<T>;
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="space-y-2 relative w-full">
      <Label>{text}</Label>
      <div className="relative">
        <Input
          type={isVisible ? "text" : "password"}
          {...form.register(name)}
          className="w-full pe-14"
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOffIcon size={16} aria-hidden="true" />
          ) : (
            <EyeIcon size={16} aria-hidden="true" />
          )}
        </button>
      </div>
      <ErrorMessage
        name={name as any}
        errors={form.formState.errors}
        render={({ message }) => {
          return <p className="text-red-500">{message}</p>;
        }}
      />
    </div>
  );
}
