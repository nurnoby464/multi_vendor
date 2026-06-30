"use client";

import * as React from "react";
import { Recycle } from "lucide-react";
import { Chip } from "@/components/atoms/Chip";
import { Badge } from "@/components/atoms/Badge";
import { ProductCard, type ProductCardProps } from "@/components/molecules/ProductCard";
import { PaginationDots } from "@/components/molecules/PaginationDots";
import { cn } from "@/lib/utils";
import { type ColorProp, type SizeToken } from "@/lib/types";
import { useCarousel, SwipeCarousel } from "./_carousel";

/* ─── Types ──────────────────────────────────────────────────── */

export interface PreOwnedTab {
  id: string;
  label: string;
}

export interface PreOwnedProduct extends ProductCardProps {
  id: string;
  tabId?: string;
  /** Condition label, e.g. "Like New", "Good", "Fair" */
  condition?: string;
}

export interface PreOwnedSectionProps {
  heading?: string;
  subheading?: string;
  /** Eyebrow label */
  eyebrow?: string;
  tabs?: PreOwnedTab[];
  products: PreOwnedProduct[];
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

const CARDS_PER_PAGE = 10;

/* ─── Component ──────────────────────────────────────────────── */

export function PreOwnedSection({
  heading = "Pre-owned Section",
  subheading = "Expertly refurbished products that deserve a second life. Reduced environmental impact, incredible value.",
  eyebrow = "Sustainable Style",
  tabs = [],
  products,
  onProductAddToCart,
  onProductClick,
  color = "primary",
  size = "md",
  autoPlayMs,
  className,
}: PreOwnedSectionProps) {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id ?? "__all__");

  const filtered = React.useMemo(() => {
    if (!tabs.length || activeTab === "__all__") return products;
    return products.filter((p) => !p.tabId || p.tabId === activeTab);
  }, [products, tabs, activeTab]);

  const pageCount = Math.ceil(filtered.length / CARDS_PER_PAGE);
const { activeIndex, prev, next, goTo } = useCarousel({
  count: pageCount,
  ...(autoPlayMs !== undefined ? { autoPlayMs } : {}),
});

  const visible = filtered.slice(
    activeIndex * CARDS_PER_PAGE,
    activeIndex * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <section className={cn("w-full", className)} aria-label={heading}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div className="flex flex-col gap-1">
          {eyebrow && (
            <Badge color="success" variant="soft" size="sm">
              <Recycle size={11} className="mr-1" aria-hidden />
              {eyebrow}
            </Badge>
          )}
          <h2 className={cn("font-bold text-text tracking-tight", headingSize[size])}>
            {heading}
          </h2>
          {subheading && (
            <p className="text-sm text-text-muted max-w-xl leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        {/* Tabs */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pre-owned categories">
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

      {/* Carousel */}
      <SwipeCarousel
        onSwipeLeft={next}
        onSwipeRight={prev}
        className="relative"
      >
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, 220px), 1fr))`,
          }}
        >
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              color={color}
              size={size}
              badges={[
                ...(product.condition
                  ? [{ label: product.condition, color: "success" as const, variant: "soft" as const }]
                  : []),
                ...(product.badges ?? []),
              ]}
              onAddToCart={() => onProductAddToCart?.(product.id)}
              onClick={() => onProductClick?.(product.id)}
            />
          ))}
        </div>
      </SwipeCarousel>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center mt-5">
          <PaginationDots
            count={pageCount}
            activeIndex={activeIndex}
            onChange={goTo}
            // onPrev={prev}
            // onNext={next}
            color={color}
            size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
            showArrows
          />
        </div>
      )}
    </section>
  );
}
