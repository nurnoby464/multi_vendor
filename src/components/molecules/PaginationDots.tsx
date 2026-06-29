"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

export interface PaginationDotsProps {
  /** Total number of slides/pages. */
  count: number;
  /** Currently active index (0-based). */
  activeIndex: number;
  onChange?: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Show prev/next arrow buttons. */
  showArrows?: boolean;
  /** Arrow button style. */
  arrowVariant?: "ghost" | "solid" | "outline";
  color?: ColorProp;
  size?: SizeToken;
  /** Dot shape. */
  dotShape?: "circle" | "rounded" | "pill";
  /** Accessibility: what do dots navigate? e.g. "Carousel slide". */
  itemLabel?: string;
  className?: string;
}

const dotSizes: Record<SizeToken, { dot: string; active: string; btn: string; icon: number }> = {
  xs: { dot: "h-1.5 w-1.5", active: "w-4",  btn: "h-6 w-6",  icon: 12 },
  sm: { dot: "h-2 w-2",     active: "w-5",  btn: "h-7 w-7",  icon: 14 },
  md: { dot: "h-2.5 w-2.5", active: "w-6",  btn: "h-8 w-8",  icon: 16 },
  lg: { dot: "h-3 w-3",     active: "w-7",  btn: "h-9 w-9",  icon: 18 },
  xl: { dot: "h-3.5 w-3.5", active: "w-8",  btn: "h-10 w-10",icon: 20 },
};

const activeBg: Record<ColorToken, string> = {
  primary:   "bg-primary",
  secondary: "bg-secondary",
  tertiary:  "bg-tertiary",
  success:   "bg-success",
  warning:   "bg-warning",
  danger:    "bg-danger",
  info:      "bg-info",
  neutral:   "bg-neutral",
};

const arrowBase: Record<ColorToken, { ghost: string; solid: string; outline: string }> = {
  primary:   { ghost: "text-primary hover:bg-primary/10",    solid: "bg-primary text-primary-foreground",    outline: "border border-primary text-primary hover:bg-primary/10"   },
  secondary: { ghost: "text-secondary hover:bg-secondary/10", solid: "bg-secondary text-secondary-foreground", outline: "border border-secondary text-secondary hover:bg-secondary/10" },
  tertiary:  { ghost: "text-tertiary hover:bg-tertiary/10",   solid: "bg-tertiary text-tertiary-foreground",   outline: "border border-tertiary text-tertiary hover:bg-tertiary/10"  },
  success:   { ghost: "text-success hover:bg-success/10",     solid: "bg-success text-success-foreground",     outline: "border border-success text-success hover:bg-success/10"    },
  warning:   { ghost: "text-warning hover:bg-warning/10",     solid: "bg-warning text-warning-foreground",     outline: "border border-warning text-warning hover:bg-warning/10"   },
  danger:    { ghost: "text-danger hover:bg-danger/10",       solid: "bg-danger text-danger-foreground",       outline: "border border-danger text-danger hover:bg-danger/10"      },
  info:      { ghost: "text-info hover:bg-info/10",           solid: "bg-info text-info-foreground",           outline: "border border-info text-info hover:bg-info/10"           },
  neutral:   { ghost: "text-neutral hover:bg-neutral/10",     solid: "bg-neutral text-neutral-foreground",     outline: "border border-neutral text-neutral hover:bg-neutral/10"   },
};

const dotShape = {
  circle:  "rounded-full",
  rounded: "rounded-[var(--radius-ds-sm)]",
  pill:    "rounded-full",
};

export function PaginationDots({
  count,
  activeIndex,
  onChange,
  onPrev,
  onNext,
  showArrows = true,
  arrowVariant = "ghost",
  color = "primary",
  size = "md",
  dotShape: shape = "circle",
  itemLabel = "Slide",
  className,
}: PaginationDotsProps) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);
  const { dot, active, btn, icon } = dotSizes[size];

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < count - 1;

  function handlePrev() {
    if (!canPrev) return;
    const next = activeIndex - 1;
    onChange?.(next);
    onPrev?.();
  }

  function handleNext() {
    if (!canNext) return;
    const next = activeIndex + 1;
    onChange?.(next);
    onNext?.();
  }

  const arrowClass = isCustom
    ? "text-[var(--ds-bg)] hover:opacity-80"
    : arrowBase[colorToken][arrowVariant];

  return (
    <div
      className={cn("flex items-center gap-2", className)}
      role="group"
      aria-label="Carousel navigation"
    >
      {/* Prev arrow */}
      {showArrows && (
        <button
          type="button"
          aria-label="Previous slide"
          disabled={!canPrev}
          onClick={handlePrev}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            btn,
            arrowClass,
          )}
          style={isCustom ? customColorVars(color) : undefined}
        >
          <ChevronLeft size={icon} aria-hidden />
        </button>
      )}

      {/* Dot indicators */}
      <div
        className="flex items-center gap-1.5"
        role="tablist"
        aria-label={`${count} slides`}
      >
        {Array.from({ length: count }).map((_, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`${itemLabel} ${i + 1} of ${count}`}
              onClick={() => onChange?.(i)}
              className={cn(
                "shrink-0 transition-all duration-300",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                dotShape[shape],
                dot,
                isActive
                  ? cn(
                      active,
                      isCustom ? "bg-[var(--ds-bg)]" : activeBg[colorToken],
                    )
                  : "bg-border hover:bg-text-muted",
              )}
              style={isActive && isCustom ? customColorVars(color) : undefined}
            />
          );
        })}
      </div>

      {/* Next arrow */}
      {showArrows && (
        <button
          type="button"
          aria-label="Next slide"
          disabled={!canNext}
          onClick={handleNext}
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            btn,
            arrowClass,
          )}
          style={isCustom ? customColorVars(color) : undefined}
        >
          <ChevronRight size={icon} aria-hidden />
        </button>
      )}
    </div>
  );
}
