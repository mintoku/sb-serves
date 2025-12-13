// app/components/search/SellerCard.tsx

type Seller = {
  id: string;
  name: string;
  tagline?: string;
  locationText?: string;
  priceStart?: number;
  rating?: number;
  reviewCount?: number;

  // NEW: small gallery strip shown under the name
  photos?: string[]; // array of image URLs
};

export default function SellerCard({ seller }: { seller: Seller }) {
  const photos = seller.photos ?? [];

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-neutral-200">
          {/* Replace with next/image later */}
          <img
            src={photos[0] ?? "https://placehold.co/200x200"}
            alt={`${seller.name} profile`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-neutral-900">
                {seller.name}
              </h3>

              {/* Photo strip directly under name */}
              {photos.length > 1 && (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {photos.slice(0, 5).map((url, idx) => (
                    <div
                      key={idx}
                      className="h-12 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-200"
                      title={`Photo ${idx + 1}`}
                    >
                      <img
                        src={url}
                        alt={`${seller.name} photo ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {seller.tagline && (
                <p className="mt-2 text-sm text-neutral-700">{seller.tagline}</p>
              )}

              {seller.locationText && (
                <p className="mt-1 text-sm text-neutral-500">{seller.locationText}</p>
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
          <div className="mt-3 flex items-center gap-2 text-sm text-neutral-700">
            {typeof seller.rating === "number" && (
              <span className="font-medium">⭐ {seller.rating.toFixed(1)}</span>
            )}
            {typeof seller.reviewCount === "number" && (
              <span className="text-neutral-500">• {seller.reviewCount} reviews</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
