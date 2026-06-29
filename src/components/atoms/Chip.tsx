"use client";

import * as React from "react";
import { X, type LucideProps } from "lucide-react";
import { cn, customColorVars, customSizeVars } from "@/lib/utils";
import { isCustomColor, isCustomSize, type ColorProp, type ColorToken, type SizeProp, type SizeToken } from "@/lib/types";
import { Icon } from "./Icon";

const sizeClasses: Record<SizeToken, string> = {
  xs: "h-6 px-2 text-xs gap-1 rounded-full",
  sm: "h-7 px-2.5 text-xs gap-1.5 rounded-full",
  md: "h-8 px-3 text-sm gap-1.5 rounded-full",
  lg: "h-9 px-3.5 text-sm gap-2 rounded-full",
  xl: "h-10 px-4 text-base gap-2 rounded-full",
};
const iconSizePx: Record<SizeToken, number> = { xs: 12, sm: 13, md: 14, lg: 15, xl: 16 };

const selected: Record<ColorToken, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  info: "bg-info text-info-foreground",
  neutral: "bg-neutral text-neutral-foreground",
};
const unselected = "bg-surface border border-border text-text hover:bg-bg";

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  selected?: boolean;
  icon?: React.ComponentType<LucideProps>;
  /** Shows a remove "x" — use for removable filter tags. */
  onRemove?: () => void;
  color?: ColorProp;
  size?: SizeProp;
}

export function Chip({ selected: isSelected = false, icon, onRemove, color = "primary", size = "md", className, children, ...props }: ChipProps) {
  const isCustom = isCustomColor(color);
  const isCustomSz = isCustomSize(size);
  const px = isCustomSz ? (size.iconSize ?? 14) : iconSizePx[size as SizeToken];

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      className={cn(
        "inline-flex items-center font-medium transition-colors",
        isSelected ? (isCustom ? "ds-custom-solid" : selected[color as ColorToken]) : unselected,
        !isCustomSz && sizeClasses[size as SizeToken],
        className,
      )}
      style={{ ...(isSelected ? customColorVars(color) : undefined), ...customSizeVars(isCustomSz ? size : undefined) }}
      {...props}
    >
      {icon && <Icon icon={icon} size={px} />}
      <span>{children}</span>
      {onRemove && (
        <Icon
          icon={X}
          size={px}
          className="hover:opacity-70"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </button>
  );
}
