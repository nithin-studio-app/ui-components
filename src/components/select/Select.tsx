import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { ChevronDownIcon } from "../../data-display/icons";
import "./Select.css";

export interface SelectOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export type SelectSize = "small" | "medium";

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: SelectSize;
  fullWidth?: boolean;
  "aria-label"?: string;
}

// A menu-based select (trigger button + role="listbox" popup), not a
// native <select> — matches the reference's own approach, which trades a
// little native-control simplicity for full control over the popup's
// appearance. Roving focus lives on the listbox itself (tabIndex=-1,
// arrow keys move an "active" index) rather than per-option tabbing.
export function Select({
  options,
  value,
  onChange,
  label,
  placeholder = "Select…",
  disabled = false,
  size = "medium",
  fullWidth = false,
  ...rest
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.findIndex((o) => o.value === value)));
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const triggerId = useId();
  const listboxId = useId();
  const labelId = useId();
  const valueId = useId();

  const selected = options.find((o) => o.value === value);

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

  useEffect(() => {
    if (open) listboxRef.current?.focus();
  }, [open]);

  function openList() {
    if (disabled) return;
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  }

  function closeList() {
    setOpen(false);
    rootRef.current?.querySelector<HTMLButtonElement>(".select-trigger")?.focus();
  }

  function commit(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange?.(option.value);
    closeList();
  }

  function moveActive(delta: number) {
    setActiveIndex((current) => {
      let next = current;
      for (let i = 0; i < options.length; i++) {
        next = (next + delta + options.length) % options.length;
        if (!options[next].disabled) return next;
      }
      return current;
    });
  }

  function handleListboxKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(options.findIndex((o) => !o.disabled));
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1 - [...options].reverse().findIndex((o) => !o.disabled));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeList();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const className = ["select", `select-${size}`, disabled && "select-disabled", fullWidth && "select-full-width"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} ref={rootRef}>
      {label && (
        <label id={labelId} htmlFor={triggerId} className="select-label">
          {label}
        </label>
      )}
      <button
        id={triggerId}
        type="button"
        className="select-trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `${labelId} ${valueId}` : undefined}
        onClick={() => (open ? closeList() : openList())}
        {...rest}
      >
        <span id={valueId} className={selected ? "select-value" : "select-placeholder"}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="select-arrow" aria-hidden="true">
          <ChevronDownIcon />
        </span>
      </button>
      {open && (
        <ul
          ref={listboxRef}
          id={listboxId}
          role="listbox"
          className="select-listbox"
          tabIndex={-1}
          aria-labelledby={label ? labelId : undefined}
          aria-activedescendant={`${listboxId}-${activeIndex}`}
          onKeyDown={handleListboxKeyDown}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listboxId}-${index}`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              className={[
                "select-option",
                index === activeIndex && "select-option-active",
                option.value === value && "select-option-selected",
                option.disabled && "select-option-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => !option.disabled && setActiveIndex(index)}
              onClick={() => commit(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
