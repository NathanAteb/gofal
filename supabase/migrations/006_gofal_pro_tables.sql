-- 006_gofal_pro_tables.sql
-- Gofal Pro — managed listing tier (£99/month).
-- Adds the four tables needed for Pro tier subscriptions, customer-editable
-- page content, photo gallery and contact-form submissions.
--
-- The anchor row in care_homes is identified by ciw_service_id; we store that
-- as the foreign key (the spec called it ciw_service_urn but the existing
-- schema uses ciw_service_id — matching reality).

CREATE TABLE IF NOT EXISTS public.gofal_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ciw_service_id TEXT NOT NULL UNIQUE REFERENCES public.care_homes(ciw_service_id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'pro' CHECK (tier IN ('free', 'pro')),
  claimed_by_email TEXT,
  claimed_at TIMESTAMPTZ,
  pro_started_at TIMESTAMPTZ,
  pro_subscription_id TEXT,
  custom_subdomain TEXT UNIQUE,
  custom_domain TEXT UNIQUE,
  welsh_medium_declared BOOLEAN NOT NULL DEFAULT FALSE,
  welsh_medium_deployment_notes TEXT,
  welsh_medium_verified_at TIMESTAMPTZ,
  welsh_medium_verified_by TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  -- Phase-2 hook for the Tier-1 Public Compliance Page (D1.05) and Statement of
  -- Purpose (D2.01) builds. Populated when a Gofal Pro customer becomes an Ateb
  -- Care tenant — at which point the compliance section auto-fills from the
  -- linked tenant. NULL until that happens.
  linked_ateb_tenant_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gofal_subscriptions_tier_idx ON public.gofal_subscriptions (tier);
CREATE INDEX IF NOT EXISTS gofal_subscriptions_status_idx ON public.gofal_subscriptions (status);
CREATE INDEX IF NOT EXISTS gofal_subscriptions_custom_subdomain_idx ON public.gofal_subscriptions (custom_subdomain) WHERE custom_subdomain IS NOT NULL;
CREATE INDEX IF NOT EXISTS gofal_subscriptions_custom_domain_idx ON public.gofal_subscriptions (custom_domain) WHERE custom_domain IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.gofal_page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL UNIQUE REFERENCES public.gofal_subscriptions(id) ON DELETE CASCADE,
  hero_intro_en TEXT,
  hero_intro_cy TEXT,
  services_description_en TEXT,
  services_description_cy TEXT,
  opening_hours JSONB,
  visiting_hours JSONB,
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  logo_url TEXT,
  primary_colour TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gofal_page_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.gofal_subscriptions(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  alt_text_en TEXT,
  alt_text_cy TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gofal_page_photos_subscription_idx
  ON public.gofal_page_photos (subscription_id, display_order);

CREATE TABLE IF NOT EXISTS public.gofal_contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.gofal_subscriptions(id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_phone TEXT,
  message TEXT NOT NULL,
  language_preference TEXT CHECK (language_preference IN ('en', 'cy')),
  forwarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gofal_contact_submissions_subscription_idx
  ON public.gofal_contact_submissions (subscription_id, created_at DESC);

ALTER TABLE public.gofal_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gofal_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gofal_page_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gofal_contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read of active Pro subscriptions and their page content / photos —
-- this is what server-rendering the public Pro page relies on. Service-role
-- bypasses RLS, so admin and Stripe-webhook writes work transparently.
CREATE POLICY gofal_subscriptions_public_read
  ON public.gofal_subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE POLICY gofal_page_content_public_read
  ON public.gofal_page_content
  FOR SELECT
  TO anon, authenticated
  USING (
    subscription_id IN (SELECT id FROM public.gofal_subscriptions WHERE status = 'active')
  );

CREATE POLICY gofal_page_photos_public_read
  ON public.gofal_page_photos
  FOR SELECT
  TO anon, authenticated
  USING (
    subscription_id IN (SELECT id FROM public.gofal_subscriptions WHERE status = 'active')
  );

-- Contact submissions: insert-only for the public (form posts); reads are
-- admin-only via service role. No public read policy intentionally.
CREATE POLICY gofal_contact_submissions_public_insert
  ON public.gofal_contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
