import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Backdrop } from "../../feedbacks/backdrop";
import { useFocusTrap } from "../../utils";

import "./Drawer.css";

export type DrawerAnchor = "left" | "right" | "top" | "bottom";
export type DrawerVariant = "temporary" | "persistent" | "permanent";

export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
  anchor?: DrawerAnchor;
  /** temporary: portaled + backdrop + focus trap (the usual case). persistent:
   * inline in the layout, no backdrop, stays mounted but can be closed.
   * permanent: always rendered, no close behavior at all. */
  variant?: DrawerVariant;
  "aria-label"?: string;
}

// temporary is the only variant that portals/traps focus/shows a backdrop —
// persistent and permanent are meant to sit inline as part of a page layout
// (e.g. beside content in a flex row), so they render in place instead.
export function Drawer({ open, onClose, children, anchor = "left", variant = "temporary", ...rest }: DrawerProps) {
  const { containerRef, handleKeyDown } = useFocusTrap<HTMLDivElement>(variant === "temporary" && open, onClose);

  if (variant === "permanent") {
    return (
      <div className={`drawer-panel drawer-anchor-${anchor} drawer-permanent`} {...rest}>
        {children}
      </div>
    );
  }

  if (!open) return null;

  if (variant === "persistent") {
    return (
      <div className={`drawer-panel drawer-anchor-${anchor} drawer-persistent`} {...rest}>
        {children}
      </div>
    );
  }

  return createPortal(
    <Backdrop open onClick={onClose} className={`drawer-backdrop-${anchor}`}>
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        className={`drawer-panel drawer-anchor-${anchor} drawer-temporary`}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </Backdrop>,
    document.body,
  );
}
