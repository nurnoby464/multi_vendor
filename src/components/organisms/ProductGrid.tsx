"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import {
  ProductCard,
  type ProductCardProps,
} from "@/components/molecules/ProductCard";
import { ProductCardCompact } from "@/components/molecules/ProductCardCompact";
import {
  SortDropdown,
  type SortOption,
} from "@/components/molecules/SortDropdown";
import { Skeleton } from "@/components/atoms/Skeleton";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import { type ColorProp, type SizeToken } from "@/lib/types";

/* ─── Types ──────────────────────────────────────────────────── */

export interface GridProduct extends ProductCardProps {
  id: string;
}

export interface ProductGridProps {
  heading?: string;
  products: GridProduct[];
  isLoading?: boolean;
  /** Number of skeleton cards to show when loading */
  skeletonCount?: number;
  sortOptions?: SortOption[];
  sortValue?: string;
  defaultSortValue?: string;
  onSortChange?: (value: string) => void;
  onProductAddToCart?: (id: string) => void;
  onProductClick?: (id: string) => void;
  /** Total product count (for header label) */
  totalCount?: number;
  /** Show grid/list view toggle */
  showViewToggle?: boolean;
  /** "Load more" pagination */
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreStatus?: "idle" | "loading";
  color?: ColorProp;
  size?: SizeToken;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const headingSize: Record<SizeToken, string> = {
  xs: "text-lg",
  sm: "text-xl",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
  xl: "text-3xl sm:text-4xl",
};

const DEFAULT_SORT: SortOption[] = [
  { value: "featured", label: "Most Relevant" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

/* ─── Component ──────────────────────────────────────────────── */

export function ProductGrid({
  heading = "All Types of Products",
  products,
  isLoading = false,
  skeletonCount = 8,
  sortOptions = DEFAULT_SORT,
  sortValue,
  defaultSortValue,
  onSortChange,
  onProductAddToCart,
  onProductClick,
  totalCount,
  showViewToggle = true,
  hasMore = false,
  onLoadMore,
  loadMoreStatus = "idle",
  color = "primary",
  size = "md",
  className,
}: ProductGridProps) {
  const [view, setView] = React.useState<"grid" | "list">("grid");

  return (
    <section
      className={cn("flex flex-col gap-4 sm:gap-5", className)}
      aria-label={heading}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2
            className={cn(
              "font-bold text-text tracking-tight",
              headingSize[size],
            )}
          >
            {heading}
          </h2>
          {typeof totalCount === "number" && (
            <span className="text-sm text-text-muted">({totalCount})</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <SortDropdown
            options={sortOptions}
            {...(defaultSortValue ? { defaultValue: defaultSortValue } : {})}
            color={color}
            size={size === "xl" ? "md" : size === "xs" ? "xs" : "sm"}
            prefix="Sort by:"
            {...(sortValue !== undefined && { value: sortValue })}
            {...(onSortChange ? { onChange: onSortChange } : {})}
          />

          {/* View toggle */}
          {showViewToggle && (
            <div
              className="hidden sm:flex items-center rounded-[var(--radius-ds-md)] border border-border bg-surface overflow-hidden"
              role="group"
              aria-label="View mode"
            >
              {(["grid", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-label={v === "grid" ? "Grid view" : "List view"}
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center transition-colors",
                    view === v
                      ? "bg-bg text-text"
                      : "text-text-muted hover:text-text hover:bg-bg/50",
                  )}
                >
                  {v === "grid" ? (
                    <LayoutGrid size={16} aria-hidden />
                  ) : (
                    <List size={16} aria-hidden />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className={cn(
            "grid gap-4",
            view === "list"
              ? "grid-cols-1"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductCard key={i} isLoading compact={view === "list"} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <p className="text-text-muted text-sm">
            No products match your filters.
          </p>
          <Button variant="outline" color={color} size="sm">
            Clear Filters
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4",
            view === "list"
              ? "grid-cols-1"
              : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {products.map((product) =>
            view === "list" ? (
              <ProductCardCompact
                key={product.id}
                {...product}
                color={color}
                size={size}
                onAddToCart={() => onProductAddToCart?.(product.id)}
                onClick={() => onProductClick?.(product.id)}
              />
            ) : (
              <ProductCard
                key={product.id}
                {...product}
                color={color}
                size={size}
                onAddToCart={() => onProductAddToCart?.(product.id)}
                onClick={() => onProductClick?.(product.id)}
              />
            ),
          )}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-2">
          <Button
            variant="outline"
            color={color}
            size={size}
            status={loadMoreStatus}
            loadingLabel="Loading more…"
            onClick={onLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
    </section>
  );
}
