"use client";

import * as React from "react";
import { cn, customColorVars, customSizeVars } from "@/lib/utils";
import { isCustomColor, isCustomSize, type ColorProp, type ColorToken, type SizeProp, type SizeToken } from "@/lib/types";

const sizeClasses: Record<SizeToken, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};
const dotSizeClasses: Record<SizeToken, string> = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
};
const fallbackBg: Record<ColorToken, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  tertiary: "bg-tertiary text-tertiary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  info: "bg-info text-info-foreground",
  neutral: "bg-neutral text-neutral-foreground",
};
const statusDotColor: Record<"online" | "offline" | "busy" | "away", string> = {
  online: "bg-success",
  offline: "bg-neutral",
  busy: "bg-danger",
  away: "bg-warning",
};

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  /** Shown when there's no `src`, or while it fails to load. */
  name?: string;
  shape?: "circle" | "square";
  color?: ColorProp;
  size?: SizeProp;
  status?: "online" | "offline" | "busy" | "away";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function Avatar({ src, alt, name = "", shape = "circle", color = "primary", size = "md", status, className, ...props }: AvatarProps) {
  const [failed, setFailed] = React.useState(false);
  const isCustom = isCustomColor(color);
  const isCustomSz = isCustomSize(size);
  const showImage = src && !failed;

  return (
    <span
      className={cn("relative inline-flex shrink-0", !isCustomSz && sizeClasses[size as SizeToken], className)}
      style={customSizeVars(isCustomSz ? size : undefined)}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- generic atom, consumers may swap for next/image
        <img
          src={src}
          alt={alt ?? name}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", shape === "circle" ? "rounded-full" : "rounded-[var(--radius-ds-md)]")}
        />
      ) : (
        <span
          className={cn(
            "flex h-full w-full items-center justify-center font-semibold",
            shape === "circle" ? "rounded-full" : "rounded-[var(--radius-ds-md)]",
            isCustom ? "ds-custom-solid" : fallbackBg[color as ColorToken],
          )}
          style={customColorVars(color)}
        >
          {name ? initials(name) : null}
        </span>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-surface",
            dotSizeClasses[isCustomSz ? "md" : (size as SizeToken)],
            statusDotColor[status],
          )}
        />
      )}
    </span>
  );
}
