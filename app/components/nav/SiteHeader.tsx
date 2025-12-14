// app/components/nav/SiteHeader.tsx
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="text-2xl tracking-wide
 text-cyan-900 font-semibold hover:text-black p-3 border-1 border-cyan-100 bg-blue-50 rounded-lg">
          SB Serves
        </Link>
        

        {/* Nav links */}
        <nav className="flex items-center gap-5 text-sm text-neutral-700">
          <Link href="/search" className="hover:text-black p-2 border-2 border-blue-50 bg-blue-50 rounded-lg">
            Browse
          </Link>
          <Link href="/seller-signup" className="hover:text-red p-2 border-2 border-blue-50 bg-blue-50 rounded-lg">
            Become a seller
          </Link>
          <Link href="/about" className="hover:text-black p-2 border-2 border-blue-50 bg-blue-50 rounded-lg">
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
