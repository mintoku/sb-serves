// app/api/sellers/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  // fetch seller profiles with related services
  const { data, error } = await supabase
    .from("seller_profiles")
    .select(
      `
      id,
      name,
      bio,
      portfolio_url,
      services (
        service_type,
        price_from
      )
    `
    );

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // If no query, return everything (as an array)
  if (!q) {
    return NextResponse.json(data ?? []);
  }

  // Otherwise filter
  const filtered = (data ?? []).filter((seller) => {
    const nameMatch = seller.name.toLowerCase().includes(q);
    const bioMatch = seller.bio?.toLowerCase().includes(q) ?? false;

    const serviceMatch = seller.services?.some((service: any) =>
      service.service_type.toLowerCase().includes(q)
    );

    return nameMatch || bioMatch || serviceMatch;
  });

  // **Return the filtered array directly**
  return NextResponse.json(filtered);
}
