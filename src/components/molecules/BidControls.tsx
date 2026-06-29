"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { cn } from "@/lib/utils";
import type { ColorProp, SizeToken } from "@/lib/types";

export interface QuickBidOption {
  /** Label shown on the button, e.g. "+$50" */
  label: string;
  /** Dollar amount to add. */
  amount: number;
}

export interface BidControlsProps {
  /** Current leading bid value. */
  currentBid?: number;
  /** The minimum bid increment. */
  minIncrement?: number;
  /** User's current custom bid amount (controlled). */
  bidAmount?: number;
  defaultBidAmount?: number;
  onBidAmountChange?: (amount: number) => void;
  /** Quick-add presets, e.g. [{ label: "+$50", amount: 50 }, ...] */
  quickOptions?: QuickBidOption[];
  onPlaceBid?: (amount: number) => void;
  bidStatus?: "idle" | "loading" | "success" | "error";
  currency?: string;
  color?: ColorProp;
  size?: SizeToken;
  /** Disables all controls (e.g. auction ended). */
  disabled?: boolean;
  className?: string;
}

const DEFAULT_QUICK_OPTIONS: QuickBidOption[] = [
  { label: "+$50", amount: 50 },
  { label: "+$100", amount: 100 },
  { label: "+$250", amount: 250 },
];

export function BidControls({
  currentBid,
  minIncrement = 1,
  bidAmount,
  defaultBidAmount,
  onBidAmountChange,
  quickOptions = DEFAULT_QUICK_OPTIONS,
  onPlaceBid,
  bidStatus = "idle",
  currency = "$",
  color = "primary",
  size = "md",
  disabled = false,
  className,
}: BidControlsProps) {
  const base = currentBid ?? 0;
  const [internalBid, setInternalBid] = React.useState<number>(
    defaultBidAmount ?? base + minIncrement,
  );
  const [inputStr, setInputStr] = React.useState<string>(
    String(defaultBidAmount ?? base + minIncrement),
  );
  const [inputError, setInputError] = React.useState(false);

  const currentAmount = bidAmount !== undefined ? bidAmount : internalBid;

  function setAmount(n: number) {
    const clamped = Math.max(base + minIncrement, n);
    if (bidAmount === undefined) setInternalBid(clamped);
    setInputStr(String(clamped));
    onBidAmountChange?.(clamped);
    setInputError(false);
  }

  function handleQuick(delta: number) {
    setAmount(currentAmount + delta);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setInputStr(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      if (bidAmount === undefined) setInternalBid(parsed);
      onBidAmountChange?.(parsed);
      setInputError(parsed < base + minIncrement);
    } else {
      setInputError(true);
    }
  }

  function handleInputBlur() {
    const parsed = parseFloat(inputStr);
    if (isNaN(parsed) || parsed < base + minIncrement) {
      setAmount(base + minIncrement);
    } else {
      setAmount(parsed);
    }
  }

  function handlePlaceBid() {
    const parsed = parseFloat(inputStr);
    if (!isNaN(parsed) && parsed >= base + minIncrement) {
      onPlaceBid?.(parsed);
    }
  }

  const minBid = base + minIncrement;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Current bid info */}
      {typeof currentBid === "number" && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Current bid</span>
          <Price value={currentBid} currency={currency} size="lg" color={color} />
          <Badge color="neutral" variant="soft" size="xs">
            Min +{currency}{minIncrement}
          </Badge>
        </div>
      )}

      {/* Quick-bid buttons */}
      {quickOptions.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quick bid increments">
          {quickOptions.map((opt) => (
            <Button
              key={opt.label}
              variant="outline"
              color={color}
              size={size === "xl" ? "md" : size === "lg" ? "sm" : "xs"}
              icon={Plus}
              iconPosition="left"
              disabled={disabled || bidStatus === "loading"}
              onClick={() => handleQuick(opt.amount)}
              aria-label={`Add ${opt.label} to bid`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      )}

      {/* Custom amount input row */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-muted" htmlFor="bid-amount-input">
          Your bid amount
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-muted shrink-0">{currency}</span>
          <Input
            id="bid-amount-input"
            type="number"
            inputMode="decimal"
            min={minBid}
            step={minIncrement}
            value={inputStr}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            color={color}
            size={size}
            error={inputError}
            disabled={disabled || bidStatus === "loading"}
            aria-invalid={inputError}
            aria-describedby={inputError ? "bid-error" : undefined}
            className="flex-1"
          />
        </div>
        {inputError && (
          <p id="bid-error" className="text-xs text-danger" role="alert">
            Minimum bid is {currency}{minBid.toFixed(2)}
          </p>
        )}
      </div>

      {/* Place bid CTA */}
      <Button
        color={color}
        size={size}
        fullWidth
        status={bidStatus}
        label="Place Bid"
        loadingLabel="Placing bid…"
        successLabel="Bid placed!"
        errorLabel="Bid failed — retry"
        disabled={disabled || inputError}
        onClick={handlePlaceBid}
      />
    </div>
  );
}
