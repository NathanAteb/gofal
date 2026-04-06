"use client";

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

export function CareHomeProfile({ home, related }: Props) {
  const { locale, t } = useI18n();

  const name = (locale === "cy" && home.name_cy) ? home.name_cy : home.name;
  const profile = home.care_home_profiles;
  const county = getCountyBySlug(home.county);
  const countyName = county
    ? locale === "cy" ? county.name_cy : county.name_en
    : home.county;

  const description = profile
    ? locale === "cy" ? profile.description_cy : profile.description
    : null;

  const jsonLd = {
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

  const ratings = [
    { key: "profile.wellbeing", value: home.ciw_rating_wellbeing },
    { key: "profile.care_support", value: home.ciw_rating_care_support },
    { key: "profile.leadership", value: home.ciw_rating_leadership },
    { key: "profile.environment", value: home.ciw_rating_environment },
  ] as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">{name}</h1>
              <p className="mt-2 text-muted-plum">
                {[home.address_line_1, home.address_line_2, home.town, home.postcode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <ActiveOfferBadge level={home.active_offer_level} size="md" />
                {home.phone && (
                  <a
                    href={`tel:${formatPhoneForTel(home.phone)}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {home.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Photo gallery */}
            <div className="mt-6">
              <h2 className="font-heading text-xl font-bold">{t("profile.photos")}</h2>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(profile?.photos && profile.photos.length > 0
                  ? profile.photos.slice(0, 6)
                  : [
                      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=75&fm=webp&fit=crop",
                      "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=400&q=75&fm=webp&fit=crop",
                      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=75&fm=webp&fit=crop",
                    ]
                ).map((photo, i) => (
                  <div key={i} className="aspect-[4/3] overflow-hidden rounded-[12px] bg-linen">
                    <img
                      src={photo}
                      alt={`${name} — ${locale === "cy" ? "llun" : "photo"} ${i + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              {!(profile?.photos && profile.photos.length > 0) && (
                <p className="mt-2 text-[10px] text-muted-plum/60">
                  Photos by Unsplash contributors
                </p>
              )}
            </div>

            {/* About */}
            {description && (
              <div className="mt-8">
                <h2 className="font-heading text-xl font-bold">{t("profile.about")}</h2>
                <div className="mt-3 prose prose-sm max-w-none text-muted-plum">
                  <p>{description}</p>
                </div>
              </div>
            )}

            {/* CIW Ratings */}
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold">{t("profile.ciw_ratings")}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {ratings.map(({ key, value }) => (
                  <div
                    key={key}
                    className="rounded-[16px] border border-blush-grey bg-white p-3 text-center"
                  >
                    <p className="text-xs font-semibold text-muted-plum">{t(key)}</p>
                    <div className="mt-1">
                      <CiwRatingBadge rating={value} size="md" />
                    </div>
                  </div>
                ))}
              </div>
              {home.ciw_last_inspected && (
                <p className="mt-3 text-sm text-muted-plum">
                  {t("profile.last_inspected")}: {formatDate(home.ciw_last_inspected, locale)}
                </p>
              )}
              {home.ciw_report_url && (
                <a
                  href={home.ciw_report_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                >
                  {t("profile.view_report")} &rarr;
                </a>
              )}
            </div>

            {/* Details */}
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold">{t("profile.details")}</h2>
              <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { label: t("profile.service_type"), value: home.service_type },
                  { label: t("profile.operator"), value: home.operator_name },
                  { label: t("profile.manager"), value: home.registered_manager },
                  {
                    label: t("profile.registered"),
                    value: home.registration_date ? formatDate(home.registration_date, locale) : null,
                  },
                  { label: t("profile.beds"), value: home.bed_count?.toString() },
                  { label: t("profile.local_authority"), value: home.local_authority },
                  { label: t("profile.ciw_id"), value: home.ciw_service_id },
                  {
                    label: t("profile.fees"),
                    value: profile ? formatFeeRange(profile.weekly_fee_from, profile.weekly_fee_to, locale) : null,
                  },
                ]
                  .filter(({ value }) => value)
                  .map(({ label, value }) => (
                    <div key={label} className="rounded-[12px] bg-linen p-3">
                      <dt className="text-xs font-semibold text-muted-plum">{label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-dusk">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Welsh Language */}
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold">{t("profile.welsh_language")}</h2>
              <div className="mt-3 rounded-[16px] border border-blush-grey bg-white p-4">
                <div className="flex items-center gap-3">
                  <ActiveOfferBadge level={home.active_offer_level} size="md" />
                </div>
                {profile?.welsh_language_notes && (
                  <p className="mt-3 text-sm text-muted-plum">
                    {profile.welsh_language_notes}
                  </p>
                )}
              </div>
            </div>

            {/* Map */}
            {home.lat && home.lng && (
              <div className="mt-8">
                <h2 className="font-heading text-xl font-bold">{t("profile.location")}</h2>
                <div className="mt-3 h-64 rounded-[16px] border border-blush-grey overflow-hidden">
                  <CareHomeMap lat={home.lat} lng={home.lng} name={name} />
                </div>
              </div>
            )}

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
                    navigator.share({
                      title: name,
                      text: `${name} — gofal.wales`,
                      url: window.location.href,
                    });
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

          {/* Sidebar - Enquiry + Claim */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <div className="rounded-[16px] border border-blush-grey bg-white p-6 shadow-card">
                <EnquiryForm careHomeId={home.id} careHomeName={name} />
              </div>

              {!home.is_claimed && (
                <div className="rounded-[16px] border border-blush-grey bg-ivory p-6">
                  <p className="text-sm font-semibold text-dusk">
                    {t("profile.claim_cta")}
                  </p>
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
            <h2 className="font-heading text-2xl font-bold">
              {t("profile.related")}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <CareHomeCard key={r.id} home={r as any} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
