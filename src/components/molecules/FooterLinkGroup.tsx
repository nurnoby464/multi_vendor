import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

export interface FooterLink {
  label: string;
  href?: string;
  /** Open in new tab. */
  external?: boolean;
  /** Badge/tag appended after the label (e.g. "New", "Beta"). */
  tag?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  disabled?: boolean;
}

export interface FooterLinkGroupProps {
  heading: string;
  links: FooterLink[];
  color?: ColorProp;
  /** Heading size. */
  headingSize?: SizeToken;
  /** Link list text size. */
  linkSize?: SizeToken;
  /** Stack direction for the link list. */
  direction?: "col" | "row";
  className?: string;
}

const headingSizeClass: Record<SizeToken, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};
const linkSizeClass: Record<SizeToken, string> = {
  xs: "text-[10px]",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
};

const hoverClass: Record<ColorToken, string> = {
  primary:   "hover:text-primary",
  secondary: "hover:text-secondary",
  tertiary:  "hover:text-tertiary",
  success:   "hover:text-success",
  warning:   "hover:text-warning",
  danger:    "hover:text-danger",
  info:      "hover:text-info",
  neutral:   "hover:text-neutral",
};

export function FooterLinkGroup({
  heading,
  links,
  color = "primary",
  headingSize = "sm",
  linkSize = "sm",
  direction = "col",
  className,
}: FooterLinkGroupProps) {
  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Heading */}
      <h4
        className={cn(
          "font-semibold uppercase tracking-wider text-text",
          headingSizeClass[headingSize],
        )}
      >
        {heading}
      </h4>

      {/* Links */}
      <ul
        className={cn(
          "flex gap-2",
          direction === "col" ? "flex-col" : "flex-row flex-wrap",
        )}
      >
        {links.map((link) => {
          const sharedClass = cn(
            "inline-flex items-center gap-1 text-text-muted transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            "rounded-sm",
            isCustom ? "hover:text-[var(--ds-bg)]" : hoverClass[colorToken],
            linkSizeClass[linkSize],
            link.disabled && "pointer-events-none opacity-40 cursor-not-allowed",
          );
          const style = isCustom ? customColorVars(color) : undefined;
          const inner = (
            <>
              {link.label}
              {link.external && (
                <ExternalLink size={10} aria-label="(opens in new tab)" className="shrink-0 opacity-60" />
              )}
              {link.tag && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase",
                    isCustom
                      ? "bg-[var(--ds-bg)]/15 text-[var(--ds-bg)]"
                      : `bg-${colorToken}/10 text-${colorToken}`,
                  )}
                  style={style}
                >
                  {link.tag}
                </span>
              )}
            </>
          );

          return (
            <li key={link.label}>
              {link.href ? (
                <a
                  href={link.href}
                  className={sharedClass}
                  style={style}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  aria-disabled={link.disabled}
                  onClick={link.onClick as React.MouseEventHandler<HTMLAnchorElement>}
                >
                  {inner}
                </a>
              ) : (
                <button
                  type="button"
                  className={sharedClass}
                  style={style}
                  disabled={link.disabled}
                  onClick={link.onClick as React.MouseEventHandler<HTMLButtonElement>}
                >
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
