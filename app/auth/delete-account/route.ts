// app/auth/delete-account/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  // Cookie collector response: Supabase will write cookies onto THIS
  const cookieRes = new NextResponse(null);

  // Helper: produce a JSON response AND copy cookies written to cookieRes
  const respond = (body: any, status = 200) => {
    const out = NextResponse.json(body, { status });

    // copy cookies set during supabase calls
    cookieRes.cookies.getAll().forEach((c) => {
      out.cookies.set(c.name, c.value, c);
    });

    return out;
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieRes.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error: userErr } = await supabase.auth.getUser();
  const user = data?.user;

  if (userErr || !user) {
    return respond({ error: "Not authenticated" }, 401);
  }

  const userId = user.id;

  // 1) delete app data
  const { error: profileErr } = await supabase
    .from("seller_profiles")
    .delete()
    .eq("id", userId);

  if (profileErr) {
    return respond({ error: profileErr.message }, 500);
  }

  // 2) clear cookies / sign out (so browser is definitely logged out)
  // Even if the user is about to be deleted, we want cookies cleared.
  const { error: signoutErr } = await supabase.auth.signOut();
  if (signoutErr) {
    // not always fatal, but it’s useful to know if it’s failing
    return respond({ error: signoutErr.message }, 500);
  }

  // 3) delete auth user (service role)
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // ✅ server-only env var
    { auth: { persistSession: false } }
  );

  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) {
    return respond({ error: delErr.message }, 500);
  }

  return respond({ success: true }, 200);
}
