"use client";

import * as React from "react";
import { Chip } from "@/components/atoms/Chip";
import { Badge } from "@/components/atoms/Badge";
import { ProductCard, type ProductCardProps } from "@/components/molecules/ProductCard";
import { PaginationDots } from "@/components/molecules/PaginationDots";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";
import { useCarousel, SwipeCarousel } from "./_carousel";

/* ─── Types ──────────────────────────────────────────────────── */

export interface DealTab {
  id: string;
  label: string;
}

export interface DealProduct extends ProductCardProps {
  id: string;
  tabId?: string; // which tab this product belongs to (undefined = all)
}

export interface DealCarouselProps {
  heading?: string;
  subheading?: string;
  /** Eyebrow badge text, e.g. "Limited Time" */
  eyebrow?: string;
  tabs?: DealTab[];
  products: DealProduct[];
  /** How many cards visible at once — responds to breakpoints if not set */
  visibleCards?: number;
  onProductAddToCart?: (id: string) => void;
  onProductClick?: (id: string) => void;
  color?: ColorProp;
  size?: SizeToken;
  autoPlayMs?: number;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const headingSize: Record<SizeToken, string> = {
  xs: "text-xl",
  sm: "text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};

const seeAllColor: Record<ColorToken, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-neutral",
};

/* ─── Component ──────────────────────────────────────────────── */

export function DealCarousel({
  heading = "50% Off — Limited Time",
  subheading,
  eyebrow = "Limited Time",
  tabs = [],
  products,
  onProductAddToCart,
  onProductClick,
  color = "primary",
  size = "md",
  autoPlayMs,
  className,
}: DealCarouselProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id ?? "__all__");

  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);

  /* Filter by active tab */
  const filtered = React.useMemo(() => {
    if (!tabs.length || activeTab === "__all__") return products;
    return products.filter((p) => !p.tabId || p.tabId === activeTab);
  }, [products, tabs, activeTab]);

  const { activeIndex, prev, next, goTo, canPrev, canNext } = useCarousel({
    count: filtered.length,
    ...(autoPlayMs !== undefined && { autoPlayMs }),
  });

  /* Visible count via CSS grid, but we track one "page" index for mobile dots */
  return (
    <section className={cn("w-full", className)} aria-label={heading}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex flex-col gap-1">
          {eyebrow && (
            <Badge color="danger" variant="soft" size="sm">
              {eyebrow}
            </Badge>
          )}
          <h2 className={cn("font-bold text-text tracking-tight", headingSize[size])}>
            {heading}
          </h2>
          {subheading && (
            <p className="text-sm text-text-muted">{subheading}</p>
          )}
        </div>

        {/* Tab filter chips */}
        {tabs.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Deal categories"
          >
            {tabs.map((tab) => (
              <Chip
                key={tab.id}
                selected={activeTab === tab.id}
                color={color}
                size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Carousel */}
      <SwipeCarousel
        onSwipeLeft={() => next()}
        onSwipeRight={() => prev()}
      >
        {/* Responsive grid — on small screens show 1–2 cards, bigger shows 4 */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 220px), 1fr))`,
          }}
        >
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              color={color}
              size={size}
              onAddToCart={() => onProductAddToCart?.(product.id)}
              onClick={() => onProductClick?.(product.id)}
            />
          ))}
        </div>
      </SwipeCarousel>

      {/* Pagination — only visible when enough products exist */}
      {filtered.length > 4 && (
        <div className="flex justify-center mt-5">
          <PaginationDots
            count={Math.ceil(filtered.length / 4)}
            activeIndex={Math.floor(activeIndex / 4)}
            onChange={(i) => goTo(i * 4)}
            onPrev={prev}
            onNext={next}
            color={color}
            size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
            showArrows={true}
          />
        </div>
      )}
    </section>
  );
}
