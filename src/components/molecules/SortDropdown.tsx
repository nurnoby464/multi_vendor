"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn, customColorVars } from "@/lib/utils";
import {
  isCustomColor,
  isCustomSize,
  type ColorProp,
  type ColorToken,
  type SizeProp,
  type SizeToken,
} from "@/lib/types";

export interface SortOption {
  value: string;
  label: string;
  /** Optional group/section label to visually separate options. */
  group?: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Prefix shown before the label, e.g. "Sort by:". */
  prefix?: string;
  color?: ColorProp;
  size?: SizeProp;
  /** Render as native <select> — better for mobile / simpler forms. */
  native?: boolean;
  disabled?: boolean;
  className?: string;
  /** aria-label for the control. */
  label?: string;
}

const sizeClasses: Record<SizeToken, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-[var(--radius-ds-sm)]",
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--radius-ds-sm)]",
  md: "h-10 px-3.5 text-sm gap-2 rounded-[var(--radius-ds-md)]",
  lg: "h-11 px-4 text-base gap-2 rounded-[var(--radius-ds-md)]",
  xl: "h-12 px-5 text-base gap-2.5 rounded-[var(--radius-ds-lg)]",
};

const borderFocus: Record<ColorToken, string> = {
  primary: "focus:border-primary focus:ring-primary/20",
  secondary: "focus:border-secondary focus:ring-secondary/20",
  tertiary: "focus:border-tertiary focus:ring-tertiary/20",
  success: "focus:border-success focus:ring-success/20",
  warning: "focus:border-warning focus:ring-warning/20",
  danger: "focus:border-danger focus:ring-danger/20",
  info: "focus:border-info focus:ring-info/20",
  neutral: "focus:border-neutral focus:ring-neutral/20",
};

export function SortDropdown({
  options,
  value,
  defaultValue,
  onChange,
  prefix = "Sort by:",
  color = "primary",
  size = "md",
  native = false,
  disabled = false,
  className,
  label = "Sort options",
}: SortDropdownProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const current = value !== undefined ? value : internalValue;
  const currentLabel = options.find((o) => o.value === current)?.label ?? "";
  const isCustom = isCustomColor(color);
  const isCustomSz = isCustomSize(size);
  const colorToken = isCustom ? "primary" : (color as ColorToken);
  const sizeToken = isCustomSz ? "md" : (size as SizeToken);

  function select(v: string) {
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
    setOpen(false);
  }

  React.useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);
  /* ── Custom dropdown ────────────────────────────────── */
  // Group options
  const groups = React.useMemo(() => {
    const map = new Map<string, SortOption[]>();
    for (const opt of options) {
      const g = opt.group ?? "__default__";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    }
    return map;
  }, [options]);
  
  /* ── Native <select> ────────────────────────────────── */
  if (native) {
    return (
      <div className={cn("relative inline-flex items-center", className)}>
        {prefix && (
          <span className="pointer-events-none absolute left-3 text-text-muted text-sm font-medium whitespace-nowrap">
            {prefix}&nbsp;
          </span>
        )}
        <select
          aria-label={label}
          value={current}
          disabled={disabled}
          onChange={(e) => select(e.target.value)}
          className={cn(
            "appearance-none border border-border bg-surface text-text",
            "focus:outline-none focus:ring-2",
            sizeClasses[sizeToken],
            borderFocus[colorToken],
            "pr-8",
            prefix && "pl-[calc(1.75rem_+_var(--prefix-width,0px))]",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          style={isCustom ? customColorVars(color) : undefined}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 text-text-muted"
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={cn("relative inline-block", className)}>
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex items-center border border-border bg-surface text-text",
          "transition-colors hover:bg-bg",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          sizeClasses[sizeToken],
          disabled && "opacity-50 cursor-not-allowed",
        )}
        style={isCustom ? customColorVars(color) : undefined}
      >
        {prefix && (
          <span className="text-text-muted font-normal whitespace-nowrap">
            {prefix}&nbsp;
          </span>
        )}
        <span className="font-medium whitespace-nowrap">{currentLabel}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn(
            "ml-auto shrink-0 text-text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className={cn(
            "absolute right-0 z-50 mt-1 min-w-full overflow-hidden",
            "rounded-[var(--radius-ds-md)] border border-border bg-surface",
            "shadow-[0_4px_20px_rgba(46,50,48,0.10)]",
            "max-h-60 overflow-y-auto",
            "py-1",
          )}
        >
          {Array.from(groups.entries()).map(([group, opts], gi) => (
            <React.Fragment key={group}>
              {group !== "__default__" && (
                <li
                  role="presentation"
                  className={cn(
                    "px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted",
                    gi > 0 && "mt-1 border-t border-border pt-2",
                  )}
                >
                  {group}
                </li>
              )}
              {opts.map((opt) => {
                const isSelected = opt.value === current;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => select(opt.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm",
                      "transition-colors",
                      isSelected
                        ? isCustom
                          ? "bg-[var(--ds-bg)]/10 text-[var(--ds-bg)] font-medium"
                          : `bg-${colorToken}/10 text-${colorToken} font-medium`
                        : "text-text hover:bg-bg",
                    )}
                    style={
                      isSelected && isCustom
                        ? customColorVars(color)
                        : undefined
                    }
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check size={14} aria-hidden className="shrink-0" />
                    )}
                  </li>
                );
              })}
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
