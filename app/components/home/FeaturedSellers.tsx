// app/components/home/FeaturedSellers.tsx

import ListingCard from "@/app/components/search/SellerProfile";
import { headers } from "next/headers"; /* to get host (www.example.com to build url later*/
import type { Seller } from "@/app/components/search/SearchShell";


/** Deterministic PRNG from a numeric seed */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable string -> uint32 hash */
function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

/** Fisher–Yates shuffle using a seeded RNG (deterministic) */
function seededShuffle<T>(arr: T[], seedStr: string) {
  const rnd = mulberry32(hashString(seedStr));
  const a = [...arr];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Featured sellers section (reuses existing ListingCard)
 */
export default async function FeaturedSellers({
  limit = 12,
}: {
  limit?: number;
}) {
  // build absolute URL (required for server components)
  const headersList = headers();
  const host = headersList.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/sellers?q=`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const sellers: Seller[] = Array.isArray(data?.sellers)
    ? (data.sellers as Seller[])
    : [];
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const featured = seededShuffle(sellers, today).slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Today's featured sellers
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((seller) => (
          <ListingCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}
