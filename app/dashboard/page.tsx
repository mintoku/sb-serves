// app/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log()
    redirect("/signin");
  }
  const { data: profile, error } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <DashboardClient
      userId={user.id}
      initialProfile={profile ?? null}
      initialError={error?.message ?? null}
    />
  );
}
