import { useId } from "react";
import type { ReactNode } from "react";
import { RadioGroupContext } from "./RadioGroupContext";
import "./RadioGroup.css";

export interface RadioGroupProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  row?: boolean;
  disabled?: boolean;
  children: ReactNode;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  row = false,
  disabled = false,
  children,
  ...rest
}: RadioGroupProps) {
  const autoName = useId();
  const groupName = name ?? autoName;
  const className = ["radio-group", row && "radio-group-row"].filter(Boolean).join(" ");

  return (
    <div role="radiogroup" className={className} {...rest}>
      <RadioGroupContext.Provider value={{ name: groupName, value, onChange, disabled }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  );
}
