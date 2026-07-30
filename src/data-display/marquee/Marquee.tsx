import { Fragment } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./Marquee.css";

export type MarqueeDirection = "up" | "down" | "left" | "right";

export interface MarqueeProps {
  /** The content to loop — passed once; Marquee handles repeating it. Any
   * markup works: text, images, a mix of both, whatever an item needs. */
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  /** "up"/"down" scroll vertically; "left"/"right" scroll horizontally. */
  direction?: MarqueeDirection;
  /** How many times `children` is repeated back-to-back to keep the loop
   * buffered. Increase this if the container can be taller than a few
   * copies of the content — otherwise the animation runs out of content
   * to show before completing a cycle, and the empty space is visible. */
  repeat?: number;
  /** CSS height (e.g. "20rem"). Defaults to filling the parent — set this
   * when the parent doesn't already constrain height. */
  height?: string;
  /** CSS width, same idea as `height`. Defaults to filling the parent. */
  width?: string;
  className?: string;
}

export function Marquee({
  children,
  duration = 20,
  direction = "up",
  repeat = 4,
  height,
  width,
  className,
}: MarqueeProps) {
  const distance = -(100 / repeat);

  return (
    <div
      className={["marquee", `marquee-${direction}`, className].filter(Boolean).join(" ")}
      style={{ height, width }}
    >
      <div
        className="marquee-track"
        style={
          {
            "--marquee-duration": `${duration}s`,
            "--marquee-distance": `${distance}%`,
          } as CSSProperties
        }
      >
        {Array.from({ length: repeat }, (_, i) => (
          <Fragment key={i}>{children}</Fragment>
        ))}
      </div>
    </div>
  );
}
