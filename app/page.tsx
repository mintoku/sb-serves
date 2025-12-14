// app/page.tsx

import SearchBar from "@/app/components/search/SearchBar";
import FeaturedSellers from "@/app/components/home/FeaturedSellers";


export default function HomePage() {
  return (
    <section className="p-20 py-10 sm:py-14">
      <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Ready to serve? 💁‍♀️
        </h1>
        <p className="mt-2 text-zinc-600">
          Book your next haircut, lash extensions, nail appointment, and more from your talented SB peers.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar initialQuery=""/>
          </div>
        </div>
      </div>

      <FeaturedSellers limit={6} />
    </section>

  );
}