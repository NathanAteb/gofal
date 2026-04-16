"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ActiveOfferBadge } from "@/components/ui/ActiveOfferBadge";
import { CiwRatingBadge } from "@/components/ui/CiwRatingBadge";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { CareHomeCard } from "@/components/cards/CareHomeCard";
import { CareHomeMap } from "@/components/maps/CareHomeMap";
import { formatDate, formatFeeRange, formatPhoneForTel } from "@/lib/utils/format";
import { getCountyBySlug } from "@/lib/utils/counties";
import type { CareHome, CareHomeProfile as ProfileType } from "@/types/database";

interface Props {
  home: CareHome & { care_home_profiles: ProfileType | null };
  related: (CareHome & { care_home_profiles?: { weekly_fee_from: number | null; photos: string[] } | null })[];
}

const SERVICE_LABELS: Record<string, { cy: string; en: string }> = {
  residential: { cy: "Gofal preswyl", en: "Residential care" },
  nursing: { cy: "Gofal nyrsio", en: "Nursing care" },
  dementia: { cy: "Gofal dementia", en: "Dementia care" },
  respite: { cy: "Gofal seibiant", en: "Respite care" },
  "personal care": { cy: "Gofal personol", en: "Personal care" },
  activities: { cy: "Gweithgareddau", en: "Activities" },
};

const AMENITY_LABELS: Record<string, { cy: string; en: string }> = {
  garden: { cy: "Gardd", en: "Garden" },
  lounge: { cy: "Lolfa", en: "Lounge" },
  "dining room": { cy: "Ystafell fwyta", en: "Dining room" },
};

const ALL_SERVICES = ["residential", "nursing", "dementia", "respite", "personal care", "activities"];
const ALL_AMENITIES = ["garden", "lounge", "dining room"];

