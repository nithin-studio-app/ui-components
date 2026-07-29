import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import "./Menu.css";

export interface MenuItemDef {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface MenuProps {
  /** Rendered inside the trigger button — text, an icon, whatever opens the menu. */
  trigger: ReactNode;
  /** Accessible name for the trigger, for icon-only triggers. */
  triggerLabel?: string;
  items: MenuItemDef[];
  onSelect?: (value: string) => void;
}

// A trigger button + role="menu" popup, in the same self-contained (owns
// its own open state, roving-focus keyboard nav) spirit as Select — just
// with menu/menuitem semantics and no persisted "selected value", since
// choosing an item here fires an action rather than setting a display
// value. The trigger is rendered content, not an arbitrary cloned element —
// keeps the aria-haspopup/aria-expanded/ref wiring on a button we fully
// control, the same tradeoff Select already makes.
export function Menu({ trigger, triggerLabel, items, onSelect }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

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
    if (open) menuRef.current?.focus();
  }, [open]);

  function openMenu() {
    setActiveIndex(Math.max(0, items.findIndex((item) => !item.disabled)));
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function commit(index: number) {
    const item = items[index];
    if (!item || item.disabled) return;
    onSelect?.(item.value);
    closeMenu();
  }

  function moveActive(delta: number) {
    setActiveIndex((current) => {
      let next = current;
      for (let i = 0; i < items.length; i++) {
        next = (next + delta + items.length) % items.length;
        if (!items[next].disabled) return next;
      }
      return current;
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
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
        setActiveIndex(items.findIndex((item) => !item.disabled));
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(items.length - 1 - [...items].reverse().findIndex((item) => !item.disabled));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div className="menu-root" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => (open ? closeMenu() : openMenu())}
      >
        {trigger}
      </button>
      {open && (
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          className="menu-list"
          tabIndex={-1}
          aria-activedescendant={`${menuId}-${activeIndex}`}
          onKeyDown={handleKeyDown}
        >
          {items.map((item, index) => (
            <li
              key={item.value}
              id={`${menuId}-${index}`}
              role="menuitem"
              aria-disabled={item.disabled || undefined}
              className={[
                "menu-item",
                index === activeIndex && "menu-item-active",
                item.disabled && "menu-item-disabled",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseEnter={() => !item.disabled && setActiveIndex(index)}
              onClick={() => commit(index)}
            >
              {item.icon && <span className="menu-item-icon">{item.icon}</span>}
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
