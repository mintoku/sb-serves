"use client"; /* for interactivity */

import Link from "next/link";
import SignOutButton from "@/app/components/seller/auth/SignOutButton";
import Container from "@/app/components/LayoutContainer";

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
      <Container className="px-6 sm:px-10 lg:px-14">
        <div className="whitespace-nowrap flex-shrink-0 flex items-start sm:items-center justify-between px-6 sm:px-10 lg:px-14 py-3 sm:py-4">
        
        {/* Brand */}
        <Link
          href="/"
          // "text-2xl font-semibold tracking-tight sm:text-4xl">
          className="text-lg sm:text-2xl tracking-wide text-cyan-900 font-semibold px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg"
        >
          sb serves
        </Link>

        <nav className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-sm text-neutral-700">
          <Link
            href="/search"
            className="whitespace-nowrap flex-shrink-0 w-full sm:w-auto
                      hover:text-blue-800 hover:bg-blue-100
                      px-3 py-2 bg-blue-50 rounded-lg"
          >
            Explore sellers
          </Link>

          {loggedIn ? (
            <Link
              href="/dashboard"
              className="whitespace-nowrap flex-shrink-0 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 bg-blue-50 rounded-lg"
            >
              Seller Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="whitespace-nowrap flex-shrink-0 hover:text-blue-800 hover:bg-blue-100 px-3 py-2 bg-blue-50 rounded-lg"
            >
              Seller portal
            </Link>
          )}

          {loggedIn && (
            <div className="whitespace-nowrap flex-shrink-0 hidden sm:block">
              <SignOutButton />
            </div>)
            }
        </nav>

      </div>
      </Container>
      
    </header>
  );
}
