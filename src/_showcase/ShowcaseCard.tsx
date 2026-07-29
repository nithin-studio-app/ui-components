import type { ReactNode } from "react";

export interface ShowcaseCardProps {
  label: string;
  children: ReactNode;
  /** The code that produced the preview above, shown in a code block
   * beneath it. Omit for cards that don't map to a single clean snippet. */
  code?: string;
}

/** One bordered card in a foundation showcase — a small caption label,
 * arbitrary preview content, and an optional code snippet below it. */
export function ShowcaseCard({ label, children, code }: ShowcaseCardProps) {
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
      {code && (
        <pre
          style={{
            marginTop: "1.25rem",
            marginBottom: 0,
            padding: "0.75rem 1rem",
            background: "#0e0f11",
            border: "1px solid #22242a",
            borderRadius: "8px",
            overflowX: "auto",
          }}
        >
          <code
            style={{
              fontFamily: "monospace",
              fontSize: "0.78rem",
              color: "#c7cbd1",
              whiteSpace: "pre",
            }}
          >
            {code}
          </code>
        </pre>
      )}
    </div>
  );
}
