// app/components/nav/SiteFooter.tsx
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t bg-white/80 backdrop-blur">
      <div className="mx-8 px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* left */}
          <p className="text-sm text-neutral-600">
            © {new Date().getFullYear()} sb serves
          </p>

          {/* right (links) */}
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/issue"
              className="hover:text-black p-2 border-2 border-red-50 bg-red-50 rounded-lg"
            >
              Report an issue
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
