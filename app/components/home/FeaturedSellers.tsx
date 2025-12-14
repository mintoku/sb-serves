// app/components/home/FeaturedSellers.tsx

import ListingCard from "@/app/components/search/SellerProfile";
import { headers } from "next/headers"; /* to get host (www.example.com to build url later*/

/**
 * Featured sellers section
 * - Reuses existing ListingCard
 */
export default async function FeaturedSellers({
  limit = 6,
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
  const sellers = Array.isArray(data?.sellers) ? data.sellers : [];

  const featured = sellers.slice(0, limit);

  if (featured.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">
        Featured sellers
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((seller) => (
          <ListingCard key={seller.id} seller={seller} />
        ))}
      </div>
    </section>
  );
}
