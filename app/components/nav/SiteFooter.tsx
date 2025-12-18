// app/components/nav/SiteFooter.tsx
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur">
      <div className="mx-8 px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* left */}
          <p className="order-2 md:order-1 text-sm text-neutral-600">
            © {new Date().getFullYear()} sb serves
          </p>

          {/* right (links) */}
          
          <nav className="grid grid-rows-2 order-1 md:order-2 flex items-center gap-4 mb-2 text-sm">
            <Link
              href="/signin"
              className="hover:text-blue-800 hover:bg-blue-100 text-center p-3 bg-blue-50 rounded-lg"
            >
              Seller portal
            </Link>
            <Link
              href="/issue"
              className="hover:text-red-800 hover:bg-red-100 text-center p-3 bg-red-50 rounded-lg"
            >
              Report an issue
            </Link>
            
          </nav>
        </div>
      </div>
    </footer>
  );
}
