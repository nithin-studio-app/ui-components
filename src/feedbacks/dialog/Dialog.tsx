import { useEffect, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { Backdrop } from "../backdrop";
import "./Dialog.css";

export type DialogMaxWidth = "xs" | "sm" | "md" | "lg";

export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  maxWidth?: DialogMaxWidth;
  fullWidth?: boolean;
  "aria-label"?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

// Portals to document.body (escapes any clipping/z-index context a
// showcase card might impose), traps Tab within the panel, restores
// focus to whatever triggered it on close, and closes on Escape or a
// genuine backdrop click (panel clicks stopPropagation so they never
// reach the backdrop's own handler).
export function Dialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = false,
  ...rest
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panel)?.focus();

    return () => {
      previouslyFocused.current?.focus();
    };
  }, [open]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose?.();
      return;
    }
    if (event.key !== "Tab") return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusables.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return createPortal(
    <Backdrop open onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={["dialog-panel", `dialog-${maxWidth}`, fullWidth && "dialog-full-width"]
          .filter(Boolean)
          .join(" ")}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {title && (
          <div id={titleId} className="dialog-title">
            {title}
          </div>
        )}
        {children && <div className="dialog-content">{children}</div>}
        {actions && <div className="dialog-actions">{actions}</div>}
      </div>
    </Backdrop>,
    document.body,
  );
}
