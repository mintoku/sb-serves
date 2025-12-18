// app/search/page.tsx
import FiltersPanel from "@/app/components/search/FiltersPanel";
import SearchShell from "@/app/components/search/SearchShell";
import SearchBar from "@/app/components/search/SearchBar";
import { headers } from "next/headers";

type SearchParams = {
  q?: string;
  services?: string;
};


export default async function SearchPage({
  searchParams,
  }: {
    searchParams: SearchParams;
  }) {
  const q = searchParams?.q ?? "";
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  
  const headersList = headers();

  const forwardedHost = headersList.get("x-forwarded-host");
  const forwardedProto = headersList.get("x-forwarded-proto");

  const host = forwardedHost ?? headersList.get("host");
  const protocol =
    forwardedProto ?? (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) {
    throw new Error("Missing Host header — cannot build absolute URL for /api/sellers");
  }

  if (searchParams.services) params.set("services", searchParams.services);
  
  const url = `${protocol}://${host}/api/sellers?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      `Failed to fetch sellers: ${res.status} ${res.statusText}\nURL: ${url}\nBody: ${bodyText.slice(0, 500)}`
    );
  }

  const { sellers } = await res.json();


  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-[1600px] px-4 py-6">

        {/* SEARCH BAR */}
        <div className="mb-6">
          <SearchBar initialQuery={q} />
        </div>

        <div className="grid grid-cols-12 gap-6">

          {/* LEFT: Filters */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6">
              <FiltersPanel />
            </div>
          </aside>

          {/* RIGHT: Results */}
          <section className="col-span-6 lg:col-span-9 space-y-4">
            <SearchShell sellers={sellers} />
          </section>

        </div>
      </div>
    </main>
  );
}
