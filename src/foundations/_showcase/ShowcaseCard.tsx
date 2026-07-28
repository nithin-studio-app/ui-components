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
      <div style={{ fontSize: "0.75rem", color: "#9aa0a6", marginBottom: "1rem" }}>{label}</div>
      {children}
    </div>
  );
}
