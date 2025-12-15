"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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

function normalizeServices(services: unknown): string[] {
  if (Array.isArray(services)) return services;

  if (typeof services === "string") {
    return services
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  return [];
}

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

  const supabase = createSupabaseBrowserClient();

  const [name, setName] = useState(initialProfile?.name ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [servicesCsv, setServicesCsv] = useState(
    normalizeServices(initialProfile?.services).join(", ")
  );
  const [location, setLocation] = useState(initialProfile?.location_text ?? "");
  const [priceStart, setPrice] = useState(initialProfile?.price_start ?? "");
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
      },
      { onConflict: "id" }
    );

    setStatus(error ? error.message : "Saved");
    router.refresh();
    setSaving(false);
  }

  async function handleSignOut() {
    setStatus(null);
    setSaving(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setStatus(error.message);
      setSaving(false);
      return;
    }

    // make Next re-check cookies (server components + middleware)
    router.refresh();

    router.replace("/signin");
    setSaving(false);
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
            disabled={saving}
            className="rounded-2xl border px-4 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
          >
            {saving ? "Signing out…" : "Sign out"}
          </button>
        </div>

        <div className="mt-8 space-y-5">
            <label className="block">
                <div className="mb-2 text-sm font-medium" text-zinc-800>Name</div>
                <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                placeholder="Your name"
                />
            </label>

            <label className="block">
                <div className="mb-2 text-sm font-medium" text-zinc-800>Bio</div>
                <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                placeholder="About you"
                />
            </label>

            <label className="block">
                <div className="mb-2 text-sm font-medium" text-zinc-800>Services (comma-separated)</div>
                <textarea
                value={servicesCsv}
                onChange={(e) => setServicesCsv(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                placeholder="Brow threading, brow waxing, etc..."
                />
            </label>

            <label className="block">
                <div className="mb-2 text-sm font-medium" text-zinc-800>Location</div>
                <textarea
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                placeholder="Isla Vista, Anacapa..."
                />
            </label>

            <label className="block">
                <div className="mb-2 text-sm font-medium" text-zinc-800>Starting price</div>
                <textarea
                value={priceStart}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                placeholder="$10"
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
