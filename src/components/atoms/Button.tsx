"use client";

import * as React from "react";
import { Loader2, type LucideProps } from "lucide-react";
import { cn, customColorVars, customSizeVars } from "@/lib/utils";
import {
  isCustomColor,
  isCustomSize,
  type ColorProp,
  type ColorToken,
  type SizeProp,
  type SizeToken,
} from "@/lib/types";
import { actionIconMap, actionLabelMap, type ButtonAction } from "@/lib/icon-map";
import { Icon } from "./Icon";

export type ButtonVariant = "solid" | "outline" | "ghost" | "soft";
/** idle = default state. loading/success are optional extra stages — use as many as the flow needs. */
export type ButtonStatus = "idle" | "loading" | "success" | "error";

const sizeClasses: Record<SizeToken, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-[var(--radius-ds-sm)]",
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-ds-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-ds-md)]",
  lg: "h-11 px-5 text-base gap-2 rounded-[var(--radius-ds-md)]",
  xl: "h-12 px-6 text-base gap-2.5 rounded-[var(--radius-ds-lg)]",
};
const iconOnlySizeClasses: Record<SizeToken, string> = {
  xs: "h-7 w-7 rounded-[var(--radius-ds-sm)]",
  sm: "h-8 w-8 rounded-[var(--radius-ds-sm)]",
  md: "h-10 w-10 rounded-[var(--radius-ds-md)]",
  lg: "h-11 w-11 rounded-[var(--radius-ds-md)]",
  xl: "h-12 w-12 rounded-[var(--radius-ds-lg)]",
};
const iconSizePx: Record<SizeToken, number> = { xs: 14, sm: 16, md: 18, lg: 20, xl: 22 };

const solid: Record<ColorToken, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
  tertiary: "bg-tertiary text-tertiary-foreground hover:bg-tertiary-hover",
  success: "bg-success text-success-foreground hover:brightness-95",
  warning: "bg-warning text-warning-foreground hover:brightness-95",
  danger: "bg-danger text-danger-foreground hover:brightness-95",
  info: "bg-info text-info-foreground hover:brightness-95",
  neutral: "bg-neutral text-neutral-foreground hover:brightness-95",
};
const outline: Record<ColorToken, string> = {
  primary: "border border-primary text-primary hover:bg-primary/10",
  secondary: "border border-secondary text-secondary hover:bg-secondary/10",
  tertiary: "border border-tertiary text-tertiary hover:bg-tertiary/10",
  success: "border border-success text-success hover:bg-success/10",
  warning: "border border-warning text-warning hover:bg-warning/10",
  danger: "border border-danger text-danger hover:bg-danger/10",
  info: "border border-info text-info hover:bg-info/10",
  neutral: "border border-neutral text-neutral hover:bg-neutral/10",
};
const ghost: Record<ColorToken, string> = {
  primary: "text-primary hover:bg-primary/10",
  secondary: "text-secondary hover:bg-secondary/10",
  tertiary: "text-tertiary hover:bg-tertiary/10",
  success: "text-success hover:bg-success/10",
  warning: "text-warning hover:bg-warning/10",
  danger: "text-danger hover:bg-danger/10",
  info: "text-info hover:bg-info/10",
  neutral: "text-neutral hover:bg-neutral/10",
};
const soft: Record<ColorToken, string> = {
  primary: "bg-primary/10 text-primary hover:bg-primary/15",
  secondary: "bg-secondary/10 text-secondary hover:bg-secondary/15",
  tertiary: "bg-tertiary/10 text-tertiary hover:bg-tertiary/15",
  success: "bg-success/10 text-success hover:bg-success/15",
  warning: "bg-warning/10 text-warning hover:bg-warning/15",
  danger: "bg-danger/10 text-danger hover:bg-danger/15",
  info: "bg-info/10 text-info hover:bg-info/15",
  neutral: "bg-neutral/10 text-neutral hover:bg-neutral/15",
};
const variantMap: Record<ButtonVariant, Record<ColorToken, string>> = { solid, outline, ghost, soft };
const customVariantClass: Record<ButtonVariant, string> = {
  solid: "ds-custom-solid border",
  outline: "ds-custom-outline border",
  ghost: "ds-custom-ghost",
  soft: "ds-custom-soft",
};

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  /** Built-in action — auto-fills icon + idle/loading/success labels (add, edit, delete, save, download, upload...). */
  action?: ButtonAction;
  /** Any lucide-react icon. Overrides the action's default icon. */
  icon?: React.ComponentType<LucideProps>;
  /** Put the icon after the label instead of before. */
  iconPosition?: "left" | "right";
  /** Square, label-less button (pass `aria-label` for accessibility). */
  iconOnly?: boolean;
  variant?: ButtonVariant;
  color?: ColorProp;
  size?: SizeProp;
  fullWidth?: boolean;
  /** Current lifecycle stage. Swaps both the label and (for "loading") the icon for a spinner. */
  status?: ButtonStatus;
  /** Idle label. Falls back to the action's default label, then to children. */
  label?: React.ReactNode;
  loadingLabel?: React.ReactNode;
  successLabel?: React.ReactNode;
  errorLabel?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      action,
      icon,
      iconPosition = "left",
      iconOnly = false,
      variant = "solid",
      color = "primary",
      size = "md",
      fullWidth = false,
      status = "idle",
      label,
      loadingLabel,
      successLabel,
      errorLabel,
      className,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const defaults = action ? actionLabelMap[action] : undefined;
    const resolvedLabel =
      status === "loading"
        ? loadingLabel ?? defaults?.loading ?? "Loading..."
        : status === "success"
          ? successLabel ?? defaults?.success ?? label ?? defaults?.idle ?? children
          : status === "error"
            ? errorLabel ?? label ?? defaults?.idle ?? children
            : label ?? defaults?.idle ?? children;

    const ButtonIcon = icon ?? (action ? actionIconMap[action] : undefined);
    const isCustom = isCustomColor(color);
    const isCustomSz = isCustomSize(size);

    const colorClass = isCustom
      ? customVariantClass[variant]
      : variantMap[variant][color as ColorToken];

    const sizeClass = isCustomSz ? "" : iconOnly ? iconOnlySizeClasses[size as SizeToken] : sizeClasses[size as SizeToken];
    const px = isCustomSz ? (size.iconSize ?? 18) : iconSizePx[size as SizeToken];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || status === "loading"}
        aria-busy={status === "loading"}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          colorClass,
          sizeClass,
          fullWidth && "w-full",
          className,
        )}
        style={{ ...customColorVars(color), ...customSizeVars(isCustomSz ? size : undefined) }}
        {...props}
      >
        {status === "loading" ? (
          <Loader2 size={px} className="animate-spin shrink-0" aria-hidden="true" />
        ) : (
          ButtonIcon && iconPosition === "left" && <Icon icon={ButtonIcon} size={px} />
        )}
        {!iconOnly && <span>{resolvedLabel}</span>}
        {ButtonIcon && iconPosition === "right" && status !== "loading" && <Icon icon={ButtonIcon} size={px} />}
      </button>
    );
  },
);
Button.displayName = "Button";
