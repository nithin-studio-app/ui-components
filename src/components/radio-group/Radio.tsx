import { accent } from "../../foundations/colors";
import { useRadioGroupContext } from "./RadioGroupContext";
import "./Radio.css";

export type RadioSize = "small" | "medium";

export interface RadioProps {
  value: string;
  /** Only used standalone, outside a RadioGroup — inside one, checked state comes from the group's value. */
  checked?: boolean;
  disabled?: boolean;
  color?: string;
  size?: RadioSize;
  name?: string;
  onChange?: (value: string) => void;
  "aria-label"?: string;
}

// Reads from RadioGroupContext when nested inside a RadioGroup (the usual
// case), falling back to its own props for standalone use — mirroring how
// the reference component works outside a group too.
export function Radio({
  value,
  checked,
  disabled = false,
  color = accent.primary,
  size = "medium",
  name,
  onChange,
  ...rest
}: RadioProps) {
  const group = useRadioGroupContext();

  const resolvedName = group?.name ?? name;
  const resolvedChecked = group ? group.value === value : checked;
  const resolvedDisabled = disabled || Boolean(group?.disabled);

  function handleChange() {
    group?.onChange?.(value);
    onChange?.(value);
  }

  const className = ["radio", `radio-${size}`, resolvedDisabled && "radio-disabled"]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={className} style={{ color }}>
      <input
        type="radio"
        className="radio-input"
        name={resolvedName}
        value={value}
        checked={resolvedChecked}
        disabled={resolvedDisabled}
        onChange={handleChange}
        {...rest}
      />
      <span className="radio-circle" aria-hidden="true">
        <span className="radio-dot" />
      </span>
    </span>
  );
}
