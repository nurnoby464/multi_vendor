"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

const sizePx: Record<SizeToken, number> = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 };
const fillColorClass: Record<ColorToken, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-neutral",
};

export interface RatingProps {
  /** 0–`max` value, fractional allowed (e.g. 3.5). */
  value: number;
  max?: number;
  size?: SizeToken;
  color?: ColorProp;
  /** Number of reviews/votes shown next to the stars, if any. */
  count?: number;
  /** Makes the stars clickable, calling `onChange` with the clicked star's value. */
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({ value, max = 5, size = "md", color = "warning", count, interactive = false, onChange, className }: RatingProps) {
  const px = sizePx[size];
  const isCustom = isCustomColor(color);
  const fillClass = isCustom ? "" : fillColorClass[color as ColorToken];
  const fillStyle = isCustom ? { color: color.bg } : undefined;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center" role={interactive ? "radiogroup" : "img"} aria-label={`Rating: ${value} out of ${max}`}>
        {Array.from({ length: max }).map((_, i) => {
          const fillPct = Math.max(0, Math.min(1, value - i)) * 100;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => onChange?.(i + 1)}
              className={cn("relative leading-none", interactive ? "cursor-pointer" : "cursor-default")}
              aria-hidden={!interactive}
              tabIndex={interactive ? 0 : -1}
            >
              <Star size={px} className="text-border" fill="currentColor" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPct}%` }}>
                <Star size={px} className={fillClass} style={fillStyle} fill="currentColor" />
              </span>
            </button>
          );
        })}
      </div>
      {typeof count === "number" && <span className="text-xs text-text-muted">({count})</span>}
    </div>
  );
}
