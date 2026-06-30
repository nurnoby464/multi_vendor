// components/organisms/HeroBannerCarousel.tsx
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroBanner } from "@/components/organisms/HeroBanner";
import { useCarousel, SwipeCarousel } from "./_carousel";
import { PaginationDots } from "@/components/molecules/PaginationDots";
import { cn } from "@/lib/utils";
import { BANNER_SLIDES } from "@/lib/mocData";

export function HeroBannerCarousel() {
  const count = BANNER_SLIDES.length;
  const [isPaused, setIsPaused] = React.useState(false);

  const { activeIndex, goTo, prev, next, canPrev, canNext } = useCarousel({
    count,
    loop: true,
    ...(isPaused ? {} : { autoPlayMs: 5000 }),
  });

  const slide = BANNER_SLIDES[activeIndex];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <SwipeCarousel onSwipeLeft={next} onSwipeRight={prev}>
        <HeroBanner
          key={activeIndex}
          eyebrow={slide?.eyebrow ?? ""}
          headline={slide?.headline ?? ""}
          headlineAccent={slide?.headlineAccent ?? ""}
          subheading={slide?.subheading ?? ""}
          backgroundImage={slide?.backgroundImage ?? ""}
          overlayOpacity={slide?.overlayOpacity ?? 0}
          backgroundColor={slide?.backgroundColor ?? ""}
          color={slide?.color ?? "neutral"}
          align={slide?.align ?? "left"}
          size={slide?.size ?? "sm"}
          minHeight={slide?.minHeight ?? "lg"}
          actions={slide?.actions ?? []}
        />
      </SwipeCarousel>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            disabled={!canPrev}
            className={cn(
              "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20",
              "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              "bg-white/90 text-text border border-border shadow-sm backdrop-blur-sm",
              "hover:bg-white transition-colors disabled:opacity-40 disabled:pointer-events-none",
            )}
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            disabled={!canNext}
            className={cn(
              "absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20",
              "inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full",
              "bg-white/90 text-text border border-border shadow-sm backdrop-blur-sm",
              "hover:bg-white transition-colors disabled:opacity-40 disabled:pointer-events-none",
            )}
          >
            <ChevronRight size={18} aria-hidden />
          </button>

          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20">
            <PaginationDots
              count={count}
              activeIndex={activeIndex}
              onChange={goTo}
              color={slide?.color ?? "neutral"}
              size="sm"
              showArrows={false}
            />
          </div>
        </>
      )}
    </div>
  );
}