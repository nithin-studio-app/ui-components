import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from "../icons";
import "./ImageCarousel.css";

export interface CarouselItem {
  id: string;
  src: string;
  alt?: string;
  caption?: ReactNode;
}

export interface ImageCarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  /** Ms between slides while playing. */
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  /** Hides the explicit Play/Pause button. Since autoplay still needs a
   * WCAG 2.2.2 pause mechanism, hiding it falls back to pausing on
   * hover/focus instead of dropping pausability altogether. */
  showPlayPauseButton?: boolean;
  /** In rem. */
  height?: number;
  "aria-label"?: string;
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// A sliding track (not conditionally-mounted slides) so the transition is a
// real animated slide rather than a cut — non-active slides stay in the
// DOM, just off-screen via transform, and are aria-hidden so assistive
// tech only ever sees the current one. Autoplay respects
// prefers-reduced-motion (skipped entirely, not just animated without
// motion) and defaults to an explicit Play/Pause toggle for WCAG 2.2.2 —
// autoplaying content needs a pause mechanism, and it needs to be
// keyboard-reachable, not just hover-triggered. The toggle and
// hover/focus-pause are mutually exclusive rather than combined: clicking
// a button first fires the hover/focus that leads the pointer/tab order
// to it, so having both meant the click's own toggle got flipped back by
// the hover that preceded it. showPlayPauseButton={false} switches to
// hover/focus-pause instead of dropping pausability altogether.
export function ImageCarousel({
  items,
  autoPlay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  showPlayPauseButton = true,
  height = 20,
  "aria-label": ariaLabel = "Image carousel",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const effectiveAutoPlay = autoPlay && !prefersReducedMotion();
  const useHoverPause = effectiveAutoPlay && !showPlayPauseButton;

  useEffect(() => {
    if (!effectiveAutoPlay || paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [effectiveAutoPlay, paused, interval, items.length]);

  if (items.length === 0) return null;

  function goTo(next: number) {
    setIndex((next + items.length) % items.length);
  }

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      style={{ height: `${height}rem` }}
      onMouseEnter={useHoverPause ? () => setPaused(true) : undefined}
      onMouseLeave={useHoverPause ? () => setPaused(false) : undefined}
      onFocus={useHoverPause ? () => setPaused(true) : undefined}
      onBlur={useHoverPause ? () => setPaused(false) : undefined}
    >
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {items.map((item, i) => (
            <div
              key={item.id}
              className="carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              aria-hidden={i !== index}
            >
              <img src={item.src} alt={item.alt ?? ""} />
              {item.caption && <div className="carousel-caption">{item.caption}</div>}
            </div>
          ))}
        </div>
      </div>

      {showArrows && items.length > 1 && (
        <>
          <button type="button" className="carousel-nav carousel-prev" onClick={() => goTo(index - 1)} aria-label="Previous slide">
            <ChevronLeftIcon />
          </button>
          <button type="button" className="carousel-nav carousel-next" onClick={() => goTo(index + 1)} aria-label="Next slide">
            <ChevronRightIcon />
          </button>
        </>
      )}

      <div className="carousel-footer">
        {showDots && items.length > 1 && (
          <div className="carousel-dots">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`carousel-dot${i === index ? " carousel-dot-active" : ""}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}

        {effectiveAutoPlay && showPlayPauseButton && items.length > 1 && (
          <button
            type="button"
            className="carousel-play-pause"
            onClick={() => setPaused((current) => !current)}
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        )}
      </div>
    </div>
  );
}
