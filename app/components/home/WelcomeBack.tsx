"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";


const supabase = createSupabaseBrowserClient();

export default function WelcomeBack() {
  const [name, setName] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authEvent, setAuthEvent] = useState<string | null>(null);

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setName(null);
        return;
      }

      const { data: profile } = await supabase
        .from("seller_profiles")
        .select("name")
        .eq("id", data.session.user.id)
        .single();

      setName(profile?.name ?? null);
    });

    // React to login/logout instantly
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          setName(null);
          return;
        }

        const { data: profile } = await supabase
          .from("seller_profiles")
          .select("name")
          .eq("id", session.user.id)
          .single();

        setName(profile?.name ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!name) return null;

  return (
    // rounded-3xl border bg-white p-6 shadow-sm sm:p-10
    <section className="rounded-2xl border bg-white p-6 shadow-sm sm:p-10 mb-8">
      <h1 className="text-4xl font-semibold mb-4 text-teal-600">
      Welcome back, {name}
    </h1>
    <div className="mt-7">
      Edit your page in
      <Link
        href="/dashboard"
        className="text-sm px-3 py-2 m-2 text-blue-800 bg-blue-50 rounded-lg"
      >Seller dashboard</Link> 
    </div>
    </section>
    
  );
}
