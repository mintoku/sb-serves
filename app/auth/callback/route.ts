import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function safeRedirectPath(path: string) {
  // prevent open redirects like redirectTo=https://evil.com
  if (!path.startsWith("/")) return "/dashboard";
  return path;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const redirectTo = safeRedirectPath(url.searchParams.get("redirectTo") ?? "/dashboard");

  const origin = url.origin;

  // IMPORTANT: use a single response object so cookie writes aren't lost
  const res = NextResponse.redirect(new URL(redirectTo, origin));

  if (!code) {
    return NextResponse.redirect(new URL("/signin?error=missing_code", origin));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/signin?error=callback_failed", origin));
  }

  return res;
}
