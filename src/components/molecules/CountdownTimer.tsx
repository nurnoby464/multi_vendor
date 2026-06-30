"use client";

import * as React from "react";
import type { ColorProp, SizeToken } from "@/lib/types";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeLeft(targetDate: Date): TimeLeft {
  const total = Math.max(0, targetDate.getTime() - Date.now());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor(total / 1000 / 60 / 60);
  return { hours, minutes, seconds, total };
}

export interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  variant?: "clock" | "compact" | "minimal";
  color?: ColorProp;   // ✅ was: string
  size?: SizeToken;    // ✅ was: string
  showIcon?: boolean;  // ✅ was: missing
  className?: string;
}

export function CountdownTimer({
  targetDate,
  onExpire,
  variant = "clock",
  showIcon = true,
  className,
}: CountdownTimerProps) {
  const [mounted, setMounted] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState<TimeLeft>(() =>
    calcTimeLeft(targetDate),
  );

  React.useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(targetDate));
  }, [targetDate]);

  React.useEffect(() => {
    if (!mounted) return;
    if (timeLeft.total <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => {
      const next = calcTimeLeft(targetDate);
      setTimeLeft(next);
      if (next.total <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [mounted, targetDate, onExpire, timeLeft.total]);

  if (!mounted) {
    return (
      <div
        className={className}
        aria-live="polite"
        aria-label="Time remaining: loading"
      >
        <div className="flex items-center gap-1 font-mono tabular-nums">
          {showIcon && <span aria-hidden>🕐</span>}
          <span>--</span>
          <span>:</span>
          <span>--</span>
          <span>:</span>
          <span>--</span>
        </div>
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className={className}
      aria-live="polite"
      aria-label={`Time remaining: ${timeLeft.hours} hours ${timeLeft.minutes} minutes ${timeLeft.seconds} seconds`}
    >
      <div className="flex items-center gap-1 font-mono tabular-nums text-lg font-bold text-primary animate-pulse">
        {showIcon && <span aria-hidden>🕐</span>}
        <span>{pad(timeLeft.hours)}</span>
        <span>:</span>
        <span>{pad(timeLeft.minutes)}</span>
        <span>:</span>
        <span>{pad(timeLeft.seconds)}</span>
      </div>
    </div>
  );
}