"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";
import type { ColorProp, SizeProp, SizeToken } from "@/lib/types";
import { isCustomSize } from "@/lib/types";

export interface SearchBarProps {
  /** Controlled value */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSearch?: ((value: string) => void) | undefined;
  onClear?: () => void;
  placeholder?: string;
  /** Show inline search submit button */
  showButton?: boolean;
  buttonLabel?: string;
  /** Dropdown suggestions list */
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  color?: ColorProp;
  size?: SizeProp;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  wrapperClassName?: string;
  /** aria-label for the search input */
  label?: string;
  radius?: string;
}

const buttonSizeMap: Record<SizeToken, SizeProp> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

export function SearchBar({
  value,
  defaultValue = "",
  onChange,
  onSearch,
  onClear,
  placeholder = "Search…",
  showButton = false,
  buttonLabel = "Search",
  suggestions = [],
  onSuggestionSelect,
  color = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  className,
  wrapperClassName,
  label = "Search",
  radius,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const currentValue = value !== undefined ? value : internalValue;
  const isCustomSz = isCustomSize(size);
  const btnSize = isCustomSz ? size : buttonSizeMap[size as SizeToken];

  const filteredSuggestions = React.useMemo(() => {
    if (!currentValue.trim()) return suggestions;
    const q = currentValue.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(q));
  }, [suggestions, currentValue]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIdx(-1);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    if (value === undefined) setInternalValue(v);
    onChange?.(v);
    setOpen(filteredSuggestions.length > 0);
    setActiveIdx(-1);
  }

  function handleClear() {
    if (value === undefined) setInternalValue("");
    onChange?.("");
    onClear?.();
    setOpen(false);
    setActiveIdx(-1);
  }

 function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || filteredSuggestions.length === 0) {
      if (e.key === "Enter") onSearch?.(currentValue);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      // ✅ Fix 2: guard against undefined
      const selected = filteredSuggestions[activeIdx];
      if (selected) {
        selectSuggestion(selected);
      } else {
        onSearch?.(currentValue);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  }

  function selectSuggestion(s: string) {
    if (value === undefined) setInternalValue(s);
    onChange?.(s);
    onSuggestionSelect?.(s);
    setOpen(false);
    setActiveIdx(-1);
  }

  const listId = React.useId();

  return (
    <div
      ref={wrapperRef}
      className={cn("relative flex items-center gap-2", wrapperClassName)}
    >
      {/* Input */}
      <div className={cn("relative flex-1", className)}>
        <Input
          aria-label={label}
          aria-autocomplete={suggestions.length ? "list" : undefined}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={
            activeIdx >= 0 ? `${listId}-opt-${activeIdx}` : undefined
          }
          leftIcon={Search}
          placeholder={placeholder}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0) setOpen(true);
          }}
          clearable={!!currentValue}
          onClear={handleClear}
          color={color}
          size={size}
          disabled={disabled || isLoading}
          className="w-full"
         {...(radius !== undefined && { radius })}
        />

        {/* Suggestions dropdown */}
        {open && filteredSuggestions.length > 0 && (
          <ul
            id={listId}
            ref={listRef}
            role="listbox"
            aria-label="Search suggestions"
            className={cn(
              "absolute z-50 mt-1 w-full overflow-hidden",
              "rounded-[var(--radius-ds-md)] border border-border bg-surface",
              "shadow-[0_4px_20px_rgba(46,50,48,0.10)]",
              "max-h-60 overflow-y-auto",
            )}
          >
            {filteredSuggestions.map((s, i) => (
              <li
                key={s}
                id={`${listId}-opt-${i}`}
                role="option"
                aria-selected={i === activeIdx}
                className={cn(
                  "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-text transition-colors",
                  i === activeIdx
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-bg",
                )}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep focus on input
                  selectSuggestion(s);
                }}
              >
                <Search
                  size={14}
                  className="shrink-0 text-text-muted"
                  aria-hidden
                />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Optional submit button */}
      {showButton && (
        <Button
          color={color}
          size={btnSize}
          disabled={disabled || isLoading}
          status={isLoading ? "loading" : "idle"}
          onClick={() => onSearch?.(currentValue)}
          aria-label={buttonLabel}
        >
          {buttonLabel}
        </Button>
      )}
    </div>
  );
}
