-- 005_adult_sector_columns.sql
-- Adds CIW provider/operator fields needed for the adult-sector import
-- so we can preserve every field from the public CIW register without flattening.

ALTER TABLE care_homes
  ADD COLUMN IF NOT EXISTS service_sub_type TEXT,
  ADD COLUMN IF NOT EXISTS responsible_individual TEXT,
  ADD COLUMN IF NOT EXISTS provider_urn TEXT,
  ADD COLUMN IF NOT EXISTS provider_name TEXT,
  ADD COLUMN IF NOT EXISTS provider_company_number TEXT,
  ADD COLUMN IF NOT EXISTS provider_approved_services INTEGER,
  ADD COLUMN IF NOT EXISTS max_places INTEGER,
  ADD COLUMN IF NOT EXISTS main_language TEXT,
  ADD COLUMN IF NOT EXISTS ciw_last_updated TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS care_homes_service_sub_type_idx ON care_homes (service_sub_type);
CREATE INDEX IF NOT EXISTS care_homes_provider_urn_idx ON care_homes (provider_urn);
CREATE INDEX IF NOT EXISTS care_homes_lat_lng_idx ON care_homes (lat, lng) WHERE lat IS NOT NULL AND lng IS NOT NULL;
