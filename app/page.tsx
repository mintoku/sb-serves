// app/page.tsx

import SearchBar from "@/app/components/search/SearchBar";

export default function HomePage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Find trusted UCSB student services
        </h1>
        <p className="mt-2 text-zinc-600">
          Nails, lashes, haircuts, brows — browse portfolios and message directly.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchBar initialQuery=""/>
          </div>

          <div className="flex gap-2">
            <span className="rounded-full border bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
              ⭐ Top rated
            </span>
            <span className="rounded-full border bg-zinc-50 px-3 py-1 text-xs text-zinc-700">
              ✅ Verified students
            </span>
          </div>
        </div>
      </div>
    </section>

  );
}