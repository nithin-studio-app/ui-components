import type { ReactNode } from "react";
import { useTabsContext } from "./TabsContext";

export interface TabProps {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}

export function Tab({ value, label, disabled = false, icon }: TabProps) {
  const ctx = useTabsContext();
  if (!ctx) return null;
  const selected = ctx.value === value;

  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.idPrefix}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.idPrefix}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      className={`tab${selected ? " tab-selected" : ""}`}
      onClick={() => ctx.onChange(value)}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      {label}
    </button>
  );
}
