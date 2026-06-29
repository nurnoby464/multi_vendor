import * as React from "react";
import { cn, customColorVars, customSizeVars } from "@/lib/utils";
import { isCustomColor, isCustomSize, type ColorProp, type ColorToken, type SizeProp, type SizeToken } from "@/lib/types";

export type BadgeVariant = "solid" | "soft" | "outline";

const sizeClasses: Record<SizeToken, string> = {
  xs: "h-4 px-1.5 text-[10px] gap-1 rounded-[var(--radius-ds-sm)]",
  sm: "h-5 px-2 text-xs gap-1 rounded-[var(--radius-ds-sm)]",
  md: "h-6 px-2.5 text-xs gap-1.5 rounded-[var(--radius-ds-sm)]",
  lg: "h-7 px-3 text-sm gap-1.5 rounded-[var(--radius-ds-md)]",
  xl: "h-8 px-3.5 text-sm gap-2 rounded-[var(--radius-ds-md)]",
};

const solid: Record<ColorToken, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  info: "bg-info text-info-foreground",
  neutral: "bg-neutral text-neutral-foreground",
};
const soft: Record<ColorToken, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  tertiary: "bg-tertiary/10 text-tertiary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  neutral: "bg-neutral/10 text-neutral",
};
const outline: Record<ColorToken, string> = {
  primary: "border border-primary text-primary",
  secondary: "border border-secondary text-secondary",
  tertiary: "border border-tertiary text-tertiary",
  success: "border border-success text-success",
  warning: "border border-warning text-warning",
  danger: "border border-danger text-danger",
  info: "border border-info text-info",
  neutral: "border border-neutral text-neutral",
};
const variantMap: Record<BadgeVariant, Record<ColorToken, string>> = { solid, soft, outline };
const customVariantClass: Record<BadgeVariant, string> = {
  solid: "ds-custom-solid",
  soft: "ds-custom-soft",
  outline: "ds-custom-outline border",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: ColorProp;
  size?: SizeProp;
  /** Small leading status dot instead of/alongside text. */
  dot?: boolean;
}

export function Badge({ variant = "soft", color = "primary", size = "md", dot = false, className, children, ...props }: BadgeProps) {
  const isCustom = isCustomColor(color);
  const isCustomSz = isCustomSize(size);

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium whitespace-nowrap",
        isCustom ? customVariantClass[variant] : variantMap[variant][color as ColorToken],
        !isCustomSz && sizeClasses[size as SizeToken],
        className,
      )}
      style={{ ...customColorVars(color), ...customSizeVars(isCustomSz ? size : undefined) }}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  );
}
