"use client";

import * as React from "react";
import { FooterLinkGroup, type FooterLinkGroupProps } from "@/components/molecules/FooterLinkGroup";
import { Divider } from "@/components/atoms/Divider";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";
import type { LucideProps } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

export interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType<LucideProps>;
}

export interface FooterProps {
  /** Brand logo node */
  logo?: React.ReactNode;
  brandName?: string;
  tagline?: string;
  copyright?: string;
  /** Link column groups */
  linkGroups?: FooterLinkGroupProps[];
  socialLinks?: SocialLink[];
  /** Additional bottom bar content (e.g. legal links) */
  bottomLinks?: { label: string; href: string }[];
  /** "dark" = dark background, "light" = surface, "colored" = primary color */
  variant?: "light" | "dark" | "colored";
  color?: ColorProp;
  size?: SizeToken;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const padY: Record<SizeToken, string> = {
  xs: "py-8",
  sm: "py-10",
  md: "py-12",
  lg: "py-14",
  xl: "py-16",
};

const brandSize: Record<SizeToken, string> = {
  xs: "text-base",
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl",
};

const taglineSize: Record<SizeToken, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
};

const iconSize: Record<SizeToken, number> = {
  xs: 14, sm: 16, md: 18, lg: 20, xl: 22,
};

const socialBtnSize: Record<SizeToken, string> = {
  xs: "h-7 w-7",
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
  xl: "h-11 w-11",
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

/* ─── Component ──────────────────────────────────────────────── */

export function Footer({
  logo,
  brandName = "Brand",
  tagline,
  copyright,
  linkGroups = [],
  socialLinks = [],
  bottomLinks = [],
  variant = "light",
  color = "primary",
  size = "md",
  className,
}: FooterProps) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);
  const isColored = variant === "colored";
  const isDark = variant === "dark" || isColored;

  const currentYear = new Date().getFullYear();
  const resolvedCopyright = copyright ?? `© ${currentYear} ${brandName}. All rights reserved.`;

  return (
    <footer
      className={cn(
        "w-full",
        variant === "light" && "bg-surface border-t border-border",
        variant === "dark" && "bg-[#1a1f1c] text-white",
        isColored && (isCustom ? "bg-[var(--ds-bg)] text-white" : `${solidBg[colorToken]} text-white`),
        className,
      )}
      style={isCustom && isColored ? customColorVars(color) : undefined}
      aria-label="Site footer"
    >
      <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", padY[size])}>
        {/* Main grid */}
        <div
          className={cn(
            "grid gap-8",
            linkGroups.length === 0
              ? "grid-cols-1"
              : linkGroups.length <= 2
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr]"
                : linkGroups.length <= 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr]"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_1fr]",
          )}
        >
          {/* Brand column */}
          <div className="flex flex-col gap-4 max-w-xs">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {logo ?? (
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-lg",
                    "text-sm font-bold",
                    isDark ? "bg-white/20 text-white" : (isCustom ? "bg-[var(--ds-bg)]/15 text-[var(--ds-bg)]" : `bg-${colorToken}/15 text-${colorToken}`),
                  )}
                  style={!isDark && isCustom ? customColorVars(color) : undefined}
                >
                  {brandName.charAt(0).toUpperCase()}
                </span>
              )}
              <span
                className={cn(
                  "font-bold",
                  brandSize[size],
                  isDark ? "text-white" : "text-text",
                )}
              >
                {brandName}
              </span>
            </div>

            {/* Tagline */}
            {tagline && (
              <p
                className={cn(
                  "leading-relaxed",
                  taglineSize[size],
                  isDark ? "text-white/60" : "text-text-muted",
                )}
              >
                {tagline}
              </p>
            )}

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center rounded-full transition-colors",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                      socialBtnSize[size],
                      isDark
                        ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                        : isCustom
                          ? "bg-[var(--ds-bg)]/10 text-[var(--ds-bg)] hover:bg-[var(--ds-bg)]/20"
                          : `bg-${colorToken}/10 text-${colorToken} hover:bg-${colorToken}/20`,
                    )}
                    style={!isDark && isCustom ? customColorVars(color) : undefined}
                  >
                    <social.icon size={iconSize[size]} aria-hidden />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link groups */}
          {linkGroups.map((group) => (
            <FooterLinkGroup
              key={group.heading}
              {...group}
              color={isDark ? { bg: "#ffffff", fg: "#1a1f1c" } : color}
              headingSize={size === "xl" ? "md" : size === "xs" ? "xs" : "sm"}
              linkSize={size === "xl" ? "md" : size === "xs" ? "xs" : "sm"}
            />
          ))}
        </div>

        {/* Bottom bar */}
        <Divider className={cn("my-6", isDark ? "bg-white/10" : undefined)} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            className={cn(
              "text-xs",
              isDark ? "text-white/40" : "text-text-muted",
            )}
          >
            {resolvedCopyright}
          </p>

          {bottomLinks.length > 0 && (
            <nav aria-label="Legal links" className="flex flex-wrap gap-4">
              {bottomLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-xs transition-colors",
                    isDark
                      ? "text-white/40 hover:text-white/70"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
