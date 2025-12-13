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

              {/* Instagram mini-strip under name (lightweight) */}
              {(profileUrl || igPosts.length > 0) && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {profileUrl && (
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
                      title="Open Instagram profile"
                      onClick={(e) => e.stopPropagation()}
                    >
                      @{seller.instagramHandle}
                    </a>
                  )}

                  {/* “Top posts” quick links (not embeds) */}
                  {igPosts.slice(0, 3).map((url, idx) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-50"
                      title={`Open Instagram post ${idx + 1}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      IG post {idx + 1} ↗
                    </a>
                  ))}

                  {igPosts.length > 3 && (
                    <span className="text-xs text-neutral-500">
                      +{igPosts.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {seller.locationText && (
                <p className="mt-2 text-sm text-neutral-500">
                  {seller.locationText}
                </p>
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

          {/* Rating row */}
          {(typeof seller.rating === "number" ||
            typeof seller.reviewCount === "number") && (
            <div className="mt-3 flex items-center gap-2 text-sm text-neutral-700">
              {typeof seller.rating === "number" && (
                <span className="font-medium">⭐ {seller.rating.toFixed(1)}</span>
              )}
              {typeof seller.reviewCount === "number" && (
                <span className="text-neutral-500">
                  • {seller.reviewCount} reviews
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
