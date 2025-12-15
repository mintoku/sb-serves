// lib/supabase/client.ts
/**
 * Supabase Browser Client (Client Components)
 * ------------------------------------------
 * Use this ONLY in "use client" components.
 *
 * Why not @supabase/supabase-js createClient() directly?
 * - In Next.js App Router, protected routes often check auth on the SERVER
 *   (middleware / server components).
 * - The server can only "see" auth if it's stored in COOKIES.
 * - The @supabase/ssr browser client is designed to work with that flow.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
