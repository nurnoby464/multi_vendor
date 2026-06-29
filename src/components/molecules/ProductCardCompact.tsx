import * as React from "react";
import { ProductCard, type ProductCardProps } from "./ProductCard";

/**
 * Compact / list-view variant of ProductCard.
 * Used in "Pre-owned", "All Types", or any dense grid where thumbnail + title + price
 * need to fit in a smaller footprint.
 *
 * Accepts exactly the same props as ProductCard — the only difference is that
 * `compact` is hardcoded to `true` and the default `size` is bumped down to `sm`.
 */
export interface ProductCardCompactProps extends Omit<
  ProductCardProps,
  "compact" | "size"
> {
  /** Override the compact size scale (defaults to "sm"). */
  size?: ProductCardProps["size"];
}

export function ProductCardCompact({
  size = "sm",
  ...props
}: ProductCardCompactProps) {
  return <ProductCard compact size={size} {...props} />;
}
