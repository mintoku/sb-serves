"use client"; /* for interactivity */

import Link from "next/link";
import SignOutButton from "@/app/components/seller/auth/SignOutButton";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
const supabase = createSupabaseBrowserClient();

export default function SiteHeader() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // initial session check
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });

    // listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand */}
        <Link
          href="/"
          className="text-lg sm:text-2xl tracking-wide text-cyan-900 font-semibold hover:text-black px-3 py-2 bg-blue-50 rounded-lg"
        >
          sb serves
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-4 text-sm text-neutral-700">
          <Link
            href="/search"
            className="hover:text-black px-3 py-2 bg-blue-50 rounded-lg"
          >
            Explore sellers
          </Link>

          {loggedIn ? (
            <Link
              href="/dashboard"
              className="hover:text-black px-3 py-2 bg-blue-50 rounded-lg"
            >
              Seller Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="hover:text-black px-3 py-2 bg-blue-50 rounded-lg"
            >
              Seller portal
            </Link>
          )}

          {loggedIn && <SignOutButton />}
        </nav>

        {/* Mobile primary action */}
        <div className="sm:hidden">
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm px-3 py-2 bg-blue-50 rounded-lg"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="text-sm px-3 py-2 bg-blue-50 rounded-lg"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
