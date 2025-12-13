// app/api/sellers/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client"; // NOTE: ideally use a server supabase client later

export async function GET(request: Request) {
  /**
   * Read query from URL: /api/sellers?q=hair
   */
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  /**
   * Fetch sellers from Supabase.
   * IMPORTANT: .select() must be a list of column names (no TypeScript types).
   */
  const { data, error } = await supabase.from("seller_profiles").select(`
    id,
    name,
    location_text,
    price_start,
    rating,
    review_count,
    photos,
    bio,
    services,
    instagram_handle
  `);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  /**
   * Map DB row shape (snake_case) -> UI/API shape (camelCase)
   * This keeps your frontend consistent with the Seller type in SearchShell.
   */
  const sellers = (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    locationText: row.location_text ?? undefined,
    priceStart: row.price_start ?? undefined,
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
    photos: row.photos ?? undefined,
    bio: row.bio ?? undefined,

    // services could be string[] (ideal) or string depending on how your DB column is defined
    services: Array.isArray(row.services)
      ? row.services
      : typeof row.services === "string"
        ? row.services.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],

    instagramHandle: row.instagram_handle ?? undefined,
  }));

  /**
   * If no query, return all sellers
   */
  if (!q) {
    return NextResponse.json({ sellers });
  }

  /**
   * Otherwise, filter on:
   * - name
   * - bio
   * - services (array or string)
   */
  const filtered = sellers.filter((seller: any) => {
    const nameMatch = (seller.name ?? "").toLowerCase().includes(q);
    const bioMatch = (seller.bio ?? "").toLowerCase().includes(q);

    const services = seller.services;

    // Handle string[] OR string
    const serviceMatch =
      Array.isArray(services)
        ? services.some((s: string) => (s ?? "").toLowerCase().includes(q))
        : typeof services === "string"
          ? services.toLowerCase().includes(q)
          : false;

    return nameMatch || bioMatch || serviceMatch;
  });

  return NextResponse.json({ sellers: filtered });
}
