"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SellerProfile = {
  id: string;
  name: string | null;
  bio: string | null;
  location_text: string | null;
  price_start: number | null;
  services: string[] | null;
  instagram_handle: string | null;
  portfolio_url: string | null;
};

export default function DashboardClient({
  userId,
  initialProfile,
  initialError,
}: {
  userId: string;
  initialProfile: SellerProfile | null;
  initialError: string | null;
}) {
  const router = useRouter();

  const [name, setName] = useState(initialProfile?.name ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [servicesCsv, setServicesCsv] = useState(
    (initialProfile?.services ?? []).join(", ")
  );
  const [status, setStatus] = useState<string | null>(initialError);
  const [saving, setSaving] = useState(false);

  function parseServices(csv: string) {
    return csv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);

    const services = parseServices(servicesCsv);

    const { error } = await supabase.from("seller_profiles").upsert(
      {
        id: userId,
        name: name.trim() || null,
        bio: bio.trim() || null,
        services: services.length ? services : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) setStatus(error.message);
    else setStatus("Saved");

    router.refresh();
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <section className="p-6 sm:p-10">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              Seller Dashboard
            </h1>
            <p className="mt-2 text-zinc-600">Edit your profile.</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-2xl border px-4 py-2 text-sm hover:bg-zinc-50"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 space-y-5">
          <label className="block">
            <div className="mb-2 text-sm font-medium text-zinc-800">Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
              placeholder="Isla Beauty"
            />
          </label>

          <label className="block">
            <div className="mb-2 text-sm font-medium text-zinc-800">Bio</div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-[120px] w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
              placeholder="What you offer, vibe, etc."
            />
          </label>

          <label className="block">
            <div className="mb-2 text-sm font-medium text-zinc-800">
              Services (comma-separated)
            </div>
            <input
              value={servicesCsv}
              onChange={(e) => setServicesCsv(e.target.value)}
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
              placeholder="nails, lashes, haircuts"
            />
          </label>

          {status && (
            <p className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              {status}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </section>
  );
}
