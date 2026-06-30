"use client";

import { useState } from "react";
import { CategoryRail } from "@/components/organisms/CategoryRail";
import { HeroBanner } from "@/components/organisms/HeroBanner";
import {
  CATEGORY_ITEMS,
  BANNER_SLIDES,
  DEAL_TABS,
  DEAL_PRODUCTS,
  SEASON_TABS,
  SEASON_PRODUCTS,
  GRID_PRODUCTS,
  GRID_SORT_OPTIONS,
} from "@/lib/mocData";
import { DealCarousel } from "@/components/organisms/DealCarousel";
import { SeasonSavingsCarousel } from "@/components/organisms/SeasonSavingsCarousel";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { ProductListingPage } from "@/components/template/ProductListingPage";
import AuctionsPage from "@/components/template/AuctionsPage";
import PreOwnedSectionDemo from "@/components/template/PreOwnedSectionView";
import { HeroBannerCarousel } from "@/components/organisms/HeroBannerCarousel";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategoryId, setActiveCategoryId] = useState("electronics");

  const slide = BANNER_SLIDES[currentSlide];

  return (
    <main className="min-h-screen">
      
      {/* ── Hero Banner ─────────────────────────────────── */}
      <HeroBannerCarousel></HeroBannerCarousel>
     

      {/* ── Category Rail ────────────────────────────────── */}
      <section className="px-5 mt-15">
        <CategoryRail
          heading="Explore by Category"
          seeAllHref="/categories"
          items={CATEGORY_ITEMS}
          activeId={activeCategoryId}
          onSelect={setActiveCategoryId}
          color="secondary" // ✅ ring color follows active banner slide
          size="xl"
          showArrows
        />
      </section>

      <section className="mx-5 mt-20 bg-surface border border-border rounded-2xl shadow-sm">
        <div className="py-10 px-7">
          <DealCarousel
            heading="50% Off — Limited Time"
            subheading="Deals refreshed every 24 hours"
            eyebrow="Flash Sale"
            tabs={DEAL_TABS}
            products={DEAL_PRODUCTS}
            color="secondary"
            size="sm"
            autoPlayMs={5000}
            onProductClick={(id) => console.log("clicked:", id)}
            onProductAddToCart={(id) => console.log("add to cart:", id)}
          />
        </div>
      </section>
      <section className="mt-20 px-7 mx-auto">
        <SeasonSavingsCarousel
          heading="Discover Season Savings"
          subheading="Curated picks updated weekly"
          eyebrow="Editor's Pick"
          tabs={SEASON_TABS}
          products={SEASON_PRODUCTS}
          color="primary"
          size="md"
          autoPlayMs={5000}
          onProductClick={(id) => console.log("clicked:", id)}
          onProductAddToCart={(id) => console.log("add to cart:", id)}
        />
      </section>

      <ProductListingPage></ProductListingPage>
      <AuctionsPage></AuctionsPage>
      <section className="mt-20 mb-5 px-10 mx-auto">
        <PreOwnedSectionDemo></PreOwnedSectionDemo>
      </section>
      
    </main>
  );
}
