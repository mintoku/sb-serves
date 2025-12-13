// app/components/search/SellerPreviewPanel.tsx
import type { Seller } from "./SearchShell";

export default function SellerPreviewPanel({
  seller,
}: {
  seller: Seller | null;
}) {
  // Empty state BEFORE clicking
  if (!seller) {
    return (
      <div className="h-[70vh] rounded-2xl border bg-white shadow-sm flex items-center justify-center">
        <p className="text-sm text-neutral-500">
          Select a seller to view their profile
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-2xl font-semibold">{seller.name}</h2>

      {seller.photos?.length && (
        <div className="grid grid-cols-3 gap-2">
          {seller.photos.slice(0, 6).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${seller.name} photo ${i + 1}`}
              className="h-32 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      {seller.bio && (
        <p className="text-neutral-700">{seller.bio}</p>
      )}

      {seller.services && (
        <div className="flex flex-wrap gap-2">
          {seller.services.map((service) => (
            <span
              key={service}
              className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
            >
              {service}
            </span>
          ))}
        </div>
      )}

      {seller.instagramHandle && (
        <a
          href={`https://instagram.com/${seller.instagramHandle.replace("@", "")}`}
          target="_blank"
          className="inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          View instagram →
        </a>
      )}
    </div>
  );
}
