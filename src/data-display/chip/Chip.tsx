import type { ReactNode } from "react";
import "./Chip.css";

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export interface ChipProps {
  label: ReactNode;
  /** Leading icon or avatar. */
  icon?: ReactNode;
  /** Shows a delete (×) button that calls this on click. */
  onDelete?: () => void;
  /** Makes the label/icon area itself a button. */
  onClick?: () => void;
  variant?: "filled" | "outlined";
  color?: string;
  disabled?: boolean;
}

// The clickable area and the delete button are always separate, sibling
// <button>s — never one nested inside the other — so this stays valid,
// accessible markup regardless of which combination of props is passed.
export function Chip({
  label,
  icon,
  onDelete,
  onClick,
  variant = "filled",
  color,
  disabled = false,
}: ChipProps) {
  const clickable = Boolean(onClick) && !disabled;
  const className = [
    "chip",
    `chip-${variant}`,
    clickable && "chip-clickable",
    disabled && "chip-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const iconAndLabel = (
    <>
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
    </>
  );

  const colorStyle = color
    ? variant === "filled"
      ? { background: color }
      : { borderColor: color, color }
    : undefined;

  return (
    <span className={className} style={colorStyle} aria-disabled={disabled || undefined}>
      {clickable ? (
        <button type="button" className="chip-main" disabled={disabled} onClick={onClick}>
          {iconAndLabel}
        </button>
      ) : (
        <span className="chip-main">{iconAndLabel}</span>
      )}
      {onDelete && (
        <button
          type="button"
          className="chip-delete"
          disabled={disabled}
          onClick={() => onDelete()}
          aria-label="Remove"
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
}
