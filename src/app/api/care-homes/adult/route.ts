import { NextResponse } from "next/server";
import { getReadonlyClient } from "@/lib/supabase/readonly";

// Cached for 1 hour at the edge — the CIW dataset only changes when we re-run the importer.
export const revalidate = 3600;

interface Row {
  ciw_service_id: string;
  name: string;
  service_type: string;
  service_sub_type: string | null;
  address_line_1: string;
  address_line_2: string | null;
  town: string;
  postcode: string;
  local_authority: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  main_language: string | null;
  max_places: number | null;
  provider_name: string | null;
  provider_approved_services: number | null;
  lat: number | null;
  lng: number | null;
  slug: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDom = searchParams.get("domiciliary") !== "false";

  const supabase = getReadonlyClient();
  // PostgREST caps each response at 1000 rows project-wide; paginate until exhausted.
  const PAGE = 1000;
  const rows: Row[] = [];
  for (let from = 0; ; from += PAGE) {
    let q = supabase
      .from("care_homes")
      .select(
        "ciw_service_id,name,service_type,service_sub_type,address_line_1,address_line_2,town,postcode,local_authority,phone,email,website,main_language,max_places,provider_name,provider_approved_services,lat,lng,slug"
      )
      .eq("is_active", true)
      .not("lat", "is", null)
      .not("lng", "is", null)
      .range(from, from + PAGE - 1);
    if (!includeDom) q = q.neq("service_type", "Domiciliary Support Service");
    const { data, error } = await q;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const page = (data ?? []) as unknown as Row[];
    rows.push(...page);
    if (page.length < PAGE) break;
  }

  const features = rows.map((r) => ({
    type: "Feature" as const,
    properties: {
      urn: r.ciw_service_id,
      name: r.name,
      slug: r.slug,
      serviceType: r.service_type,
      subType: r.service_sub_type,
      addressLine1: r.address_line_1,
      addressLine2: r.address_line_2,
      town: r.town,
      postcode: r.postcode,
      localAuthority: r.local_authority,
      phone: r.phone,
      email: r.email,
      website: r.website,
      language: r.main_language,
      maxPlaces: r.max_places,
      providerName: r.provider_name,
      providerApprovedServices: r.provider_approved_services,
    },
    geometry: { type: "Point" as const, coordinates: [r.lng!, r.lat!] },
  }));

  const counts: Record<string, number> = {};
  for (const r of rows) {
    const k = r.service_sub_type ? `${r.service_type}|${r.service_sub_type}` : r.service_type;
    counts[k] = (counts[k] ?? 0) + 1;
  }

  return NextResponse.json(
    {
      type: "FeatureCollection",
      generatedAt: new Date().toISOString(),
      counts: { total: rows.length, byBucket: counts },
      features,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
