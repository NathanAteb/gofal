import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { getCountyBySlug, counties } from "@/lib/utils/counties";
import { CareHomeProfile } from "./CareHomeProfile";
import { CountyPage } from "./CountyPage";
import type { Metadata } from "next";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Check if it's a county
  const county = getCountyBySlug(slug);
  if (county) {
    return {
      title: `Cartrefi Gofal yn ${county.name_cy} / Care Homes in ${county.name_en}`,
      description: `Dewch o hyd i gartrefi gofal yn ${county.name_cy}. Find care homes in ${county.name_en} with CIW ratings and Welsh language information.`,
      alternates: {
        languages: { cy: `/cartrefi-gofal/${slug}`, en: `/cartrefi-gofal/${slug}` },
      },
    };
  }

  // It's a care home
  try {
    const supabase = await createServiceClient();
    const { data: home } = await supabase
      .from("care_homes")
      .select("name, name_cy, town, county")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!home) return { title: "Not Found" };

    return {
      title: `${home.name} — ${home.town}`,
      description: `${home.name} — cartref gofal yn ${home.town}, ${home.county}. Gweld graddfeydd CIW, prisiau, a gwybodaeth Gymraeg.`,
      alternates: {
        languages: { cy: `/cartrefi-gofal/${slug}`, en: `/cartrefi-gofal/${slug}` },
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;

  // Check if it's a county
  const county = getCountyBySlug(slug);
  if (county) {
    return <CountyPage county={county} />;
  }

  // It's a care home
  try {
    const supabase = await createServiceClient();

    const { data: home } = await supabase
      .from("care_homes")
      .select("*, care_home_profiles(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!home) notFound();

    const { data: related } = await supabase
      .from("care_homes")
      .select("id, name, name_cy, slug, town, county, active_offer_level, ciw_rating_care_support, bed_count, listing_tier, is_featured, is_active, is_claimed, active_offer_verified, ciw_service_id, address_line_1, address_line_2, postcode, service_type, created_at, updated_at, care_home_profiles(weekly_fee_from, photos)")
      .eq("county", home.county)
      .eq("is_active", true)
      .neq("id", home.id)
      .limit(3);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <CareHomeProfile home={home as any} related={(related || []) as any} />;
  } catch {
    notFound();
  }
}
