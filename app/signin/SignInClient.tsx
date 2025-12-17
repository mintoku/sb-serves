"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setStatus(null);

    // IMPORTANT: must match what you added in Supabase + Google Cloud
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
    }
    // If no error, user gets redirected to Google automatically.
  }

  return (
    <div className="mx-auto max-w-md pb-20 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>

      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="mt-6 w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Continue with Google"}
      </button>

      {status && <p className="mt-3 text-sm text-red-600">{status}</p>}
    </div>
  );
}
