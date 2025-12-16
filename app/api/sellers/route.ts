// app/api/sellers/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") ?? "").toLowerCase().trim();

    const supabase = createSupabaseServerClient();

    const { data, error } = await supabase.from("seller_profiles").select(`
      id,
      name,
      bio,
      instagram_handle,
      services,
      location_text,
      price_start,
      rating,
      review_count,
      photos,
      instagram_post_urls,
      profile_pic
    `);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // map the database values to sellers
    const sellers = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      bio: row.bio ?? undefined,
      locationText: row.location_text ?? undefined,
      priceStart: row.price_start ?? undefined,
      rating: row.rating ?? undefined,
      reviewCount: row.review_count ?? undefined,
      photos: row.photos ?? undefined,

      // normalize services (text[] or "csv string")
      services: Array.isArray(row.services)
        ? row.services
        : typeof row.services === "string"
          ? row.services.split(",").map((s: string) => s.trim()).filter(Boolean)
          : [],

      instagramHandle: row.instagram_handle ?? undefined,
      instagramPostUrls: row.instagram_post_urls ?? [],
      profilePic: row.profile_pic ?? undefined, // not implemented yet
    }));

    if (!q) return NextResponse.json({ sellers }, { status: 200 });

    const filtered = sellers.filter((s: any) => {
      const nameMatch = (s.name ?? "").toLowerCase().includes(q);
      const bioMatch = (s.bio ?? "").toLowerCase().includes(q);
      const serviceMatch = Array.isArray(s.services)
        ? s.services.some((x: string) => (x ?? "").toLowerCase().includes(q))
        : false;
      return nameMatch || bioMatch || serviceMatch;
    });

    return NextResponse.json({ sellers: filtered }, { status: 200 });
  } catch (e: any) {
    // Always return JSON (prevents “end of JSON input”)
    return NextResponse.json(
      { error: e?.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
