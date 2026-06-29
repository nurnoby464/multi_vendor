import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CSSProperties } from "react";
import {
  isCustomColor,
  isCustomSize,
  type ColorProp,
  type SizeProp,
} from "./types";

/** Merge Tailwind classes safely (later classes win, no duplicate/conflicting utilities). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a one-off `CustomColor` into the CSS variables that `.ds-custom-*`
 * utility classes (defined in styles/theme.css) read from. Returns undefined
 * for preset tokens — those are handled entirely by static Tailwind classes.
 */
export function customColorVars(color?: ColorProp): CSSProperties | undefined {
  if (!isCustomColor(color)) return undefined;
  return {
    "--ds-bg": color.bg,
    "--ds-fg": color.fg ?? "#ffffff",
    "--ds-border": color.border ?? color.bg,
    "--ds-bg-hover": color.hoverBg ?? color.bg,
  } as CSSProperties;
}

/**
 * Converts a one-off `CustomSize` into inline style overrides. Returns undefined
 * for preset tokens — those are handled entirely by static Tailwind classes.
 */
export function customSizeVars(size?: SizeProp): CSSProperties | undefined {
  if (!isCustomSize(size)) return undefined;
  return {
    height: size.height,
    paddingLeft: size.paddingX,
    paddingRight: size.paddingX,
    paddingTop: size.paddingY,
    paddingBottom: size.paddingY,
    fontSize: size.fontSize,
    gap: size.gap,
    borderRadius: size.radius,
  };
}

export function isToken<T extends string>(value: T | object): value is T {
  return typeof value === "string";
}
