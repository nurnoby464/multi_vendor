"use client";

import * as React from "react";
import { Avatar } from "@/components/atoms/Avatar";
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  isCustomSize,
  type ColorProp,
  type ColorToken,
  type SizeProp,
  type SizeToken,
} from "@/lib/types";
import type { LucideProps } from "lucide-react";

export interface CategoryIconLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "color"
> {
  label: string;
  src?: string;
  icon?: React.ComponentType<LucideProps>;
  color?: ColorProp;
  size?: SizeProp;
  active?: boolean;
  layout?: "vertical" | "horizontal";
  count?: number;
  asButton?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
}

const avatarSize: Record<SizeToken, SizeProp> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

const labelSize: Record<SizeToken, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

const ringClass: Record<ColorToken, string> = {
  primary: "ring-2 ring-primary ring-offset-2 ring-offset-surface",
  secondary: "ring-2 ring-secondary ring-offset-2 ring-offset-surface",
  tertiary: "ring-2 ring-tertiary ring-offset-2 ring-offset-surface",
  success: "ring-2 ring-success ring-offset-2 ring-offset-surface",
  warning: "ring-2 ring-warning ring-offset-2 ring-offset-surface",
  danger: "ring-2 ring-danger ring-offset-2 ring-offset-surface",
  info: "ring-2 ring-info ring-offset-2 ring-offset-surface",
  neutral: "ring-2 ring-neutral ring-offset-2 ring-offset-surface",
};

export function CategoryIconLink({
  label,
  src,
  icon: IconComp,
  color = "primary",
  size = "md",
  active = false,
  layout = "vertical",
  count,
  asButton = false,
  onClick,
  className,
  ...props
}: CategoryIconLinkProps) {
  const isCustom = isCustomColor(color);
  const isCustomSz = isCustomSize(size);
  const sizeToken = isCustomSz ? "md" : (size as SizeToken);
  const avSize = isCustomSz ? size : avatarSize[sizeToken];

  const activeRing = isCustom
    ? `ring-2 ring-offset-2 ring-offset-surface`
    : ringClass[color as ColorToken];

  // Get first letter for fallback
  const firstLetter = label.charAt(0).toUpperCase();

  const content = (
    <>
      {/* Avatar bubble */}
      <span className="relative inline-flex shrink-0">
        <Avatar
          name={label}
          color={color}
          size={avSize}
          className={cn("transition-all duration-200", active && activeRing)}
          {...(src !== undefined && { src })}
          style={
            active && isCustom
              ? ({ "--tw-ring-color": color.bg } as React.CSSProperties)
              : undefined
          }
        >
          {/* Content inside avatar */}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {src ? (
              // If src exists, Avatar component handles the image
              null
            ) : IconComp ? (
              // If icon exists and no src, show icon
              <IconComp
                size={
                  sizeToken === "xs"
                    ? 12
                    : sizeToken === "sm"
                      ? 14
                      : sizeToken === "lg"
                        ? 20
                        : sizeToken === "xl"
                          ? 24
                          : 16
                }
                strokeWidth={2}
                aria-hidden
                className="text-current opacity-90"
              />
            ) : (
              // If no src and no icon, show first letter
              <span className="text-sm font-medium text-current">
                {firstLetter}
              </span>
            )}
          </span>
        </Avatar>
        
        {/* Count badge */}
        {typeof count === "number" && count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger px-0.5 text-[9px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>

      {/* Label */}
      <span
        className={cn(
          "font-medium text-text-muted transition-colors duration-200",
          labelSize[sizeToken],
          active && (isCustom ? "text-[var(--ds-bg)]" : `text-${color}`),
          layout === "vertical" ? "text-center leading-tight" : "",
        )}
        style={active && isCustom ? customColorVars(color) : undefined}
      >
        {label}
      </span>
    </>
  );

  const sharedClass = cn(
    "group inline-flex shrink-0 cursor-pointer items-center",
    "transition-opacity hover:opacity-80",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    layout === "vertical" ? "flex-col gap-1.5" : "flex-row gap-2",
    className,
  );

  if (asButton) {
    return (
      <button
        type="button"
        aria-pressed={active}
        className={sharedClass}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      aria-current={active ? "page" : undefined}
      className={sharedClass}
      onClick={onClick}
      {...props}
    >
      {content}
    </a>
  );
}