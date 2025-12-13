import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";

type Seller = {
  id: string;
  name: string | null;
  bio: string | null;
  location_area: string | null;
  portfolio_url: string | null;
  created_at: string | string;
};

type Service = {
  id: string;
  seller_id: string;
  type: string | null;
  price_from: number | null;
  created_at: string | null;
};

export async function GET() {
  try {
    const supabase = createClient();

    // 1) Get sellers
    const { data: sellers, error: sellersError } = await supabase
      .from("seller_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (sellersError) {
      return NextResponse.json({ error: sellersError.message }, { status: 500 });
    }

    // 2) Get services
    const { data: services, error: servicesError } = await supabase
      .from("services")
      .select("*");

    if (servicesError) {
      return NextResponse.json({ error: servicesError.message }, { status: 500 });
    }

    // 3) Merge: attach services to each seller
    const servicesBySeller = new Map<string, Service[]>();
    (services ?? []).forEach((svc: any) => {
      const s = svc as Service;
      const arr = servicesBySeller.get(s.seller_id) ?? [];
      arr.push(s);
      servicesBySeller.set(s.seller_id, arr);
    });

    const combined = (sellers ?? []).map((seller: any) => {
      const s = seller as Seller;
      return {
        ...s,
        services: servicesBySeller.get(s.id) ?? [],
      };
    });

    return NextResponse.json({ sellers: combined });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
