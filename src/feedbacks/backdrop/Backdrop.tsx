import type { MouseEventHandler, ReactNode } from "react";
import "./Backdrop.css";

export interface BackdropProps {
  open: boolean;
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  /** Renders inline within its parent instead of covering the full viewport — for scoping to one container. */
  fixed?: boolean;
}

// A dimming overlay, typically holding a loading indicator or shown
// behind a Dialog/Drawer. Doesn't manage focus itself — Dialog (which
// composes this) is where focus-trapping belongs, since a bare Backdrop
// is also valid standalone (e.g. a full-page loading state).
export function Backdrop({ open, children, onClick, fixed = true }: BackdropProps) {
  if (!open) return null;

  return (
    <div className={`backdrop${fixed ? " backdrop-fixed" : ""}`} onClick={onClick}>
      {children}
    </div>
  );
}
