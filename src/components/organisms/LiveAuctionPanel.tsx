"use client";

import * as React from "react";
import { Radio, Users } from "lucide-react";
import {
  BidControls,
  type BidControlsProps,
} from "@/components/molecules/BidControls";
import { CountdownTimer } from "@/components/molecules/CountdownTimer";
import { Badge } from "@/components/atoms/Badge";
import { Avatar } from "@/components/atoms/Avatar";
import { Price } from "@/components/atoms/Price";
import { Skeleton } from "@/components/atoms/Skeleton";
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  type ColorProp,
  type ColorToken,
  type SizeToken,
} from "@/lib/types";

/* ─── Types ──────────────────────────────────────────────────── */

export interface AuctionBidder {
  name: string;
  avatarSrc?: string;
  amount: number;
}

export interface LiveAuctionPanelProps {
  label?: string;
  title: string;
  subtitle?: string;
  description?: string;
  productImage?: string;
  productImageAlt?: string;
  currentBid?: number;
  endDate: Date | string;
  onExpire?: () => void;
  recentBidders?: AuctionBidder[];
  viewerCount?: number;
  bidControls?: Omit<BidControlsProps, "color" | "size">;
  ended?: boolean;
  isLoading?: boolean;
  dark?: boolean;
  color?: ColorProp;
  size?: SizeToken;
  currency?: string;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const titleSize: Record<SizeToken, string> = {
  xs: "text-xl",
  sm: "text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};

const darkOverlayToken: Record<ColorToken, string> = {
  primary:   "from-primary/20",
  secondary: "from-secondary/20",
  tertiary:  "from-tertiary/20",
  success:   "from-success/20",
  warning:   "from-warning/20",
  danger:    "from-danger/20",
  info:      "from-info/20",
  neutral:   "from-neutral/20",
};

/* ─── Helpers ─────────────────────────────────────────────────── */

/** Normalise `Date | string` → `Date` once, at the top of render. */
function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

/* ─── Component ──────────────────────────────────────────────── */

export function LiveAuctionPanel({
  label = "Live Auction",
  title,
  subtitle,
  description,
  productImage,
  productImageAlt = "Auction product",
  currentBid,
  endDate,
  onExpire,
  recentBidders = [],
  viewerCount,
  bidControls,
  ended = false,
  isLoading = false,
  dark = true,
  color = "primary",
  size = "md",
  currency = "$",
  className,
}: LiveAuctionPanelProps) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);

  // ✅ Normalise once — CountdownTimer only accepts Date
  const endDateAsDate = toDate(endDate);

  if (isLoading) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-ds-lg)]",
          dark ? "bg-[#1a1f1c]" : "bg-surface border border-border",
          "p-6 sm:p-8",
          className,
        )}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-4 lg:flex-1">
            <Skeleton shape="text" width="30%" height={16} />
            <Skeleton shape="text" width="70%" height={32} />
            <Skeleton shape="text" width="50%" height={48} />
            <Skeleton shape="rect" height={120} />
          </div>
          <Skeleton
            shape="rounded"
            width={280}
            height={320}
            className="hidden lg:block shrink-0"
          />
        </div>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-ds-lg)]",
        dark
          ? "bg-[#1a1f1c] text-white"
          : "bg-surface border border-border text-text",
        "p-5 sm:p-7 lg:p-8",
        className,
      )}
      aria-label={`${label}: ${title}`}
    >
      {dark && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 opacity-30",
            "bg-gradient-to-br",
            isCustom ? "from-[var(--ds-bg)]/20" : darkOverlayToken[colorToken],
            "to-transparent",
          )}
          style={isCustom ? customColorVars(color) : undefined}
          aria-hidden
        />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row gap-8 lg:items-start">
        {/* ── Left: info + bid ── */}
        <div className="flex flex-col gap-5 lg:flex-1 min-w-0">
          {/* Live badge + viewers */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              color="danger"
              variant="solid"
              size="sm"
              dot
              className="uppercase tracking-wider"
            >
              <Radio size={11} className="mr-1" aria-hidden />
              {label}
            </Badge>

            {typeof viewerCount === "number" && (
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  dark ? "text-white/60" : "text-text-muted",
                )}
              >
                <Users size={12} aria-hidden />
                {viewerCount.toLocaleString()} watching
              </span>
            )}

            {ended && (
              <Badge color="neutral" variant="soft" size="sm">
                Auction Ended
              </Badge>
            )}
          </div>

          {/* Title + subtitle */}
          <div className="flex flex-col gap-1">
            {subtitle && (
              <p className={cn("text-sm", dark ? "text-white/50" : "text-text-muted")}>
                {subtitle}
              </p>
            )}
            <h2 className={cn("font-bold tracking-tight", titleSize[size])}>
              {title}
            </h2>
            {description && (
              <p
                className={cn(
                  "text-sm leading-relaxed mt-1 max-w-md",
                  dark ? "text-white/70" : "text-text-muted",
                )}
              >
                {description}
              </p>
            )}
          </div>

          {/* Current bid + timer row */}
          <div className="flex flex-wrap items-center gap-6">
            {typeof currentBid === "number" && (
              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-xs font-medium uppercase tracking-wider",
                    dark ? "text-white/50" : "text-text-muted",
                  )}
                >
                  Current Bid
                </span>
                <Price
                  value={currentBid}
                  currency={currency}
                  color={color}
                  size={size === "xs" || size === "sm" ? "lg" : "xl"}
                  {...(dark ? { className: "!text-white" } : {})}
                />
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wider",
                  dark ? "text-white/50" : "text-text-muted",
                )}
              >
                {ended ? "Ended" : "Ends in"}
              </span>
              {/* ✅ targetDate is now always Date, color is ColorProp */}
              <CountdownTimer
                targetDate={endDateAsDate}
                {...(onExpire !== undefined && { onExpire })}
                variant="clock"
                color={color}
                size={size === "xs" ? "xs" : size === "xl" ? "lg" : "sm"}
                showIcon={false}
              />
            </div>
          </div>

          {/* Recent bidders */}
          {recentBidders.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {recentBidders.slice(0, 4).map((b) => (
                  <Avatar
                    key={b.name}
                    name={b.name}
                    size="xs"
                    color={color}
                    className="ring-2 ring-surface"
                    {...(b.avatarSrc !== undefined && { src: b.avatarSrc })}
                  />
                ))}
              </div>
              <span className={cn("text-xs", dark ? "text-white/50" : "text-text-muted")}>
                {recentBidders.length} recent bid
                {recentBidders.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Bid controls */}
          {!ended && bidControls && (
            <div
              className={cn(
                "mt-1 p-4 rounded-[var(--radius-ds-md)]",
                dark ? "bg-white/5 backdrop-blur-sm" : "bg-bg",
              )}
            >
              <BidControls
                {...bidControls}
                currency={currency}
                color={color}
                size={size === "xl" ? "md" : size === "xs" ? "xs" : "sm"}
                disabled={ended}
                {...(currentBid !== undefined && { currentBid })}
              />
            </div>
          )}
        </div>

        {/* ── Right: product image ── */}
        {productImage && (
          <div
            className={cn(
              "shrink-0 overflow-hidden rounded-[var(--radius-ds-lg)]",
              "w-full max-w-[280px] lg:w-[280px] xl:w-[320px]",
              "aspect-[3/4] lg:aspect-auto lg:h-[360px]",
              "mx-auto lg:mx-0",
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={productImage}
              alt={productImageAlt}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}