import type { ReactNode } from "react";
import "./Card.css";

export type CardVariant = "elevation" | "outlined";

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  /** Makes the whole card one clickable surface. Don't combine with
   * CardActions, or a CardMedia with component="video", in the same
   * card — a button can't contain another interactive element (a
   * button or a video's own controls), so a clickable card is meant to
   * be the card's only action. */
  onClick?: () => void;
}

export function Card({ children, variant = "elevation", onClick }: CardProps) {
  const className = ["card", `card-${variant}`, onClick && "card-clickable"].filter(Boolean).join(" ");

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {children}
      </button>
    );
  }

  return <div className={className}>{children}</div>;
}

export interface CardHeaderProps {
  avatar?: ReactNode;
  title: ReactNode;
  subheader?: ReactNode;
  action?: ReactNode;
}

export function CardHeader({ avatar, title, subheader, action }: CardHeaderProps) {
  return (
    <div className="card-header">
      {avatar && <div className="card-header-avatar">{avatar}</div>}
      <div className="card-header-text">
        <div className="card-header-title">{title}</div>
        {subheader && <div className="card-header-subheader">{subheader}</div>}
      </div>
      {action && <div className="card-header-action">{action}</div>}
    </div>
  );
}

export interface CardMediaProps {
  src: string;
  alt?: string;
  component?: "img" | "video";
  /** In rem. */
  height?: number;
}

export function CardMedia({ src, alt = "", component = "img", height = 12 }: CardMediaProps) {
  const style = { height: `${height}rem` };
  return component === "video" ? (
    <video className="card-media" style={style} src={src} controls />
  ) : (
    <img className="card-media" style={style} src={src} alt={alt} />
  );
}

export interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="card-content">{children}</div>;
}

export interface CardActionsProps {
  children: ReactNode;
  disableSpacing?: boolean;
}

export function CardActions({ children, disableSpacing = false }: CardActionsProps) {
  return <div className={`card-actions${disableSpacing ? " card-actions-no-spacing" : ""}`}>{children}</div>;
}
