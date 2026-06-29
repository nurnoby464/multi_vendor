"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryIconLink } from "@/components/molecules/CategoryIconLink";
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  type ColorProp,
  type ColorToken,
  type SizeToken,
  type SizeProp,
} from "@/lib/types";
import type { LucideProps } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

export interface CategoryItem {
  id: string;
  label: string;
  href?: string;
  src?: string;
  icon?: React.ComponentType<LucideProps>;
  count?: number;
}

export interface CategoryRailProps {
  heading?: string;
  /** "See All" link */
  seeAllHref?: string;
  onSeeAll?: () => void;
  items: CategoryItem[];
  /** Controlled active item id */
  activeId?: string;
  defaultActiveId?: string;
  onSelect?: (id: string) => void;
  color?: ColorProp;
  size?: SizeProp;
  /** Show scroll arrows on desktop */
  showArrows?: boolean;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const headingSize: Record<SizeToken, string> = {
  xs: "text-base",
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

const arrowBtn: Record<SizeToken, string> = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
  xl: "h-11 w-11",
};

const arrowIcon: Record<SizeToken, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 22,
};

const arrowTokenClass: Record<ColorToken, string> = {
  primary: "border-primary/30 text-primary hover:bg-primary/10",
  secondary: "border-secondary/30 text-secondary hover:bg-secondary/10",
  tertiary: "border-tertiary/30 text-tertiary hover:bg-tertiary/10",
  success: "border-success/30 text-success hover:bg-success/10",
  warning: "border-warning/30 text-warning hover:bg-warning/10",
  danger: "border-danger/30 text-danger hover:bg-danger/10",
  info: "border-info/30 text-info hover:bg-info/10",
  neutral: "border-neutral/30 text-neutral hover:bg-neutral/10",
};

const seeAllTokenClass: Record<ColorToken, string> = {
  primary: "text-primary hover:text-primary-hover",
  secondary: "text-secondary hover:text-secondary-hover",
  tertiary: "text-tertiary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-neutral",
};

/* ─── Component ──────────────────────────────────────────────── */

export function CategoryRail({
  heading = "Explore by Category",
  seeAllHref,
  onSeeAll,
  items,
  activeId,
  defaultActiveId,
  onSelect,
  color = "primary",
  size = "md",
  showArrows = true,
  className,
}: CategoryRailProps) {
  const [internalActive, setInternalActive] = React.useState(
    defaultActiveId ?? "",
  );
  const currentActive = activeId !== undefined ? activeId : internalActive;

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);
  const sizeToken: SizeToken =
    typeof size === "object" ? "md" : (size as SizeToken);

  function updateScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    const ro = new ResizeObserver(updateScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      ro.disconnect();
    };
  }, [items]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -240 : 240, behavior: "smooth" });
  }

  function handleSelect(id: string) {
    if (activeId === undefined) setInternalActive(id);
    onSelect?.(id);
  }

  return (
    <section className={cn("w-full", className)} aria-label={heading}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2
          className={cn(
            "font-bold text-text tracking-tight",
            headingSize[sizeToken],
          )}
        >
          {heading}
        </h2>

        <div className="flex items-center gap-2">
          {/* Arrows */}
          {showArrows && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                aria-label="Scroll categories left"
                disabled={!canScrollLeft}
                onClick={() => scroll("left")}
                className={cn(
                  "inline-flex items-center justify-center rounded-full border transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  arrowBtn[sizeToken],
                  isCustom
                    ? "border-[var(--ds-bg)]/30 text-[var(--ds-bg)] hover:bg-[var(--ds-bg)]/10"
                    : arrowTokenClass[colorToken],
                )}
                style={isCustom ? customColorVars(color) : undefined}
              >
                <ChevronLeft size={arrowIcon[sizeToken]} aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Scroll categories right"
                disabled={!canScrollRight}
                onClick={() => scroll("right")}
                className={cn(
                  "inline-flex items-center justify-center rounded-full border transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  arrowBtn[sizeToken],
                  isCustom
                    ? "border-[var(--ds-bg)]/30 text-[var(--ds-bg)] hover:bg-[var(--ds-bg)]/10"
                    : arrowTokenClass[colorToken],
                )}
                style={isCustom ? customColorVars(color) : undefined}
              >
                <ChevronRight size={arrowIcon[sizeToken]} aria-hidden />
              </button>
            </div>
          )}

          {/* See All */}
          {(seeAllHref || onSeeAll) && (
            <a
              href={seeAllHref}
              onClick={onSeeAll}
              className={cn(
                "text-sm font-medium transition-colors",
                isCustom
                  ? "text-[var(--ds-bg)] hover:opacity-80"
                  : seeAllTokenClass[colorToken],
              )}
              style={isCustom ? customColorVars(color) : undefined}
            >
              See All
            </a>
          )}
        </div>
      </div>

      {/* Scrollable rail */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-4 sm:gap-6 overflow-x-auto",
          "scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]",
          "[&::-webkit-scrollbar]:hidden",
          "pb-2 -mb-2" /* prevent clip on focus rings */,
        )}
        role="list"
        aria-label={heading}
      >
        {items.map((item) => (
          <div key={item.id} role="listitem" className="shrink-0">
            <CategoryIconLink
              label={item.label}
              href={item.href}
              active={currentActive === item.id}
              color={color}
              size={size}
              asButton={!item.href}
              onClick={() => handleSelect(item.id)}
              layout="vertical"
              {...(item.src !== undefined && { src: item.src })}
              {...(item.icon !== undefined && { icon: item.icon })}
              {...(item.count !== undefined && { count: item.count })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
