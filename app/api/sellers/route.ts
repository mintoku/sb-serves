// // app/api/sellers/route.ts

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client"; // change back to client later

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
      service_offered
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

    const serviceMatch = seller.service_offered.toLowerCase().includes(q) ?? false;
    return nameMatch || bioMatch || serviceMatch;
  });

  // **Return the filtered array directly**
  return NextResponse.json(filtered);
}
// BELOW FOR DEBUGGING
// // app/api/sellers/route.ts
// import { NextResponse } from "next/server";
// import { supabaseServer } from "@/lib/supabase/server";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const q = (searchParams.get("q") ?? "").trim();

//   /**
//    * Build the base query.
//    * We select only the fields our UI needs.
//    */
//   let query = supabaseServer
//     .from("seller_profiles")
//     .select("id, name, bio, portfolio_url, service_offered");

//   /**
//    * If there's a search query, filter in the DATABASE (faster + cleaner)
//    * ilike = case-insensitive pattern match
//    * .or() lets us search across multiple columns
//    */
//   if (q.length > 0) {
//     const pattern = `%${q}%`;
//     query = query.or(
//       `name.ilike.${pattern},bio.ilike.${pattern},service_offered.ilike.${pattern}`
//     );
//   }

//   const { data, error } = await query;

//   /**
//    * If Supabase errors, return a 500 with details.
//    * (This helps a TON while debugging.)
//    */
//   if (error) {
//     return NextResponse.json(
//       {
//         error: error.message,
//         hint: error.hint,
//         details: error.details,
//       },
//       { status: 500 }
//     );
//   }

//   /**
//    * Extra debug info (safe to keep for now):
//    * - how many rows we got back
//    * - what query string was used
//    */
//   return NextResponse.json({
//     count: data?.length ?? 0,
//     q,
//     sellers: data ?? [],
//   });
// }
