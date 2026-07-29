import { createContext, useContext } from "react";

export interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
  idPrefix: string;
}

export const TabsContext = createContext<TabsContextValue | null>(null);

export function useTabsContext() {
  return useContext(TabsContext);
}
