import { cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import "./FormControlLabel.css";

export type FormControlLabelPlacement = "end" | "start" | "top" | "bottom";

export interface FormControlLabelProps {
  /** A single Checkbox, Radio, or Switch element. */
  control: ReactElement<{ disabled?: boolean }>;
  label: ReactNode;
  disabled?: boolean;
  labelPlacement?: FormControlLabelPlacement;
}

// Wrapping in a real <label> auto-associates it with the control inside —
// no id/htmlFor plumbing needed, and clicking the text toggles the control.
export function FormControlLabel({
  control,
  label,
  disabled = false,
  labelPlacement = "end",
}: FormControlLabelProps) {
  const className = [
    "form-control-label",
    `form-control-label-${labelPlacement}`,
    disabled && "form-control-label-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const resolvedControl =
    disabled && isValidElement(control) ? cloneElement(control, { disabled: true }) : control;

  return (
    <label className={className}>
      {resolvedControl}
      <span className="form-control-label-text">{label}</span>
    </label>
  );
}
