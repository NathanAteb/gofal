-- gofal.wales database schema
-- Run this in Supabase SQL editor to set up the database

-- Care homes table
CREATE TABLE IF NOT EXISTS care_homes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciw_service_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_cy TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  town TEXT NOT NULL,
  county TEXT NOT NULL,
  postcode TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  service_type TEXT NOT NULL DEFAULT 'residential',
  operator_name TEXT,
  registered_manager TEXT,
  registration_date DATE,
  bed_count INTEGER,
  local_authority TEXT,
  ciw_rating_wellbeing TEXT,
  ciw_rating_care_support TEXT,
  ciw_rating_leadership TEXT,
  ciw_rating_environment TEXT,
  ciw_last_inspected DATE,
  ciw_report_url TEXT,
  active_offer_level INTEGER NOT NULL DEFAULT 0 CHECK (active_offer_level BETWEEN 0 AND 3),
  active_offer_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_claimed BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  listing_tier TEXT NOT NULL DEFAULT 'free' CHECK (listing_tier IN ('free', 'enhanced', 'featured')),
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Care home profiles (extended info for claimed homes)
CREATE TABLE IF NOT EXISTS care_home_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  care_home_id UUID NOT NULL REFERENCES care_homes(id) ON DELETE CASCADE UNIQUE,
  description TEXT,
  description_cy TEXT,
  photos TEXT[] DEFAULT '{}',
  video_url TEXT,
  services TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  welsh_language_notes TEXT,
  weekly_fee_from INTEGER,
  weekly_fee_to INTEGER,
  accepts_local_authority BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  care_home_id UUID NOT NULL REFERENCES care_homes(id) ON DELETE CASCADE,
  family_name TEXT NOT NULL,
  family_email TEXT NOT NULL,
  family_phone TEXT,
  care_needed_for TEXT NOT NULL,
  care_type TEXT NOT NULL,
  timeline TEXT NOT NULL,
  welsh_speaker BOOLEAN NOT NULL DEFAULT FALSE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'sent', 'responded', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Claims
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  care_home_id UUID NOT NULL REFERENCES care_homes(id) ON DELETE CASCADE,
  claimant_name TEXT NOT NULL,
  claimant_email TEXT NOT NULL,
  claimant_role TEXT NOT NULL,
  verification_token TEXT NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_care_homes_county ON care_homes(county);
CREATE INDEX IF NOT EXISTS idx_care_homes_slug ON care_homes(slug);
CREATE INDEX IF NOT EXISTS idx_care_homes_active ON care_homes(is_active);
CREATE INDEX IF NOT EXISTS idx_care_homes_featured ON care_homes(is_featured);
CREATE INDEX IF NOT EXISTS idx_care_homes_active_offer ON care_homes(active_offer_level);
CREATE INDEX IF NOT EXISTS idx_care_homes_name_search ON care_homes USING gin(to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_care_homes_town_search ON care_homes USING gin(to_tsvector('simple', town));
CREATE INDEX IF NOT EXISTS idx_enquiries_care_home ON enquiries(care_home_id);
CREATE INDEX IF NOT EXISTS idx_claims_care_home ON claims(care_home_id);
CREATE INDEX IF NOT EXISTS idx_claims_token ON claims(verification_token);

-- RLS (Row Level Security)
ALTER TABLE care_homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_home_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Public read for care homes
CREATE POLICY "Public can view active care homes"
  ON care_homes FOR SELECT
  USING (is_active = TRUE);

-- Public read for profiles
CREATE POLICY "Public can view care home profiles"
  ON care_home_profiles FOR SELECT
  USING (TRUE);

-- Anyone can create enquiries
CREATE POLICY "Anyone can create enquiries"
  ON enquiries FOR INSERT
  WITH CHECK (TRUE);

-- Anyone can create claims
CREATE POLICY "Anyone can create claims"
  ON claims FOR INSERT
  WITH CHECK (TRUE);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER care_homes_updated_at
  BEFORE UPDATE ON care_homes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER care_home_profiles_updated_at
  BEFORE UPDATE ON care_home_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
