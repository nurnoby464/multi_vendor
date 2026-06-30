"use client";

import * as React from "react";
import {
  PreOwnedSection,
  type PreOwnedProduct,
  type PreOwnedTab,
} from "@/components/organisms/PreOwnedSection";
import { type ColorProp, type SizeToken } from "@/lib/types";

/* ─── Mock Tabs ───────────────────────────────────────────────── */

const MOCK_TABS: PreOwnedTab[] = [
  { id: "fashion", label: "Fashion" },
  { id: "electronics", label: "Electronics" },
  { id: "home", label: "Home" },
];

/* ─── Mock Products (12 items, 3 pages × 4) ──────────────────── */

const MOCK_PRODUCTS: PreOwnedProduct[] = [
 
  /* ══════════════════════════════════════════════
     FASHION  (p1 – p21)
  ══════════════════════════════════════════════ */
  {
    id: "p1", tabId: "fashion", condition: "Like New",
    title: "Levi's 501 Original Jeans",
    price: 1850, originalPrice: 4200, currency: "৳",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
    rating: 4.7, reviewCount: 312,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p2", tabId: "fashion", condition: "Good",
    title: "Nike Air Force 1 Low White",
    price: 3200, originalPrice: 8500, currency: "৳",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&q=80",
    rating: 4.5, reviewCount: 198, badges: [],
  },
  {
    id: "p3", tabId: "fashion", condition: "Fair",
    title: "Ralph Lauren Polo Shirt – Navy",
    price: 980, originalPrice: 3500, currency: "৳",
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80",
    rating: 4.1, reviewCount: 87,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p4", tabId: "fashion", condition: "Like New",
    title: "Zara Trench Coat – Camel",
    price: 4100, originalPrice: 9800, currency: "৳",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80",
    rating: 4.8, reviewCount: 421,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p5", tabId: "fashion", condition: "Good",
    title: "Adidas Ultraboost 22 – Black",
    price: 5200, originalPrice: 14000, currency: "৳",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80",
    rating: 4.6, reviewCount: 540,
    badges: [{ label: "Top Pick", color: "primary", variant: "soft" }],
  },
  {
    id: "p6", tabId: "fashion", condition: "Like New",
    title: "H&M Oversized Hoodie – Grey",
    price: 750, originalPrice: 2200, currency: "৳",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80",
    rating: 4.2, reviewCount: 63, badges: [],
  },
  {
    id: "p7", tabId: "fashion", condition: "Fair",
    title: "Uniqlo Ultra Light Down Jacket",
    price: 2800, originalPrice: 7500, currency: "৳",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=80",
    rating: 4.4, reviewCount: 177,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p8", tabId: "fashion", condition: "Like New",
    title: "Gucci Canvas Belt – Brown",
    price: 9800, originalPrice: 28000, currency: "৳",
    image: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?w=400&q=80",
    rating: 4.9, reviewCount: 830,
    badges: [{ label: "Luxury", color: "warning", variant: "soft" }],
  },
  {
    id: "p9", tabId: "fashion", condition: "Good",
    title: "Puma RS-X Sneakers – White/Red",
    price: 2400, originalPrice: 6800, currency: "৳",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
    rating: 4.3, reviewCount: 109, badges: [],
  },
  {
    id: "p10", tabId: "fashion", condition: "Like New",
    title: "Tommy Hilfiger Oxford Shirt – White",
    price: 1600, originalPrice: 4500, currency: "৳",
    image: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&q=80",
    rating: 4.5, reviewCount: 248, badges: [],
  },
  {
    id: "p11", tabId: "fashion", condition: "Good",
    title: "Dr. Martens 1460 Boots – Black",
    price: 6500, originalPrice: 16000, currency: "৳",
    image: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400&q=80",
    rating: 4.7, reviewCount: 392,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p12", tabId: "fashion", condition: "Fair",
    title: "Champion Reverse Weave Sweatpants",
    price: 900, originalPrice: 2800, currency: "৳",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
    rating: 4.0, reviewCount: 55,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p13", tabId: "fashion", condition: "Like New",
    title: "New Balance 990v5 – Grey",
    price: 7800, originalPrice: 19000, currency: "৳",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    rating: 4.8, reviewCount: 615,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p14", tabId: "fashion", condition: "Good",
    title: "Lululemon ABC Slim-Fit Pants",
    price: 3400, originalPrice: 9200, currency: "৳",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80",
    rating: 4.6, reviewCount: 281, badges: [],
  },
  {
    id: "p15", tabId: "fashion", condition: "Like New",
    title: "Calvin Klein Cotton Tee – Black",
    price: 620, originalPrice: 1800, currency: "৳",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
    rating: 4.3, reviewCount: 134, badges: [],
  },
  {
    id: "p16", tabId: "fashion", condition: "Fair",
    title: "Patagonia Fleece Pullover – Blue",
    price: 3200, originalPrice: 8800, currency: "৳",
    image: "https://images.unsplash.com/photo-1624378441864-6359c8a6e0d9?w=400&q=80",
    rating: 4.5, reviewCount: 207,
    badges: [{ label: "Eco", color: "success", variant: "soft" }],
  },
  {
    id: "p17", tabId: "fashion", condition: "Good",
    title: "Ray-Ban Wayfarer Sunglasses",
    price: 4200, originalPrice: 12000, currency: "৳",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
    rating: 4.7, reviewCount: 468,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p18", tabId: "fashion", condition: "Like New",
    title: "North Face Nuptse Puffer Jacket",
    price: 8500, originalPrice: 22000, currency: "৳",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80",
    rating: 4.9, reviewCount: 733,
    badges: [{ label: "Best Seller", color: "warning", variant: "soft" }],
  },
  {
    id: "p19", tabId: "fashion", condition: "Good",
    title: "Converse Chuck 70 High – Cream",
    price: 2100, originalPrice: 6500, currency: "৳",
    image: "https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=400&q=80",
    rating: 4.4, reviewCount: 322, badges: [],
  },
  {
    id: "p20", tabId: "fashion", condition: "Like New",
    title: "Polo Ralph Lauren Chino Pants",
    price: 2600, originalPrice: 7200, currency: "৳",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
    rating: 4.5, reviewCount: 189, badges: [],
  },
  {
    id: "p21", tabId: "fashion", condition: "Fair",
    title: "Vans Old Skool – Black/White",
    price: 1750, originalPrice: 4800, currency: "৳",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80",
    rating: 4.3, reviewCount: 276,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
 
  /* ══════════════════════════════════════════════
     ELECTRONICS  (p22 – p42)
  ══════════════════════════════════════════════ */
  {
    id: "p22", tabId: "electronics", condition: "Like New",
    title: "Apple AirPods Pro (2nd Gen)",
    price: 12500, originalPrice: 28000, currency: "৳",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fead85c?w=400&q=80",
    rating: 4.9, reviewCount: 1042,
    badges: [{ label: "Top Pick", color: "primary", variant: "soft" }],
  },
  {
    id: "p23", tabId: "electronics", condition: "Good",
    title: "Samsung Galaxy S23 – 128 GB",
    price: 38000, originalPrice: 72000, currency: "৳",
    image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400&q=80",
    rating: 4.6, reviewCount: 578, badges: [],
  },
  {
    id: "p24", tabId: "electronics", condition: "Fair",
    title: "Logitech MX Master 3 Mouse",
    price: 3800, originalPrice: 9500, currency: "৳",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    rating: 4.4, reviewCount: 233,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p25", tabId: "electronics", condition: "Like New",
    title: "Sony WH-1000XM5 Headphones",
    price: 22000, originalPrice: 48000, currency: "৳",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    rating: 4.8, reviewCount: 891,
    badges: [{ label: "Best Seller", color: "warning", variant: "soft" }],
  },
  {
    id: "p26", tabId: "electronics", condition: "Good",
    title: "iPad Air 5th Gen – 64 GB",
    price: 42000, originalPrice: 85000, currency: "৳",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
    rating: 4.7, reviewCount: 712,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p27", tabId: "electronics", condition: "Like New",
    title: "MacBook Air M2 – 8 GB / 256 GB",
    price: 95000, originalPrice: 145000, currency: "৳",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&q=80",
    rating: 4.9, reviewCount: 1380,
    badges: [{ label: "Premium", color: "warning", variant: "soft" }],
  },
  {
    id: "p28", tabId: "electronics", condition: "Good",
    title: "Kindle Paperwhite 11th Gen",
    price: 8500, originalPrice: 18000, currency: "৳",
    image: "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&q=80",
    rating: 4.6, reviewCount: 445, badges: [],
  },
  {
    id: "p29", tabId: "electronics", condition: "Fair",
    title: "GoPro Hero 11 Action Camera",
    price: 18000, originalPrice: 45000, currency: "৳",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80",
    rating: 4.5, reviewCount: 302,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p30", tabId: "electronics", condition: "Like New",
    title: "Nintendo Switch OLED – White",
    price: 32000, originalPrice: 58000, currency: "৳",
    image: "https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=400&q=80",
    rating: 4.8, reviewCount: 978,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p31", tabId: "electronics", condition: "Good",
    title: "Samsung 27\" 4K Monitor",
    price: 28000, originalPrice: 55000, currency: "৳",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=400&q=80",
    rating: 4.6, reviewCount: 387, badges: [],
  },
  {
    id: "p32", tabId: "electronics", condition: "Like New",
    title: "Apple Watch Series 8 – 45mm",
    price: 26000, originalPrice: 52000, currency: "৳",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
    rating: 4.7, reviewCount: 634,
    badges: [{ label: "Top Pick", color: "primary", variant: "soft" }],
  },
  {
    id: "p33", tabId: "electronics", condition: "Fair",
    title: "Bose SoundLink Revolve+ Speaker",
    price: 9200, originalPrice: 24000, currency: "৳",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    rating: 4.4, reviewCount: 214,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p34", tabId: "electronics", condition: "Good",
    title: "DJI Mini 3 Drone",
    price: 52000, originalPrice: 95000, currency: "৳",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&q=80",
    rating: 4.8, reviewCount: 521,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p35", tabId: "electronics", condition: "Like New",
    title: "Anker 65W GaN Charger (4-Port)",
    price: 2800, originalPrice: 6500, currency: "৳",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80",
    rating: 4.5, reviewCount: 188, badges: [],
  },
  {
    id: "p36", tabId: "electronics", condition: "Good",
    title: "Razer DeathAdder V3 Gaming Mouse",
    price: 4500, originalPrice: 11000, currency: "৳",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
    rating: 4.6, reviewCount: 342,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p37", tabId: "electronics", condition: "Like New",
    title: "Sony PlayStation 5 Slim",
    price: 68000, originalPrice: 95000, currency: "৳",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    rating: 4.9, reviewCount: 1650,
    badges: [{ label: "Best Seller", color: "warning", variant: "soft" }],
  },
  {
    id: "p38", tabId: "electronics", condition: "Fair",
    title: "Canon EOS M50 Mark II Camera",
    price: 35000, originalPrice: 72000, currency: "৳",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80",
    rating: 4.5, reviewCount: 289,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p39", tabId: "electronics", condition: "Good",
    title: "JBL Flip 6 Portable Speaker",
    price: 5800, originalPrice: 14000, currency: "৳",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    rating: 4.4, reviewCount: 411, badges: [],
  },
  {
    id: "p40", tabId: "electronics", condition: "Like New",
    title: "Xiaomi Mi Band 7 Pro",
    price: 3200, originalPrice: 7500, currency: "৳",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
    rating: 4.3, reviewCount: 156, badges: [],
  },
  {
    id: "p41", tabId: "electronics", condition: "Good",
    title: "Dell XPS 13 – Intel i7 / 16 GB",
    price: 82000, originalPrice: 140000, currency: "৳",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    rating: 4.7, reviewCount: 598,
    badges: [{ label: "Premium", color: "warning", variant: "soft" }],
  },
  {
    id: "p42", tabId: "electronics", condition: "Like New",
    title: "Elgato Stream Deck MK.2",
    price: 9800, originalPrice: 22000, currency: "৳",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    rating: 4.6, reviewCount: 267,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
 
  /* ══════════════════════════════════════════════
     HOME  (p43 – p62)
  ══════════════════════════════════════════════ */
  {
    id: "p43", tabId: "home", condition: "Like New",
    title: "IKEA KALLAX Shelf Unit – White",
    price: 5200, originalPrice: 11000, currency: "৳",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    rating: 4.5, reviewCount: 164, badges: [],
  },
  {
    id: "p44", tabId: "home", condition: "Good",
    title: "Philips Hue Starter Kit (3 Bulbs)",
    price: 3400, originalPrice: 7800, currency: "৳",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    rating: 4.3, reviewCount: 97,
    badges: [{ label: "Eco", color: "success", variant: "soft" }],
  },
  {
    id: "p45", tabId: "home", condition: "Fair",
    title: "Dyson V8 Cordless Vacuum",
    price: 18500, originalPrice: 42000, currency: "৳",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
    rating: 4.6, reviewCount: 345,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p46", tabId: "home", condition: "Like New",
    title: "Nespresso Vertuo Next Coffee Maker",
    price: 9200, originalPrice: 20000, currency: "৳",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    rating: 4.7, reviewCount: 512,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p47", tabId: "home", condition: "Good",
    title: "KitchenAid Stand Mixer – Red",
    price: 32000, originalPrice: 68000, currency: "৳",
    image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80",
    rating: 4.9, reviewCount: 1120,
    badges: [{ label: "Best Seller", color: "warning", variant: "soft" }],
  },
  {
    id: "p48", tabId: "home", condition: "Like New",
    title: "Instant Pot Duo 7-in-1 – 6 Qt",
    price: 7800, originalPrice: 18000, currency: "৳",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
    rating: 4.7, reviewCount: 876,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p49", tabId: "home", condition: "Good",
    title: "Ikea POÄNG Armchair – Birch",
    price: 4500, originalPrice: 10000, currency: "৳",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80",
    rating: 4.4, reviewCount: 203, badges: [],
  },
  {
    id: "p50", tabId: "home", condition: "Fair",
    title: "Rowenta Steam Iron – Pro",
    price: 2200, originalPrice: 6500, currency: "৳",
    image: "https://images.unsplash.com/photo-1558618047-f4e90d6e9e5f?w=400&q=80",
    rating: 4.2, reviewCount: 88,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p51", tabId: "home", condition: "Like New",
    title: "Philips Air Fryer XXL – 7.3 L",
    price: 14000, originalPrice: 32000, currency: "৳",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
    rating: 4.8, reviewCount: 694,
    badges: [{ label: "Top Pick", color: "primary", variant: "soft" }],
  },
  {
    id: "p52", tabId: "home", condition: "Good",
    title: "Braun Hand Blender – 800W",
    price: 3800, originalPrice: 9000, currency: "৳",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
    rating: 4.5, reviewCount: 141, badges: [],
  },
  {
    id: "p53", tabId: "home", condition: "Like New",
    title: "Sonos One Smart Speaker",
    price: 12000, originalPrice: 26000, currency: "৳",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    rating: 4.7, reviewCount: 482,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p54", tabId: "home", condition: "Good",
    title: "Eufy RoboVac G30 – Robot Vacuum",
    price: 16500, originalPrice: 38000, currency: "৳",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
    rating: 4.6, reviewCount: 319,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
  {
    id: "p55", tabId: "home", condition: "Fair",
    title: "MUJI Wooden Desk Organizer",
    price: 1200, originalPrice: 3200, currency: "৳",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&q=80",
    rating: 4.1, reviewCount: 72,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p56", tabId: "home", condition: "Like New",
    title: "Weber Q1200 Portable Gas Grill",
    price: 22000, originalPrice: 48000, currency: "৳",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    rating: 4.8, reviewCount: 557,
    badges: [{ label: "Best Seller", color: "warning", variant: "soft" }],
  },
  {
    id: "p57", tabId: "home", condition: "Good",
    title: "Bodum French Press – 1L",
    price: 1800, originalPrice: 4800, currency: "৳",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    rating: 4.5, reviewCount: 233, badges: [],
  },
  {
    id: "p58", tabId: "home", condition: "Like New",
    title: "Ring Video Doorbell (2nd Gen)",
    price: 8800, originalPrice: 19000, currency: "৳",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    rating: 4.6, reviewCount: 388,
    badges: [{ label: "Popular", color: "primary", variant: "soft" }],
  },
  {
    id: "p59", tabId: "home", condition: "Good",
    title: "IKEA LACK Side Table – Black",
    price: 1100, originalPrice: 2800, currency: "৳",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    rating: 4.2, reviewCount: 95, badges: [],
  },
  {
    id: "p60", tabId: "home", condition: "Fair",
    title: "Tefal Non-Stick Pan Set (3 pcs)",
    price: 2600, originalPrice: 7200, currency: "৳",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
    rating: 4.3, reviewCount: 118,
    badges: [{ label: "Sale", color: "danger", variant: "soft" }],
  },
  {
    id: "p61", tabId: "home", condition: "Like New",
    title: "Xiaomi Air Purifier 4 Pro",
    price: 12500, originalPrice: 28000, currency: "৳",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    rating: 4.7, reviewCount: 461,
    badges: [{ label: "Eco", color: "success", variant: "soft" }],
  },
  {
    id: "p62", tabId: "home", condition: "Good",
    title: "Umbra Trigg Floating Shelf Set",
    price: 3200, originalPrice: 7500, currency: "৳",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    rating: 4.4, reviewCount: 174,
    badges: [{ label: "Trending", color: "warning", variant: "soft" }],
  },
];

/* ─── Control Config ─────────────────────────────────────────── */

const COLOR_OPTIONS = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
] as const;
type ColorOption = (typeof COLOR_OPTIONS)[number];

const SIZE_OPTIONS: SizeToken[] = ["xs", "sm", "md", "lg", "xl"];

/* ─── Demo Wrapper ───────────────────────────────────────────── */

export default function PreOwnedSectionDemo() {
  const [color, setColor] = React.useState<ColorOption>("primary");
  const [size, setSize] = React.useState<SizeToken>("md");
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [tabsOn, setTabsOn] = React.useState(true);

  return (
    <div>
      {/* ── Control Panel ── */}
      {false && (
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-3">
            Demo Controls
          </p>
          <div className="flex flex-wrap gap-6 p-4 rounded-xl border border-border bg-surface shadow-sm">
            {/* Color */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                color
              </label>
              <div className="flex gap-1.5">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={[
                      "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                      color === c
                        ? "bg-primary text-white border-primary"
                        : "border-border text-text-muted hover:border-primary hover:text-primary",
                    ].join(" ")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                size
              </label>
              <div className="flex gap-1.5">
                {SIZE_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={[
                      "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                      size === s
                        ? "bg-primary text-white border-primary"
                        : "border-border text-text-muted hover:border-primary hover:text-primary",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* AutoPlay */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                autoPlay (3 s)
              </label>
              <button
                onClick={() => setAutoPlay((v) => !v)}
                className={[
                  "px-4 py-1 rounded-full text-xs font-semibold border transition-all",
                  autoPlay
                    ? "bg-success text-white border-success"
                    : "border-border text-text-muted hover:border-success hover:text-success",
                ].join(" ")}
              >
                {autoPlay ? "ON" : "OFF"}
              </button>
            </div>

            {/* Tabs toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-text-muted">
                tab filtering
              </label>
              <button
                onClick={() => setTabsOn((v) => !v)}
                className={[
                  "px-4 py-1 rounded-full text-xs font-semibold border transition-all",
                  tabsOn
                    ? "bg-primary text-white border-primary"
                    : "border-border text-text-muted hover:border-primary hover:text-primary",
                ].join(" ")}
              >
                {tabsOn ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Active prop summary */}
          <p className="mt-2 text-xs text-text-muted font-mono">
            {`<PreOwnedSection color="${color}" size="${size}"${autoPlay ? " autoPlayMs={3000}" : ""}${tabsOn ? " tabs={MOCK_TABS}" : ""} />`}
          </p>
        </div>
      )}

      {/* ── Live Component ── */}
      <div>

        <PreOwnedSection
          heading="Pre-Owned Picks"
          subheading="Expertly refurbished products that deserve a second life. Reduced environmental impact, incredible value."
          eyebrow="Sustainable Style"
          tabs={MOCK_TABS}
          products={MOCK_PRODUCTS}
          color="secondary"
          size="md"
          // autoPlayMs={30000}
          onProductAddToCart={(id) => console.log("Add to cart:", id)}
          onProductClick={(id) => console.log("Product clicked:", id)}
        />
      </div>
    </div>
  );
}
