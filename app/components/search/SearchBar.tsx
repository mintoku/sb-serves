// components/search/SearchBar.tsx

export default function SearchBar() {
    return (
        <div style={{ marginBottom: 24 }}>
            <input
                type="text"
                placeholder="Search for services"
                style={{
                    width: "100%",
                    padding: 12,
                    fontSize: 16,
                }}
            />
        </div>
    )
}