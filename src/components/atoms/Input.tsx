"use client";

import * as React from "react";
import { X, type LucideProps } from "lucide-react";
import { cn, customColorVars, customSizeVars } from "@/lib/utils";
import { isCustomColor, isCustomSize, type ColorProp, type ColorToken, type SizeProp, type SizeToken } from "@/lib/types";
import { Icon } from "./Icon";

const sizeClasses: Record<SizeToken, string> = {
  xs: "h-7 px-2.5 text-xs rounded-[var(--radius-ds-sm)]",
  sm: "h-8 px-3 text-sm rounded-[var(--radius-ds-sm)]",
  md: "h-10 px-3.5 text-sm rounded-[var(--radius-ds-md)]",
  lg: "h-11 px-4 text-base rounded-[var(--radius-ds-md)]",
  xl: "h-12 px-4.5 text-base rounded-[var(--radius-ds-lg)]",
};
const iconSizePx: Record<SizeToken, number> = { xs: 14, sm: 16, md: 18, lg: 18, xl: 20 };

const focusRing: Record<ColorToken, string> = {
  primary: "focus-within:border-primary focus-within:ring-primary/20",
  secondary: "focus-within:border-secondary focus-within:ring-secondary/20",
  tertiary: "focus-within:border-tertiary focus-within:ring-tertiary/20",
  success: "focus-within:border-success focus-within:ring-success/20",
  warning: "focus-within:border-warning focus-within:ring-warning/20",
  danger: "focus-within:border-danger focus-within:ring-danger/20",
  info: "focus-within:border-info focus-within:ring-info/20",
  neutral: "focus-within:border-neutral focus-within:ring-neutral/20",
};

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color"> {
  /** Optional icon shown on the left, inside the field (e.g. Search). */
  leftIcon?: React.ComponentType<LucideProps>;
  /**
   * Show a right-side clear ("x") button when there's a value. Either pass a
   * boolean (uses internal state if uncontrolled) or a handler to control it yourself.
   */
  clearable?: boolean;
  onClear?: () => void;
  color?: ColorProp;
  size?: SizeProp;
  error?: boolean;
  wrapperClassName?: string;
  radius?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      leftIcon,
      clearable = false,
      onClear,
      color = "primary",
      size = "md",
      error = false,
      radius,
      className,
      wrapperClassName,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
    const currentValue = value !== undefined ? value : internalValue;
    const showClear = clearable && !disabled && String(currentValue ?? "").length > 0;

    const isCustom = isCustomColor(color);
    const isCustomSz = isCustomSize(size);
    const px = isCustomSz ? (size.iconSize ?? 16) : iconSizePx[size as SizeToken];

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (value === undefined) setInternalValue(e.target.value);
      onChange?.(e);
    }

    function handleClear() {
      if (value === undefined) setInternalValue("");
      onClear?.();
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2 border bg-surface text-text transition-colors",
          "ring-0 focus-within:ring-2",
          error ? "border-danger focus-within:border-danger focus-within:ring-danger/20" : "border-border",
          !error && !isCustom && focusRing[color as ColorToken],
          !isCustomSz && sizeClasses[size as SizeToken],
          disabled && "opacity-50 cursor-not-allowed",
          wrapperClassName,
        )}
        style={{
          ...(!error ? customColorVars(color) : undefined),
          ...customSizeVars(isCustomSz ? size : undefined),
          ...(!error && isCustom ? { "--tw-ring-color": "var(--ds-bg)" } as React.CSSProperties : undefined),
          ...(radius && { borderRadius: radius }),
        }}
      >
        {leftIcon && <Icon icon={leftIcon} size={px} color="neutral" className="shrink-0 opacity-70" />}
        <input
          ref={ref}
          className={cn("flex-1 min-w-0 bg-transparent outline-none placeholder:text-text-muted disabled:cursor-not-allowed", className)}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          disabled={disabled}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            className="shrink-0 text-text-muted hover:text-text transition-colors"
          >
            <Icon icon={X} size={px} />
          </button>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
