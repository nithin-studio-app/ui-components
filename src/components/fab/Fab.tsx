import type { MouseEventHandler, ReactNode } from "react";
import { accent } from "../../foundations/colors";
import "./Fab.css";

export type FabSize = "small" | "medium" | "large";
export type FabVariant = "circular" | "extended";

export interface FabProps {
  children: ReactNode;
  variant?: FabVariant;
  color?: string;
  size?: FabSize;
  disabled?: boolean;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  "aria-label"?: string;
}

// A circular Fab is icon-only, so it needs an accessible name from the
// caller (aria-label) since its children are typically a bare icon; an
// extended Fab shows text and can rely on that instead.
export function Fab({
  children,
  variant = "circular",
  color = accent.primary,
  size = "medium",
  disabled = false,
  href,
  onClick,
  ...rest
}: FabProps) {
  const className = [
    "fab",
    `fab-${variant}`,
    `fab-${size}`,
    disabled && "fab-disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const style = { background: color, color: "#fff" };

  if (href) {
    return (
      <a
        className={className}
        style={style}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        onClick={disabled ? undefined : onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={className} style={style} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
