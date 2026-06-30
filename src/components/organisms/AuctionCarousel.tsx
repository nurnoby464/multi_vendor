// components/organisms/AuctionCarousel.tsx
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarousel, SwipeCarousel } from "./_carousel";
import { PaginationDots } from "@/components/molecules/PaginationDots";
import { cn } from "@/lib/utils";
import type { ColorProp, SizeToken } from "@/lib/types";

export interface AuctionCarouselProps<T extends { id: string }> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  autoPlayMs?: number;
  loop?: boolean;
  color?: ColorProp;
  size?: SizeToken;
  className?: string;
}

export function AuctionCarousel<T extends { id: string }>({
  items,
  renderItem,
  autoPlayMs = 6000,
  loop = true,
  color = "primary",
  size = "md",
  className,
}: AuctionCarouselProps<T>) {
  const count = items.length;
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [isPaused, setIsPaused] = React.useState(false);
  const [isTabVisible, setIsTabVisible] = React.useState(true);
  const [isInView, setIsInView] = React.useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const effectiveAutoPlayMs =
    isPaused || !isTabVisible || !isInView || prefersReducedMotion || count < 2
      ? undefined
      : autoPlayMs;

  const { activeIndex, goTo, prev, next, canPrev, canNext } = useCarousel({
    count,
    loop,
    ...(effectiveAutoPlayMs !== undefined ? { autoPlayMs: effectiveAutoPlayMs } : {}),
  });

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    const handler = () => setIsTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        // ✅ access index 0 explicitly and guard for undefined
        const entry = entries[0];
        if (entry !== undefined) {
          setIsInView(entry.isIntersecting);
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function handleMouseEnter() { setIsPaused(true); }
  function handleMouseLeave() { setIsPaused(false); }
  function handleFocusCapture() { setIsPaused(true); }
  function handleBlurCapture(e: React.FocusEvent<HTMLDivElement>) {
    const nextTarget = e.relatedTarget as Node | null;
    if (!nextTarget || !containerRef.current?.contains(nextTarget)) {
      setIsPaused(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  }

  if (count === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Live auctions"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      onKeyDown={handleKeyDown}
    >
      <div className="sr-only" aria-live="polite">
        {`Slide ${activeIndex + 1} of ${count}`}
      </div>

      <SwipeCarousel
        onSwipeLeft={next}
        onSwipeRight={prev}
        className="overflow-hidden rounded-[var(--radius-ds-lg)]"
      >
        <div
          className={cn(
            "flex",
            !prefersReducedMotion && "transition-transform duration-400 ease-out",
          )}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== activeIndex}
              className="w-full shrink-0 grow-0 basis-full"
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </SwipeCarousel>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous auction"
            onClick={prev}
            disabled={!canPrev}
            className={cn(
              "absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20",
              "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              "bg-surface/90 text-text border border-border shadow-sm backdrop-blur-sm",
              "hover:bg-surface transition-colors disabled:opacity-40 disabled:pointer-events-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            )}
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next auction"
            onClick={next}
            disabled={!canNext}
            className={cn(
              "absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20",
              "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              "bg-surface/90 text-text border border-border shadow-sm backdrop-blur-sm",
              "hover:bg-surface transition-colors disabled:opacity-40 disabled:pointer-events-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            )}
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </>
      )}

      {count > 1 && (
        <div className="flex justify-center mt-4">
          <PaginationDots
            count={count}
            activeIndex={activeIndex}
            onChange={goTo}
            color={color}
            size={size === "xl" ? "lg" : size === "xs" ? "xs" : "sm"}
            showArrows={false}
          />
        </div>
      )}
    </div>
  );
}