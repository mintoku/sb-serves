// app/components/search/SellerCard.tsx

import type { Seller } from "./SearchShell";

function normalizeIgPosts(value: unknown): string[] {
  // In case something passes jsonb-ish data or nulls
  if (!Array.isArray(value)) return [];
  return value.filter((x): x is string => typeof x === "string" && x.length > 0);
}

export default function SellerCard({ seller }: { seller: Seller }) {
  const igPosts = normalizeIgPosts(seller.instagramPostUrls);

  const profileUrl = seller.instagramHandle
    ? `https://www.instagram.com/${seller.instagramHandle}/`
    : undefined;

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex gap-4">
        {/* Avatar (placeholder for now) */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-200">
          {/* Later: you can swap this for a real image */}
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
            SB
          </div>
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-neutral-900">
                {seller.name}
              </h3>

              {seller.services && (
                <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  {seller.services}
                </span>
              )}


              {seller.locationText && (
                <div className="mt-2">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                    📍 {seller.locationText}
                  </span>
                </div>
              )}


              {seller.bio && (
                <p className="mt-2 line-clamp-2 text-sm text-neutral-700">
                  {seller.bio}
                </p>
              )}
            </div>

            {/* Price */}
            {typeof seller.priceStart === "number" && (
              <div className="text-right">
                <div className="text-xl font-semibold text-emerald-700">
                  ${seller.priceStart}
                </div>
                <div className="text-xs text-neutral-500">starting price</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </article>
  );
}
