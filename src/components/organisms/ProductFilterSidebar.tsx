"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterGroup, type FilterGroupProps } from "@/components/molecules/FilterGroup";
import { Button } from "@/components/atoms/Button";
import { Divider } from "@/components/atoms/Divider";
import { Badge } from "@/components/atoms/Badge";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

/* ─── Types ──────────────────────────────────────────────────── */

export interface FilterSection {
  id: string;
  heading: string;
  options: FilterGroupProps["options"];
  multiple?: boolean;
  maxVisible?: number;
  defaultCollapsed?: boolean;
}

export interface FilterValues {
  [sectionId: string]: string[];
}

export interface ProductFilterSidebarProps {
  heading?: string;
  sections: FilterSection[];
  /** Controlled filter values */
  value?: FilterValues;
  defaultValue?: FilterValues;
  onChange?: (values: FilterValues) => void;
  onClear?: () => void;
  /** Mobile: sidebar becomes a slide-over panel */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  color?: ColorProp;
  size?: SizeToken;
  className?: string;
}

/* ─── Maps ───────────────────────────────────────────────────── */

const headingSize: Record<SizeToken, string> = {
  xs: "text-sm", sm: "text-sm", md: "text-base", lg: "text-lg", xl: "text-xl",
};

// const tokenBorderColor: Record<ColorToken, string> = {
//   primary: "focus:border-primary",
//   secondary: "focus:border-secondary",
//   tertiary: "focus:border-tertiary",
//   success: "focus:border-success",
//   warning: "focus:border-warning",
//   danger: "focus:border-danger",
//   info: "focus:border-info",
//   neutral: "focus:border-neutral",
// };

/* ─── Component ──────────────────────────────────────────────── */

export function ProductFilterSidebar({
  heading = "Filter Products",
  sections,
  value,
  defaultValue,
  onChange,
  onClear,
  mobileOpen = false,
  onMobileClose,
  color = "primary",
  size = "md",
  className,
}: ProductFilterSidebarProps) {
  const [internalValues, setInternalValues] = React.useState<FilterValues>(
    defaultValue ?? {},
  );
  const values = value ?? internalValues;

  const isCustom = isCustomColor(color);

  /* Total active filters count */
  const activeCount = Object.values(values).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  function handleSectionChange(sectionId: string, selected: string[]) {
    const next = { ...values, [sectionId]: selected };
    if (value === undefined) setInternalValues(next);
    onChange?.(next);
  }

  function handleClear() {
    const cleared: FilterValues = {};
    if (value === undefined) setInternalValues(cleared);
    onChange?.(cleared);
    onClear?.();
  }

  const sidebar = (
    <aside
      className={cn(
        "flex flex-col gap-5 bg-surface rounded-[var(--radius-ds-lg)] border border-border",
        "p-4 sm:p-5",
        className,
      )}
      aria-label={heading}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={size === "xs" ? 14 : size === "sm" ? 15 : size === "lg" || size === "xl" ? 18 : 16}
            className="text-text-muted shrink-0"
            aria-hidden
          />
          <h2 className={cn("font-semibold text-text", headingSize[size])}>
            {heading}
          </h2>
          {activeCount > 0 && (
            <Badge color={color} variant="solid" size="xs">
              {activeCount}
            </Badge>
          )}
        </div>

        {/* Mobile close */}
        <button
          type="button"
          aria-label="Close filters"
          onClick={onMobileClose}
          className={cn(
            "md:hidden inline-flex items-center justify-center rounded-md h-8 w-8",
            "text-text-muted hover:text-text hover:bg-bg transition-colors",
          )}
        >
          <X size={18} aria-hidden />
        </button>
      </div>

      <Divider />

      {/* Filter sections */}
      <div className="flex flex-col gap-5">
        {sections.map((section, i) => (
          <React.Fragment key={section.id}>
            <FilterGroup
              heading={section.heading}
              options={section.options}
              value={values[section.id] ?? []}
              onChange={(selected) => handleSectionChange(section.id, selected)}
              multiple={section.multiple ?? true}
              maxVisible={section.maxVisible ?? 6}
              collapsible
              defaultCollapsed={section.defaultCollapsed ?? false}
              color={color}
              size={size}
            />
            {i < sections.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>

      {/* Clear all */}
      {activeCount > 0 && (
        <>
          <Divider />
          <Button
            variant="ghost"
            color={color}
            size={size === "xl" ? "md" : size}
            fullWidth
            onClick={handleClear}
          >
            Clear All Filters
          </Button>
        </>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop: always visible */}
      <div className="hidden md:block">{sidebar}</div>

      {/* Mobile: slide-over panel */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal
          aria-label={heading}
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-label="Close filter panel"
            onClick={onMobileClose}
          />
          {/* Panel */}
          <div className="relative ml-auto h-full w-[min(340px,100vw)] overflow-y-auto bg-surface shadow-xl">
            <div className="p-4">{sidebar}</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Mobile trigger button ──────────────────────────────────── */

export interface FilterTriggerButtonProps {
  activeCount?: number;
  onClick?: () => void;
  color?: ColorProp;
  size?: SizeToken;
  label?: string;
  className?: string;
}

export function FilterTriggerButton({
  activeCount = 0,
  onClick,
  color = "primary",
  size = "md",
  label = "Filters",
  className,
}: FilterTriggerButtonProps) {
  return (
    <Button
      variant="outline"
      color={color}
      size={size}
      icon={SlidersHorizontal}
      onClick={onClick}
      className={cn("md:hidden", className)}
    >
      {label}
      {activeCount > 0 && (
        <Badge color={color} variant="solid" size="xs" className="ml-1">
          {activeCount}
        </Badge>
      )}
    </Button>
  );
}
