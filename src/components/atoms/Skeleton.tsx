import * as React from "react";
import { cn, customSizeVars } from "@/lib/utils";
import { isCustomSize, type SizeProp, type SizeToken } from "@/lib/types";

export type SkeletonAnimation = "pulse" | "shimmer" | "none";
export type SkeletonShape = "text" | "circle" | "rect" | "rounded";

const heightBySize: Record<SizeToken, string> = {
  xs: "0.6rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.25rem",
  xl: "1.75rem",
};

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  /** Controls the default height of `text`/`rect` shapes when `height` isn't set explicitly. */
  size?: SizeProp;
  width?: string | number;
  height?: string | number;
  animation?: SkeletonAnimation;
}

/** The base Skeleton primitive — one placeholder shape. */
export function Skeleton({
  shape = "rect",
  size = "md",
  width,
  height,
  animation = "pulse",
  className,
  style,
  ...props
}: SkeletonProps) {
  const isCustomSz = isCustomSize(size);
  const resolvedHeight =
    height ??
    (shape === "circle"
      ? heightBySize[isCustomSz ? "md" : (size as SizeToken)]
      : !isCustomSz
        ? heightBySize[size as SizeToken]
        : undefined);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-skeleton-base",
        shape === "circle" && "rounded-full",
        shape === "text" && "rounded-[var(--radius-ds-sm)]",
        shape === "rounded" && "rounded-[var(--radius-ds-lg)]",
        shape === "rect" && "rounded-[var(--radius-ds-md)]",
        animation === "pulse" && "ds-skeleton-pulse",
        animation === "shimmer" && "ds-skeleton-shimmer",
        className,
      )}
      style={{
        width: shape === "circle" ? resolvedHeight : width,
        height: resolvedHeight,
        ...customSizeVars(isCustomSz ? size : undefined),
        ...style,
      }}
      {...props}
    />
  );
}

/** Convenience wrapper for a paragraph-style block of skeleton text lines. */
export function SkeletonText({
  lines = 3,
  lastLineWidth = "60%",
  gap = "0.5rem",
  size = "md",
  animation = "pulse",
}: {
  lines?: number;
  lastLineWidth?: string;
  gap?: string;
  size?: SizeProp;
  animation?: SkeletonAnimation;
}) {
  return (
    <div className="flex flex-col" style={{ gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          shape="text"
          size={size}
          animation={animation}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

/**
 * Fully dynamic skeleton generator. Describe the shape of whatever you're loading
 * (a product card, a table row, a profile header...) as a small JSON-like tree,
 * and it's rendered with consistent spacing automatically — no need to hand-build
 * a bespoke skeleton component for every layout in the app.
 *
 * Example — mirroring a ProductCard:
 * <SkeletonLayout node={{
 *   direction: "col", gap: "0.75rem",
 *   children: [
 *     { type: "rect", height: 160 },
 *     { type: "text", repeat: 2, height: 12 },
 *     { direction: "row", gap: "0.5rem", children: [{ type: "circle", width: 24, height: 24 }, { type: "text", width: "40%" }] },
 *   ],
 * }} />
 */
export interface SkeletonNode {
  type?: SkeletonShape;
  width?: string | number;
  height?: string | number;
  direction?: "row" | "col";
  gap?: string;
  /** Render this node N times in a row (e.g. 3 text lines) instead of writing it out 3 times. */
  repeat?: number;
  animation?: SkeletonAnimation;
  className?: string;
  children?: SkeletonNode[];
}

export function SkeletonLayout({ node }: { node: SkeletonNode }) {
  const {
    repeat,
    children,
    direction,
    gap,
    type,
    width,
    height,
    animation,
    className,
  } = node;

  if (children && children.length > 0) {
    return (
      <div
        className={cn(
          "flex",
          direction === "row" ? "flex-row items-center" : "flex-col",
          className,
        )}
        style={{ gap: gap ?? "0.5rem" }}
      >
        {children.map((child, i) => (
          <SkeletonLayout key={i} node={child} />
        ))}
      </div>
    );
  }

  if (repeat && repeat > 1) {
    return (
      <div className="flex flex-col" style={{ gap: gap ?? "0.5rem" }}>
        {Array.from({ length: repeat }).map((_, i) => (
          <Skeleton
            key={i}
            className={className}
            {...(type !== undefined && { shape: type })}
            {...(width !== undefined && { width: width })}
            {...(height !== undefined && { height: height })}
            {...(animation !== undefined && { animation: animation })}
          />
        ))}
      </div>
    );
  }

  return (
    <Skeleton
      className={className}
      {...(type !== undefined && { shape: type })}
      {...(width !== undefined && { width: width })}
      {...(height !== undefined && { height: height })}
      {...(animation !== undefined && { animation: animation })}
    />
  );
}
