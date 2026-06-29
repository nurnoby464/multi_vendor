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

export interface SeasonTab {
  id: string;
  label: string;
}

export interface SeasonProduct extends ProductCardProps {
  id: string;
  tabId?: string;
}

export interface SeasonSavingsCarouselProps {
  heading?: string;
  subheading?: string;
  eyebrow?: string;
  tabs?: SeasonTab[];
  products: SeasonProduct[];
  onProductAddToCart?: (id: string) => void;
  onProductClick?: (id: string) => void;
  color?: ColorProp;
  size?: SizeToken;
  /** Auto-advance interval in ms. Undefined = off. */
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

/* Visible cards by breakpoint (CSS driven, we track "virtual" pages for dots) */
const CARDS_PER_PAGE = 4;

/* ─── Component ──────────────────────────────────────────────── */

export function SeasonSavingsCarousel({
  heading = "Discover Season Savings",
  subheading,
  eyebrow,
  tabs = [],
  products,
  onProductAddToCart,
  onProductClick,
  color = "primary",
  size = "md",
  autoPlayMs,
  className,
}: SeasonSavingsCarouselProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id ?? "__all__");
  const isCustom = isCustomColor(color);

  const filtered = React.useMemo(() => {
    if (!tabs.length || activeTab === "__all__") return products;
    return products.filter((p) => !p.tabId || p.tabId === activeTab);
  }, [products, tabs, activeTab]);

  const pageCount = Math.ceil(filtered.length / CARDS_PER_PAGE);
const { activeIndex, prev, next, goTo } = useCarousel({
  count: pageCount,
  ...(autoPlayMs !== undefined ? { autoPlayMs } : {}),
});

  const visibleProducts = filtered.slice(
    activeIndex * CARDS_PER_PAGE,
    activeIndex * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <section className={cn("w-full", className)} aria-label={heading}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex flex-col gap-1">
          {eyebrow && (
            <Badge color={color} variant="soft" size="sm">
              {eyebrow}
            </Badge>
          )}
          <h2 className={cn("font-bold text-text tracking-tight", headingSize[size])}>
            {heading}
          </h2>
          {subheading && <p className="text-sm text-text-muted">{subheading}</p>}
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Season categories">
            {tabs.map((tab) => (
              <Chip
                key={tab.id}
                selected={activeTab === tab.id}
                color={color}
                size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
                onClick={() => {
                  setActiveTab(tab.id);
                  goTo(0);
                }}
                role="tab"
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Carousel window */}
      <SwipeCarousel
        onSwipeLeft={next}
        onSwipeRight={prev}
        className="relative overflow-hidden"
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 220px), 1fr))`,
          }}
        >
          {visibleProducts.map((product) => (
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

      {/* Pagination dots */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-5">
          <PaginationDots
            count={pageCount}
            activeIndex={activeIndex}
            onChange={goTo}
            onPrev={prev}
            onNext={next}
            color={color}
            size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
            showArrows
          />
        </div>
      )}
    </section>
  );
}
