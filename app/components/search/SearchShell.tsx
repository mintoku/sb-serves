"use client";

import { useMemo, useState } from "react";
import SellerCard from "@/./app/components/search/SellerCard";
import SellerPreviewPanel from "@/app/components/search/SellerProfile";

export type Seller = {
  id: string;
  name: string;
  bio?: string;
  services?: string[];
  locationText?: string;
  priceStart?: number;
  rating?: number;
  reviewCount?: number;

  instagramHandle?: string;
  instagramPostUrls?: string[];
};

export default function SearchShell({ sellers }: { sellers: Seller[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedSeller = useMemo(
    () => sellers.find((s) => s.id === selectedId) ?? null,
    [sellers, selectedId]
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* MIDDLE: results list */}
      <div className="order-2 lg:order-1 col-span-12 lg:col-span-6 space-y-4">
        {sellers.map((seller) => (
          <button
            key={seller.id}
            type="button"
            onClick={() => setSelectedId(seller.id)}
            className="w-full text-left"
          >
            <div
              className={
                selectedId === seller.id
                  ? "rounded-2xl ring-2 ring-emerald-500 ring-offset-2 ring-offset-neutral-50"
                  : ""
              }
            >
              <SellerCard seller={seller} />
            </div>
          </button>
        ))}
      </div>

      {/* RIGHT: profile preview panel */}
      <aside className="order-1 lg:order-2 col-span-12 lg:col-span-6">
        <div className="sticky top-6">
          <SellerPreviewPanel seller={selectedSeller} />
        </div>
      </aside>
    </div>
  );
}
