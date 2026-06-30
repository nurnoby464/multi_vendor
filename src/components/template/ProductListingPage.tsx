"use client";

import { useState } from "react";
import {
  ProductFilterSidebar,
  FilterTriggerButton,
  type FilterValues,
} from "@/components/organisms/ProductFilterSidebar";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { GRID_PRODUCTS, GRID_SORT_OPTIONS, PRODUCT_FILTER_SECTIONS } from "@/lib/mocData";

export function ProductListingPage() {
  const [filters, setFilters] = useState<FilterValues>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeCount = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  return (
    <div className="mx-auto  px-4 sm:px-6 py-6">
      {/* Mobile filter trigger — hidden on desktop via component's own `md:hidden` */}
      <div className="mb-4">
        <FilterTriggerButton
          activeCount={activeCount}
          onClick={() => setMobileFiltersOpen(true)}
          color="primary"
          size="md"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar: renders desktop-fixed + mobile-slideover internally */}
        <div className="w-64 shrink-0">
          <ProductFilterSidebar
            heading="Filter Products"
            sections={PRODUCT_FILTER_SECTIONS}
            value={filters}
            onChange={setFilters}
            onClear={() => console.log("filters cleared")}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
            color="primary"
            size="md"
          />
        </div>

        {/* Product grid */}
        <div className="flex-1">
          <ProductGrid
            heading="All Products"
            products={GRID_PRODUCTS}
            sortOptions={GRID_SORT_OPTIONS}
            defaultSortValue="featured"
            onSortChange={(v) => console.log("sort:", v)}
            onProductAddToCart={(id) => console.log("add:", id)}
            onProductClick={(id) => console.log("click:", id)}
            totalCount={GRID_PRODUCTS.length}
            color="primary"
            size="md"
          />
        </div>
      </div>
    </div>
  );
}