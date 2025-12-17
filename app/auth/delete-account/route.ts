// app/auth/delete-account/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // IMPORTANT: use a single response object so cookie writes aren't lost
  const res = NextResponse.json({ success: true });

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

  const { data, error: userErr } = await supabase.auth.getUser();
  const user = data?.user;

  if (userErr || !user) {
    // return the SAME `res` so cookie updates (if any) are preserved
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // 1) delete app data (profile row)
  const { error: profileErr } = await supabase
    .from("seller_profiles")
    .delete()
    .eq("id", user.id);

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  // 2) delete auth user using service role (server-only)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only env var
    { auth: { persistSession: false } }
  );

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) {
    return NextResponse.json({ error: delErr.message }, { status: 500 });
  }

  // 3) clear session cookies
  // Even if the user is deleted, this ensures your browser session is wiped.
  await supabase.auth.signOut();

  // return the response that contains the cookie deletions
  return res;
}
