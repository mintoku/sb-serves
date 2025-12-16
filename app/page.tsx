// app/page.tsx

import SearchBar from "@/app/components/search/SearchBar";
import FeaturedSellers from "@/app/components/home/FeaturedSellers";
import { createSupabaseServerClient } from "@/lib/supabase/server";


export default async function HomePage() {
  const supabase = createSupabaseServerClient();

  // Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let sellerName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("seller_profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    sellerName = profile?.name ?? null;
  }
  return (
    <section className="p-20 py-10 sm:py-14">
      {/* Greeting */}
      {sellerName && (
        <h2 className="mb-6 text-4xl font-semibold tracking-tight">
          Welcome back, {sellerName}. 
        </h2>
      )}
    
      <section className="p-20 py-10 sm:py-14">
        {/* TWO-COLUMN HERO */}
        <div className="grid gap-2 sm:grid-cols-3">

          {/* TOP: Search box */}
          <div className="sm:col-span-3 rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              Ready to serve? 💁‍♀️
            </h1>

            <p className="mt-2 text-zinc-600">
              Book your next haircut, lash extensions, nail appointment...
            </p>

            <div className="mt-6">
              <SearchBar initialQuery="" />
            </div>
          </div>
          {/* LEFT: Intro box */}
          <div className="sm:col-span-3 rounded-3xl border bg-white p-6 shadow-sm sm:p-8 flex flex-col justify-center">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Services for SB students, from SB students
            </h2>

            <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
              If UCSB students know how to do one thing right, it's glowing up. 
              From haircuts to nails, this is the best place for connecting talented
              students with Gauchos looking for well-priced services.
            </p>
          </div>
          
        </div>

        <FeaturedSellers limit={6} />
      </section>
    </section>
    
  );
}
