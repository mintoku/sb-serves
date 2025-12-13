// components/search/SearchBar.tsx
"use client";

import { useState } from 'react';

export default function SearchBar({ initialQuery= ""}: { initialQuery?: string }) {
    const [query, setQuery] = useState(initialQuery);
    return (
        <div style={{ marginBottom: 24 }}>
            <input
                type="text"
                placeholder="Search for services"
                style={{
                    width: "90%",
                    padding: 12,
                    fontSize: 16,
                }}
            />
        </div>
    )
}