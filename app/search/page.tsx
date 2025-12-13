// app/search/page.tsx
import FiltersPanel from "@/app/components/search/FiltersPanel";
import SearchShell from "@/app/components/search/SearchShell";
import SearchBar from "@/app/components/search/SearchBar";
import { headers } from "next/headers";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams?.q ?? "";

  const headersList = headers();

  // More robust in dev + when deployed behind proxies
  const forwardedHost = headersList.get("x-forwarded-host");
  const forwardedProto = headersList.get("x-forwarded-proto");

  const host = forwardedHost ?? headersList.get("host");
  const protocol = forwardedProto ?? (process.env.NODE_ENV === "development" ? "http" : "https");

  if (!host) {
    throw new Error("Missing Host header — cannot build absolute URL for /api/sellers");
  }

  const url = `${protocol}://${host}/api/sellers?q=${encodeURIComponent(q)}`;

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

        {/* 🔍 SEARCH BAR */}
        <div className="mb-6">
          <SearchBar initialQuery={q} />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-6">
              <FiltersPanel />
            </div>
          </aside>

          {/* MIDDLE + RIGHT */}
          <section className="col-span-12 lg:col-span-9">
            <SearchShell sellers={sellers} />
          </section>
        </div>
      </div>
    </main>
  );
}
