import type { MouseEventHandler, ReactNode } from "react";
import { palette } from "../../foundations/colors";
import "./Link.css";

export type LinkUnderline = "always" | "hover" | "none";

export interface LinkProps {
  href: string;
  children: ReactNode;
  underline?: LinkUnderline;
  color?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

// A real <a> — no polymorphism, no button-in-disguise. External links
// (target="_blank") get a safe default rel unless the caller overrides it.
export function Link({ href, children, underline = "always", color = palette.blue.A200, target, rel, onClick }: LinkProps) {
  const resolvedRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;

  return (
    <a
      href={href}
      className={`link link-underline-${underline}`}
      style={{ color }}
      target={target}
      rel={resolvedRel}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
