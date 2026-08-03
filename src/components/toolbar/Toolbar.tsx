import type { ReactNode } from "react";
import "./Toolbar.css";

export interface ToolbarProps {
  children: ReactNode;
  /** Labels the group for assistive tech and switches on role="toolbar" —
   * omit for a purely visual grouping with no semantic meaning. */
  "aria-label"?: string;
}

// A bordered container for a horizontal cluster of related actions (icon
// buttons, a search field, regular buttons — whatever) that belong
// together but aren't a single component of their own. Deliberately
// unopinionated about what's inside: unlike CardActions (always inside a
// Card, always at a card's edge), this stands alone anywhere a page needs
// to visually group a handful of controls.
export function Toolbar({ children, "aria-label": ariaLabel }: ToolbarProps) {
  return (
    <div className="toolbar" role={ariaLabel ? "toolbar" : undefined} aria-label={ariaLabel}>
      {children}
    </div>
  );
}
