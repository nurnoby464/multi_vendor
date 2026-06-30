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

const bubbleSize: Record<SizeToken, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const iconSize: Record<SizeToken, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

const labelSize: Record<SizeToken, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-xs",
  lg: "text-sm",
  xl: "text-base",
};

const ringClass: Record<ColorToken, string> = {
  primary:   "ring-2 ring-primary   ring-offset-2 ring-offset-surface",
  secondary: "ring-2 ring-secondary ring-offset-2 ring-offset-surface",
  tertiary:  "ring-2 ring-tertiary  ring-offset-2 ring-offset-surface",
  success:   "ring-2 ring-success   ring-offset-2 ring-offset-surface",
  warning:   "ring-2 ring-warning   ring-offset-2 ring-offset-surface",
  danger:    "ring-2 ring-danger    ring-offset-2 ring-offset-surface",
  info:      "ring-2 ring-info      ring-offset-2 ring-offset-surface",
  neutral:   "ring-2 ring-neutral   ring-offset-2 ring-offset-surface",
};

const hoverRingClass: Record<ColorToken, string> = {
  primary:   "group-hover:ring-2 group-hover:ring-primary/50   group-hover:ring-offset-2 group-hover:ring-offset-surface",
  secondary: "group-hover:ring-2 group-hover:ring-secondary/50 group-hover:ring-offset-2 group-hover:ring-offset-surface",
  tertiary:  "group-hover:ring-2 group-hover:ring-tertiary/50  group-hover:ring-offset-2 group-hover:ring-offset-surface",
  success:   "group-hover:ring-2 group-hover:ring-success/50   group-hover:ring-offset-2 group-hover:ring-offset-surface",
  warning:   "group-hover:ring-2 group-hover:ring-warning/50   group-hover:ring-offset-2 group-hover:ring-offset-surface",
  danger:    "group-hover:ring-2 group-hover:ring-danger/50    group-hover:ring-offset-2 group-hover:ring-offset-surface",
  info:      "group-hover:ring-2 group-hover:ring-info/50      group-hover:ring-offset-2 group-hover:ring-offset-surface",
  neutral:   "group-hover:ring-2 group-hover:ring-neutral/50   group-hover:ring-offset-2 group-hover:ring-offset-surface",
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
  const avSize = isCustomSz ? size : sizeToken;

  const activeRing = isCustom
    ? "ring-2 ring-offset-2 ring-offset-surface"
    : ringClass[color as ColorToken];

  const hoverRing = isCustom
    ? "group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-offset-surface"
    : hoverRingClass[color as ColorToken];

  const firstLetter = label.charAt(0).toUpperCase();

  // ✅ Single wrapper lifts BOTH bubble + label together
  const content = (
    <span
      className={cn(
        "inline-flex items-center",
        "transition-transform duration-200 ease-out group-hover:-translate-y-1",
        layout === "vertical" ? "flex-col gap-1.5" : "flex-row gap-2",
      )}
    >
      {/* Bubble */}
      <span className="relative inline-flex shrink-0">
        {src ? (
         <Avatar
  name={label}
  color={color}
  size={avSize}
  src={src}
  shape="circle"          // ✅ explicitly set
  className={cn(
    "transition-all duration-200",
    active ? activeRing : hoverRing,
  )}
  style={
    active && isCustom
      ? ({ "--tw-ring-color": (color as { bg: string }).bg } as React.CSSProperties)
      : undefined
  }
/>
        ) : (
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full",
              "transition-all duration-200",
              bubbleSize[sizeToken],
              isCustom ? "bg-[var(--ds-bg)]/10" : `bg-${color}/10`,
              active ? activeRing : hoverRing,
            )}
            style={isCustom ? customColorVars(color) : undefined}
          >
            {IconComp ? (
              <IconComp
                size={iconSize[sizeToken]}
                strokeWidth={2}
                aria-hidden
                className={cn(
                  "transition-colors duration-200",
                  isCustom ? "text-[var(--ds-bg)]" : `text-${color}`,
                )}
              />
            ) : (
              <span
                className={cn(
                  "font-medium",
                  isCustom ? "text-[var(--ds-bg)]" : `text-${color}`,
                )}
              >
                {firstLetter}
              </span>
            )}
          </span>
        )}

        {/* Count badge */}
        {typeof count === "number" && count > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-danger px-0.5 text-[9px] font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>

      {/* Label — now inside the lifting wrapper */}
      <span
        className={cn(
          "font-medium text-text-muted transition-colors duration-200",
          labelSize[sizeToken],
          active && (isCustom ? "text-[var(--ds-bg)]" : `text-${color}`),
          "group-hover:text-text",
          layout === "vertical" ? "text-center leading-tight" : "",
        )}
        style={active && isCustom ? customColorVars(color) : undefined}
      >
        {label}
      </span>
    </span>
  );

  // ✅ Outer element no longer controls flex-col/gap — inner content wrapper does
  const sharedClass = cn(
    "group inline-flex shrink-0 cursor-pointer items-center justify-center",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    className,
  );

  if (asButton) {
    return (
      <button type="button" aria-pressed={active} className={sharedClass} onClick={onClick}>
        {content}
      </button>
    );
  }

  return (
    <a aria-current={active ? "page" : undefined} className={sharedClass} onClick={onClick} {...props}>
      {content}
    </a>
  );
}