// lib/supabase/server.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client
 * ---------------------------
 * Route Handlers (/app/api/...) run on the server.
 * So we should build the Supabase client using SERVER environment variables.
 *
 * IMPORTANT:
 * - For simple public reads, you can use the anon key.
 * - If you later need admin access, use the service role key (NEVER expose it to the browser).
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);
