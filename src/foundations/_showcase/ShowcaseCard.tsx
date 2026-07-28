import type { ReactNode } from "react";

export interface ShowcaseCardProps {
  label: string;
  children: ReactNode;
}

/** One bordered card in a foundation showcase — a small caption label
 * plus arbitrary preview content below it. */
export function ShowcaseCard({ label, children }: ShowcaseCardProps) {
  return (
    <div
      style={{
        border: "1px solid #2a2c30",
        borderRadius: "12px",
        padding: "1.75rem 2rem",
        background: "#17181b",
      }}
    >
      <h2 style={{ fontSize: "0.85rem", fontWeight: 600, color: "#e8e8e8", margin: "0 0 1rem" }}>
        {label}
      </h2>
      {children}
    </div>
  );
}
