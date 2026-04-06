import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q") || "";
  const county = params.get("county") || "";
  const careType = params.get("care_type") || "";
  const activeOfferLevel = params.get("active_offer_level");
  const sort = params.get("sort") || "relevance";
  const page = parseInt(params.get("page") || "1");
  const perPage = Math.min(parseInt(params.get("per_page") || "12"), 50);

  try {
    const supabase = await createClient();
    let dbQuery = supabase
      .from("care_homes")
      .select("*, care_home_profiles(*)", { count: "exact" })
      .eq("is_active", true);

    // Text search
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,town.ilike.%${query}%,postcode.ilike.%${query}%,name_cy.ilike.%${query}%`
      );
    }

    // County filter
    if (county) {
      dbQuery = dbQuery.eq("county", county);
    }

    // Care type filter
    if (careType) {
      dbQuery = dbQuery.ilike("service_type", `%${careType}%`);
    }

    // Active offer level
    if (activeOfferLevel) {
      dbQuery = dbQuery.gte("active_offer_level", parseInt(activeOfferLevel));
    }

    // Sort
    switch (sort) {
      case "rating":
        dbQuery = dbQuery.order("ciw_rating_care_support", {
          ascending: false,
          nullsFirst: false,
        });
        break;
      case "fee_low":
        dbQuery = dbQuery.order("care_home_profiles(weekly_fee_from)", {
          ascending: true,
          nullsFirst: false,
        });
        break;
      case "fee_high":
        dbQuery = dbQuery.order("care_home_profiles(weekly_fee_from)", {
          ascending: false,
          nullsFirst: false,
        });
        break;
      default:
        // Featured first, then by name
        dbQuery = dbQuery
          .order("is_featured", { ascending: false })
          .order("listing_tier", { ascending: false })
          .order("name", { ascending: true });
    }

    // Pagination
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    dbQuery = dbQuery.range(from, to);

    const { data, count, error } = await dbQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      homes: data || [],
      total: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
