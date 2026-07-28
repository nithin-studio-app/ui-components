import type { ReactNode } from "react";
import "./Table.css";

export interface TableProps {
  children: ReactNode;
}

// Wrapped in a horizontally-scrolling container so a wide table never
// forces the page itself to scroll sideways.
export function Table({ children }: TableProps) {
  return (
    <div className="table-container">
      <table className="table">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return <thead className="table-head">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export interface TableRowProps {
  children: ReactNode;
  /** Highlights the row on hover — set on data rows, not header rows. */
  hover?: boolean;
}

export function TableRow({ children, hover = false }: TableRowProps) {
  return <tr className={hover ? "table-row table-row-hover" : "table-row"}>{children}</tr>;
}

export interface TableCellProps {
  children?: ReactNode;
  /** Renders a <th scope="col"> instead of a <td>. */
  header?: boolean;
  align?: "left" | "center" | "right";
}

export function TableCell({ children, header = false, align = "left" }: TableCellProps) {
  const className = `table-cell table-cell-${align}`;
  return header ? (
    <th className={className} scope="col">
      {children}
    </th>
  ) : (
    <td className={className}>{children}</td>
  );
}
