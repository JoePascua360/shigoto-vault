import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import { FormControl } from "./ui/form";

type SelectTriggerConfig = {
  isForm: boolean;
  position?: "item-aligned" | "popper";
  placeholder?: string;
};

interface SelectComponentProps {
  state: SelectProps;
  selectElementConfig: SelectTriggerConfig;
  children: React.ReactElement;
  className?: string;
}

export default function SelectComponent({
  state,
  selectElementConfig,
  children,
  className = "",
}: SelectComponentProps) {
  return (
    <Select {...state}>
      {selectElementConfig.isForm ? (
        <FormControl>
          <SelectTrigger className={className}>
            <SelectValue placeholder={selectElementConfig?.placeholder || ""} />
          </SelectTrigger>
        </FormControl>
      ) : (
        <SelectTrigger className={className}>
          <SelectValue placeholder={selectElementConfig?.placeholder || ""} />
        </SelectTrigger>
      )}
      <SelectContent position={selectElementConfig?.position || "popper"}>
        {children}
      </SelectContent>
    </Select>
  );
}
