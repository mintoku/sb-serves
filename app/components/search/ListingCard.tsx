/**
 * ListingCard
 * ------------
 * Displays ONE seller/service (Yelp-style card)
 * Reusable across search results, profile previews, etc.
 */

type ListingCardProps = {
  name: string;
  service: string;
  bio: string;
};

export default function ListingCard({
  name,
  service,
  bio,
}: ListingCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">{name}</h3>

      <p className="text-sm text-gray-500">{service}</p>

      <p className="mt-2 text-sm text-gray-700 line-clamp-3">
        {bio}
      </p>

      <button className="mt-4 text-sm font-medium text-indigo-600 hover:underline">
        View profile →
      </button>
    </div>
  );
}
