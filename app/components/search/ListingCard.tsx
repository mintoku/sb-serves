// components/search/ListingCard.tsx

/**
 * ListingCard
 * Renders one seller + their services.
 */
export default function ListingCard({ seller }: { seller: any }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <h3 style={{ marginBottom: 6 }}>{seller.name}</h3>

      {seller.bio && (
        <p style={{ opacity: 0.85, marginBottom: 10 }}>
          {seller.bio}
        </p>
      )}

      {/* Services */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {seller.services?.map((service: any, i: number) => (
          <span
            key={i}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              fontSize: 14,
            }}
          >
            {service.service_type}
            {service.price_from && ` · from $${service.price_from}`}
          </span>
        ))}
      </div>

      {/* Portfolio */}
      {seller.portfolio_url && (
        <div style={{ marginTop: 10 }}>
          <a href={seller.portfolio_url} target="_blank">
            View portfolio →
          </a>
        </div>
      )}
    </div>
  );
}
