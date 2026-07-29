import type { ReactNode } from "react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import { fontFamily } from "../foundations/typography/fontFamily";

export interface ShowcasePageProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Shared page shell for foundation showcase stories (typography, colors,
 * layout, ...) — full-width heading + optional description, dark
 * background, stacked content below. Keep every foundation's Storybook
 * page on this same shell so they read as one system.
 *
 * Defaults to `fontFamily.default` (Roboto). The typography showcase's
 * individual font specimens override this per-card on purpose — this
 * default only reaches content that doesn't set its own font-family. */
export function ShowcasePage({ title, description, children }: ShowcasePageProps) {
  return (
    <div style={{ background: "#0e0f11", padding: "2rem", fontFamily: fontFamily.default }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 0.4rem", color: "#f5f5f5" }}>
        {title}
      </h1>
      {description && (
        <p style={{ fontSize: "0.85rem", margin: "0 0 1.5rem", color: "#9aa0a6" }}>{description}</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>{children}</div>
    </div>
  );
}
