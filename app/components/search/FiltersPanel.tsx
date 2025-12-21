"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SERVICE_OPTIONS = [
  { key: "haircuts", label: "Haircuts" },
  { key: "nails", label: "Nails" },
  { key: "lashes", label: "Lashes" },
  { key: "brows", label: "Brows" },
  { key: "makeup", label: "Makeup" },
  { key: "tailor", label: "Tailor/hem" },
  { key: "tanning", label: "Tanning" },
  { key: "food", label: "Food" },
  { key: "photography", label: "Photography" },
  { key: "cleaning", label: "Cleaning" },
  { key: "other", label: "Other" },
];

function parseCSV(value: string | null) {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function toCSV(values: string[]) {
  return values.join(",");
}

export default function FiltersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // read current values from URL
  // useMemo menans this recomputes only if searchParams changes
  const selectedServices = useMemo(() => {
    return new Set(parseCSV(searchParams.get("services")));
  }, [searchParams]);    

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) params.delete(key);
    else params.set(key, value);

    // Keep URL clean: no empty "services=" or "maxPrice="
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleService(serviceKey: string) {
    const next = new Set(selectedServices);

    if (next.has(serviceKey)) next.delete(serviceKey);
    else next.add(serviceKey);

    const asArray = Array.from(next);
    updateParam("services", asArray.length ? toCSV(asArray) : null);
  }
  return (
    <div className="sm:max-w-[330px] w-full rounded-2xl border bg-white p-4 pb-8 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-900">Filters</h2>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-800">Service type</h3>
        <div className="space-y-1">
          {SERVICE_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className="flex items-center gap-2 text-sm text-neutral-700"
            >
              <input
                type="checkbox"
                className="accent-black"
                checked={selectedServices.has(opt.key)}
                onChange={() => toggleService(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>
    </div>
  )
}