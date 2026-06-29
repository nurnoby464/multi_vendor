"use client";

import * as React from "react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  type ColorProp,
  type ColorToken,
  type SizeToken,
} from "@/lib/types";
import type { LucideProps } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

export interface HeroAction {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost" | "soft";
  icon?: React.ComponentType<LucideProps>;
}

export interface HeroBannerProps {
  /** Eyebrow/pre-headline tag (e.g. "New Collection") */
  eyebrow?: string;
  headline: string;
  /** Italic or emphasis part of the headline — rendered in a different style */
  headlineAccent?: string;
  subheading?: string;
  /** Primary + optional secondary CTA */
  actions?: HeroAction[];
  /** Full-bleed background image URL */
  backgroundImage?: string;
  /** Overlay opacity 0–1 (default 0.35) */
  overlayOpacity?: number;
  /** Solid background color (used when no image) */
  backgroundColor?: string;
  /** Content alignment */
  align?: "left" | "center" | "right";
  /** Min height token */
  minHeight?: "sm" | "md" | "lg" | "full";
  color?: ColorProp;
  size?: SizeToken;
  /** Extra content rendered to the right in split layouts */
  aside?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const minHeightMap = {
  sm: "min-h-[320px]",
  md: "min-h-[420px]",
  lg: "min-h-[540px]",
  full: "min-h-screen",
};

const headlineSize: Record<SizeToken, string> = {
  xs: "text-2xl sm:text-3xl",
  sm: "text-3xl sm:text-4xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl",
  xl: "text-6xl sm:text-7xl",
};

const subSize: Record<SizeToken, string> = {
  xs: "text-sm",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

const alignClass = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const btnColorMap: Record<ColorToken, string> = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  success: "success",
  warning: "warning",
  danger: "danger",
  info: "info",
  neutral: "neutral",
};

/* ─── Component ──────────────────────────────────────────────── */

export function HeroBanner({
  eyebrow,
  headline,
  headlineAccent,
  subheading,
  actions = [],
  backgroundImage,
  overlayOpacity = 0.35,
  backgroundColor,
  align = "left",
  minHeight = "md",
  color = "primary",
  size = "md",
  aside,
  className,
  children,
}: HeroBannerProps) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);
  const hasBg = !!(backgroundImage || backgroundColor);

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden",
        minHeightMap[minHeight],
        "flex items-center",
        !hasBg && "bg-bg",
        className,
      )}
      style={{
        backgroundColor:
          !backgroundImage && backgroundColor ? backgroundColor : undefined,
        ...(!backgroundImage && isCustom ? customColorVars(color) : undefined),
      }}
      aria-label="Hero banner"
    >
      {/* Background image */}
      {backgroundImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className={cn("flex gap-8", aside ? "lg:flex-row" : "flex-col")}>
          {/* Left / main content */}
          <div
            className={cn(
              "flex flex-col gap-4 sm:gap-5",
              alignClass[align],
              aside ? "lg:flex-1" : "max-w-2xl",
              align === "center" && !aside && "mx-auto",
            )}
          >
            {/* Eyebrow badge */}
            {eyebrow && (
              <Badge
                color={color}
                variant="soft"
                size={size === "xs" ? "xs" : size === "sm" ? "sm" : "md"}
                className={
                  backgroundImage
                    ? "text-current bg-white/20 backdrop-blur-sm"
                    : ""
                }
              >
                {eyebrow}
              </Badge>
            )}

            {/* Headline */}
            <h1
              className={cn(
                "font-bold leading-tight tracking-tight",
                headlineSize[size],
                backgroundImage ? "text-white" : "text-text",
              )}
            >
              {headline}
              {headlineAccent && (
                <>
                  {" "}
                  <em
                    className={cn(
                      "not-italic",
                      isCustom ? "text-[var(--ds-bg)]" : `text-${colorToken}`,
                    )}
                    style={isCustom ? customColorVars(color) : undefined}
                  >
                    {headlineAccent}
                  </em>
                </>
              )}
            </h1>

            {/* Subheading */}
            {subheading && (
              <p
                className={cn(
                  "leading-relaxed max-w-xl",
                  subSize[size],
                  backgroundImage ? "text-white/80" : "text-text-muted",
                )}
              >
                {subheading}
              </p>
            )}

            {/* CTAs */}
            {actions.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap gap-3 mt-1",
                  align === "center" && "justify-center",
                )}
              >
                {actions.map((action, i) => {
                  const btn = (
                    <Button
                      key={action.label}
                      variant={
                        action.variant ?? (i === 0 ? "solid" : "outline")
                      }
                      color={backgroundImage && i > 0 ? "neutral" : color}
                      size={size}
                      onClick={action.onClick}
                      className={
                        backgroundImage && i > 0
                          ? "border-white/60 text-white hover:bg-white/10"
                          : undefined
                      }
                      {...(action.icon !== undefined && { icon: action.icon })}
                    >
                      {action.label}
                    </Button>
                  );
                  return action.href ? (
                    <a key={action.label} href={action.href}>
                      {btn}
                    </a>
                  ) : (
                    btn
                  );
                })}
              </div>
            )}

            {children}
          </div>

          {/* Aside slot */}
          {aside && (
            <div className="lg:flex-1 flex items-center justify-center">
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
