"use client";

/**
 * Sign out button
 * ---------------
 * - Clears Supabase auth session
 * - Refreshes server components so middleware + server auth re-run
 */

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function signOut() {
    await supabase.auth.signOut();

    // Re-run server components & middleware
    router.refresh();

    router.replace("/");
  }

  return (
    <button
      onClick={signOut}
      className="rounded-xl bg-red-50 border px-4 py-2 text-sm hover:bg-red-100"
    >
      Sign out
    </button>
  );
}
