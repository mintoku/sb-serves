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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  /**
   * 1️⃣ Read the search query from the URL
   * Example URL: /search?q=nails
   */
  const q = searchParams?.q ?? "";

  /**
   * 2️⃣ Build an ABSOLUTE URL for server-side fetch
   * Server components do NOT support relative URLs like "/api/..."
   */
  const headersList = headers();
  const host = headersList.get("host"); // ex: "localhost:3000"
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const url = `${protocol}://${host}/api/sellers?q=${encodeURIComponent(
    q
  )}`;

  /**
   * 3️⃣ Fetch sellers from API route
   */
  const res = await fetch(url, {
    cache: "no-store", // always fetch fresh results
  });

  if (!res.ok) {
    throw new Error("Failed to fetch sellers");
  }

  const sellers = await res.json();

  /**
   * 4️⃣ Render the page
   */
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Search Results</h1>

      {/* Search bar (prefilled with current query) */}
      <div style={{ marginBottom: 20 }}>
        <SearchBar initialQuery={q} />
      </div>

      {/* Seller results */}
      <div style={{ display: "grid", gap: 16 }}>
        {sellers.map((seller: any) => (
          <ListingCard key={seller.id} seller={seller} />
        ))}
      </div>

      {/* Empty state */}
      {sellers.length === 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>
          No results found.
        </p>
      )}
    </main>
  );
}
