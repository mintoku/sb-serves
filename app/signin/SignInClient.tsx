// app/signin/SignInClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const supabase = createSupabaseBrowserClient();

export default function SignInClient() {
  const searchParams = useSearchParams();

  // If middleware sent them here with ?redirectTo=/dashboard, keep it
  const redirectToParam = searchParams.get("redirectTo") || "/dashboard";

  // Email input
  const [email, setEmail] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  /**
   * Decide the base URL we should use in the email redirect.
   * - In production, set NEXT_PUBLIC_SITE_URL to https://yourdomain.com
   * - In dev, fallback to the current site origin (window.location.origin)
   */
  const siteOrigin =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbserves.com";


  async function sendMagicLink() {
    setLoading(true);
    setStatus(null);

    const cleanEmail = email.trim();

    // The link in the email will land here:
    // /auth/callback?redirectTo=/dashboard
    const emailRedirectTo = `${siteOrigin}/auth/callback?redirectTo=${encodeURIComponent(
      redirectToParam
    )}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo,
      },
    });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setStatus("Magic link sent! Check your email and click the link to sign in ✨");
    setLoading(false);
  }

  return (
    <section className="p-6 sm:p-10">
      <div className="mx-auto max-w-md rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Seller sign in
        </h1>

        <p className="mt-2 text-zinc-600">
          Enter your email and we’ll send you a magic link to sign in.
        </p>

        <div className="mt-6 space-y-4">
          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ucsb.edu"
            className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
            disabled={loading}
          />

          {status && (
            <p className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {status}
            </p>
          )}

          <button
            onClick={sendMagicLink}
            disabled={loading || !email.trim()}
            className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send magic link"}
          </button>

          <p className="text-xs text-zinc-500 leading-relaxed">
            Tip: If you don’t see it, check spam/promotions. The link works best
            when opened in the same browser.
          </p>
        </div>
      </div>
    </section>
  );
}
