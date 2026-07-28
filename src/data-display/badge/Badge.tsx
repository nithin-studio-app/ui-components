import type { ReactNode } from "react";
import "./Badge.css";

export interface BadgeProps {
  children: ReactNode;
  /** Badge content — a number or short string. Omit (or use variant="dot") for just a dot. */
  content?: ReactNode;
  variant?: "standard" | "dot";
  /** Truncates numeric content above this value (e.g. 99 -> "99+"). */
  max?: number;
  /** Show the badge when `content` is exactly 0 (default: hide it). */
  showZero?: boolean;
  color?: string;
  /** Hides the badge without unmounting it (or its child). */
  invisible?: boolean;
}

export function Badge({
  children,
  content,
  variant = "standard",
  max = 99,
  showZero = false,
  color = "#2962ff",
  invisible = false,
}: BadgeProps) {
  const isDot = variant === "dot";
  const hasContent = content !== undefined && content !== null && content !== "";
  const isZero = content === 0;
  const showBadge = !invisible && (isDot || (hasContent && (!isZero || showZero)));

  const displayContent =
    !isDot && typeof content === "number" && content > max ? `${max}+` : content;

  return (
    <span className="badge-anchor">
      {children}
      {showBadge && (
        <span
          className={isDot ? "badge badge-dot" : "badge badge-standard"}
          style={{ background: color }}
          aria-hidden={isDot || undefined}
        >
          {!isDot && displayContent}
        </span>
      )}
    </span>
  );
}
