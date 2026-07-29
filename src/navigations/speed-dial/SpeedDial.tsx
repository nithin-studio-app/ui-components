import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { Fab } from "../../components/fab";
import { Tooltip } from "../../data-display/tooltip";
import { CloseIcon } from "../../data-display/icons";

import "./SpeedDial.css";

export interface SpeedDialAction {
  value: string;
  icon: ReactNode;
  label: string;
}

export type SpeedDialDirection = "up" | "down" | "left" | "right";

export interface SpeedDialProps {
  /** Icon shown on the closed main button. */
  icon: ReactNode;
  /** Icon shown while open — defaults to a close (×) icon. */
  openIcon?: ReactNode;
  actions: SpeedDialAction[];
  onAction?: (value: string) => void;
  direction?: SpeedDialDirection;
  "aria-label": string;
}

const tooltipPlacement: Record<SpeedDialDirection, "top" | "bottom" | "left" | "right"> = {
  up: "left",
  down: "left",
  left: "top",
  right: "top",
};

// A Fab that expands into a stack of action Fabs, each labeled by a
// Tooltip. Click-to-toggle (not hover) so it behaves the same on
// touch/mouse/keyboard; closes on Escape, choosing an action, or a click
// outside, and returns focus to the main button in every case.
export function SpeedDial({ icon, openIcon, actions, onAction, direction = "up", "aria-label": ariaLabel }: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  // The main button is always the last child of the root (the actions
  // wrapper, when present, comes before it) — simpler than needing Fab to
  // support a className passthrough just to find it again.
  function focusMainButton() {
    (rootRef.current?.lastElementChild as HTMLButtonElement | undefined)?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
      focusMainButton();
    }
  }

  function selectAction(value: string) {
    onAction?.(value);
    setOpen(false);
    focusMainButton();
  }

  return (
    <div className={`speed-dial speed-dial-${direction}`} ref={rootRef} onKeyDown={handleKeyDown}>
      {open && (
        <div className="speed-dial-actions">
          {actions.map((action) => (
            <Tooltip key={action.value} title={action.label} placement={tooltipPlacement[direction]}>
              <Fab size="small" aria-label={action.label} onClick={() => selectAction(action.value)}>
                {action.icon}
              </Fab>
            </Tooltip>
          ))}
        </div>
      )}
      <Fab aria-label={ariaLabel} aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        {open ? (openIcon ?? <CloseIcon />) : icon}
      </Fab>
    </div>
  );
}
