// app/components/nav/SiteHeader.tsx
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="font-semibold tracking-tight">
          SB Serves
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-5 text-sm text-neutral-700">
          <Link href="/search" className="hover:text-black">
            Search
          </Link>
          <Link href="/become-a-seller" className="hover:text-black">
            Become a Seller
          </Link>
          <Link href="/about" className="hover:text-black">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
