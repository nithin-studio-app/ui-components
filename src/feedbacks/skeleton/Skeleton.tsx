import type { CSSProperties } from "react";
import "./Skeleton.css";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonAnimation = "pulse" | "wave" | false;

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  animation?: SkeletonAnimation;
}

// Purely decorative (aria-hidden) — a loading placeholder isn't itself
// content, so it has nothing to announce. If a group of these needs to
// tell screen reader users that content is loading, wrap them in your own
// role="status" region rather than expecting the Skeleton to do it.
export function Skeleton({ variant = "text", width, height, animation = "pulse" }: SkeletonProps) {
  const className = ["skeleton", `skeleton-${variant}`, animation && `skeleton-${animation}`]
    .filter(Boolean)
    .join(" ");

  const style: CSSProperties = {};
  if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;

  return <span className={className} style={style} aria-hidden="true" />;
}
