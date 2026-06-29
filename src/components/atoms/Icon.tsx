import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ColorProp, SizeToken } from "@/lib/types";
import { isCustomColor } from "@/lib/types";

const sizePx: Record<SizeToken, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 22,
  xl: 26,
};

const colorTextClass: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-neutral",
};

export interface IconProps extends Omit<LucideProps, "size" | "color"> {
  /** Any lucide-react icon component, e.g. `icon={Trash2}`. */
  icon: React.ComponentType<LucideProps>;
  /** Design-system size token, or an exact pixel number for a one-off. */
  size?: SizeToken | number;
  /** Design-system color token, or a `CustomColor` for a one-off brand color. */
  color?: ColorProp;
  className?: string;
}

/** The base Icon atom. Every other atom that shows an icon (Button, Input, Chip...) uses this internally. */
export function Icon({ icon: LucideIcon, size = "md", color, className, ...props }: IconProps) {
  const px = typeof size === "number" ? size : sizePx[size];
  const custom = isCustomColor(color);

  return (
    <LucideIcon
      size={px}
      strokeWidth={2}
      aria-hidden="true"
      className={cn(!custom && color ? colorTextClass[color] : undefined, className)}
      style={custom ? { color: color.fg ?? color.bg } : undefined}
      {...props}
    />
  );
}
