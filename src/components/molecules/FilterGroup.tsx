"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

export interface FilterOption {
  value: string;
  label: string;
  /** Secondary descriptor, e.g. count "( 24 )". */
  count?: number;
  disabled?: boolean;
}

export interface FilterGroupProps {
  heading: string;
  options: FilterOption[];
  /** Controlled selected values. */
  value?: string[];
  defaultValue?: string[];
  onChange?: (selected: string[]) => void;
  /** Allow multiple selections (default) or single. */
  multiple?: boolean;
  color?: ColorProp;
  size?: SizeToken;
  /** Collapse after N items and show "Show more". */
  maxVisible?: number;
  /** Starts collapsed — clicking heading toggles body. */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

const checkboxSize: Record<SizeToken, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-5 w-5",
};
const labelSize: Record<SizeToken, string> = {
  xs: "text-xs",
  sm: "text-xs",
  md: "text-sm",
  lg: "text-sm",
  xl: "text-base",
};
const checkedBorder: Record<ColorToken, string> = {
  primary:   "border-primary bg-primary",
  secondary: "border-secondary bg-secondary",
  tertiary:  "border-tertiary bg-tertiary",
  success:   "border-success bg-success",
  warning:   "border-warning bg-warning",
  danger:    "border-danger bg-danger",
  info:      "border-info bg-info",
  neutral:   "border-neutral bg-neutral",
};
const focusRing: Record<ColorToken, string> = {
  primary:   "focus-visible:ring-primary/30",
  secondary: "focus-visible:ring-secondary/30",
  tertiary:  "focus-visible:ring-tertiary/30",
  success:   "focus-visible:ring-success/30",
  warning:   "focus-visible:ring-warning/30",
  danger:    "focus-visible:ring-danger/30",
  info:      "focus-visible:ring-info/30",
  neutral:   "focus-visible:ring-neutral/30",
};

export function FilterGroup({
  heading,
  options,
  value,
  defaultValue = [],
  onChange,
  multiple = true,
  color = "primary",
  size = "md",
  maxVisible = 6,
  collapsible = false,
  defaultCollapsed = false,
  className,
}: FilterGroupProps) {
  const [internalSelected, setInternalSelected] = React.useState<string[]>(defaultValue);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [showAll, setShowAll] = React.useState(false);

  const selected = value ?? internalSelected;

  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);

  function toggle(val: string) {
    let next: string[];
    if (multiple) {
      next = selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val];
    } else {
      next = selected[0] === val ? [] : [val];
    }
    if (value === undefined) setInternalSelected(next);
    onChange?.(next);
  }

  const visibleOptions = showAll ? options : options.slice(0, maxVisible);
  const hasMore = options.length > maxVisible;
  const selectedCount = selected.length;

  const groupId = React.useId();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Heading row */}
      <div
        className={cn(
          "flex items-center justify-between",
          collapsible && "cursor-pointer select-none",
        )}
        role={collapsible ? "button" : undefined}
        aria-expanded={collapsible ? !collapsed : undefined}
        aria-controls={collapsible ? groupId : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onClick={collapsible ? () => setCollapsed((c) => !c) : undefined}
        onKeyDown={
          collapsible
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCollapsed((c) => !c);
                }
              }
            : undefined
        }
      >
        <span className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text leading-none">{heading}</h3>
          {selectedCount > 0 && (
            <Badge color={color} variant="solid" size="xs">
              {selectedCount}
            </Badge>
          )}
        </span>
        {collapsible && (
          collapsed
            ? <ChevronDown size={16} className="text-text-muted" aria-hidden />
            : <ChevronUp size={16} className="text-text-muted" aria-hidden />
        )}
      </div>

      {/* Options list */}
      {(!collapsible || !collapsed) && (
        <ul id={groupId} role="group" aria-label={heading} className="flex flex-col gap-1">
          {visibleOptions.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <li key={opt.value}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-ds-sm)] py-1 px-1",
                    "transition-colors hover:bg-bg",
                    opt.disabled && "pointer-events-none opacity-50",
                  )}
                >
                  {/* Custom checkbox */}
                  <span className="relative flex shrink-0 items-center justify-center">
                    <input
                      type={multiple ? "checkbox" : "radio"}
                      checked={checked}
                      disabled={opt.disabled}
                      onChange={() => toggle(opt.value)}
                      aria-label={opt.label}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        "rounded-[var(--radius-ds-sm)] border-2 transition-colors duration-150",
                        "focus-visible:ring-2 focus-visible:ring-offset-1",
                        checkboxSize[size],
                        focusRing[colorToken],
                        checked
                          ? isCustom
                            ? "ds-custom-solid border-[var(--ds-bg)] bg-[var(--ds-bg)]"
                            : checkedBorder[colorToken]
                          : "border-border bg-surface",
                      )}
                      style={isCustom && checked ? customColorVars(color) : undefined}
                      aria-hidden
                    >
                      {/* Checkmark */}
                      {checked && (
                        <svg
                          viewBox="0 0 10 10"
                          className="absolute inset-0 h-full w-full p-0.5 text-white"
                          fill="none"
                          aria-hidden
                        >
                          <polyline
                            points="1.5,5 4,8 8.5,2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </span>

                  {/* Label + count */}
                  <span className="flex flex-1 items-center justify-between gap-2">
                    <span className={cn("text-text", labelSize[size])}>{opt.label}</span>
                    {typeof opt.count === "number" && (
                      <span className="text-xs text-text-muted tabular-nums">({opt.count})</span>
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {/* Show more / less */}
      {(!collapsible || !collapsed) && hasMore && (
        <button
          type="button"
          className={cn(
            "mt-0.5 self-start text-xs font-medium transition-colors",
            isCustom ? "text-[var(--ds-bg)]" : `text-${colorToken}`,
            "hover:opacity-80",
          )}
          style={isCustom ? customColorVars(color) : undefined}
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? "Show less" : `Show ${options.length - maxVisible} more`}
        </button>
      )}
    </div>
  );
}
