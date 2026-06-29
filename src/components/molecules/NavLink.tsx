"use client";

import * as React from "react";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

export interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "color"> {
  /** Marks this link as the current page / active route. */
  active?: boolean;
  /** Underline offset; defaults to "bottom" (sliding underline). */
  indicatorPosition?: "bottom" | "top";
  /** Renders as a <button> instead of <a> (useful for SPA routing handlers). */
  asButton?: boolean;
  color?: ColorProp;
  size?: SizeToken;
  className?: string;
  children: React.ReactNode;
  /** For <button> rendering */
  onClick?: React.MouseEventHandler;
}

const textSize: Record<SizeToken, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const activeColor: Record<ColorToken, string> = {
  primary:   "text-primary after:bg-primary",
  secondary: "text-secondary after:bg-secondary",
  tertiary:  "text-tertiary after:bg-tertiary",
  success:   "text-success after:bg-success",
  warning:   "text-warning after:bg-warning",
  danger:    "text-danger after:bg-danger",
  info:      "text-info after:bg-info",
  neutral:   "text-neutral after:bg-neutral",
};

const hoverColor: Record<ColorToken, string> = {
  primary:   "hover:text-primary",
  secondary: "hover:text-secondary",
  tertiary:  "hover:text-tertiary",
  success:   "hover:text-success",
  warning:   "hover:text-warning",
  danger:    "hover:text-danger",
  info:      "hover:text-info",
  neutral:   "hover:text-neutral",
};

export function NavLink({
  active = false,
  indicatorPosition = "bottom",
  asButton = false,
  color = "primary",
  size = "md",
  className,
  children,
  onClick,
  ...props
}: NavLinkProps) {
  const isCustom = isCustomColor(color);

  const baseClass = cn(
    // layout
    "relative inline-flex items-center gap-1.5 font-medium transition-colors",
    // focus ring
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    // sliding underline pseudo-element
    "after:absolute after:left-0 after:right-0 after:h-[2px] after:rounded-full",
    "after:transition-transform after:duration-200",
    indicatorPosition === "bottom"
      ? "after:bottom-0 after:origin-left"
      : "after:top-0 after:origin-left",
    // size
    textSize[size],
    // color states
    isCustom
      ? cn("text-text-muted hover:opacity-90", active && "opacity-100")
      : cn(
          "text-text-muted",
          hoverColor[color as ColorToken],
          active && activeColor[color as ColorToken],
        ),
    // underline show/hide
    active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
    className,
  );

  const style = isCustom
    ? {
        ...customColorVars(color),
        ...(active ? { color: color.bg } : undefined),
        // custom underline color via after pseudo — we use a CSS var trick
        "--nav-accent": color.bg,
      } as React.CSSProperties
    : undefined;

  if (asButton) {
    return (
      <button
        type="button"
        aria-current={active ? "page" : undefined}
        className={baseClass}
        style={style}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={baseClass}
      style={style}
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  );
}
