// app/search/page.tsx

import ListingCard from "@/components/search/ListingCard";
import SearchBar from "@/components/search/SearchBar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";

  // Fetch sellers from your API route
  const res = await fetch(
    `http://localhost:3000/api/sellers?q=${encodeURIComponent(q)}`,
    { cache: "no-store" } // always fresh during dev
  );

  const sellers = await res.json();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Search results</h1>

      {/* Search bar at the top */}
      <div style={{ marginBottom: 20 }}>
        <SearchBar initialQuery={q} />
      </div>

      {/* Render one ListingCard per seller */}
      <div style={{ display: "grid", gap: 12 }}>
        {sellers.map((seller: any) => (
          <ListingCard key={seller.id} seller={seller} />
        ))}
      </div>

      {/* Empty state */}
      {sellers.length === 0 && (
        <p style={{ marginTop: 16, opacity: 0.8 }}>No results found.</p>
      )}
    </main>
  );
}
