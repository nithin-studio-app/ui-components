import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useFocusTrap } from "../../utils";
import "./Popover.css";

export type PopoverPlacement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

export interface PopoverProps {
  /** Rendered inside the trigger button — text, an icon, whatever opens the popover. */
  trigger: ReactNode;
  /** Accessible name for the trigger, for icon-only triggers. */
  triggerLabel?: string;
  /** Accessible name for the panel itself (role="dialog" requires one regardless of what the trigger looks like). */
  label: string;
  children: ReactNode;
  placement?: PopoverPlacement;
}

// The generic version of Menu: a trigger button + floating panel holding
// arbitrary content instead of a fixed list of menu items, so (unlike
// Menu) it traps focus like a lightweight non-modal dialog rather than
// doing roving-tabindex/menuitem keyboard nav — its content might be a
// form, not a list to arrow through. Self-contained open state and
// click-outside-close, same as Menu/Select.
export function Popover({ trigger, triggerLabel, label, children, placement = "bottom-start" }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { containerRef, handleKeyDown } = useFocusTrap<HTMLDivElement>(open, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="popover-root" ref={rootRef}>
      <button
        type="button"
        className="popover-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => setOpen((current) => !current)}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={containerRef}
          role="dialog"
          aria-label={label}
          className={`popover-panel popover-${placement}`}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  );
}
