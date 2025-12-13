// app/search/page.tsx

import ListingCard from "@/app/components/search/ListingCard";
import SearchBar from "@/app/components/search/SearchBar";
import { headers } from "next/headers";


/**
 * Search results page (Server Component)
 * -------------------------------------
 * - Uses Next.js App Router
 * - Runs on the SERVER by default
 * - Receives URL query params via `searchParams`
 * - Fetches seller data from /api/sellers
 */

export default async function SearchPage({searchParams,}: {
  searchParams: { q?: string };
}) {
  /**
   * Read the search query from the URL
   * Example URL: /search?q=nails
   */
  const q = searchParams?.q ?? "";

  /**
   * Build an ABSOLUTE URL for server-side fetch
   * Server components do NOT support relative URLs like "/api/..."
   */
  const headersList = headers();
  const host = headersList.get("host"); // ex: "localhost:3000"
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/sellers?q=${encodeURIComponent(q)}`;

  /**
   * Fetch sellers from API route
   */
  const res = await fetch(url, { cache: "no-store", }); // always fetch fresh results

  if (!res.ok) {
    throw new Error("Failed to fetch sellers");
  }

  const sellers = await res.json();
 

  /**
   * Render the page
   */
  return (
   <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Page title */}
      <h1 className="mb-6 text-2xl font-bold">
        Results for "{q}"
      </h1>

      {/* Empty state */}
      {(!sellers || sellers.length === 0) && (
        <p className="text-gray-500">
          No services found.
        </p>
      )}

      {/* Results grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sellers?.map((seller) => (
          <ListingCard
            key={seller.id}
            name={seller.name}
            service={seller.service}
            bio={seller.bio}
          />
        ))}
      </div>
    </main>
  );
}
