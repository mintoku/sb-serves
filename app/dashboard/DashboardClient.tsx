"use client";

import type { Seller } from "@/app/components/search/SearchShell";

function sellerProfileRowToSeller(row: SellerProfile | null): Seller | null {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name ?? "Unnamed",
    bio: row.bio ?? undefined,

    services: Array.isArray(row.services)
      ? row.services
      : [],

    locationText: row.location_text ?? undefined,
    priceStart: row.price_start ?? undefined,

    instagramHandle: row.instagram_handle ?? undefined,

    instagramPostUrls: Array.isArray(row.instagram_post_urls)
      ? row.instagram_post_urls
      : [],
  };
}


import { useState } from "react";
import { useRouter } from "next/navigation";
import SellerProfile from "@/app/components/search/SellerProfile";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SellerProfile = {
  id: string;
  name: string | null;
  bio: string | null;
  location_text: string | null;
  price_start: number | null;
  services: string[] | null;
  instagram_handle: string | null;
  instagram_post_urls: string | null;
  portfolio_url: string | null;
};


function normalizeServices(services: unknown): string[] {
  // already an array
  if (Array.isArray(services)) return services.filter((x): x is string => typeof x === "string");

  // string could be CSV OR JSON array string
  if (typeof services === "string") {
    const s = services.trim();

    // If it looks like JSON array, parse it safely
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed
            .map((x) => String(x).trim())
            .filter(Boolean);
        }
      } catch {
        // fall through to CSV parsing
      }
    }

    // Otherwise treat as CSV
    return s
      .split(",")
      .map((x) => x.trim())
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
  const [previewProfile, setPreviewProfile] = useState<SellerProfile | null>(
    initialProfile
  );


  const [name, setName] = useState(initialProfile?.name ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [instagramHandle, setInstagramHandle] = useState(initialProfile?.instagram_handle ?? "");
  const [servicesCsv, setServicesCsv] = useState(
    normalizeServices(initialProfile?.services).join(", ")
  );
  const [location, setLocation] = useState(initialProfile?.location_text ?? "");
  const [priceStart, setPrice] = useState(initialProfile?.price_start ?? "");
  const [instagramPostUrls, setInstagramPostUrls] = useState(initialProfile?.instagram_post_urls ?? "");
  
  const [status, setStatus] = useState<string | null>(initialError);
  const [saving, setSaving] = useState(false);

    function parseServices(input: string) {
        return normalizeServices(input);
    }

    function normalizeInstagramUrls(
      input: string | string[] | null
    ): string[] {
      if (!input) return [];

      if (Array.isArray(input)) {
        return input.filter(Boolean).slice(0, 6);
      }

      return input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 6);
    }


  async function handleSave() {
    if (!name.trim()) {
      setStatus("Name is required.");
      return;
    }
    setSaving(true);
    setStatus(null);

    const services = parseServices(servicesCsv);

    const { error } = await supabase.from("seller_profiles").upsert(
    {
      id: userId,
      name: name.trim() || null,
      bio: bio.trim() || null,
      instagram_handle: instagramHandle.trim() || null,
      services: services.length ? services : null,
      location_text: location.trim() || null,
      price_start: priceStart ? Number(priceStart) : null, 
      instagram_post_urls: normalizeInstagramUrls(instagramPostUrls) || null, 
    },
    
    { onConflict: "id" },
  );
    if (!error) {
      setPreviewProfile({
        id: userId,
        name: name.trim() || null,
        bio: bio.trim() || null,
        services: services.length ? services : null,
        location_text: location.trim() || null,
        price_start: priceStart ? Number(priceStart) : null,
        instagram_handle: instagramHandle.trim() || null,
        instagram_post_urls: instagramPostUrls,
        portfolio_url: initialProfile?.portfolio_url ?? null,
      });
  }



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
    // Delete button UI state (optional; you can also just use window.confirm)
    const [deleting, setDeleting] = useState(false);

    async function handleDeleteAccount() {
        const ok = window.confirm(
        "This will permanently delete your account. This cannot be undone. Continue?"
        );
        if (!ok) return;

        setDeleting(true);
        setStatus(null);

        const res = await fetch("/auth/delete-account", { method: "POST" });

        // Protect against non-JSON responses
        const text = await res.text();
        let data: any = {};
        try {
        data = text ? JSON.parse(text) : {};
        } catch {
        // ignore, we'll handle below
        }

        if (!res.ok) {
            setStatus(data.error || "Failed to delete account");
            setDeleting(false);
            return;
        }
        // also clear any client-side auth state
        await supabase.auth.signOut();

        window.location.href = "/";
    }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-5 lg:grid-cols-2">
        {/* LEFT: dashboard/editor */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border bg-white p-6 shadow-sm sm:p-10">
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
                <div className="mb-2 text-sm font-medium text-zinc-800">Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium text-zinc-800">Bio</div>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="About you"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium text-zinc-800">
                  Instagram handle
                </div>
                <input
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="joes_killer_cuts"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium text-zinc-800">
                  Services (comma-separated)
                </div>
                <textarea
                  value={servicesCsv.replace(/"/g, "")}
                  onChange={(e) => setServicesCsv(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Brow threading, brow waxing, etc..."
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium text-zinc-800">Location</div>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="Isla Vista, Anacapa..."
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium text-zinc-800">
                  Starting price
                </div>
                <input
                  value={priceStart}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="10"
                  inputMode="numeric"
                />
              </label>

              <label className="block">
                <div className="mb-2 text-sm font-medium text-zinc-800">
                  URLs of Instagram posts to feature (comma-separated, 6 max)
                </div>
                <textarea
                  value={instagramPostUrls}
                  onChange={(e) => setInstagramPostUrls(e.target.value)}
                  className="min-h-[96px] w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2"
                  placeholder="https://www.instagram.com/..., https://www.instagram.com/..."
                />
                <p className="mt-2 text-xs text-zinc-500">
                  Currently: {normalizeInstagramUrls(instagramPostUrls).length}/6 (If posts don't show up, refresh or double check your URLs)
                </p>
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

              <button
                onClick={handleDeleteAccount}
                disabled={saving || deleting}
                className="w-full rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <SellerProfile seller={sellerProfileRowToSeller(previewProfile)} />
          </div>
        </aside>
      </div>
    </section>
  );
}
