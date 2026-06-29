import * as React from "react";
import { cn } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";
import { Badge } from "./Badge";

const sizeClasses: Record<SizeToken, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
};
const colorClass: Record<ColorToken, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-neutral",
};

export interface PriceProps {
  /** Current/sale price, already formatted (e.g. "$24.00") or a raw number. */
  value: number | string;
  /** Original price, shown struck through, if there's a discount. */
  originalValue?: number | string;
  currency?: string;
  /** Format a raw number yourself if you need locale-specific formatting; otherwise numbers get `currency` prefixed. */
  formatter?: (value: number) => string;
  size?: SizeToken;
  color?: ColorProp;
  /** Shows a "-30%" style badge, computed automatically from value/originalValue unless overridden. */
  showDiscountBadge?: boolean;
  className?: string;
}

function format(value: number | string, currency: string, formatter?: (v: number) => string) {
  if (typeof value === "string") return value;
  return formatter ? formatter(value) : `${currency}${value.toFixed(2)}`;
}

export function Price({ value, originalValue, currency = "$", formatter, size = "md", color = "primary", showDiscountBadge = false, className }: PriceProps) {
  const isCustom = isCustomColor(color);
  const discountPct =
    typeof value === "number" && typeof originalValue === "number" && originalValue > 0
      ? Math.round(100 - (value / originalValue) * 100)
      : undefined;

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span
        className={cn("font-semibold", sizeClasses[size], !isCustom && colorClass[color as ColorToken])}
        style={isCustom ? { color: color.bg } : undefined}
      >
        {format(value, currency, formatter)}
      </span>
      {originalValue !== undefined && (
        <span className="text-text-muted line-through text-sm">{format(originalValue, currency, formatter)}</span>
      )}
      {showDiscountBadge && discountPct !== undefined && discountPct > 0 && (
        <Badge color="danger" size="xs" variant="solid">
          -{discountPct}%
        </Badge>
      )}
    </span>
  );
}
