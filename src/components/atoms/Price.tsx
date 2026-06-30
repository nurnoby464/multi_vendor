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

export type PriceLayout = "row" | "col";

export interface PriceProps {
  value: number | string;
  originalValue?: number | string;
  currency?: string;
  formatter?: (value: number) => string;
  size?: SizeToken;
  color?: ColorProp;
  showDiscountBadge?: boolean;
  /** "row" (default, unchanged) = value, struck original, badge all inline.
   *  "col" = value stacked above struck original; badge sits beside the stack. */
  layout?: PriceLayout;
  className?: string;
}

function format(value: number | string, currency: string, formatter?: (v: number) => string) {
  if (typeof value === "string") return value;
  return formatter ? formatter(value) : `${currency}${value.toFixed(2)}`;
}

export function Price({
  value,
  originalValue,
  currency = "$",
  formatter,
  size = "md",
  color = "primary",
  showDiscountBadge = false,
  layout = "row",
  className,
}: PriceProps) {
  const isCustom = isCustomColor(color);
  const discountPct =
    typeof value === "number" && typeof originalValue === "number" && originalValue > 0
      ? Math.round(100 - (value / originalValue) * 100)
      : undefined;

  const valueEl = (
    <span
      className={cn(
        "font-semibold leading-tight",
        sizeClasses[size],
        !isCustom && colorClass[color as ColorToken],
      )}
      style={isCustom ? { color: color.bg } : undefined}
    >
      {format(value, currency, formatter)}
    </span>
  );

  const originalEl = originalValue !== undefined && (
    <span
      className={cn(
        "text-text-muted line-through leading-tight",
        layout === "col" ? "text-xs" : "text-sm",
      )}
    >
      {format(originalValue, currency, formatter)}
    </span>
  );

  const priceBlock =
    layout === "col" ? (
      <span className="flex flex-col items-start gap-0.5 min-w-0">
        {valueEl}
        {originalEl}
      </span>
    ) : (
      <>
        {valueEl}
        {originalEl}
      </>
    );

  return (
    <span
      className={cn(
        "inline-flex flex-wrap min-w-0",
        layout === "row" ? "items-baseline gap-2" : "items-center gap-2",
        className,
      )}
    >
      {priceBlock}
      {showDiscountBadge && discountPct !== undefined && discountPct > 0 && (
        <Badge color="danger" size="xs" variant="solid">
          -{discountPct}%
        </Badge>
      )}
    </span>
  );
}