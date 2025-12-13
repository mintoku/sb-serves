// app/page.tsx

import SearchBar from "./components/search/SearchBar";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>sb serves</h1>

      <SearchBar />
      <p> Sorry! We couldn't find anything.</p>
    </main>
  );
}