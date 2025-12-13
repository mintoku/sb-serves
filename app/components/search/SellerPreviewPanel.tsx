// app/components/search/SellerPreviewPanel.tsx

import type { Seller } from "./SearchShell";
import InstagramPreview from "@/app/components/seller/InstagramPreview";

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

  /**
   * Normalize instagram fields
   * - Handles cases where the handle includes "@"
   * - Handles cases where instagramPostUrls is undefined / null / not an array
   */
  const igHandleRaw = seller.instagramHandle?.trim() ?? "";
  const igHandle = igHandleRaw.startsWith("@")
    ? igHandleRaw.slice(1)
    : igHandleRaw;

  const igPosts = Array.isArray(seller.instagramPostUrls)
    ? seller.instagramPostUrls.filter(
        (x): x is string => typeof x === "string" && x.length > 0
      )
    : [];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-2xl font-semibold">{seller.name}</h2>

      {seller.bio && <p className="text-neutral-700">{seller.bio}</p>}

      {seller.services?.length ? (
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
      ) : null}

      {/* Simple profile link */}
      {igHandle ? (
        <a
          href={`https://instagram.com/${igHandle}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm font-medium text-emerald-600 hover:underline"
        >
          View Instagram →
        </a>
      ) : null}

      {/* Embedded posts gallery */}
      <InstagramPreview
        instagramUsername={igHandle || undefined}
        instagramPostUrls={igPosts}
      />
    </div>
  );
}
