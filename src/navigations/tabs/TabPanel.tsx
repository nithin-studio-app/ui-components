import type { ReactNode } from "react";
import { useTabsContext } from "./TabsContext";

export interface TabPanelProps {
  value: string;
  children: ReactNode;
}

export function TabPanel({ value, children }: TabPanelProps) {
  const ctx = useTabsContext();
  if (!ctx || ctx.value !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${ctx.idPrefix}-panel-${value}`}
      aria-labelledby={`${ctx.idPrefix}-tab-${value}`}
      className="tab-panel"
      tabIndex={0}
    >
      {children}
    </div>
  );
}
