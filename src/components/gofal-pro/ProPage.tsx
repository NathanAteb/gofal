"use client";

import { useState } from "react";
import { autoHeroIntro, autoServicesDescription, welshMediumBadgeTooltip, classifyServiceType, SERVICE_LABELS } from "@/lib/gofal/auto-populate";

type Lang = "en" | "cy";

interface CareHomeData {
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
  max_places: number | null;
  provider_name: string | null;
}

interface SubscriptionData {
  id: string;
  custom_subdomain: string | null;
  custom_domain: string | null;
  welsh_medium_declared: boolean;
  welsh_medium_verified_at: string | null;
  welsh_medium_deployment_notes: string | null;
}

interface PageContent {
  hero_intro_en: string | null;
  hero_intro_cy: string | null;
  services_description_en: string | null;
  services_description_cy: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  logo_url: string | null;
  primary_colour: string | null;
}

interface PagePhoto {
  id: string;
  photo_url: string;
  alt_text_en: string | null;
  alt_text_cy: string | null;
  display_order: number;
}

interface Props {
  home: CareHomeData;
  subscription: SubscriptionData;
  content: PageContent | null;
  photos: PagePhoto[];
}

const HEATHER = "#7B5B7E";
const BRAMBLE = "#4A2F4E";
const CORAL = "#D4806A";
const HONEY = "#E5AD3E";
const IVORY = "#FBF7F3";
const BLUSH = "#DDD4CE";
const DUSK = "#2C2430";
const LAVENDER = "#A68AAB";

const COPY = {
  en: {
    langToggle: "Cymraeg",
    services: "Our services",
    visiting: "Visiting & opening hours",
    contact: "Contact us",
    contactName: "Your name",
    contactEmail: "Your email",
    contactPhone: "Your phone (optional)",
    contactMessage: "Message",
    contactSubmit: "Send enquiry",
    contactPrivacy: "Your details are sent only to the care provider, never shared with third parties.",
    welshBadge: "Welsh-speaking staff available",
    welshBadgeVerified: "Welsh-speaking staff available — verified",
    poweredBy: "Powered by",
    ciwLabel: "Registered with Care Inspectorate Wales",
    placesLabel: "registered places",
    operatorLabel: "Operated by",
    locationLabel: "Located in",
    complianceTitle: "Compliance information",
    compliancePlaceholder: "Annual return, Statement of Purpose, ratings widget and complaints policy will appear here from June 2026 (under the Health & Social Care (Wales) Act 2025 publication duty).",
    sopTitle: "Statement of Purpose",
    sopPlaceholder: "The provider's Statement of Purpose will be hosted here.",
    photoGalleryTitle: "Photo gallery",
    sentSuccess: "Thank you — your enquiry has been sent.",
  },
  cy: {
    langToggle: "English",
    services: "Ein gwasanaethau",
    visiting: "Oriau ymweld ac agor",
    contact: "Cysylltwch â ni",
    contactName: "Eich enw",
    contactEmail: "Eich e-bost",
    contactPhone: "Eich ffôn (dewisol)",
    contactMessage: "Neges",
    contactSubmit: "Anfon ymholiad",
    contactPrivacy: "Anfonir eich manylion at y darparwr gofal yn unig — ni chânt eu rhannu â thrydydd parti.",
    welshBadge: "Staff sy'n siarad Cymraeg ar gael",
    welshBadgeVerified: "Staff sy'n siarad Cymraeg ar gael — wedi'i wirio",
    poweredBy: "Wedi'i bweru gan",
    ciwLabel: "Wedi'i gofrestru gydag Arolygiaeth Gofal Cymru",
    placesLabel: "o leoedd cofrestredig",
    operatorLabel: "Wedi'i gweithredu gan",
    locationLabel: "Wedi'i lleoli yn",
    complianceTitle: "Gwybodaeth gydymffurfio",
    compliancePlaceholder: "Bydd adroddiad blynyddol, Datganiad o Bwrpas, teclyn graddfeydd a pholisi cwynion yn ymddangos yma o Mehefin 2026 (o dan ddyletswydd cyhoeddi Deddf Iechyd a Gofal Cymdeithasol (Cymru) 2025).",
    sopTitle: "Datganiad o Bwrpas",
    sopPlaceholder: "Bydd Datganiad o Bwrpas y darparwr yn cael ei letya yma.",
    photoGalleryTitle: "Oriel luniau",
    sentSuccess: "Diolch — mae eich ymholiad wedi'i anfon.",
  },
};

