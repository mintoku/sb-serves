"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * SearchBar (Client Component)
 * ----------------------------
 * - Lets the user type a query
 * - On Enter OR button click, navigates to /search?q=...
 * - The SearchPage server component will see the new q and refetch results
 */

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  // Local input state (what the user is typing)
  const [query, setQuery] = useState(initialQuery ?? "");

  /**
   * If the URL changes and SearchPage rerenders with a new initialQuery,
   * keep the input in sync.
   */
  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  /**
   * Navigate to the search results page with a ?q= query param
   */
  function runSearch() {
    const trimmed = query.trim();

    // If empty, you can choose behavior:
    // Option A: go to /search with no q (shows all sellers or empty depending on your API)
    // Option B: stay put (do nothing)
    // We'll do Option A:
    if (!trimmed) {
      router.push("/search");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search services (nails, lashes), names, etc..."
        style={{
          width: "100%",
          maxWidth: 520,
          padding: "10px 12px",
          borderRadius: 10,
          border: "3px solid rgba(0, 89, 65, 0.2)",
          background: "transparent",
        }}
        // Press Enter to search
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault(); // prevents form submit refresh
            runSearch();
          }
        }}
      />

      <button
        type="button"
        onClick={runSearch}
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.2)",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        Explore!
      </button>
    </div>
  );
}
