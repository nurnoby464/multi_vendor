// app/auctions/page.tsx
"use client";

import { useCallback } from "react";
import { useState } from "react";
import { LiveAuctionPanel } from "@/components/organisms/LiveAuctionPanel";
import { AuctionCarousel } from "@/components/organisms/AuctionCarousel";
import { LIVE_AUCTIONS, MockAuction } from "@/lib/mocData";

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<MockAuction[]>(LIVE_AUCTIONS);

  const handleExpire = useCallback((id: string) => {
    setAuctions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ended: true } : a)),
    );
  }, []);

  const handlePlaceBid = useCallback((id: string, amount: number) => {
    setAuctions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, currentBid: amount } : a)),
    );
    // TODO: call your real API here
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 mt-15">
      <h2 className="text-3xl font-bold mb-6">Live Auctions</h2>
      <AuctionCarousel
        items={auctions}
        autoPlayMs={6000}
        color="primary"
        size="md"
        renderItem={(auction) => {
          const { id, bidControls, ...panelProps } = auction;
          return (
            <LiveAuctionPanel
              {...panelProps}
              onExpire={() => handleExpire(id)}
              {...(bidControls && {
                bidControls: {
                  ...bidControls,
                  onPlaceBid: (amount: number) => {
                    bidControls.onPlaceBid?.(amount);
                    handlePlaceBid(id, amount);
                  },
                },
              })}
            />
          );
        }}
      />
    </div>
  );
}
