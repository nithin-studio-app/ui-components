import { useState } from "react";
import type { ReactNode } from "react";
import { PersonIcon } from "../../icons";
import "./Avatar.css";

export type AvatarVariant = "circular" | "rounded" | "square";

export interface AvatarProps {
  /** Image URL. Falls back to `children`, then the first letter of `alt`,
   * then a generic person icon if this is unset or fails to load. */
  src?: string;
  /** Used as the image's `alt` text, and (failing that) the fallback letter. */
  alt?: string;
  /** Custom fallback content (e.g. initials, an icon) — takes priority
   * over the `alt`-derived letter when `src` is unset or fails. */
  children?: ReactNode;
  variant?: AvatarVariant;
  /** Diameter in rem. */
  size?: number;
}

export function Avatar({ src, alt, children, variant = "circular", size = 2.5 }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(src) && !imgFailed;

  let content: ReactNode;
  if (showImage) {
    content = <img src={src} alt={alt ?? ""} onError={() => setImgFailed(true)} />;
  } else if (children) {
    content = children;
  } else if (alt) {
    content = alt.trim().charAt(0).toUpperCase();
  } else {
    content = <PersonIcon />;
  }

  const a11yProps = showImage
    ? {}
    : alt
      ? { role: "img" as const, "aria-label": alt }
      : { "aria-hidden": true as const };

  return (
    <span
      className={`avatar avatar-${variant}`}
      style={{ width: `${size}rem`, height: `${size}rem`, fontSize: `${size * 0.4}rem` }}
      {...a11yProps}
    >
      {content}
    </span>
  );
}
