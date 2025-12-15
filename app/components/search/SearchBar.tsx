"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; /* lets us "push" (navigate) to next page*/

/**
 * client componenent
 * - on Enter OR button click, navigates to /search?q=...
 * - SearchPage server component will see the new q and refetch results
 */

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();

  // user's query ("" if none)
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

    // If empty, go to /search with no q (shows all sellers or empty depending on your API)
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
          maxWidth: "80%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "3px solid rgba(0, 89, 65, 0.2)",
          background: "transparent",
        }}
        // press enter to search
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
          border: "2px solid rgba(0, 89, 65, 0.2)",
          background: "rgba(106, 137, 128, 0.1)",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
}