export function ProPage({ home, subscription, content, photos }: Props) {
  const [lang, setLang] = useState<Lang>("cy"); // Welsh-first per CLAUDE.md
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const t = COPY[lang];

  const heroDefault = autoHeroIntro({
    name: home.name,
    service_type: home.service_type,
    service_sub_type: home.service_sub_type,
    town: home.town,
    local_authority: home.local_authority,
    max_places: home.max_places,
    ciw_service_id: home.ciw_service_id,
  });
  const servicesDefault = autoServicesDescription({
    service_type: home.service_type,
    service_sub_type: home.service_sub_type,
  });
  const serviceKey = classifyServiceType({
    service_type: home.service_type,
    service_sub_type: home.service_sub_type,
  });

  const heroIntro = (lang === "en" ? content?.hero_intro_en : content?.hero_intro_cy) ?? heroDefault[lang];
  const servicesText =
    (lang === "en" ? content?.services_description_en : content?.services_description_cy) ?? servicesDefault[lang];
  const contactName = content?.contact_name ?? home.provider_name ?? home.name;
  const contactPhone = content?.contact_phone ?? home.phone ?? "";
  const contactEmail = content?.contact_email ?? home.email ?? "";
  const accent = content?.primary_colour ?? HEATHER;

  const welshVerified = !!subscription.welsh_medium_verified_at;
  const welshTooltip = welshMediumBadgeTooltip(
    subscription.welsh_medium_verified_at ? new Date(subscription.welsh_medium_verified_at) : null
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/gofal/contact-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription_id: subscription.id,
          sender_name: formData.get("name"),
          sender_email: formData.get("email"),
          sender_phone: formData.get("phone") || null,
          message: formData.get("message"),
          language_preference: lang,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ background: IVORY, minHeight: "100vh", color: DUSK, fontFamily: "Nunito, system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: `1px solid ${BLUSH}`, background: "white" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {content?.logo_url ? (
            <img src={content.logo_url} alt={`${home.name} logo`} style={{ height: 56, width: 56, objectFit: "contain", borderRadius: 12 }} />
          ) : (
            <div style={{ height: 56, width: 56, borderRadius: 12, background: accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins, sans-serif", fontSize: 22, fontWeight: 700 }}>
              {home.name.charAt(0)}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 220 }}>
            <h1 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 24, fontWeight: 700, color: BRAMBLE, lineHeight: 1.15, margin: 0 }}>
              {home.name}
            </h1>
            <div style={{ fontSize: 13, color: "#6B5670", marginTop: 2 }}>
              {home.town}{home.local_authority ? `, ${home.local_authority}` : ""} · CIW {home.ciw_service_id}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "cy" : "en")}
            style={{
              border: `1.5px solid ${BLUSH}`,
              background: "white",
              color: BRAMBLE,
              padding: "6px 14px",
              borderRadius: 9999,
              fontFamily: "Nunito, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
            aria-label="Toggle language"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 24px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ background: accent, color: "white", padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>
            {SERVICE_LABELS[serviceKey][lang]}
          </span>
          {home.max_places && (serviceKey.startsWith("care-home")) && (
            <span style={{ background: HONEY, color: BRAMBLE, padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>
              {home.max_places} {t.placesLabel}
            </span>
          )}
          {subscription.welsh_medium_declared && (
            <span
              title={welshTooltip}
              style={{
                background: HEATHER,
                color: "white",
                padding: "4px 12px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              🏴 {welshVerified ? t.welshBadgeVerified : t.welshBadge}
            </span>
          )}
        </div>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: DUSK, margin: 0 }}>{heroIntro}</p>
      </section>

      {/* Services */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px" }}>
        <h2 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 22, color: BRAMBLE, marginTop: 16 }}>{t.services}</h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, color: DUSK }}>{servicesText}</p>
      </section>

      {/* Photo gallery */}
      {photos.length > 0 && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px" }}>
          <h2 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 22, color: BRAMBLE }}>{t.photoGalleryTitle}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {photos.map((p) => (
              <img
                key={p.id}
                src={p.photo_url}
                alt={(lang === "en" ? p.alt_text_en : p.alt_text_cy) ?? home.name}
                loading="lazy"
                style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 16, border: `1px solid ${BLUSH}` }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Statement of Purpose placeholder — Tier-1 D2.01 hook */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px" }}>
        <h2 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 22, color: BRAMBLE }}>{t.sopTitle}</h2>
        <div style={{ background: "white", border: `1px dashed ${BLUSH}`, borderRadius: 16, padding: 16, color: "#6B5670", fontSize: 14 }}>
          {t.sopPlaceholder}
        </div>
      </section>

      {/* Public Compliance — Tier-1 D1.05 hook */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px" }}>
        <h2 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 22, color: BRAMBLE }}>{t.complianceTitle}</h2>
        <div style={{ background: "white", border: `1px dashed ${BLUSH}`, borderRadius: 16, padding: 16, color: "#6B5670", fontSize: 14 }}>
          {t.compliancePlaceholder}
        </div>
      </section>

      {/* Contact */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px 48px" }}>
        <h2 style={{ fontFamily: "Poppins, system-ui, sans-serif", fontSize: 22, color: BRAMBLE }}>{t.contact}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="gofal-contact-grid">
          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${BLUSH}`, padding: 20 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#6B5670", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {home.address_line_1 ? "Address" : ""}
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.5 }}>
                {home.address_line_1}
                {home.address_line_2 && (
                  <>
                    <br />
                    {home.address_line_2}
                  </>
                )}
                <br />
                {home.town} {home.postcode}
              </div>
            </div>
            {contactPhone && (
              <div style={{ marginBottom: 8 }}>
                <a href={`tel:${contactPhone}`} style={{ color: accent, fontWeight: 700, textDecoration: "none" }}>
                  📞 {contactPhone}
                </a>
              </div>
            )}
            {contactEmail && (
              <div style={{ marginBottom: 8 }}>
                <a href={`mailto:${contactEmail}`} style={{ color: accent, textDecoration: "none" }}>
                  ✉ {contactEmail}
                </a>
              </div>
            )}
            <div style={{ marginTop: 14, fontSize: 13, color: "#6B5670" }}>
              <strong>{t.operatorLabel}:</strong> {contactName}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ background: "white", borderRadius: 16, border: `1px solid ${BLUSH}`, padding: 20 }}
          >
            {submitted ? (
              <div style={{ color: HEATHER, fontWeight: 700, padding: "12px 0" }}>{t.sentSuccess}</div>
            ) : (
              <>
                <FormField name="name" label={t.contactName} required />
                <FormField name="email" type="email" label={t.contactEmail} required />
                <FormField name="phone" type="tel" label={t.contactPhone} />
                <FormField name="message" label={t.contactMessage} as="textarea" required />
                {submitError && <div style={{ color: CORAL, fontSize: 13, margin: "6px 0" }}>{submitError}</div>}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: CORAL,
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: 9999,
                    fontFamily: "Poppins, system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {t.contactSubmit}
                </button>
                <div style={{ fontSize: 11, color: "#6B5670", marginTop: 10, lineHeight: 1.4 }}>{t.contactPrivacy}</div>
              </>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "white", borderTop: `1px solid ${BLUSH}`, padding: "20px 24px", textAlign: "center", fontSize: 13, color: "#6B5670" }}>
        <div>
          {home.name} · {t.ciwLabel} · {home.ciw_service_id}
        </div>
        <div style={{ marginTop: 6 }}>
          {t.poweredBy}{" "}
          <a href="https://gofal.wales" style={{ color: HEATHER, fontWeight: 700, textDecoration: "none" }}>
            gofal.wales
          </a>
        </div>
      </footer>

      <style>{`
        @media (max-width: 720px) {
          .gofal-contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

function FormField({
  name,
  label,
  type = "text",
  as,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  as?: "textarea";
  required?: boolean;
}) {
  const common = {
    name,
    required,
    style: {
      width: "100%",
      padding: "8px 12px",
      border: `1.5px solid ${BLUSH}`,
      borderRadius: 12,
      fontFamily: "inherit",
      fontSize: 14,
      color: DUSK,
      background: "white",
    } as React.CSSProperties,
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name} style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B5670", marginBottom: 4 }}>
        {label}
        {required ? " *" : ""}
      </label>
      {as === "textarea" ? <textarea {...common} rows={4} /> : <input type={type} {...common} />}
    </div>
  );
}
