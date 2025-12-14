// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // Supabase sends back a "code" for PKCE flows
  const code = searchParams.get("code");

  if (code) {
    const supabase = createSupabaseServerClient();

    // This exchanges the code for a session AND sets auth cookies
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Send them where you actually want them after login
  return NextResponse.redirect(`${origin}/dashboard`);
}
