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
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-1">
        <Link
          href="/"
          className="text-2xl tracking-wide text-cyan-900 font-semibold hover:text-black p-3 border-1 border-cyan-100 bg-blue-50 rounded-lg"
        >
          sb serves
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-5 text-sm text-neutral-700">
          <Link
            href="/search"
            className="hover:text-black p-2 border-2 border-blue-50 bg-blue-50 rounded-lg"
          >
            Explore sellers
          </Link>

          {loggedIn ? (
            <Link
              href="/dashboard"
              className="hover:text-black p-2 border-2 border-blue-50 bg-blue-50 rounded-lg"
            >
              Seller Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="hover:text-black p-2 border-2 border-blue-50 bg-blue-50 rounded-lg"
            >
              Seller portal
            </Link>
          )}

          {loggedIn && <SignOutButton />}

        </nav>
      </div>
    </header>
  );
}
