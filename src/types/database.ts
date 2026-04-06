export interface CareHome {
  id: string;
  ciw_service_id: string;
  name: string;
  name_cy: string | null;
  address_line_1: string;
  address_line_2: string | null;
  town: string;
  county: string;
  postcode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  lat: number | null;
  lng: number | null;
  service_type: string;
  operator_name: string | null;
  registered_manager: string | null;
  registration_date: string | null;
  bed_count: number | null;
  local_authority: string | null;
  ciw_rating_wellbeing: string | null;
  ciw_rating_care_support: string | null;
  ciw_rating_leadership: string | null;
  ciw_rating_environment: string | null;
  ciw_last_inspected: string | null;
  ciw_report_url: string | null;
  active_offer_level: number;
  active_offer_verified: boolean;
  is_claimed: boolean;
  is_active: boolean;
  is_featured: boolean;
  listing_tier: "free" | "enhanced" | "featured";
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CareHomeProfile {
  id: string;
  care_home_id: string;
  description: string | null;
  description_cy: string | null;
  photos: string[];
  video_url: string | null;
  services: string[];
  amenities: string[];
  welsh_language_notes: string | null;
  weekly_fee_from: number | null;
  weekly_fee_to: number | null;
  accepts_local_authority: boolean;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  care_home_id: string;
  family_name: string;
  family_email: string;
  family_phone: string | null;
  care_needed_for: string;
  care_type: string;
  timeline: string;
  welsh_speaker: boolean;
  message: string | null;
  status: "new" | "sent" | "responded" | "converted";
  created_at: string;
}

export interface Claim {
  id: string;
  care_home_id: string;
  claimant_name: string;
  claimant_email: string;
  claimant_role: string;
  verification_token: string;
  verified: boolean;
  created_at: string;
}

export interface CareHomeWithProfile extends CareHome {
  care_home_profiles: CareHomeProfile | null;
}

export type County = {
  slug: string;
  name_en: string;
  name_cy: string;
};

export interface SearchFilters {
  query?: string;
  county?: string;
  care_type?: string;
  active_offer_level?: number;
  min_rating?: string;
  beds_available?: boolean;
  sort?: "relevance" | "rating" | "fee_low" | "fee_high" | "distance";
  page?: number;
  per_page?: number;
  lat?: number;
  lng?: number;
}
