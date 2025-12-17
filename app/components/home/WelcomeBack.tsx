"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = createSupabaseBrowserClient();

export default function WelcomeBack() {
  const [name, setName] = useState<string | null>(null);

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
    <h1 className="text-xl font-semibold">
      Welcome back, {name}
    </h1>
  );
}
