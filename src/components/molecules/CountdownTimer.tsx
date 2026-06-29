"use client";

import * as React from "react";
import { Timer } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { cn, customColorVars } from "@/lib/utils";
import { isCustomColor, type ColorProp, type ColorToken, type SizeToken } from "@/lib/types";

export interface CountdownTimerProps {
  /** Target datetime (JS Date or ISO string). */
  targetDate: Date | string;
  /** Called when the timer reaches zero. */
  onExpire?: () => void;
  /** Display style. "clock" = HH:MM:SS segment display; "badge" = inline compact badge. */
  variant?: "clock" | "badge" | "inline";
  color?: ColorProp;
  size?: SizeToken;
  /** Show the timer icon. */
  showIcon?: boolean;
  /** Custom expired message. */
  expiredLabel?: string;
  /** Label above/before the clock, e.g. "Ends in". */
  label?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(target: Date): TimeLeft {
  const total = Math.max(0, target.getTime() - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, total };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const segmentSize: Record<SizeToken, { num: string; label: string }> = {
  xs: { num: "text-base font-bold", label: "text-[9px]" },
  sm: { num: "text-lg font-bold", label: "text-[10px]" },
  md: { num: "text-2xl font-bold", label: "text-[11px]" },
  lg: { num: "text-3xl font-bold", label: "text-xs" },
  xl: { num: "text-4xl font-bold", label: "text-sm" },
};

const colorClass: Record<ColorToken, string> = {
  primary:   "text-primary",
  secondary: "text-secondary",
  tertiary:  "text-tertiary",
  success:   "text-success",
  warning:   "text-warning",
  danger:    "text-danger",
  info:      "text-info",
  neutral:   "text-neutral",
};

export function CountdownTimer({
  targetDate,
  onExpire,
  variant = "clock",
  color = "danger",
  size = "md",
  showIcon = true,
  expiredLabel = "Auction ended",
  label,
  className,
}: CountdownTimerProps) {
  const target = React.useMemo(
    () => (targetDate instanceof Date ? targetDate : new Date(targetDate)),
    [targetDate],
  );

  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(() => calcTimeLeft(target));
  const expiredRef = React.useRef(false);

  React.useEffect(() => {
    if (timeLeft.total <= 0) return;
    const id = setInterval(() => {
      const next = calcTimeLeft(target);
      setTimeLeft(next);
      if (next.total <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target, onExpire, timeLeft.total]);

  const isCustom = isCustomColor(color);
  const colorToken = isCustom ? "primary" : (color as ColorToken);
  const expired = timeLeft.total <= 0;
  const urgency = !expired && timeLeft.total < 60 * 60 * 1000; // < 1 hour

  /* ── Badge variant ─────────────────────────────────── */
  if (variant === "badge") {
    const display = expired
      ? expiredLabel
      : timeLeft.days > 0
        ? `${timeLeft.days}d ${pad(timeLeft.hours)}h`
        : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;

    return (
      <Badge
        color={expired ? "neutral" : urgency ? "danger" : color}
        variant="soft"
        size={size}
        dot={!expired}
        className={cn(urgency && !expired && "animate-pulse", className)}
      >
        {showIcon && !expired && <Timer size={12} aria-hidden />}
        {display}
      </Badge>
    );
  }

  /* ── Inline variant ────────────────────────────────── */
  if (variant === "inline") {
    if (expired) return <span className={cn("text-text-muted text-sm", className)}>{expiredLabel}</span>;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-mono font-semibold tabular-nums",
          isCustom ? "text-[var(--ds-bg)]" : colorClass[colorToken],
          urgency && "animate-pulse",
          className,
        )}
        style={isCustom ? customColorVars(color) : undefined}
        aria-live="polite"
        aria-label={`Time remaining: ${timeLeft.hours} hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`}
      >
        {showIcon && <Timer size={14} aria-hidden />}
        {timeLeft.days > 0 && <>{timeLeft.days}d&nbsp;</>}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
    );
  }

  /* ── Clock variant (default) ───────────────────────── */
  const { num: numClass, label: lblClass } = segmentSize[size];

  if (expired) {
    return (
      <div className={cn("flex items-center gap-2 text-text-muted", className)}>
        {showIcon && <Timer size={16} aria-hidden />}
        <span className="text-sm font-medium">{expiredLabel}</span>
      </div>
    );
  }

  const segments = [
    ...(timeLeft.days > 0 ? [{ value: timeLeft.days, label: "Days" }] : []),
    { value: timeLeft.hours, label: "Hrs" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  return (
    <div
      className={cn("flex flex-col gap-1.5", className)}
      aria-live="polite"
      aria-label={`Time remaining: ${timeLeft.hours} hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`}
    >
      {(label || showIcon) && (
        <div className="flex items-center gap-1.5 text-text-muted">
          {showIcon && <Timer size={14} aria-hidden />}
          {label && <span className="text-xs font-medium">{label}</span>}
        </div>
      )}

      <div className="flex items-center gap-1">
        {segments.map((seg, i) => (
          <React.Fragment key={seg.label}>
            {/* Segment block */}
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "font-mono tabular-nums leading-none",
                  numClass,
                  isCustom ? "text-[var(--ds-bg)]" : colorClass[colorToken],
                  urgency && "animate-pulse",
                )}
                style={isCustom ? customColorVars(color) : undefined}
              >
                {pad(seg.value)}
              </span>
              <span className={cn("text-text-muted uppercase tracking-wide", lblClass)}>
                {seg.label}
              </span>
            </div>

            {/* Colon separator (except after last) */}
            {i < segments.length - 1 && (
              <span
                className={cn(
                  "mb-3 font-mono font-bold leading-none select-none",
                  numClass,
                  isCustom ? "text-[var(--ds-bg)]" : colorClass[colorToken],
                  "animate-[blink_1s_step-start_infinite]",
                )}
                style={isCustom ? customColorVars(color) : undefined}
                aria-hidden
              >
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
