import type { LucideIcon } from "lucide-react";

/** Preset semantic color tokens every component understands out of the box. */
export type ColorToken =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

/** Preset size scale shared by every component. */
export type SizeToken = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * One-off brand color for a single instance, when a preset token isn't enough.
 * e.g. <Button color={{ bg: "#ff5733" }}>Promo</Button>
 */
export interface CustomColor {
  /** Background / fill color. Any valid CSS color (hex, rgb, hsl...). */
  bg: string;
  /** Foreground (text/icon) color. Defaults to white. */
  fg?: string;
  /** Border color. Defaults to `bg`. */
  border?: string;
  /** Hover background. Defaults to `bg` (handled via color-mix in CSS). */
  hoverBg?: string;
}

/** Every color-accepting prop is either a design-system token or a custom override. */
export type ColorProp = ColorToken | CustomColor;

/** One-off size override for a single instance, when a preset isn't enough. */
export interface CustomSize {
  height?: string;
  paddingX?: string;
  paddingY?: string;
  fontSize?: string;
  iconSize?: number;
  gap?: string;
  radius?: string;
}

/** Every size-accepting prop is either a design-system token or a custom override. */
export type SizeProp = SizeToken | CustomSize;

export function isCustomColor(c?: ColorProp): c is CustomColor {
  return !!c && typeof c === "object";
}

export function isCustomSize(s?: SizeProp): s is CustomSize {
  return !!s && typeof s === "object";
}

export type IconType = LucideIcon;
