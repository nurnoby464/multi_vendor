"use client";

import { CategoryIconLink } from "@/components/molecules";
import { CategoryRail } from "@/components/organisms/CategoryRail";
import { HeroBanner } from "@/components/organisms/HeroBanner";
import { Navbar } from "@/components/organisms/Navbar";
import {
  BookOpen,
  Home,
  LeafIcon,
  Shirt,
  Smartphone,
  Utensils,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <HeroBanner
        eyebrow="NEW COLLECTION"
        headline="Grounded Living,"
        headlineAccent="Elevated Design."
        subheading="Bring the tranquility of nature into your home with our sustainably sourced electronics and artisanal kitchenware."
        actions={[
          {
            label: "Shop The Collection",
            href: "/collections/new",
            variant: "solid",
          },
          {
            label: "View Lookbook",
            href: "/lookbook",
            variant: "outline",
          },
        ]}
        backgroundColor="#2d4a22"
        color="primary"
        align="left"
        size="lg"
        minHeight="lg"
      />
      <div className="px-5 mt-3">
        <CategoryRail
          heading="Explore by Category"
          seeAllHref="/categories"
          items={[
            {
              id: "electronics",
              label: "Electronics",
              icon: Smartphone,
              src: "https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg",
            },
            { id: "home", label: "Home & Living", icon: Home },
            { id: "kitchen", label: "Kitchen", icon: Utensils },
            { id: "garden", label: "Garden", icon: LeafIcon },
            { id: "fashion", label: "Fashion", icon: Shirt },
            { id: "books", label: "Books", icon: BookOpen },
          ]}
          color="neutral"
          size="xl"
        />
      </div>
     
    </div>
  );
}
