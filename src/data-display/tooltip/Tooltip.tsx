import { useId, useState, cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import "./Tooltip.css";

export interface TooltipProps {
  title: ReactNode;
  /** A single element — gets aria-describedby and hover/focus handlers
   * merged onto it (existing handlers on it still run). */
  children: ReactElement;
  placement?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ title, children, placement = "top" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  if (!title || !isValidElement(children)) return children;

  const show = () => setOpen(true);
  const hide = () => setOpen(false);
  const props = children.props as Record<string, ((...args: unknown[]) => void) | undefined>;

  const trigger = cloneElement(children, {
    "aria-describedby": open ? id : undefined,
    onMouseEnter: (...args: unknown[]) => {
      props.onMouseEnter?.(...args);
      show();
    },
    onMouseLeave: (...args: unknown[]) => {
      props.onMouseLeave?.(...args);
      hide();
    },
    onFocus: (...args: unknown[]) => {
      props.onFocus?.(...args);
      show();
    },
    onBlur: (...args: unknown[]) => {
      props.onBlur?.(...args);
      hide();
    },
    onKeyDown: (...args: unknown[]) => {
      props.onKeyDown?.(...args);
      const event = args[0] as { key?: string };
      if (event?.key === "Escape") hide();
    },
  } as Record<string, unknown>);

  return (
    <span className="tooltip-anchor">
      {trigger}
      {open && (
        <span id={id} role="tooltip" className={`tooltip tooltip-${placement}`}>
          {title}
        </span>
      )}
    </span>
  );
}
