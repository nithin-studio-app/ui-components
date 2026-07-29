import type { ChangeEvent } from "react";
import { accent } from "../../foundations/colors";
import "./Switch.css";

export type SwitchSize = "small" | "medium";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  color?: string;
  size?: SwitchSize;
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
}

// A real checkbox underneath (not a custom widget), with role="switch"
// layered on — the ARIA APG's recommended pattern for an on/off toggle
// that still gets native keyboard and checked-state behavior for free.
export function Switch({
  checked,
  defaultChecked,
  disabled = false,
  color = accent.primary,
  size = "medium",
  onChange,
  ...rest
}: SwitchProps) {
  const className = ["switch", `switch-${size}`, disabled && "switch-disabled"].filter(Boolean).join(" ");

  return (
    <span className={className} style={{ color }}>
      <input
        type="checkbox"
        role="switch"
        className="switch-input"
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked, event)}
        {...rest}
      />
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
    </span>
  );
}
