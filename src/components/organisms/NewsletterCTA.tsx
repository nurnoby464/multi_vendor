"use client";

import * as React from "react";
import { Leaf } from "lucide-react";
import {
  NewsletterForm,
  type NewsletterFormProps,
} from "@/components/molecules/NewsletterForm";
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  type ColorProp,
  type ColorToken,
  type SizeToken,
} from "@/lib/types";
import type { LucideProps } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

export interface NewsletterCTAProps {
  heading?: string;
  subheading?: string;
  /** Icon shown above the heading */
  icon?: React.ComponentType<LucideProps>;
  /** Background style: "solid" fills with color, "gradient" adds a sweep */
  variant?: "solid" | "gradient" | "outlined";
  /** Override the bg color (defaults to primary token) */
  color?: ColorProp;
  size?: SizeToken;
  formProps?: Omit<NewsletterFormProps, "color" | "size" | "layout">;
  /** Force form layout regardless of size */
  formLayout?: "row" | "col";
  disclaimer?: string;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const sectionPad: Record<SizeToken, string> = {
  xs: "py-8 px-4",
  sm: "py-10 px-4 sm:px-8",
  md: "py-12 px-4 sm:px-8 lg:px-16",
  lg: "py-16 px-4 sm:px-8 lg:px-20",
  xl: "py-20 px-4 sm:px-8 lg:px-24",
};

const headingSize: Record<SizeToken, string> = {
  xs: "text-xl",
  sm: "text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl",
  xl: "text-4xl sm:text-5xl",
};

const subSize: Record<SizeToken, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm sm:text-base",
  lg: "text-base sm:text-lg",
  xl: "text-lg sm:text-xl",
};

const iconSize: Record<SizeToken, number> = {
  xs: 20,
  sm: 24,
  md: 28,
  lg: 32,
  xl: 36,
};

const solidBg: Record<ColorToken, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-neutral",
};

const gradientBg: Record<ColorToken, string> = {
  primary: "bg-gradient-to-br from-primary to-primary/80",
  secondary: "bg-gradient-to-br from-secondary to-secondary/80",
  tertiary: "bg-gradient-to-br from-tertiary to-tertiary/80",
  success: "bg-gradient-to-br from-success to-success/80",
  warning: "bg-gradient-to-br from-warning to-warning/80",
  danger: "bg-gradient-to-br from-danger to-danger/80",
  info: "bg-gradient-to-br from-info to-info/80",
  neutral: "bg-gradient-to-br from-neutral to-neutral/80",
};

const outlinedBorder: Record<ColorToken, string> = {
  primary: "border-primary/30",
  secondary: "border-secondary/30",
  tertiary: "border-tertiary/30",
  success: "border-success/30",
  warning: "border-warning/30",
  danger: "border-danger/30",
  info: "border-info/30",
  neutral: "border-neutral/30",
};

/* ─── Component ──────────────────────────────────────────────── */

export function NewsletterCTA({
  heading = "Join the Rooted Community",
  subheading = "Receive exclusive early-access to sustainable product launches and tips for a grounded lifestyle.",
  icon: IconComp = Leaf,
  variant = "solid",
  color = "primary",
  size = "md",
  formProps,
  formLayout,
  disclaimer = "No spam. Unsubscribe any time.",
  className,
}: NewsletterCTAProps) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);

  const isSolid = variant === "solid" || variant === "gradient";
  const textOnColor = isSolid; // white text when background is colored

  return (
    <section
      className={cn(
        "w-full",
        variant === "solid" &&
          (isCustom ? "bg-[var(--ds-bg)]" : solidBg[colorToken]),
        variant === "gradient" &&
          (isCustom ? "bg-[var(--ds-bg)]" : gradientBg[colorToken]),
        variant === "outlined" &&
          "bg-surface border border-[var(--ds-border,theme(colors.border))]",
        variant === "outlined" && !isCustom && outlinedBorder[colorToken],
        "rounded-[var(--radius-ds-lg)] overflow-hidden",
        sectionPad[size],
        className,
      )}
      style={isCustom ? customColorVars(color) : undefined}
      aria-label={heading}
    >
      {/* Background texture blob (decorative) */}
      {isSolid && (
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-10"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 80% at 80% 20%, white, transparent)",
          }}
        />
      )}

      <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center gap-5 text-center">
        {/* Icon */}
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full p-3",
            textOnColor
              ? "bg-white/20"
              : isCustom
                ? "bg-[var(--ds-bg)]/10"
                : `bg-${colorToken}/10`,
          )}
          aria-hidden
        >
          <IconComp
            size={iconSize[size]}
            className={
              textOnColor
                ? "text-white"
                : isCustom
                  ? "text-[var(--ds-bg)]"
                  : `text-${colorToken}`
            }
            style={
              !textOnColor && isCustom ? customColorVars(color) : undefined
            }
          />
        </span>

        {/* Heading */}
        <h2
          className={cn(
            "font-bold tracking-tight",
            headingSize[size],
            textOnColor ? "text-white" : "text-text",
          )}
        >
          {heading}
        </h2>

        {/* Subheading */}
        {subheading && (
          <p
            className={cn(
              "leading-relaxed",
              subSize[size],
              textOnColor ? "text-white/80" : "text-text-muted",
            )}
          >
            {subheading}
          </p>
        )}

        {/* Newsletter form */}
        <div className="w-full max-w-md">
          <NewsletterForm
            {...formProps}
            layout={
              formLayout ?? (size === "xs" || size === "sm" ? "col" : "row")
            }
            color={
              textOnColor
                ? {
                    bg: "#ffffff",
                    ...(isCustom && color.bg ? { fg: color.bg } : {}),
                  }
                : color
            }
            size={size}
            {...(disclaimer ? { disclaimer } : {})}
          />
        </div>

        {/* Disclaimer */}
        {disclaimer && (
          <p
            className={cn(
              "text-xs",
              textOnColor ? "text-white/60" : "text-text-muted",
            )}
          >
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
