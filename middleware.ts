// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  // We will forward the request, but with updated cookies if Supabase refreshes them
  let res = NextResponse.next();

  // Create a Supabase client that can READ/WRITE auth cookies in middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Supabase may refresh the session; we must pass new cookies along
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: this triggers session refresh if needed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  // If trying to access dashboard while not logged in, redirect to signup
  if (isDashboard && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/signup";
    // optional: remember where they wanted to go
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
