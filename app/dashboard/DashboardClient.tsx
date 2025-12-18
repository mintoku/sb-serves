"use client";

import type { Seller } from "@/app/components/search/SearchShell";
import TextareaField from "@/app/dashboard/TextareaField";
import { SERVICE_OPTIONS } from "@/app/lib/services";


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

    instagramPostUrls: row.instagram_post_urls ?? [],
  };
}


import { useState } from "react";
import { useRouter } from "next/navigation";
import SellerProfile from "@/app/components/search/SellerProfile";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { start } from "node:repl";

type SellerProfile = {
  id: string;
  name: string | null;
  bio: string | null;
  location_text: string | null;
  price_start: number | null;
  services: string[] | null;
  instagram_handle: string | null;
  instagram_post_urls: string[] | null;
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
  // const [servicesCsv, setServicesCsv] = useState(
  //   normalizeServices(initialProfile?.services).join(", ")
  // );
  const [location, setLocation] = useState(initialProfile?.location_text ?? "");
  const [priceStart, setPrice] = useState(initialProfile?.price_start ?? "");
const [instagramPostUrls, setInstagramPostUrls] = useState(
  (initialProfile?.instagram_post_urls ?? []).join(", ")
);  
  const [status, setStatus] = useState<string | null>(initialError);
  const [saving, setSaving] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>(
  // if you're loading an existing profile into the form:
  Array.isArray(initialProfile?.services) ? initialProfile.services : []
);

    function toggleService(service: string) {
      setSelectedServices((prev) =>
        prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
      );
    }

    // function parseServices(input: string) {
    //     return normalizeServices(input);
    // }

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
    if (priceStart && Number.isNaN(Number(priceStart))) {
      setStatus("Price must be a number");
      return;
    }
    setSaving(true);
    setStatus(null);

    // const services = parseServices(servicesCsv);
    const services = selectedServices;
    
    const normalizedPostUrls = normalizeInstagramUrls(instagramPostUrls);

    const { error } = await supabase.from("seller_profiles").upsert(
    {
      id: userId,
      name: name.trim() || null,
      bio: bio.trim() || null,
      instagram_handle: instagramHandle.trim() || null,
      services: services.length ? services : null,
      location_text: location.trim() || null,
      price_start: priceStart ? Number(priceStart) : null, 
      instagram_post_urls: normalizedPostUrls.length ? normalizedPostUrls : null, // if normalized posturls is nonzero, use it; otherwise its null
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
        instagram_post_urls: normalizedPostUrls.length ? normalizedPostUrls : null,
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

    async function handleDeleteAccount() {
        const ok = window.confirm(
        "This will permanently delete your account. This cannot be undone. Continue?"
        );
        if (!ok) return;
  

        const res = await fetch("/auth/delete-account", { method: "POST" });
        const data = await res.json();

          if (!res.ok) {
            setStatus(data.error || "Failed to delete account");
            return;
          }

          // ensure client state + local session updates immediately
          await supabase.auth.signOut();

          // update any server components / header that depend on auth
          router.push("/");
          router.refresh();
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
                <p className="mb-4 mt-2 text-zinc-600">Edit your profile.</p>
              </div>

              <button
                onClick={handleSignOut}
                disabled={saving}
                className="rounded-2xl border px-4 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
              >
                {saving ? "Signing out…" : "Sign out"}
              </button>
            </div>
            <div className="lg:col-span-1">
              <TextareaField
              label="Your name"
              value={name}
              onChange={setName}
              placeholder="Name"
              maxChars={100}
            />

            <TextareaField
              label="Bio"
              value={bio}
              onChange={setBio}
              placeholder="About you"
              maxChars={100}
              minHeight={60}
            />

            <TextareaField
              label="Instagram handle"
              value={instagramHandle}
              onChange={setInstagramHandle}
              placeholder="joes_killer_cuts"
              maxChars={30}
              minHeight={60}
            />
              
            {/* <TextareaField
              label="Services (comma-separated list)"
              value={servicesCsv.replace(/"/g, "")}
              onChange={setServicesCsv}
              placeholder="Brow threading, brow waxing, etc..."
              maxChars={60}
              minHeight={60}
            /> */}

            <div className="rounded-2xl border bg-white p-4 mt-3 mb-5">
              <h3 className="text-sm font-semibold text-neutral-900">Services</h3>
              <p className="mt-1 text-xs text-neutral-600">Select all that apply.</p>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {SERVICE_OPTIONS.map((service) => {
                  const checked = selectedServices.includes(service);
                  return (
                    <label
                      key={service}
                      className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:border-neutral-400"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleService(service)}
                        className="h-4 w-4"
                      />
                      <span className="text-neutral-800">{service}</span>
                    </label>
                  );
                })}
              </div>
            </div>


            <TextareaField
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Isla Vista, Anacapa..."
              maxChars={30}
              minHeight={60}
            />


            <TextareaField
              label="Starting price"
              value={priceStart}
              onChange={setPrice}
              placeholder="10"
              maxChars={5}
              minHeight={60}
            />


            <TextareaField
              label="URLs of Instagram posts to feature (comma-separated, 6 max)"
              value={instagramPostUrls}
              onChange={setInstagramPostUrls}
              placeholder="https://www.instagram.com/..., https://www.instagram.com/..."
              maxChars={400}
              minHeight={60}
            />

              {status && (
                <p className="space-y-1 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  {status}
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-8 w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>

              <button
                onClick={handleDeleteAccount}
                className="mt-3 w-full rounded-2xl border border-red-300 bg-red-50 px-4 py-3 text-red-700 hover:bg-red-100 disabled:opacity-60"
              >Delete account
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
