import type { ReactNode } from "react";
import "./Divider.css";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  /** Adds space at the edges instead of running full-length. */
  inset?: boolean;
  /** Optional label rendered in the middle (e.g. "OR"). */
  children?: ReactNode;
}

export function Divider({ orientation = "horizontal", inset = false, children }: DividerProps) {
  const className = [
    "divider",
    `divider-${orientation}`,
    inset && "divider-inset",
    children && "divider-with-label",
  ]
    .filter(Boolean)
    .join(" ");

  if (children) {
    return (
      <div className={className} role="separator" aria-orientation={orientation}>
        <span className="divider-line" />
        <span className="divider-label">{children}</span>
        <span className="divider-line" />
      </div>
    );
  }

  return (
    <hr className={className} aria-orientation={orientation === "vertical" ? "vertical" : undefined} />
  );
}
