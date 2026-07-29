import { Children, isValidElement, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { TabsContext } from "./TabsContext";
import { TabPanel } from "./TabPanel";
import "./Tabs.css";

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  /** Tab and TabPanel elements, mixed together — Tabs sorts them into the
   * tablist strip and the panel stack itself, so both stay inside the same
   * context provider regardless of how they're interleaved in JSX. */
  children: ReactNode;
  "aria-label"?: string;
}

// Roving tabindex: only the selected Tab is in the natural Tab order
// (tabIndex 0, others -1), and ArrowLeft/Right/Home/End move focus (and
// activate) between tabs — queried directly off the tablist's own DOM
// rather than tracked in state, same pattern as Select/Menu's keyboard nav.
export function Tabs({ value, onChange, children, "aria-label": ariaLabel }: TabsProps) {
  const idPrefix = useId();
  const listRef = useRef<HTMLDivElement>(null);

  const childArray = Children.toArray(children);
  const tabs = childArray.filter((child) => !(isValidElement(child) && child.type === TabPanel));
  const panels = childArray.filter((child) => isValidElement(child) && child.type === TabPanel);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const list = listRef.current;
    if (!list) return;
    const tabButtons = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'));
    if (tabButtons.length === 0) return;
    const currentIndex = tabButtons.findIndex((tab) => tab === document.activeElement);

    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1 + tabButtons.length) % tabButtons.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = tabButtons.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    tabButtons[nextIndex].focus();
    tabButtons[nextIndex].click();
  }

  return (
    <TabsContext.Provider value={{ value, onChange, idPrefix }}>
      <div ref={listRef} role="tablist" aria-label={ariaLabel} className="tabs" onKeyDown={handleKeyDown}>
        {tabs}
      </div>
      {panels}
    </TabsContext.Provider>
  );
}