export function CareHomeProfile({ home, related }: Props) {
  const { locale, t } = useI18n();
  const [activeSection, setActiveSection] = useState("overview");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const name = (locale === "cy" && home.name_cy) ? home.name_cy : home.name;
  const profile = home.care_home_profiles;
  const county = getCountyBySlug(home.county);
  const countyName = county
    ? locale === "cy" ? county.name_cy : county.name_en
    : home.county;

  const description = profile
    ? locale === "cy" ? profile.description_cy : profile.description
    : null;

  const photos = profile?.photos && profile.photos.length > 0
    ? profile.photos
    : [
        "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=75&fm=webp&fit=crop",
        "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&q=75&fm=webp&fit=crop",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=75&fm=webp&fit=crop",
      ];

  const hasRealPhotos = !!(profile?.photos && profile.photos.length > 0);

  // Sticky section nav — track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["overview", "photos", "about", "pricing", "ratings", "services", "amenities", "funding", "welsh", "location", "faq"];
      for (const id of sections) {
        const el = sectionRefs.current[id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Build FAQ items
  const faqItems = buildFaqItems(home, profile, name, locale);

  // JSON-LD schemas
  const jsonLdNursingHome = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    name: home.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: [home.address_line_1, home.address_line_2].filter(Boolean).join(", "),
      addressLocality: home.town,
      addressRegion: home.county,
      postalCode: home.postcode,
      addressCountry: "GB",
    },
    ...(home.phone && { telephone: home.phone }),
    ...(home.website && { url: home.website }),
    ...(home.lat && home.lng && {
      geo: { "@type": "GeoCoordinates", latitude: home.lat, longitude: home.lng },
    }),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "cy" ? "Hafan" : "Home", item: "https://gofal.wales" },
      { "@type": "ListItem", position: 2, name: locale === "cy" ? "Cartrefi Gofal" : "Care Homes", item: "https://gofal.wales/cartrefi-gofal" },
      ...(county ? [{ "@type": "ListItem", position: 3, name: countyName, item: `https://gofal.wales/cartrefi-gofal/${county.slug}` }] : []),
      { "@type": "ListItem", position: county ? 4 : 3, name },
    ],
  };

  const ratings = [
    { key: "profile.wellbeing", value: home.ciw_rating_wellbeing },
    { key: "profile.care_support", value: home.ciw_rating_care_support },
    { key: "profile.leadership", value: home.ciw_rating_leadership },
    { key: "profile.environment", value: home.ciw_rating_environment },
  ] as const;

  const lowestRating = getLowestRating(ratings.map((r) => r.value));

  const sections = [
    { id: "overview", label: locale === "cy" ? "Trosolwg" : "Overview" },
    { id: "photos", label: locale === "cy" ? "Lluniau" : "Photos" },
    { id: "pricing", label: locale === "cy" ? "Prisiau" : "Pricing" },
    { id: "ratings", label: "CIW" },
    { id: "services", label: locale === "cy" ? "Gwasanaethau" : "Services" },
    { id: "amenities", label: locale === "cy" ? "Cyfleusterau" : "Facilities" },
    { id: "welsh", label: locale === "cy" ? "Cymraeg" : "Welsh" },
    { id: "location", label: locale === "cy" ? "Lleoliad" : "Location" },
    { id: "faq", label: locale === "cy" ? "Cwestiynau" : "FAQs" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdNursingHome) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* Sticky section nav */}
      <div className="sticky top-[64px] z-30 border-b border-blush-grey bg-white/95 backdrop-blur-sm" data-print-hidden>
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 sm:px-6">
          <nav className="flex gap-1 py-2" aria-label="Page sections">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                  activeSection === id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-plum hover:bg-ivory hover:text-dusk"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label_cy: "Cartrefi Gofal", label_en: "Care Homes", href: "/cartrefi-gofal" },
            ...(county
              ? [{ label_cy: county.name_cy, label_en: county.name_en, href: `/cartrefi-gofal/${county.slug}` }]
              : []),
            { label_cy: name, label_en: home.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* ===== Main content ===== */}
          <div className="lg:col-span-2">

            {/* Hero / Overview */}
            <section ref={(el) => { sectionRefs.current.overview = el; }} id="overview">
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">{name}</h1>
              <p className="mt-2 text-muted-plum">
                {[home.address_line_1, home.address_line_2, home.town, home.postcode]
                  .filter(Boolean)
                  .join(", ")}
                {home.lat && home.lng && (
                  <button onClick={() => scrollTo("location")} className="ml-2 text-sm font-semibold text-primary hover:underline">
                    {locale === "cy" ? "Gweld ar y map" : "View on map"}
                  </button>
                )}
              </p>

              {/* CIW + Price summary strip */}
              <div className="mt-4 flex flex-wrap items-center gap-4 rounded-[16px] border border-blush-grey bg-white p-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-muted-plum uppercase tracking-wide">CIW</span>
                  <CiwRatingBadge rating={lowestRating} size="sm" />
                </div>
                <div className="h-6 w-px bg-blush-grey" />
                {profile?.weekly_fee_from ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-plum uppercase tracking-wide">
                      {locale === "cy" ? "Pris o" : "Price from"}
                    </span>
                    <span className="text-sm font-bold text-dusk">
                      &pound;{profile.weekly_fee_from}
                      <span className="font-normal text-muted-plum">{locale === "cy" ? "/wythnos" : "/week"}</span>
                    </span>
                    <button onClick={() => scrollTo("pricing")} className="text-sm font-semibold text-primary hover:underline">
                      {locale === "cy" ? "Gweld prisiau" : "View pricing"}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-muted-plum">{locale === "cy" ? "Cysylltwch am brisiau" : "Contact for pricing"}</span>
                )}
                <div className="h-6 w-px bg-blush-grey hidden sm:block" />
                <ActiveOfferBadge level={home.active_offer_level} size="md" />
              </div>
            </section>

            {/* Photo gallery — 1 large + 2 small */}
            <section ref={(el) => { sectionRefs.current.photos = el; }} id="photos" className="mt-6">
              <div className="relative grid grid-cols-2 gap-2 sm:grid-cols-4 sm:grid-rows-2">
                {/* Large photo */}
                <div className="col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-l-[16px] bg-linen">
                  <img
                    src={photos[0]}
                    alt={`${name} — ${locale === "cy" ? "prif lun" : "main photo"}`}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="eager"
                  />
                </div>
                {/* Small photos */}
                {photos.slice(1, 3).map((photo, i) => (
                  <div
                    key={i}
                    className={`aspect-[4/3] overflow-hidden bg-linen ${
                      i === 0 ? "rounded-tr-[16px]" : "rounded-br-[16px]"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${name} — ${locale === "cy" ? "llun" : "photo"} ${i + 2}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ))}
                {/* Show all photos overlay */}
                {photos.length > 3 && (
                  <button
                    onClick={() => setShowAllPhotos(true)}
                    className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-dusk shadow-card backdrop-blur-sm transition-colors hover:bg-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                    </svg>
                    {t("profile.show_all_photos")} ({photos.length})
                  </button>
                )}
              </div>
              {!hasRealPhotos && (
                <p className="mt-2 text-[10px] text-muted-plum/60">Photos by Unsplash contributors</p>
              )}
            </section>

            {/* Photo lightbox */}
            {showAllPhotos && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-dusk/90 p-4" onClick={() => setShowAllPhotos(false)}>
                <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[16px] bg-white p-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowAllPhotos(false)}
                    className="absolute right-3 top-3 z-10 rounded-full bg-ivory p-2 text-dusk hover:bg-blush-grey"
                    aria-label={t("common.close")}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="aspect-[4/3] overflow-hidden rounded-[12px] bg-linen">
                        <img src={photo} alt={`${name} — ${i + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* About + Key Facts */}
            {description && (
              <section ref={(el) => { sectionRefs.current.about = el; }} id="about" className="mt-8">
                <h2 className="font-heading text-xl font-bold">{t("profile.about")}</h2>
                <div className="mt-3 prose prose-sm max-w-none text-muted-plum">
                  <p>{description}</p>
                </div>
              </section>
            )}

            {/* Key facts grid */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: locale === "cy" ? "Gweithredwr" : "Operator", value: home.operator_name },
                { label: locale === "cy" ? "Gwelyau" : "Beds", value: home.bed_count?.toString() },
                { label: locale === "cy" ? "Math" : "Type", value: home.service_type },
                { label: locale === "cy" ? "Cofrestrwyd" : "Registered", value: home.registration_date ? new Date(home.registration_date).getFullYear().toString() : null },
                { label: locale === "cy" ? "Rheolwr" : "Manager", value: home.registered_manager },
                { label: locale === "cy" ? "Awdurdod" : "Authority", value: home.local_authority },
              ]
                .filter(({ value }) => value)
                .map(({ label, value }) => (
                  <div key={label} className="rounded-[12px] bg-linen p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-plum">{label}</p>
                    <p className="mt-0.5 text-sm font-bold text-dusk capitalize">{value}</p>
                  </div>
                ))}
            </div>

            {/* Pricing */}
            <section ref={(el) => { sectionRefs.current.pricing = el; }} id="pricing" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.pricing")}</h2>
              <div className="mt-3 rounded-[16px] border border-blush-grey bg-white p-4">
                {profile?.weekly_fee_from ? (
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-dusk">
                        &pound;{profile.weekly_fee_from}
                        {profile.weekly_fee_to && profile.weekly_fee_to !== profile.weekly_fee_from && (
                          <span> &ndash; &pound;{profile.weekly_fee_to}</span>
                        )}
                      </span>
                      <span className="text-sm text-muted-plum">{t("card.per_week")}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-plum">
                      {locale === "cy"
                        ? "Mae prisiau'n amrywio yn dibynnu ar y math o ofal sydd ei angen. Cysylltwch am bris manwl."
                        : "Prices vary depending on the type of care needed. Contact for a detailed quote."}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-plum">
                    {locale === "cy"
                      ? "Cysylltwch â'r cartref yn uniongyrchol am wybodaeth am brisiau."
                      : "Contact the home directly for pricing information."}
                  </p>
                )}
                {profile?.accepts_local_authority && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {locale === "cy" ? "Yn derbyn cyllid Awdurdod Lleol" : "Accepts Local Authority funding"}
                  </div>
                )}
              </div>
            </section>

            {/* CIW Ratings */}
            <section ref={(el) => { sectionRefs.current.ratings = el; }} id="ratings" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.ciw_ratings")}</h2>

              {/* CIW explainer card */}
              <div className="mt-3 rounded-[16px] bg-primary/5 border border-primary/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 rounded-full bg-primary/10 p-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dusk">
                      {locale === "cy" ? "Adroddiad Arolygiaeth Gofal Cymru (CIW)" : "Care Inspectorate Wales (CIW) Report"}
                    </p>
                    <p className="mt-1 text-xs text-muted-plum">
                      {locale === "cy"
                        ? "CIW yw rheoleiddiwr annibynnol gwasanaethau gofal cymdeithasol yng Nghymru."
                        : "CIW is the independent regulator of social care services in Wales."}
                    </p>
                    {home.ciw_report_url && (
                      <a
                        href={home.ciw_report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        {t("profile.view_report")} &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Overall rating banner */}
              {lowestRating && (
                <div className={`mt-3 rounded-[12px] px-4 py-3 text-center font-heading text-lg font-bold text-white ${
                  lowestRating === "Excellent" ? "bg-green-600" :
                  lowestRating === "Good" ? "bg-blue-600" :
                  lowestRating === "Adequate" ? "bg-amber-500" :
                  "bg-red-500"
                }`}>
                  {locale === "cy" ? "Gradd gyffredinol" : "Overall rating"}: {
                    locale === "cy"
                      ? lowestRating === "Excellent" ? "Rhagorol" : lowestRating === "Good" ? "Da" : lowestRating === "Adequate" ? "Digonol" : "Gwael"
                      : lowestRating
                  }
                </div>
              )}

              {/* Sub-ratings */}
              <div className="mt-3 divide-y divide-blush-grey rounded-[16px] border border-blush-grey bg-white">
                {ratings.map(({ key, value }) => (
                  <div key={key} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-dusk">{t(key)}</span>
                    <CiwRatingBadge rating={value} size="md" />
                  </div>
                ))}
              </div>
              {home.ciw_last_inspected && (
                <p className="mt-3 text-sm text-muted-plum">
                  {t("profile.last_inspected")}: {formatDate(home.ciw_last_inspected, locale)}
                </p>
              )}
            </section>

            {/* Services / Types of Care */}
            <section ref={(el) => { sectionRefs.current.services = el; }} id="services" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.services")}</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ALL_SERVICES.map((service) => {
                  const available = profile?.services?.includes(service);
                  const label = SERVICE_LABELS[service]?.[locale] || service;
                  return (
                    <div key={service} className="flex items-center gap-2 rounded-[12px] bg-white border border-blush-grey px-3 py-2.5">
                      {available ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-green-600">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-muted-plum/40">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      )}
                      <span className={`text-sm ${available ? "font-semibold text-dusk" : "text-muted-plum/60 line-through"}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Amenities / Facilities */}
            <section ref={(el) => { sectionRefs.current.amenities = el; }} id="amenities" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.amenities")}</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {ALL_AMENITIES.map((amenity) => {
                  const available = profile?.amenities?.includes(amenity);
                  const label = AMENITY_LABELS[amenity]?.[locale] || amenity;
                  return (
                    <div key={amenity} className="flex items-center gap-2 rounded-[12px] bg-white border border-blush-grey px-3 py-2.5">
                      {available ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-green-600">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 text-muted-plum/40">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      )}
                      <span className={`text-sm ${available ? "font-semibold text-dusk" : "text-muted-plum/60 line-through"}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Funding Types */}
            <section ref={(el) => { sectionRefs.current.funding = el; }} id="funding" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.funding")}</h2>
              <div className="mt-3 rounded-[16px] border border-blush-grey bg-white divide-y divide-blush-grey">
                {[
                  { label: locale === "cy" ? "Preifat" : "Private", available: true },
                  { label: locale === "cy" ? "Awdurdod Lleol" : "Local Authority", available: !!profile?.accepts_local_authority },
                  { label: locale === "cy" ? "Awdurdod Lleol + Ychwanegiad" : "Local Authority + Top-up", available: !!profile?.accepts_local_authority },
                  { label: locale === "cy" ? "Gofal Iechyd Parhaus (CHC)" : "Continuing Healthcare (CHC)", available: home.service_type === "nursing" },
                ].map(({ label, available }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-dusk">{label}</span>
                    {available ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-green-600">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-muted-plum/40">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Welsh Language */}
            <section ref={(el) => { sectionRefs.current.welsh = el; }} id="welsh" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.welsh_language")}</h2>
              <div className="mt-3 rounded-[16px] border border-blush-grey bg-white p-4">
                <div className="flex items-center gap-3">
                  <ActiveOfferBadge level={home.active_offer_level} size="md" />
                </div>
                <p className="mt-3 text-sm text-muted-plum">
                  {home.active_offer_level >= 2
                    ? locale === "cy"
                      ? "Mae'r cartref hwn yn cynnig gwasanaeth Cymraeg da. Gallwch ddisgwyl gofal drwy gyfrwng y Gymraeg."
                      : "This home offers a good Welsh language service. You can expect care through the medium of Welsh."
                    : home.active_offer_level === 1
                      ? locale === "cy"
                        ? "Mae rhywfaint o ddarpariaeth Gymraeg ar gael yn y cartref hwn."
                        : "Some Welsh language provision is available at this home."
                      : locale === "cy"
                        ? "Nid oes gwybodaeth am ddarpariaeth Gymraeg ar gael ar hyn o bryd."
                        : "No Welsh language provision information is currently available."}
                </p>
                {profile?.welsh_language_notes && (
                  <p className="mt-2 text-sm text-muted-plum italic">{profile.welsh_language_notes}</p>
                )}
              </div>
            </section>

            {/* Map */}
            {home.lat && home.lng && (
              <section ref={(el) => { sectionRefs.current.location = el; }} id="location" className="mt-10">
                <h2 className="font-heading text-xl font-bold">{t("profile.location")}</h2>
                <p className="mt-2 text-sm text-muted-plum">
                  {[home.address_line_1, home.address_line_2, home.town, countyName, home.postcode].filter(Boolean).join(", ")}
                </p>
                <div className="mt-3 h-72 rounded-[16px] border border-blush-grey overflow-hidden">
                  <CareHomeMap lat={home.lat} lng={home.lng} name={name} />
                </div>
              </section>
            )}

            {/* FAQ Accordion */}
            <section ref={(el) => { sectionRefs.current.faq = el; }} id="faq" className="mt-10">
              <h2 className="font-heading text-xl font-bold">{t("profile.faq")}</h2>
              <div className="mt-3 divide-y divide-blush-grey rounded-[16px] border border-blush-grey bg-white">
                {faqItems.map((item, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left"
                      aria-expanded={faqOpen === i}
                    >
                      <span className="text-sm font-semibold text-dusk pr-4">{item.question}</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`flex-shrink-0 text-muted-plum transition-transform duration-200 ${faqOpen === i ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {faqOpen === i && (
                      <div className="px-4 pb-4 text-sm text-muted-plum">
                        {item.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Print & Share */}
            <div className="mt-8 flex gap-3" data-print-hidden>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-semibold text-muted-plum transition-colors hover:bg-ivory"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
                </svg>
                {locale === "cy" ? "Argraffu" : "Print"}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: name, text: `${name} — gofal.wales`, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full border border-blush-grey bg-white px-4 py-2 text-sm font-semibold text-muted-plum transition-colors hover:bg-ivory"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {locale === "cy" ? "Rhannu" : "Share"}
              </button>
            </div>
          </div>

          {/* ===== Sidebar ===== */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Quick contact buttons */}
              {home.phone && (
                <a
                  href={`tel:${formatPhoneForTel(home.phone)}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary-hover"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  {t("profile.call_home")}
                </a>
              )}

              {/* Enquiry form */}
              <div className="rounded-[16px] border border-blush-grey bg-white p-6 shadow-card">
                <EnquiryForm careHomeId={home.id} careHomeName={name} />
              </div>

              {/* Claim listing */}
              {!home.is_claimed && (
                <div className="rounded-[16px] border border-blush-grey bg-ivory p-6">
                  <p className="text-sm font-semibold text-dusk">{t("profile.claim_cta")}</p>
                  <Link
                    href={`/hawlio/${home.slug}`}
                    className="mt-3 inline-block w-full rounded-full bg-primary px-6 py-3 text-center font-body font-bold text-white transition-colors hover:bg-primary-dark"
                  >
                    {t("profile.claim_button")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related homes */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="font-heading text-2xl font-bold">{t("profile.related")}</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <CareHomeCard key={r.id} home={r as any} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-blush-grey bg-white p-3 lg:hidden" data-print-hidden>
        <div className="flex gap-3">
          {home.phone && (
            <a
              href={`tel:${formatPhoneForTel(home.phone)}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-secondary px-4 py-3 font-body font-bold text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {locale === "cy" ? "Ffonio" : "Call"}
            </a>
          )}
          <button
            onClick={() => scrollTo("overview")}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-body font-bold text-white"
          >
            {t("profile.enquire_now")}
          </button>
        </div>
      </div>

      {/* Bottom padding for mobile fixed bar */}
      <div className="h-20 lg:hidden" />
    </>
  );
}

// ===== Helpers =====

function getLowestRating(ratings: (string | null)[]): string | null {
  const order = ["Poor", "Adequate", "Good", "Excellent"];
  let lowest: string | null = null;
  let lowestIdx = Infinity;
  for (const r of ratings) {
    if (!r) continue;
    const idx = order.indexOf(r);
    if (idx !== -1 && idx < lowestIdx) {
      lowestIdx = idx;
      lowest = r;
    }
  }
  return lowest;
}

function buildFaqItems(
  home: CareHome,
  profile: ProfileType | null,
  name: string,
  locale: "cy" | "en"
) {
  const items: { question: string; answer: string }[] = [];

  // Location
  items.push({
    question: locale === "cy" ? `Ble mae ${name} wedi'i leoli?` : `Where is ${name} located?`,
    answer: locale === "cy"
      ? `Mae ${name} wedi'i leoli yn ${home.address_line_1}, ${home.town}, ${home.postcode}.`
      : `${name} is located at ${home.address_line_1}, ${home.town}, ${home.postcode}.`,
  });

  // CIW
  if (home.ciw_rating_care_support) {
    const ratingCy = home.ciw_rating_care_support === "Excellent" ? "Rhagorol" : home.ciw_rating_care_support === "Good" ? "Da" : home.ciw_rating_care_support === "Adequate" ? "Digonol" : "Gwael";
    items.push({
      question: locale === "cy" ? `Beth yw gradd CIW ${name}?` : `What is ${name}'s CIW rating?`,
      answer: locale === "cy"
        ? `Gradd gofal a chymorth CIW ${name} yw "${ratingCy}". Mae CIW (Arolygiaeth Gofal Cymru) yn arolygu pob cartref gofal yng Nghymru.`
        : `${name}'s CIW care and support rating is "${home.ciw_rating_care_support}". CIW (Care Inspectorate Wales) inspects all care homes in Wales.`,
    });
  }

  // Care types
  if (profile?.services && profile.services.length > 0) {
    const serviceNames = profile.services.map((s) => {
      const label = SERVICE_LABELS[s];
      return label ? label[locale] : s;
    });
    items.push({
      question: locale === "cy" ? `Pa fathau o ofal mae ${name} yn ei gynnig?` : `What types of care does ${name} offer?`,
      answer: locale === "cy"
        ? `Mae ${name} yn cynnig: ${serviceNames.join(", ")}.`
        : `${name} offers: ${serviceNames.join(", ")}.`,
    });
  }

  // Beds
  if (home.bed_count) {
    items.push({
      question: locale === "cy" ? `Faint o welyau sydd yn ${name}?` : `How many beds does ${name} have?`,
      answer: locale === "cy"
        ? `Mae ${home.bed_count} o welyau yn ${name}.`
        : `${name} has ${home.bed_count} beds.`,
    });
  }

  // Owner
  if (home.operator_name) {
    items.push({
      question: locale === "cy" ? `Pwy sy'n rhedeg ${name}?` : `Who operates ${name}?`,
      answer: locale === "cy"
        ? `${name} yn cael ei redeg gan ${home.operator_name}.`
        : `${name} is operated by ${home.operator_name}.`,
    });
  }

  // Cost
  if (profile?.weekly_fee_from) {
    items.push({
      question: locale === "cy" ? `Faint mae'n costio i aros yn ${name}?` : `How much does it cost to stay at ${name}?`,
      answer: locale === "cy"
        ? `Mae prisiau yn ${name} yn dechrau o £${profile.weekly_fee_from} yr wythnos. Mae'r gost yn amrywio yn ôl y math o ofal sydd ei angen.`
        : `Prices at ${name} start from £${profile.weekly_fee_from} per week. The cost varies depending on the type of care required.`,
    });
  }

  // Welsh
  items.push({
    question: locale === "cy" ? `Ydy ${name} yn cynnig gofal yn Gymraeg?` : `Does ${name} offer care in Welsh?`,
    answer: home.active_offer_level >= 2
      ? locale === "cy"
        ? `Ydy, mae ${name} yn cynnig gwasanaeth Cymraeg da (Lefel ${home.active_offer_level} y Cynnig Rhagweithiol).`
        : `Yes, ${name} offers a good Welsh language service (Active Offer Level ${home.active_offer_level}).`
      : home.active_offer_level === 1
        ? locale === "cy"
          ? `Mae rhywfaint o ddarpariaeth Gymraeg ar gael yn ${name}.`
          : `Some Welsh language provision is available at ${name}.`
        : locale === "cy"
          ? `Nid oes gwybodaeth am ddarpariaeth Gymraeg ar gael ar hyn o bryd ar gyfer ${name}.`
          : `No Welsh language provision information is currently available for ${name}.`,
  });

  return items;
}
