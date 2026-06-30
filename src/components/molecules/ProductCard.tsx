"use client";

import * as React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Price } from "@/components/atoms/Price";
import { Rating } from "@/components/atoms/Rating";
import { Skeleton, SkeletonLayout } from "@/components/atoms/Skeleton";
import { cn } from "@/lib/utils";
import type { BadgeProps } from "@/components/atoms/Badge";
import type { ColorProp, SizeProp } from "@/lib/types";

export interface ProductCardBadge {
  label: string;
  color?: BadgeProps["color"];
  variant?: BadgeProps["variant"];
}

export interface ProductCardProps {
  /** Full-bleed product image. Pass `undefined` to render skeleton. */
  image?: string;
  imageAlt?: string;
  title?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  /** Array of badges (New, Sale, Eco, etc.) */
  badges?: ProductCardBadge[];
  /** Whether to show an add-to-cart button */
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  addToCartStatus?: "idle" | "loading" | "success";
  /** Whether the product is currently in the cart */
  inCart?: boolean;
  /** Navigate to product on click */
  href?: string;
  onClick?: () => void;
  color?: ColorProp;
  size?: SizeProp;
  /** Loading skeleton state */
  isLoading?: boolean;
  /** Compact layout flag — used by ProductCardCompact internally */
  compact?: boolean;
  className?: string;
}

export function ProductCard({
  image,
  imageAlt = "Product image",
  title,
  price,
  originalPrice,
  currency = "$",
  rating,
  reviewCount,
  badges = [],
  showAddToCart = true,
  onAddToCart,
  addToCartStatus = "idle",
  inCart = false,
  href,
  onClick,
  color = "primary",
  size = "md",
  isLoading = false,
  compact = false,
  className,
}: ProductCardProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-[var(--radius-ds-lg)] border border-border bg-surface",
          compact ? "flex gap-3 p-3" : "flex flex-col",
          className,
        )}
        aria-busy="true"
        aria-label="Loading product"
      >
        {compact ? (
          <>
            <Skeleton
              shape="rounded"
              width={72}
              height={72}
              className="shrink-0"
            />
            <SkeletonLayout
              node={{
                direction: "col",
                gap: "0.5rem",
                children: [
                  { type: "text", width: "70%", height: 14 },
                  { type: "text", width: "50%", height: 12 },
                  { type: "text", width: "40%", height: 16 },
                ],
              }}
            />
          </>
        ) : (
          <>
            <Skeleton shape="rounded" height={200} className="rounded-b-none" />
            <div className="p-4">
              <SkeletonLayout
                node={{
                  direction: "col",
                  gap: "0.75rem",
                  children: [
                    { type: "text", width: "80%", height: 14 },
                    { type: "text", width: "55%", height: 12 },
                    {
                      direction: "row",
                      gap: "0.5rem",
                      children: [
                        { type: "rect", width: 80, height: 32 },
                        { type: "rect", width: 80, height: 32 },
                      ],
                    },
                  ],
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  }

  const cardContent = (
    <>
      {/* Thumbnail area */}
      <div
        className={cn(
          "relative overflow-hidden bg-bg",
          compact
            ? "h-[72px] w-[72px] shrink-0 rounded-[var(--radius-ds-md)]"
            : "w-full rounded-b-none rounded-t-[var(--radius-ds-lg)]",
          !compact && "aspect-[4/3]",
        )}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <ShoppingCart size={compact ? 20 : 32} aria-hidden />
          </div>
        )}

        {/* Badges overlay */}
        {badges.length > 0 && !compact && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((b) => (
              <Badge
                key={b.label}
                color={b.color ?? "tertiary"}
                variant={b.variant ?? "solid"}
                size="xs"
              >
                {b.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Info area */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          compact ? "gap-1 min-w-0" : "gap-2 p-4",
        )}
      >
        {/* Inline badges for compact */}
        {badges.length > 0 && compact && (
          <div className="flex flex-wrap gap-1">
            {badges.map((b) => (
              <Badge
                key={b.label}
                color={b.color ?? "tertiary"}
                variant={b.variant ?? "soft"}
                size="xs"
              >
                {b.label}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        {title && (
          <p
            className={cn(
              "font-medium text-text leading-snug",
              compact ? "truncate text-sm" : "line-clamp-2 text-sm",
            )}
          >
            {title}
          </p>
        )}

        {/* Rating */}
        {typeof rating === "number" && (
          <Rating
            value={rating}
            size={compact ? "xs" : "sm"}
            color="warning"
            {...(reviewCount !== undefined && { count: reviewCount })}
          />
        )}

        {/* Price row */}
        <div
          className={cn(
            "flex items-center justify-between gap-2 flex-wrap",
+           !compact && "mt-auto",
          )}
        >
          {typeof price === "number" && (
            <Price
              value={price}
              currency={currency}
              color={color}
              size={compact ? "sm" : "md"} layout={compact ? "row" : "col"}
              showDiscountBadge={!compact && !!originalPrice}
              {...(originalPrice !== undefined && {
                originalValue: originalPrice,
              })}
            />
          )}

          {showAddToCart && !compact && (
            <Button
              size="sm"
              color={color}
              variant={inCart ? "soft" : "solid"}
              icon={ShoppingCart}
              iconOnly
              aria-label={inCart ? "In cart" : "Add to cart"}
              status={addToCartStatus}
               className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
            />
          )}
        </div>

        {showAddToCart && compact && (
          <Button
            size="xs"
            color={color}
            variant={inCart ? "soft" : "outline"}
            status={addToCartStatus}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.();
            }}
            className="mt-1 self-start"
          >
            {inCart ? "In Cart" : "Add"}
          </Button>
        )}
      </div>
    </>
  );

  const sharedClass = cn(
    "group overflow-hidden rounded-[var(--radius-ds-lg)] border border-border bg-surface",
    "transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(46,50,48,0.10)]",
    compact ? "flex gap-3 p-3" : "flex flex-col",
    (href || onClick) && "cursor-pointer",
    className,
  );

  if (href) {
    return (
      <a href={href} className={sharedClass} onClick={onClick}>
        {cardContent}
      </a>
    );
  }

  return (
    <div
      className={sharedClass}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {cardContent}
    </div>
  );
}
