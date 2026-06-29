"use client";

import * as React from "react";

/* ─── Hook ───────────────────────────────────────────────────── */

export interface UseCarouselOptions {
  count: number;
  /** How many items are visible per "page" (used for page-jump mode). */
  visibleCount?: number;
  loop?: boolean;
  autoPlayMs?: number;
}

export interface UseCarouselReturn {
  activeIndex: number;
  goTo: (i: number) => void;
  prev: () => void;
  next: () => void;
  canPrev: boolean;
  canNext: boolean;
}

export function useCarousel({
  count,
  visibleCount = 1,
  loop = false,
  autoPlayMs,
}: UseCarouselOptions): UseCarouselReturn {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const canPrev = loop ? count > 1 : activeIndex > 0;
  const canNext = loop ? count > 1 : activeIndex < count - 1;

  function goTo(i: number) {
    setActiveIndex(((i % count) + count) % count);
  }

  function prev() {
    setActiveIndex((cur) =>
      loop ? (cur - 1 + count) % count : Math.max(0, cur - 1),
    );
  }

  function next() {
    setActiveIndex((cur) =>
      loop ? (cur + 1) % count : Math.min(count - 1, cur + 1),
    );
  }

  /* Auto-play */
  React.useEffect(() => {
    if (!autoPlayMs || count < 2) return;
    const id = setInterval(next, autoPlayMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlayMs, count, activeIndex]);

  return { activeIndex, goTo, prev, next, canPrev, canNext };
}

/* ─── Touch Swipe Wrapper ────────────────────────────────────── */

export interface SwipeCarouselProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  className?: string;
  children: React.ReactNode;
}

export function SwipeCarousel({
  onSwipeLeft,
  onSwipeRight,
  threshold = 40,
  className,
  children,
}: SwipeCarouselProps) {
  const startXRef = React.useRef<number | null>(null);
  const startYRef = React.useRef<number | null>(null);
  const lockedRef = React.useRef<"h" | "v" | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    startXRef.current = touch.clientX;
    startYRef.current = touch.clientY;
    lockedRef.current = null;
  }

  function onTouchMove(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (!touch || startXRef.current === null || startYRef.current === null)
      return;

    const dx = touch.clientX - startXRef.current;
    const dy = touch.clientY - startYRef.current;
    if (!lockedRef.current) {
      lockedRef.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (lockedRef.current === "h") e.preventDefault();
  }

  function onTouchEnd(e: React.TouchEvent) {
    const touch = e.changedTouches[0];
    if (!touch || startXRef.current === null || lockedRef.current !== "h")
      return;

    const dx = touch.clientX - startXRef.current;
    if (Math.abs(dx) >= threshold) {
      if (dx < 0) onSwipeLeft?.();
      else onSwipeRight?.();
    }
    startXRef.current = null;
    startYRef.current = null;
    lockedRef.current = null;
  }

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
}
